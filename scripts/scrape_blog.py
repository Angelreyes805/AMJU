#!/usr/bin/env python3
"""
Blog scraper -> data/blog/<slug>.json (+ cover images).

Fetches each known post, extracts title, publish date, cover image, and body
paragraphs.

Usage:  python3 scripts/scrape_blog.py
Deps:   pip install --user requests beautifulsoup4
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:  # pragma: no cover
    sys.exit("Missing deps. Run:  pip install --user requests beautifulsoup4")

BASE_URL = "https://www.amjunlimited.com"
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "data" / "blog"
IMG_DIR = ROOT / "public" / "images" / "blog"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

SLUGS = ["who-would-have-thought", "muv-luv", "key-punch-inventory"]


def sized(src: str, size: int = 1200) -> str | None:
    m = re.search(r"https://static\.wixstatic\.com/media/[^\s\"')]+", src or "")
    if not m:
        return None
    url = m.group(0)
    if "/v1/" in url:
        url = re.sub(r"w_\d+", f"w_{size}", url)
        url = re.sub(r"h_\d+", f"h_{size}", url)
        return url
    return f"{url}/v1/fill/w_{size},h_{size},al_c,q_85,enc_auto/cover.jpg"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    index = []

    for slug in SLUGS:
        url = f"{BASE_URL}/post/{slug}"
        print(f"▶ {slug}")
        try:
            html = requests.get(url, headers=HEADERS, timeout=30).text
        except requests.RequestException as exc:
            print(f"  ! failed: {exc}")
            continue
        soup = BeautifulSoup(html, "html.parser")

        def meta(prop: str) -> str | None:
            el = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
            return el["content"] if el and el.get("content") else None

        title = (meta("og:title") or slug).rsplit("|", 1)[0].strip()
        date = (meta("article:published_time") or "")[:10]
        summary = meta("og:description") or ""

        # Cover image.
        cover_rel = None
        cover_url = sized(meta("og:image") or "")
        if cover_url:
            try:
                r = requests.get(cover_url, headers=HEADERS, timeout=30)
                r.raise_for_status()
                (IMG_DIR / f"{slug}.jpg").write_bytes(r.content)
                cover_rel = f"/images/blog/{slug}.jpg"
            except requests.RequestException:
                pass

        # Body paragraphs (dedupe; drop nav/boilerplate).
        seen, body = set(), []
        for p in soup.find_all("p"):
            t = re.sub(r"\s+", " ", p.get_text(" ", strip=True)).strip()
            if len(t) > 40 and t not in seen:
                seen.add(t)
                body.append(t)
        body = body[:12]

        data = {"slug": slug, "title": title, "date": date, "cover": cover_rel,
                "summary": summary, "body": body}
        (OUT_DIR / f"{slug}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False))
        index.append({"slug": slug, "title": title, "date": date, "cover": cover_rel, "summary": summary})
        print(f"  ✓ {title} · {date} · {len(body)} paragraphs · cover={'yes' if cover_rel else 'no'}")

    index.sort(key=lambda p: p["date"], reverse=True)
    (OUT_DIR / "index.json").write_text(json.dumps(index, indent=2, ensure_ascii=False))
    print(f"\n✅ {len(index)} posts -> data/blog/")


if __name__ == "__main__":
    main()
