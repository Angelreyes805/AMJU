#!/usr/bin/env python3
"""
Videos scraper for the /livestream page -> data/videos.json.

Extracts YouTube embed IDs and the section headings they sit under (by
document position) so the rebuilt Videos page can group them the same way.

Usage:  python3 scripts/scrape_videos.py
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

URL = "https://www.amjunlimited.com/livestream"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "videos.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

NOISE = {
    "Videos", "Location", "Information", "Socials", "Store Hours:", "More",
    "Shipping/Handling & Return Policy", "Cookies/Privacy Notice",
    "Privacy Policy", "Contact information", "About", "FAQ", "Terms of Use",
}


def main() -> None:
    html = requests.get(URL, headers=HEADERS, timeout=30).text
    soup = BeautifulSoup(html, "html.parser")

    # Positions of section headings.
    headings = []
    for tag in soup.find_all(["h1", "h2", "h3"]):
        text = re.sub(r"\s+", " ", tag.get_text(" ", strip=True)).strip()
        if text and text not in NOISE and len(text) < 60:
            src = str(tag)
            pos = html.find(src[:60]) if src else -1
            if pos != -1:
                headings.append((pos, text))
    headings.sort()

    # Positions of unique YouTube embeds.
    videos = []
    seen = set()
    for m in re.finditer(r"youtube(?:-nocookie)?\.com/embed/([A-Za-z0-9_-]{6,})", html):
        vid = m.group(1)
        if vid in seen:
            continue
        seen.add(vid)
        videos.append((m.start(), vid))

    # Assign each video to the nearest preceding heading.
    sections: dict[str, dict] = {}
    order = []
    for pos, vid in videos:
        title = "Videos"
        for hpos, htext in headings:
            if hpos <= pos:
                title = htext
            else:
                break
        if title not in sections:
            sections[title] = {"title": title, "videos": []}
            order.append(title)
        sections[title]["videos"].append({"id": vid, "url": f"https://www.youtube.com/embed/{vid}"})

    result = {"sections": [sections[t] for t in order]}
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    total = sum(len(s["videos"]) for s in result["sections"])
    print(f"✅ {total} videos in {len(result['sections'])} section(s) -> data/videos.json")
    for s in result["sections"]:
        print(f"   · {s['title']}: {len(s['videos'])}")


if __name__ == "__main__":
    main()
