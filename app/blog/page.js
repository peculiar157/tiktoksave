import Container from "@/components/Container";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description:
    "Guides and tips on downloading TikTok videos, saving sound as MP3, and using TikTok content the right way.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-950 sm:text-4xl">
          TikTokSave Blog
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          Practical guides on saving, converting, and using TikTok content —
          written in plain English.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-slate-400">
          No posts yet — check back soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
