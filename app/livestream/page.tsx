import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import VideoEmbed from "@/components/VideoEmbed/VideoEmbed";
import videos from "@/data/videos.json";

export const metadata: Metadata = { title: "Videos" };

export default function VideosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Watch"
        title="Videos"
        subtitle="Gundam builds, how-tos, supplies, and more — all our videos in one place."
      />
      {videos.sections.map((section) => (
        <section className="section" key={section.title}>
          <div className="u-container">
            {videos.sections.length > 1 && <h2>{section.title}</h2>}
            <div className="video-grid">
              {section.videos.map((v) => (
                <VideoEmbed key={v.id} id={v.id} title={section.title} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
