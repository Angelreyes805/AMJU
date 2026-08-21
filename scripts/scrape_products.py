#!/usr/bin/env python3
"""
Product scraper for the amjunlimited.com -> Next.js rebuild.

Parses Wix Stores product widgets (data-hook="product-item-root") from a page,
downloads each product image to public/images/products/<slug>.<ext>, and writes
data/products.json in the shape expected by lib/store/types.ts (Product[]).

Usage:
    python3 scripts/scrape_products.py                # scrape homepage widgets
    python3 scripts/scrape_products.py --url <page>   # scrape a specific page
    python3 scripts/scrape_products.py --no-images    # data only, skip downloads

Dependencies:  pip install --user requests beautifulsoup4
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:  # pragma: no cover
    sys.exit("Missing deps. Run:  pip install --user requests beautifulsoup4")

BASE_URL = "https://www.amjunlimited.com"
ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "public" / "images" / "products"
DATA_PATH = ROOT / "data" / "products.json"

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}


def slug_from_href(href: str, fallback: str) -> str:
    if href and "/product-page/" in href:
        return href.rstrip("/").split("/product-page/")[-1]
    s = re.sub(r"[^a-z0-9]+", "-", fallback.lower()).strip("-")
    return s or "product"


def parse_price(text: str | None) -> float | None:
    if not text:
        return None
    m = re.search(r"([\d,]+\.?\d*)", text.replace(",", ""))
    return float(m.group(1)) if m else None


def sized_wix_url(src: str, size: int = 800) -> str | None:
    """Return a web-optimized (w_size) Wix CDN URL, not the full original.

    Keeps download sizes small (~80-150 KB) so the 806-product catalog stays
    a manageable repo size instead of hundreds of MB of full-res originals.
    """
    m = re.search(r"https://static\.wixstatic\.com/media/[^\s\"')]+", src or "")
    if not m:
        return None
    url = m.group(0)
    if "/v1/" in url:
        url = re.sub(r"w_\d+", f"w_{size}", url)
        url = re.sub(r"h_\d+", f"h_{size}", url)
        return url
    # No transform present: build one against the original media id.
    return f"{url}/v1/fill/w_{size},h_{size},al_c,q_85,enc_auto/file{ext_from_url(url)}"


def ext_from_url(url: str) -> str:
    for e in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        if e in url.lower():
            return ".jpg" if e == ".jpeg" else e
    return ".jpg"


def extract(html_text: str) -> list[dict]:
    soup = BeautifulSoup(html_text, "html.parser")
    products = []
    for it in soup.select('[data-hook="product-item-root"]'):
        name_el = it.select_one('[data-hook="product-item-name"]')
        if not name_el:
            continue
        name = name_el.get_text(strip=True)
        price_el = it.select_one('[data-hook="product-item-price-to-pay"]')
        link_el = it.select_one('[data-hook="product-item-product-details-link"]')
        img_el = it.find("img")
        href = link_el.get("href") if link_el else ""
        slug = slug_from_href(href, name)
        raw = ""
        if img_el:
            raw = img_el.get("src") or img_el.get("data-src") or ""
            if not raw:
                srcset = img_el.get("srcset") or img_el.get("data-srcset") or ""
                raw = srcset.split(",")[0].strip().split(" ")[0] if srcset else ""
        img = sized_wix_url(raw) if raw else None
        out_of_stock = it.find(string=re.compile("Out of Stock")) is not None
        products.append(
            {
                "id": slug,
                "slug": slug,
                "name": name,
                "price": parse_price(price_el.get_text() if price_el else None),
                "compareAtPrice": None,
                "currency": "USD",
                "categories": [],
                "inStock": not out_of_stock,
                "sourceUrl": href or None,
                "_image_url": img,  # stripped before writing
            }
        )
    return products


def download_images(products: list[dict], skip: bool) -> None:
    if skip:
        for p in products:
            p["images"] = []
            p.pop("_image_url", None)
        return
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    for p in products:
        url = p.pop("_image_url", None)
        p["images"] = []
        if not url:
            continue
        fname = f"{p['slug']}{ext_from_url(url)}"
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            (PRODUCTS_DIR / fname).write_bytes(r.content)
            p["images"] = [{"src": f"/images/products/{fname}", "alt": p["name"]}]
            print(f"  ✓ {fname} ({len(r.content)//1024} KB)")
            time.sleep(0.12)
        except requests.RequestException as exc:
            print(f"  ! {fname} failed: {exc}")


def fetch_all_pages() -> list[dict]:
    """Paginate /shop?page=N until a page returns no new products."""
    by_slug: dict[str, dict] = {}
    page = 1
    while page <= 40:  # safety cap (~14 pages expected for 806 products)
        url = f"{BASE_URL}/shop?page={page}"
        print(f"▶ page {page}  ({url})")
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
        except requests.RequestException as exc:
            print(f"  ! failed: {exc}")
            break
        found = extract(r.text)
        new = [p for p in found if p["slug"] not in by_slug]
        for p in new:
            by_slug[p["slug"]] = p
        print(f"  {len(found)} on page · {len(new)} new · {len(by_slug)} total")
        if not new:  # no new products -> reached the end
            break
        page += 1
        time.sleep(0.3)
    return list(by_slug.values())


def sitemap_product_urls() -> list[str]:
    r = requests.get(f"{BASE_URL}/store-products-sitemap.xml", headers=HEADERS, timeout=30)
    r.raise_for_status()
    urls = re.findall(r"<loc>([^<]+/product-page/[^<]+)</loc>", r.text)
    return list(dict.fromkeys(urls))


def extract_product_page(html_text: str, url: str) -> dict:
    soup = BeautifulSoup(html_text, "html.parser")

    def hook(h: str) -> str | None:
        el = soup.select_one(f'[data-hook="{h}"]')
        return el.get_text(" ", strip=True) if el else None

    og_title = soup.find("meta", property="og:title")
    name = (og_title["content"].rsplit("|", 1)[0].strip() if og_title else None) or hook(
        "product-item-name"
    ) or "Product"
    price = parse_price(hook("formatted-primary-price") or hook("product-item-price-to-pay"))
    description = hook("description") or ""
    og_image = soup.find("meta", property="og:image")
    img = sized_wix_url(og_image["content"]) if og_image and og_image.get("content") else None
    out_of_stock = soup.select_one('[data-hook="out-of-stock-indicator"]') is not None
    slug = url.rstrip("/").split("/product-page/")[-1]
    return {
        "id": slug,
        "slug": slug,
        "name": name,
        "description": description,
        "price": price,
        "compareAtPrice": None,
        "currency": "USD",
        "categories": [],
        "inStock": not out_of_stock,
        "sourceUrl": url,
        "_image_url": img,
    }


def fetch_from_sitemap() -> list[dict]:
    urls = sitemap_product_urls()
    print(f"sitemap lists {len(urls)} product URLs")
    products = []
    for i, url in enumerate(urls, 1):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            products.append(extract_product_page(r.text, url))
        except requests.RequestException as exc:
            print(f"  ! [{i}] {url} failed: {exc}")
            continue
        if i % 25 == 0 or i == len(urls):
            print(f"  ...{i}/{len(urls)} pages")
        time.sleep(0.1)
    return products


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BASE_URL, help="page to scrape product widgets from")
    ap.add_argument("--all", action="store_true", help="paginate the visible /shop catalog")
    ap.add_argument("--sitemap", action="store_true", help="scrape ALL products via sitemap (full 806)")
    ap.add_argument("--no-images", action="store_true", help="skip image downloads")
    args = ap.parse_args()

    if args.sitemap:
        products = fetch_from_sitemap()
        print(f"\ncollected {len(products)} products from sitemap")
    elif args.all:
        products = fetch_all_pages()
        print(f"\ncollected {len(products)} unique products")
    else:
        print(f"▶ fetching {args.url}")
        r = requests.get(args.url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        products = extract(r.text)
        print(f"  found {len(products)} products")

    download_images(products, args.no_images)

    DATA_PATH.write_text(json.dumps(products, indent=2, ensure_ascii=False))
    priced = sum(1 for p in products if p["price"] is not None)
    imaged = sum(1 for p in products if p["images"])
    print(f"\n✅ wrote {len(products)} products -> {DATA_PATH.relative_to(ROOT)}")
    print(f"   {priced} priced · {imaged} with images")


if __name__ == "__main__":
    main()
