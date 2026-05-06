"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/LanguageProvider";
import { markdownComponents } from "@/components/markdownComponents";
import type { Locale } from "@/lib/i18n";
import type {
  Project,
  ProjectPair,
  ProjectSummary,
  ProjectSummaryPair,
} from "@/lib/works";

const OVERVIEW_ID = "overview";

type ProjectDetailProps = {
  pair: ProjectPair;
  allPairs: ProjectSummaryPair[];
};

type Chosen<T> = {
  value: T;
  fallback: boolean;
  availableIn: Locale;
};

function chooseVariant<T>(
  pair: Partial<Record<Locale, T>>,
  locale: Locale,
): Chosen<T> | null {
  const other: Locale = locale === "en" ? "ko" : "en";
  const primary = pair[locale];
  if (primary) return { value: primary, fallback: false, availableIn: locale };
  const fallback = pair[other];
  if (fallback) return { value: fallback, fallback: true, availableIn: other };
  return null;
}

export function ProjectDetail({ pair, allPairs }: ProjectDetailProps) {
  const { locale, t } = useLanguage();

  const chosen = useMemo(
    () => chooseVariant<Project>(pair, locale),
    [pair, locale],
  );

  const sidebarItems = useMemo(() => {
    return allPairs
      .map((p) => chooseVariant<ProjectSummary>(p, locale))
      .filter((c): c is Chosen<ProjectSummary> => c !== null);
  }, [allPairs, locale]);

  const project = chosen?.value;
  const [activeId, setActiveId] = useState<string>(OVERVIEW_ID);

  useEffect(() => {
    if (!project) return;

    const ids = [OVERVIEW_ID, ...project.parts.map((p) => p.slug)];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project]);

  if (!project || !chosen) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-32 md:px-10">
        <p className="font-serif text-2xl text-ink">Project not found.</p>
        <Link
          href="/"
          className="link mt-6 inline-block text-sm tracking-widest text-ink-muted"
        >
          ← {t.projectPage.backToWorks}
        </Link>
      </section>
    );
  }

  const fallbackNote = chosen.fallback
    ? chosen.availableIn === "en"
      ? t.projectPage.onlyInEnglishNote
      : t.projectPage.onlyInKoreanNote
    : null;

  return (
    <article className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-40 md:pt-12">
      <Link
        href="/"
        className="link inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted"
      >
        <span aria-hidden="true">←</span>
        <span>{t.projectPage.backToWorks}</span>
      </Link>

      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-10">
        {/* Column 1 — All projects */}
        <aside className="md:col-span-2">
          <div className="md:sticky md:top-28">
            <span className="eyebrow">{t.projectPage.allProjectsLabel}</span>
            <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
              {sidebarItems.map(({ value: p, fallback, availableIn }) => {
                const active = p.slug === project.slug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/works/${p.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={
                        "block text-sm leading-snug transition-colors " +
                        (active
                          ? "text-accent"
                          : "text-ink-muted hover:text-ink")
                      }
                    >
                      {p.title}
                      {fallback && (
                        <span className="ml-2 inline-block rounded-full border border-ink/15 px-1.5 py-0.5 align-middle text-[0.55rem] uppercase tracking-widest text-ink-muted">
                          {availableIn === "en"
                            ? t.projectPage.onlyInEnglish
                            : t.projectPage.onlyInKorean}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Column 2 — In this project (project header + sub-works) */}
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <header>
              <span className="eyebrow">{project.year}</span>
              <h1 className="mt-3 font-serif text-2xl font-medium leading-tight text-ink md:text-3xl">
                {project.title}
              </h1>
              <p className="mt-2 text-xs uppercase tracking-widest text-ink-muted">
                {project.medium}
              </p>
            </header>

            <div className="mt-8 border-t border-ink/10 pt-4">
              <span className="eyebrow">{t.projectPage.partsLabel}</span>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={`#${OVERVIEW_ID}`}
                    aria-current={activeId === OVERVIEW_ID ? "true" : undefined}
                    className={
                      "block text-sm transition-colors " +
                      (activeId === OVERVIEW_ID
                        ? "text-accent"
                        : "text-ink-muted hover:text-ink")
                    }
                  >
                    <span aria-hidden="true" className="mr-2 text-ink-faint">
                      —
                    </span>
                    {t.projectPage.overviewLabel}
                  </a>
                </li>
                {project.parts.map((part) => {
                  const active = activeId === part.slug;
                  return (
                    <li key={part.slug}>
                      <a
                        href={`#${part.slug}`}
                        aria-current={active ? "true" : undefined}
                        className={
                          "block text-sm transition-colors " +
                          (active
                            ? "text-accent"
                            : "text-ink-muted hover:text-ink")
                        }
                      >
                        <span aria-hidden="true" className="mr-2 text-ink-faint">
                          —
                        </span>
                        {part.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* Column 3 — Project contents */}
        <div className="md:col-span-7">
          {fallbackNote && (
            <p className="mb-8 inline-block rounded-md border border-ink/10 bg-paper-warm px-4 py-2 text-xs uppercase tracking-widest text-ink-muted">
              {fallbackNote}
            </p>
          )}

          <section id={OVERVIEW_ID} className="scroll-mt-28">
            <span className="eyebrow">{t.projectPage.overviewLabel}</span>
            {project.overview.trim() && (
              <div className="prose prose-ink mt-4 max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {project.overview}
                </ReactMarkdown>
              </div>
            )}
          </section>

          {project.parts.map((part) => (
            <section
              key={part.slug}
              id={part.slug}
              className="mt-20 scroll-mt-28 border-t border-ink/10 pt-12"
            >
              <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
                {part.title}
              </h2>

              {part.body.trim() && (
                <div className="prose prose-ink mt-6 max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {part.body}
                  </ReactMarkdown>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
