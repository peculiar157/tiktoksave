import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import AdSlot from "@/components/AdSlot";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated,
    },
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <Container className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-2xl">
        <Link href="/blog" className="text-sm font-medium text-brand-600">
          ← Back to blog
        </Link>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
          {post.title}
        </h1>

        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="prose-brand mt-8 text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-900">
          Ready to save a video?{" "}
          <Link href="/#downloader" className="font-semibold underline">
            Try the DLTok downloader
          </Link>
          .
        </div>

        <AdSlot slot="0000000002" className="mt-10" />
      </article>

      {otherPosts.length ? (
        <div className="mx-auto mt-16 max-w-2xl border-t border-brand-100 pt-10">
          <h2 className="text-lg font-semibold text-brand-950">
            More from the blog
          </h2>
          <ul className="mt-4 space-y-3">
            {otherPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Container>
  );
}
