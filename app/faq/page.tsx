import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import faq from "@/data/faq.json";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Frequently Asked Questions"
        subtitle="Answers to common questions about shipping, returns, and our products."
      />
      <section className="section">
        <div className="u-container">
          <div className="accordion">
            {faq.items.map((item, i) => (
              <details className="accordion__item" key={i}>
                <summary className="accordion__summary">
                  <span>{item.q}</span>
                  <span className="accordion__icon" aria-hidden="true" />
                </summary>
                <div className="accordion__body">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
