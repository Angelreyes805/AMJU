#!/usr/bin/env python3
"""
Static-content page scraper for the amjunlimited.com -> Next.js rebuild.

Fetches the text-content pages (About, Shipping/Returns, Privacy, Terms,
Cookies Notice, Contact), extracts the main content as ordered blocks
(heading / paragraph / list-item), and writes data/pages/<slug>.json for the
<Prose> component to render.

Usage:  python3 scripts/scrape_pages.py
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
OUT_DIR = ROOT / "data" / "pages"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# live route -> (output slug, page title)
PAGES = {
    "about-6": ("about", "About AMJ Unlimited"),
    "shipping-returns": ("shipping-returns", "Shipping & Returns"),
    "privacy-policy": ("privacy-policy", "Privacy Policy"),
    "terms-of-use": ("terms-of-use", "Terms of Use"),
    "cook": ("cook", "Cookies/Privacy Notice"),
    "contact-8": ("contact", "Contact"),
}

# Header/footer boilerplate present on every page.
NOISE = {
    "Home", "Shop", "Videos", "Forum", "Members", "Blog", "My Account", "Cart",
    "Location", "Store Hours:", "Information", "Socials", "More",
    "Shipping/Handling & Return Policy", "Cookies/Privacy Notice",
    "Privacy Policy", "Contact information", "About", "FAQ", "Terms of Use",
    "1322 S 4th Ave", "Yuma, Az 85364", "United States", "top of page",
    "bottom of page", "Log In", "Sign Up",
}
STOP = re.compile(r"^(©|Store Hours|Location$)", re.I)
HOURS = re.compile(r"^\w+\s+(12:00am|Closed)", re.I)


def extract_blocks(html_text: str) -> list[dict]:
    soup = BeautifulSoup(html_text, "html.parser")
    blocks: list[dict] = []
    seen: set[str] = set()
    for el in soup.find_all(["h1", "h2", "h3", "h4", "p", "li"]):
        text = re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip()
        if not text or len(text) < 3 or text in NOISE or HOURS.match(text):
            continue
        if STOP.match(text):
            break
        if text in seen:  # Wix duplicates list text in nested <p>/<span>
            continue
        seen.add(text)
        tag = el.name
        kind = "heading" if tag in ("h1", "h2", "h3", "h4") else (
            "listitem" if tag == "li" else "paragraph"
        )
        level = int(tag[1]) if kind == "heading" else None
        blocks.append({"type": kind, "text": text, **({"level": level} if level else {})})
    return blocks


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for route, (slug, title) in PAGES.items():
        url = f"{BASE_URL}/{route}"
        print(f"▶ {slug}  ({url})")
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
        except requests.RequestException as exc:
            print(f"  ! failed: {exc}")
            continue
        blocks = extract_blocks(r.text)
        (OUT_DIR / f"{slug}.json").write_text(
            json.dumps({"title": title, "slug": slug, "blocks": blocks}, indent=2, ensure_ascii=False)
        )
        print(f"  ✓ {len(blocks)} blocks -> data/pages/{slug}.json")


if __name__ == "__main__":
    main()
