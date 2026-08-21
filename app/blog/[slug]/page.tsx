import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { getPost, getPosts } from "@/lib/blog";

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="section">
      <div className="u-container post">
        <nav className="post__breadcrumb" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true"> / </span>
          <span>{post.title}</span>
        </nav>

        <header className="post__header">
          {post.date && <time className="post__date">{post.date}</time>}
          <h1 className="post__title">{post.title}</h1>
        </header>

        {post.cover && (
          <div className="post__cover">
            <Image
              src={asset(post.cover)}
              alt={post.title}
              width={1200}
              height={675}
              priority
            />
          </div>
        )}

        <div className="post__body">
          {post.body.length > 0 ? (
            post.body.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p>{post.summary}</p>
          )}
        </div>
      </div>
    </article>
  );
}
