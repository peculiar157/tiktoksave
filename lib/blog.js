import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getPostSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getPostMeta(slug) {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || data.date,
    tags: data.tags || [],
    readingTime: readingTime(content).text,
  };
}

export function getAllPosts() {
  return getPostSlugs()
    .map((slug) => getPostMeta(slug))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const html = processed.toString();

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || data.date,
    tags: data.tags || [],
    readingTime: readingTime(content).text,
    html,
  };
}
