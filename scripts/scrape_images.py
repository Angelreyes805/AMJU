#!/usr/bin/env python3
"""
Image scraper for the amjunlimited.com → Next.js rebuild.

Crawls the live Wix site, extracts every image it can find (regular <img>,
srcset, Wix <wow-image> JSON blobs, CSS background-image, and OG/Twitter meta),
downloads the ORIGINAL full-resolution file from the Wix CDN, and stores it in
    public/images/<section>/<section>-<nn>-<shortid>.<ext>
with a clean, deterministic naming system.

It also writes public/images/manifest.json mapping every original CDN URL to its
local path + alt text, so React components can be wired up predictably.

Usage:
    python3 scripts/scrape_images.py                 # scrape default marketing pages
    python3 scripts/scrape_images.py --all-pages     # every page in the sitemap
    python3 scripts/scrape_images.py --page /about-6 --section about
    python3 scripts/scrape_images.py --dry-run       # list, don't download

Dependencies:
    pip install --user requests beautifulsoup4
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:  # pragma: no cover
    sys.exit(
        "Missing deps. Run:  pip install --user requests beautifulsoup4"
    )

BASE_URL = "https://www.amjunlimited.com"
PUBLIC_IMAGES = Path(__file__).resolve().parent.parent / "public" / "images"
MANIFEST_PATH = PUBLIC_IMAGES / "manifest.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    )
}

# Map live Wix routes -> local /public/images/<section> folder + naming prefix.
DEFAULT_PAGES = {
    "/": "home",
    "/about-6": "about",
    "/shipping-returns": "shipping",
    "/faq": "faq",
    "/contact-8": "contact",
    "/livestream": "livestream",
    "/gift-card": "gift-card",
}

WIX_MEDIA_HOST = "static.wixstatic.com"


def slugify(text: str, max_len: int = 40) -> str:
    text = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").strip().lower())
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:max_len].strip("-")


def original_wix_url(url: str) -> str:
    """Strip Wix's on-the-fly transform (/v1/fill/...) to fetch the original."""
    if WIX_MEDIA_HOST in url:
        marker = url.find("/v1/")
        if marker != -1:
            return url[:marker]
    return url


def wix_media_shortid(url: str) -> str:
    """Extract a stable short id from a Wix media URL for naming/dedup."""
    path = urlparse(url).path
    name = path.split("/media/")[-1] if "/media/" in path else Path(path).name
    name = name.split("~")[0]           # drop ~mv2 suffix
    name = re.sub(r"[^a-zA-Z0-9]+", "", name)
    return name[-10:] or "img"


def ext_from_url(url: str) -> str:
    path = urlparse(url).path.lower()
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"):
        if ext in path:
            return ".jpg" if ext == ".jpeg" else ext
    return ".jpg"


def collect_image_refs(html: str, page_url: str) -> list[dict]:
    """Return [{url, alt}] for every image reference found on the page."""
    soup = BeautifulSoup(html, "html.parser")
    refs: dict[str, str] = {}  # url -> alt (deduped by original url)

    def add(raw_url: str, alt: str = "") -> None:
        if not raw_url:
            return
        raw_url = urljoin(page_url, raw_url.strip())
        if not raw_url.startswith("http"):
            return
        orig = original_wix_url(raw_url)
        # Only keep Wix-hosted media (skip tracking pixels, sprites, data URIs).
        if WIX_MEDIA_HOST not in orig:
            return
        if orig not in refs or (alt and not refs[orig]):
            refs[orig] = alt or refs.get(orig, "")

    # 1) <img src>, data-src, and srcset
    for img in soup.find_all("img"):
        alt = img.get("alt", "")
        add(img.get("src", ""), alt)
        add(img.get("data-src", ""), alt)
        srcset = img.get("srcset") or img.get("data-srcset") or ""
        for part in srcset.split(","):
            add(part.strip().split(" ")[0], alt)

    # 2) <source srcset> inside <picture>
    for source in soup.find_all("source"):
        for part in (source.get("srcset") or "").split(","):
            add(part.strip().split(" ")[0])

    # 3) Wix <wow-image data-image-info='{...uri...}'>
    for tag in soup.find_all(attrs={"data-image-info": True}):
        try:
            info = json.loads(tag["data-image-info"])
            uri = info.get("imageData", {}).get("uri") or info.get("uri")
            alt = info.get("imageData", {}).get("alt", "")
            if uri:
                add(f"https://{WIX_MEDIA_HOST}/media/{uri}", alt)
        except (ValueError, KeyError):
            continue

    # 4) inline style background-image: url(...)
    for match in re.finditer(r"background-image:\s*url\(([^)]+)\)", html):
        add(match.group(1).strip("'\" "))

    # 5) raw Wix media URLs anywhere in the HTML (catches JSON-embedded galleries)
    for match in re.finditer(r"https://static\.wixstatic\.com/media/[^\s\"'\\)]+", html):
        add(match.group(0))

    # 6) OG / Twitter images
    for prop in ("og:image", "twitter:image"):
        meta = soup.find("meta", attrs={"property": prop}) or soup.find(
            "meta", attrs={"name": prop}
        )
        if meta and meta.get("content"):
            add(meta["content"], "social share image")

    return [{"url": u, "alt": a} for u, a in refs.items()]


