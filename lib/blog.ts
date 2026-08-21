// Blog data access. Posts are scraped into data/blog/*.json by
// scripts/scrape_blog.py. Statically importing them keeps everything
// available at build time for the static export.

import index from "@/data/blog/index.json";
import whoWouldHaveThought from "@/data/blog/who-would-have-thought.json";
import muvLuv from "@/data/blog/muv-luv.json";
import keyPunchInventory from "@/data/blog/key-punch-inventory.json";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  cover: string | null;
  summary: string;
  body: string[];
}

export interface BlogSummary {
  slug: string;
  title: string;
  date: string;
  cover: string | null;
  summary: string;
}

const POSTS: Record<string, BlogPost> = {
  "who-would-have-thought": whoWouldHaveThought as BlogPost,
  "muv-luv": muvLuv as BlogPost,
  "key-punch-inventory": keyPunchInventory as BlogPost,
};

export function getPosts(): BlogSummary[] {
  return index as BlogSummary[];
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS[slug];
}
