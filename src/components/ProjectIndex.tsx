"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/i18n";
import type { ProjectSummary, ProjectSummaryPair } from "@/lib/works";

type Props = { pairs: ProjectSummaryPair[] };

type Chosen = {
  project: ProjectSummary;
  fallback: boolean;
  availableIn: Locale;
};

const WORKS_PER_PAGE = 10;

function chooseVariant(pair: ProjectSummaryPair, locale: Locale): Chosen | null {
  const other: Locale = locale === "en" ? "ko" : "en";
  const primary = pair[locale];
  if (primary) return { project: primary, fallback: false, availableIn: locale };
  const fallback = pair[other];
  if (fallback) return { project: fallback, fallback: true, availableIn: other };
  return null;
}

export function ProjectIndex({ pairs }: Props) {
  const { locale, t } = useLanguage();
  const home = t.home;
  const [pageIndex, setPageIndex] = useState(1);

  const chosen = useMemo(
    () =>
      pairs
        .map((p) => chooseVariant(p, locale))
        .filter((c): c is Chosen => c !== null),
    [pairs, locale],
  );

  // Reset to page 1 when the locale flips (the visible list may be a
  // different length once locale-only items appear or disappear).
  useEffect(() => {
    setPageIndex(1);
  }, [locale]);

  const totalPages = Math.max(1, Math.ceil(chosen.length / WORKS_PER_PAGE));
  const safePage = Math.min(pageIndex, totalPages);
  const pageStart = (safePage - 1) * WORKS_PER_PAGE;
  const pageItems = chosen.slice(pageStart, pageStart + WORKS_PER_PAGE);

  return (
    <section
      id="works"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-32 md:px-10 md:pb-40"
    >
      <header className="border-t border-ink/10 pt-10">
        <span className="eyebrow">{home.worksLabel}</span>
      </header>

      <ol className="mt-2">
        {pageItems.map(({ project, fallback, availableIn }) => (
          <li
            key={project.slug}
            className="border-b border-ink/10 transition-colors hover:bg-paper-warm"
          >
            <Link
              href={`/works/${project.slug}`}
              className="grid grid-cols-12 items-baseline gap-4 px-2 py-7 md:gap-10 md:px-4 md:py-8"
            >
              <span className="col-span-2 font-serif text-sm text-ink-muted md:text-base">
                {project.year}
              </span>
              <h2 className="col-span-10 font-serif text-2xl font-medium leading-tight text-ink md:col-span-7 md:text-3xl">
                {project.title}
                {fallback && (
                  <span className="ml-3 inline-flex translate-y-[-2px] items-center rounded-full border border-ink/15 px-2 py-0.5 align-middle text-[0.6rem] font-sans uppercase tracking-widest text-ink-muted">
                    {availableIn === "en"
                      ? t.projectPage.onlyInEnglish
                      : t.projectPage.onlyInKorean}
                  </span>
                )}
              </h2>
              <span className="col-span-12 text-xs uppercase tracking-widest text-ink-muted md:col-span-3 md:text-right">
                {project.medium}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {totalPages > 1 && (
        <>
          <nav
            className="mt-10 flex items-center justify-between gap-4 text-xs uppercase tracking-widest"
            aria-label="Works pagination"
          >
            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className={
                "transition-colors " +
                (safePage === 1
                  ? "text-ink-faint"
                  : "text-ink-muted hover:text-ink")
              }
            >
              ← {home.prevLabel}
            </button>

            <ul className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const active = n === safePage;
                return (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => setPageIndex(n)}
                      aria-current={active ? "page" : undefined}
                      className={
                        "transition-colors " +
                        (active
                          ? "text-accent underline underline-offset-4"
                          : "text-ink-muted hover:text-ink")
                      }
                    >
                      {n}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setPageIndex((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className={
                "transition-colors " +
                (safePage === totalPages
                  ? "text-ink-faint"
                  : "text-ink-muted hover:text-ink")
              }
            >
              {home.nextLabel} →
            </button>
          </nav>

          <p className="mt-4 text-center text-xs uppercase tracking-widest text-ink-faint">
            {home.pageOfLabel(safePage, totalPages)}
          </p>
        </>
      )}
    </section>
  );
}