def fetch(url: str) -> requests.Response | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp
    except requests.RequestException as exc:
        print(f"  ! failed: {url} ({exc})")
        return None


def scrape_page(route: str, section: str, dry_run: bool, manifest: dict) -> int:
    page_url = urljoin(BASE_URL + "/", route.lstrip("/"))
    print(f"\n▶ {section}  ({page_url})")
    resp = fetch(page_url)
    if not resp:
        return 0

    refs = collect_image_refs(resp.text, page_url)
    print(f"  found {len(refs)} unique image(s)")

    out_dir = PUBLIC_IMAGES / section
    downloaded = 0

    for i, ref in enumerate(sorted(refs, key=lambda r: r["url"]), start=1):
        url = ref["url"]
        if url in manifest:  # already downloaded on a previous page
            continue

        shortid = wix_media_shortid(url)
        alt_slug = slugify(ref["alt"])
        stem = f"{section}-{i:02d}"
        if alt_slug:
            stem += f"-{alt_slug}"
        stem += f"-{shortid}"
        filename = f"{stem}{ext_from_url(url)}"
        rel_path = f"/images/{section}/{filename}"

        manifest[url] = {
            "local": rel_path,
            "alt": ref["alt"],
            "section": section,
            "source_page": page_url,
        }

        if dry_run:
            print(f"    · {rel_path}   <- {url[:70]}...")
            continue

        out_dir.mkdir(parents=True, exist_ok=True)
        img_resp = fetch(url)
        if not img_resp:
            continue
        (out_dir / filename).write_bytes(img_resp.content)
        downloaded += 1
        print(f"    ✓ {rel_path}  ({len(img_resp.content) // 1024} KB)")
        time.sleep(0.15)  # be polite to the CDN

    return downloaded


def load_manifest() -> dict:
    if MANIFEST_PATH.exists():
        return json.loads(MANIFEST_PATH.read_text())
    return {}


def save_manifest(manifest: dict) -> None:
    PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))


def sitemap_pages() -> dict:
    """Fetch all page routes from the Wix pages sitemap."""
    resp = fetch(f"{BASE_URL}/pages-sitemap.xml")
    pages = {}
    if resp:
        for loc in re.findall(r"<loc>([^<]+)</loc>", resp.text):
            route = urlparse(loc).path or "/"
            pages[route] = slugify(route.strip("/")) or "home"
    return pages


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape images from amjunlimited.com")
    parser.add_argument("--all-pages", action="store_true", help="crawl the whole sitemap")
    parser.add_argument("--page", help="single route to scrape, e.g. /about-6")
    parser.add_argument("--section", help="folder/prefix for --page (default: derived)")
    parser.add_argument("--dry-run", action="store_true", help="list without downloading")
    args = parser.parse_args()

    if args.page:
        pages = {args.page: args.section or slugify(args.page.strip("/")) or "home"}
    elif args.all_pages:
        pages = sitemap_pages() or DEFAULT_PAGES
    else:
        pages = DEFAULT_PAGES

    manifest = load_manifest()
    total = 0
    for route, section in pages.items():
        total += scrape_page(route, section, args.dry_run, manifest)

    if not args.dry_run:
        save_manifest(manifest)
        print(f"\n✅ downloaded {total} new image(s)")
        print(f"   manifest: {MANIFEST_PATH.relative_to(Path.cwd())}")
    else:
        print(f"\n(dry run) {len(manifest)} image(s) catalogued, none downloaded")


if __name__ == "__main__":
    main()
