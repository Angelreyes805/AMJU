import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader/PageHeader";
import { asset } from "@/lib/asset";
import { getPosts } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  const posts = getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="News & Updates"
        subtitle="Inventory drops, new arrivals, and notes from the shop."
      />
      <section className="section">
        <div className="u-container">
          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="blog-card__media">
                  {post.cover ? (
                    <Image
                      className="blog-card__img"
                      src={asset(post.cover)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="blog-card__placeholder" aria-hidden="true" />
                  )}
                </Link>
                <div className="blog-card__body">
                  {post.date && <time className="blog-card__date">{post.date}</time>}
                  <h2 className="blog-card__title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.summary && <p className="blog-card__excerpt">{post.summary}</p>}
                  <Link href={`/blog/${post.slug}`} className="blog-card__more">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
