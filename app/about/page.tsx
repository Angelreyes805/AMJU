import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import data from "@/data/pages/about.json";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const paragraphs = data.blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => b.text);
  const [intro, ownerBio] = paragraphs;

  return (
    <>
      <PageHeader
        eyebrow="About AMJ Unlimited"
        title="All things hobby, collectibles & anime"
      />
      <section className="section">
        <div className="u-container about">
          <div className="about__block">
            <h2>Our Story</h2>
            {intro && <p className="about__text">{intro}</p>}
          </div>
          {ownerBio && (
            <div className="about__block">
              <h2>About the Owner</h2>
              <p className="about__text">{ownerBio}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
