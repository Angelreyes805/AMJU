import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Prose, { type ContentBlock } from "@/components/Prose/Prose";
import data from "@/data/pages/privacy-policy.json";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
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
