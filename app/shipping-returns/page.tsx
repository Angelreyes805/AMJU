import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import Prose, { type ContentBlock } from "@/components/Prose/Prose";
import data from "@/data/pages/shipping-returns.json";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHeader eyebrow="Support" title={data.title} />
      <section className="section">
        <div className="u-container">
          <Prose blocks={data.blocks as ContentBlock[]} />
        </div>
      </section>
    </>
  );
}
