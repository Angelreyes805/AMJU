// Renders ordered content blocks scraped into data/pages/*.json.
// Consecutive list items are grouped into a single <ul>.
import { Fragment } from "react";

export interface ContentBlock {
  type: "heading" | "paragraph" | "listitem";
  text: string;
  level?: number;
}

// Linkify bare emails so "management@amjunlimited.com" is clickable.
function renderText(text: string) {
  const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.-]+)/g);
  return parts.map((part, i) =>
    /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part) ? (
      <a key={i} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

export default function Prose({ blocks }: { blocks: ContentBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length) {
      out.push(
        <ul className="prose__list" key={key}>
          {list.map((t, i) => (
            <li key={i}>{renderText(t)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  blocks.forEach((b, i) => {
    if (b.type === "listitem") {
      list.push(b.text);
      return;
    }
    flushList(`list-${i}`);
    if (b.type === "heading") {
      const level = Math.min(Math.max(b.level ?? 2, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      out.push(
        <Tag className="prose__heading" key={i}>
          {b.text}
        </Tag>
      );
    } else {
      out.push(
        <p className="prose__p" key={i}>
          {renderText(b.text)}
        </p>
      );
    }
  });
  flushList("list-end");

  return <div className="prose">{out}</div>;
}
