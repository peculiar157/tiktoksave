import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const staticRoutes = ["", "/blog", "/about", "/privacy", "/terms", "/contact"].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "monthly",
      priority: route === "" ? 1 : 0.6,
    })
  );

  const postRoutes = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated ? new Date(post.updated) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
