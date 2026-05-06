import type { MetadataRoute } from "next";
import { getSitemapPostEntries } from "@/lib/posts";
import { getProjectSlugs } from "@/lib/works";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ["", "/cv", "/publications", "/contact", "/posts"];
  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
  }));

  const projectEntries = getProjectSlugs().map((slug) => ({
    url: `${SITE}/works/${slug}`,
    lastModified: now,
  }));

  const postEntries = getSitemapPostEntries().map(({ slug, date }) => {
    const parsed = date ? new Date(date) : null;
    return {
      url: `${SITE}/posts/${slug}`,
      lastModified:
        parsed && !Number.isNaN(parsed.getTime()) ? parsed : now,
    };
  });

  return [...staticEntries, ...projectEntries, ...postEntries];
}
