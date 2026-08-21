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


def clean_wix_img(src: str) -> str | None:
    m = re.search(r"https://static\.wixstatic\.com/media/[^\s\"')]+", src or "")
    if not m:
        return None
    url = m.group(0)
    marker = url.find("/v1/")
    return url[:marker] if marker != -1 else url


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
        img = clean_wix_img(img_el.get("src", "")) if img_el else None
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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BASE_URL, help="page to scrape product widgets from")
    ap.add_argument("--no-images", action="store_true", help="skip image downloads")
    args = ap.parse_args()

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
