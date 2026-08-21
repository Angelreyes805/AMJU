import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Prose, { type ContentBlock } from "@/components/Prose/Prose";
import data from "@/data/pages/terms-of-use.json";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
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
