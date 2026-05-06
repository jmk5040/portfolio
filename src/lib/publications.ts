// Server-only utilities for reading publications from `content/publications/`.
//
// File layout:
//   content/publications/
//   ├── journal/   <year>-<firstauthor>-<keyword>.md
//   ├── writings/  <yyyy-mm-dd>-<keyword>.md
//   └── press/     <yyyy-mm-dd>-<keyword>.md
//
// Each file is frontmatter only (the markdown body is currently ignored — it
// can be repurposed later for an abstract or commentary). Add a new
// publication by dropping a new file in the right subfolder; the build picks
// it up automatically.

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";

const BASE = path.join(process.cwd(), "content", "publications");

export type JournalPaper = {
  type: "journal";
  authors: string;
  year: string;
  title: string;
  venue: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  arxiv?: string;
  ads?: string;
  link?: string;
  firstAuthor: boolean;
  // Optional, locale-aware sentence describing the author's specific
  // contribution to the paper. Use a plain string for a single language, or
  // `{ en: "...", ko: "..." }` for both. Skip the field entirely to omit it.
  contribution?: LocalizedTitle;
};

export type LocalizedTitle = string | Partial<Record<Locale, string>>;

export type Writing = {
  type: "writing";
  year: string;
  date?: string;
  title: LocalizedTitle;
  venue: string;
  link?: string;
  lang?: Locale;
};

export type PressItem = {
  type: "press";
  year: string;
  date?: string;
  title: LocalizedTitle;
  venue: string;
  link?: string;
  lang?: Locale;
};

const MD = /\.(md|mdx)$/;

function readDir(subdir: string): string[] {
  const dir = path.join(BASE, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => MD.test(f) && !f.startsWith("."))
    .sort();
}

function readFm(subdir: string, filename: string): Record<string, unknown> {
  const raw = fs.readFileSync(path.join(BASE, subdir, filename), "utf8");
  const { data } = matter(raw);
  return data as Record<string, unknown>;
}

function asString(v: unknown): string {
  return v === undefined || v === null ? "" : String(v);
}

function asOptional(v: unknown): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  return String(v);
}

function asLocalizedTitle(v: unknown): LocalizedTitle {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const obj = v as Record<string, unknown>;
    const out: Partial<Record<Locale, string>> = {};
    if (typeof obj.en === "string") out.en = obj.en;
    if (typeof obj.ko === "string") out.ko = obj.ko;
    return out;
  }
  return asString(v);
}

function asOptionalLocalizedTitle(v: unknown): LocalizedTitle | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "object" && !Array.isArray(v)) {
    const obj = v as Record<string, unknown>;
    const out: Partial<Record<Locale, string>> = {};
    if (typeof obj.en === "string" && obj.en.trim()) out.en = obj.en;
    if (typeof obj.ko === "string" && obj.ko.trim()) out.ko = obj.ko;
    return out.en || out.ko ? out : undefined;
  }
  const s = String(v).trim();
  return s ? s : undefined;
}

function sortByYearDesc<T extends { year: string; date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ka = a.date ?? a.year;
    const kb = b.date ?? b.year;
    if (ka === kb) return 0;
    return ka < kb ? 1 : -1;
  });
}

export function getJournalPapers(): JournalPaper[] {
  const out: JournalPaper[] = [];
  for (const f of readDir("journal")) {
    const d = readFm("journal", f);
    out.push({
      type: "journal",
      authors: asString(d.authors),
      year: asString(d.year),
      title: asString(d.title),
      venue: asString(d.venue),
      volume: asOptional(d.volume),
      number: asOptional(d.number),
      pages: asOptional(d.pages),
      doi: asOptional(d.doi),
      arxiv: asOptional(d.arxiv),
      ads: asOptional(d.ads),
      link: asOptional(d.link),
      firstAuthor: Boolean(d.firstAuthor),
      contribution: asOptionalLocalizedTitle(d.contribution),
    });
  }
  return sortByYearDesc(out);
}

export function getWritings(): Writing[] {
  const out: Writing[] = [];
  for (const f of readDir("writings")) {
    const d = readFm("writings", f);
    out.push({
      type: "writing",
      year: asString(d.year),
      date: asOptional(d.date),
      title: asLocalizedTitle(d.title),
      venue: asString(d.venue),
      link: asOptional(d.link),
      lang: d.lang === "ko" ? "ko" : d.lang === "en" ? "en" : undefined,
    });
  }
  return sortByYearDesc(out);
}

export function getPress(): PressItem[] {
  const out: PressItem[] = [];
  for (const f of readDir("press")) {
    const d = readFm("press", f);
    out.push({
      type: "press",
      year: asString(d.year),
      date: asOptional(d.date),
      title: asLocalizedTitle(d.title),
      venue: asString(d.venue),
      link: asOptional(d.link),
      lang: d.lang === "ko" ? "ko" : d.lang === "en" ? "en" : undefined,
    });
  }
  return sortByYearDesc(out);
}

export function pickTitle(title: LocalizedTitle, locale: Locale): {
  text: string;
  fallback: boolean;
  fallbackLang?: Locale;
} {
  if (typeof title === "string") return { text: title, fallback: false };
  const primary = title[locale];
  if (primary) return { text: primary, fallback: false };
  const other: Locale = locale === "en" ? "ko" : "en";
  const fallback = title[other];
  if (fallback) return { text: fallback, fallback: true, fallbackLang: other };
  return { text: "", fallback: false };
}
