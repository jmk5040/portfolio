// Server-only utilities for reading Markdown blog posts from `content/posts/`.
// Files are read at build time and the resulting data is passed to client
// components for rendering and search.
//
// Filename convention:
//   <slug>.en.md          → English version of `slug`
//   <slug>.ko.md          → Korean version of `slug`
//   <slug>.md             → unsuffixed file; lang taken from frontmatter,
//                           defaults to `en`
//
// Files that share the same `<slug>` are paired automatically — the EN/KO
// toggle on the post page swaps between them.

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export const POST_LOCALES: Locale[] = ["en", "ko"];

export type PostSummary = {
  slug: string;
  lang: Locale;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingMinutes: number;
};

export type Post = PostSummary & {
  body: string;
};

export type PostPair = Partial<Record<Locale, Post>>;
export type PostSummaryPair = Partial<Record<Locale, PostSummary>>;

const FILE_RE = /^(.+?)(?:\.(en|ko))?\.(?:md|mdx)$/;
const ANY_MD = /\.(md|mdx)$/;

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function listFilenames(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => ANY_MD.test(f)).sort();
}

function parseFile(filename: string): Post | null {
  const m = filename.match(FILE_RE);
  if (!m) return null;
  const [, slug, langFromName] = m;

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const langFromFm: Locale | undefined =
    data.lang === "ko" ? "ko" : data.lang === "en" ? "en" : undefined;
  const lang: Locale = (langFromName as Locale | undefined) ?? langFromFm ?? "en";

  const tags = Array.isArray(data.tags) ? (data.tags as unknown[]).map(String) : [];

  return {
    slug,
    lang,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    tags,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    body: content.trim(),
    readingMinutes: readingTime(content),
  };
}

function buildIndex(): Map<string, PostPair> {
  const index = new Map<string, PostPair>();
  for (const filename of listFilenames()) {
    const post = parseFile(filename);
    if (!post) continue;
    const existing = index.get(post.slug) ?? {};
    existing[post.lang] = post;
    index.set(post.slug, existing);
  }
  return index;
}

function pairLatestDate(pair: PostPair): string {
  const dates = (Object.values(pair) as Post[])
    .map((p) => p.date)
    .filter((d) => Boolean(d))
    .sort();
  return dates[dates.length - 1] ?? "";
}

function pairToSummary(pair: PostPair): PostSummaryPair {
  const out: PostSummaryPair = {};
  for (const lang of POST_LOCALES) {
    const p = pair[lang];
    if (p) {
      const { body: _body, ...rest } = p;
      out[lang] = rest;
    }
  }
  return out;
}

export function getPostSlugs(): string[] {
  return Array.from(buildIndex().keys()).sort();
}

export function getPostPair(slug: string): PostPair | null {
  const pair = buildIndex().get(slug);
  return pair ?? null;
}

function getAllPostPairs(): PostPair[] {
  return Array.from(buildIndex().values()).sort((a, b) =>
    pairLatestDate(a) < pairLatestDate(b) ? 1 : -1,
  );
}

export function getPostIndexPairs(): PostSummaryPair[] {
  return getAllPostPairs().map(pairToSummary);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const pair of getAllPostPairs()) {
    for (const post of Object.values(pair) as Post[]) {
      post.tags.forEach((t) => set.add(t));
    }
  }
  return Array.from(set).sort();
}

// One sitemap entry per unique slug — the URL doesn't change with locale.
export function getSitemapPostEntries(): { slug: string; date: string }[] {
  return getAllPostPairs().map((pair) => ({
    slug: (pair.en ?? pair.ko)!.slug,
    date: pairLatestDate(pair),
  }));
}
