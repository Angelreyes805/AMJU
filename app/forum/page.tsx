import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";

export const metadata: Metadata = { title: "Forum" };

export default function ForumPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Forum"
        subtitle="Connect with fellow builders — share your work, ask questions, and talk all things Gundam, mecha, and collectibles."
      />
      <section className="section">
        <div className="u-container">
          <div className="placeholder">
            <h2 className="placeholder__title">Community forum coming soon</h2>
            <p className="placeholder__text">
              Our members’ forum is being rebuilt. Categories, threads, and
              replies will live here.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
