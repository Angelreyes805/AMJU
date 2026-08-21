import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Prose, { type ContentBlock } from "@/components/Prose/Prose";
import data from "@/data/pages/cook.json";

export const metadata: Metadata = { title: "Cookies/Privacy Notice" };

export default function CookiesNoticePage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={data.title} />
      <section className="section">
        <div className="u-container">
          <Prose blocks={data.blocks as ContentBlock[]} />
        </div>
      </section>
    </>
  );
}
