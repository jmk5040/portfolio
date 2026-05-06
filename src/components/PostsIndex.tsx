"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import type { Locale } from "@/lib/i18n";
import type { PostSummary, PostSummaryPair } from "@/lib/posts";

type PostsIndexProps = {
  pairs: PostSummaryPair[];
  tags: string[];
};

type Chosen = {
  post: PostSummary;
  fallback: boolean;
  availableIn: Locale;
};

const POSTS_PER_PAGE = 10;

function chooseVariant(pair: PostSummaryPair, locale: Locale): Chosen | null {
  const other: Locale = locale === "en" ? "ko" : "en";
  const primary = pair[locale];
  if (primary) return { post: primary, fallback: false, availableIn: locale };
  const fallback = pair[other];
  if (fallback) return { post: fallback, fallback: true, availableIn: other };
  return null;
}

function formatDate(date: string, locale: Locale): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function matches(post: PostSummary, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (post.title.toLowerCase().includes(q)) return true;
  if (post.excerpt.toLowerCase().includes(q)) return true;
  if (post.tags.some((t) => t.toLowerCase().includes(q))) return true;
  return false;
}

export function PostsIndex({ pairs, tags }: PostsIndexProps) {
  const { locale, t } = useLanguage();
  const page = t.postsPage;
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(1);

  // Resolve each pair against the current locale, then filter by query and
  // by tag (OR semantics: a post passes if it matches any selected tag, or
  // if no tags are selected at all).
  const filtered = useMemo(() => {
    return pairs
      .map((pair) => chooseVariant(pair, locale))
      .filter((c): c is Chosen => c !== null)
      .filter(({ post }) => {
        if (
          activeTags.length > 0 &&
          !post.tags.some((t) => activeTags.includes(t))
        ) {
          return false;
        }
        if (!matches(post, query)) return false;
        return true;
      });
  }, [pairs, locale, query, activeTags]);

  // Whenever the filter inputs change, jump back to page 1 so the user
  // doesn't end up looking at an empty page.
  useEffect(() => {
    setPageIndex(1);
  }, [query, activeTags, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(pageIndex, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pageItems = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const fallbackBadge = (availableIn: Locale): string =>
    availableIn === "en" ? page.onlyInEnglish : page.onlyInKorean;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

      <section className="mx-auto w-full max-w-6xl px-6 pb-32 md:px-10 md:pb-40">
        {/* Search + tag filter */}
        <div className="border-t border-ink/10 pt-10">
          <label className="block">
            <span className="sr-only">{page.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={page.searchPlaceholder}
              className="w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink placeholder-ink-faint outline-none transition-colors focus:border-ink"
            />
          </label>

          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="eyebrow">{page.tagsLabel}</span>
              <button
                type="button"
                onClick={() => setActiveTags([])}
                aria-pressed={activeTags.length === 0}
                className={
                  "uppercase tracking-widest transition-colors " +
                  (activeTags.length === 0
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink")
                }
              >
                {page.clearTags}
              </button>
              {tags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                    className={
                      "uppercase tracking-widest transition-colors " +
                      (active ? "text-ink" : "text-ink-muted hover:text-ink")
                    }
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-4 text-xs uppercase tracking-widest text-ink-faint">
            {page.countLabel(filtered.length)}
          </p>
        </div>

        {/* Post list */}
        {pairs.length === 0 ? (
          <p className="mt-16 text-base text-ink-muted">{page.empty}</p>
        ) : filtered.length === 0 ? (
          <p className="mt-16 text-base text-ink-muted">{page.noResults}</p>
        ) : (
          <>
            <ol className="mt-2">
              {pageItems.map(({ post, fallback, availableIn }) => (
                <li
                  key={post.slug}
                  className="border-b border-ink/10 transition-colors hover:bg-paper-warm"
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="grid grid-cols-12 items-baseline gap-4 px-2 py-7 md:gap-10 md:px-4 md:py-8"
                    hrefLang={post.lang}
                  >
                    <span className="col-span-3 font-serif text-sm text-ink-muted md:col-span-2 md:text-base">
                      {formatDate(post.date, locale)}
                    </span>
                    <div className="col-span-9 md:col-span-10">
                      <h2 className="font-serif text-2xl font-medium leading-tight text-ink md:text-3xl">
                        {post.title}
                        {fallback && (
                          <span className="ml-3 align-middle border border-ink/15 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-ink-muted">
                            {fallbackBadge(availableIn)}
                          </span>
                        )}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft md:text-base">
                          {post.excerpt}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <p className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-widest text-ink-muted">
                          {post.tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ol>

            {totalPages > 1 && (
              <nav
                className="mt-10 flex items-center justify-between gap-4 text-xs uppercase tracking-widest"
                aria-label="Pagination"
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
                  ← {page.prevLabel}
                </button>

                <ul className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => {
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
                    },
                  )}
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    setPageIndex((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  className={
                    "transition-colors " +
                    (safePage === totalPages
                      ? "text-ink-faint"
                      : "text-ink-muted hover:text-ink")
                  }
                >
                  {page.nextLabel} →
                </button>
              </nav>
            )}

            {totalPages > 1 && (
              <p className="mt-4 text-center text-xs uppercase tracking-widest text-ink-faint">
                {page.pageOfLabel(safePage, totalPages)}
              </p>
            )}
          </>
        )}
      </section>
    </>
  );
}
