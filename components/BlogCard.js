import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-brand-100 bg-white p-6 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-brand-950 group-hover:text-brand-700">
        {post.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {post.description}
      </p>
      <span className="mt-4 text-sm font-semibold text-brand-600">
        Read article →
      </span>
    </Link>
  );
}
