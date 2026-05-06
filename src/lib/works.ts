// Server-only utilities for reading project ("works") markdown files from
// `content/works/`. Each project is one or two files (one per language) that
// share a slug:
//
//   content/works/<slug>.en.md
//   content/works/<slug>.ko.md
//
// File body convention:
//   - The text before the first `## ` heading is the project Overview.
//   - Each `## Title` heading begins a Part. The part's slug is derived from
//     the EN file's heading; KO inherits canonical slugs by position so the
//     URL anchors stay stable when the language toggle flips.
//   - Images are ordinary markdown: `![alt](src "caption")`. They render
//     inline exactly where you place them. Use `placeholder`,
//     `placeholder-portrait`, or `placeholder-square` as `src` to render a
//     CSS placeholder instead of a real image.
//   - Real images live under `public/works/<slug>/` so they're web-accessible,
//     and are referenced as `/works/<slug>/<file>`.

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";

const WORKS_DIR = path.join(process.cwd(), "content", "works");

export type ImageRatio = "portrait" | "landscape" | "square";

export type ProjectPart = {
  slug: string;
  title: string;
  body: string; // markdown
};

export type ProjectSummary = {
  slug: string;
  lang: Locale;
  title: string;
  year: string;
  medium: string;
};

export type Project = ProjectSummary & {
  overview: string; // markdown
  parts: ProjectPart[];
};

export type ProjectPair = Partial<Record<Locale, Project>>;
export type ProjectSummaryPair = Partial<Record<Locale, ProjectSummary>>;

const FILE_RE = /^(.+?)(?:\.(en|ko))?\.(?:md|mdx)$/;
const ANY_MD = /\.(md|mdx)$/;
const H2_RE = /^##\s+(.+?)\s*$/;

function listFilenames(): string[] {
  if (!fs.existsSync(WORKS_DIR)) return [];
  return fs.readdirSync(WORKS_DIR).filter((f) => ANY_MD.test(f)).sort();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Section = { title: string | null; body: string };

function splitByH2(body: string): Section[] {
  const lines = body.split(/\r?\n/);
  const sections: { title: string | null; lines: string[] }[] = [
    { title: null, lines: [] },
  ];
  for (const line of lines) {
    const m = line.match(H2_RE);
    if (m) {
      sections.push({ title: m[1], lines: [] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }
  return sections.map((s) => ({
    title: s.title,
    body: s.lines.join("\n").trim(),
  }));
}

type RawPart = { title: string; body: string };
type RawProject = {
  lang: Locale;
  title: string;
  year: string;
  medium: string;
  overview: string;
  parts: RawPart[];
};

function parseFile(filename: string, slug: string): RawProject | null {
  const m = filename.match(FILE_RE);
  if (!m) return null;
  const [, , langFromName] = m;

  const raw = fs.readFileSync(path.join(WORKS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const langFromFm: Locale | undefined =
    data.lang === "ko" ? "ko" : data.lang === "en" ? "en" : undefined;
  const lang: Locale = (langFromName as Locale | undefined) ?? langFromFm ?? "en";

  const sections = splitByH2(content.trim());
  const overview = sections[0]?.body ?? "";
  const partSections = sections.slice(1).filter((s) => s.title);

  const parts: RawPart[] = partSections.map((s) => ({
    title: s.title!,
    body: s.body,
  }));

  return {
    lang,
    title: typeof data.title === "string" ? data.title : slug,
    year: typeof data.year === "string" ? data.year : "",
    medium: typeof data.medium === "string" ? data.medium : "",
    overview,
    parts,
  };
}

type RawIndex = Map<string, { en?: RawProject; ko?: RawProject }>;

function buildIndex(): RawIndex {
  const index: RawIndex = new Map();
  for (const filename of listFilenames()) {
    const m = filename.match(FILE_RE);
    if (!m) continue;
    const [, slug] = m;
    const parsed = parseFile(filename, slug);
    if (!parsed) continue;
    const existing = index.get(slug) ?? {};
    existing[parsed.lang] = parsed;
    index.set(slug, existing);
  }
  return index;
}

function applySlugs(parsed: RawProject, canonical: string[]): ProjectPart[] {
  return parsed.parts.map((p, i) => ({
    slug: canonical[i] ?? slugify(p.title) ?? `part-${i + 1}`,
    title: p.title,
    body: p.body,
  }));
}

function pairToProjects(slug: string, raw: { en?: RawProject; ko?: RawProject }): ProjectPair {
  const canonicalSource = raw.en ?? raw.ko;
  const canonicalSlugs = canonicalSource
    ? canonicalSource.parts.map((p, i) => slugify(p.title) || `part-${i + 1}`)
    : [];

  const out: ProjectPair = {};
  for (const lang of ["en", "ko"] as const) {
    const r = raw[lang];
    if (!r) continue;
    out[lang] = {
      slug,
      lang,
      title: r.title,
      year: r.year,
      medium: r.medium,
      overview: r.overview,
      parts: applySlugs(r, canonicalSlugs),
    };
  }
  return out;
}

function projectToSummary(p: Project): ProjectSummary {
  const { overview: _o, parts: _p, ...rest } = p;
  return rest;
}

function pairToSummary(pair: ProjectPair): ProjectSummaryPair {
  const out: ProjectSummaryPair = {};
  if (pair.en) out.en = projectToSummary(pair.en);
  if (pair.ko) out.ko = projectToSummary(pair.ko);
  return out;
}

function getAllPairs(): ProjectPair[] {
  const index = buildIndex();
  const pairs: ProjectPair[] = [];
  for (const [slug, raw] of index) {
    pairs.push(pairToProjects(slug, raw));
  }
  // Sort by year descending; ties resolved by title ascending.
  pairs.sort((a, b) => {
    const aRef = a.en ?? a.ko;
    const bRef = b.en ?? b.ko;
    const yearA = aRef?.year ?? "";
    const yearB = bRef?.year ?? "";
    if (yearA !== yearB) return yearA < yearB ? 1 : -1;
    return (aRef?.title ?? "").localeCompare(bRef?.title ?? "");
  });
  return pairs;
}

export function getProjectSlugs(): string[] {
  return Array.from(buildIndex().keys()).sort();
}

export function getProjectPair(slug: string): ProjectPair | null {
  const raw = buildIndex().get(slug);
  if (!raw) return null;
  return pairToProjects(slug, raw);
}

export function getAllProjectPairs(): ProjectPair[] {
  return getAllPairs();
}

export function getAllProjectIndexPairs(): ProjectSummaryPair[] {
  return getAllPairs().map(pairToSummary);
}
