"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Comments } from "@/components/Comments";
import { useLanguage } from "@/components/LanguageProvider";
import { markdownComponents } from "@/components/markdownComponents";
import type { Locale } from "@/lib/i18n";
import type {
  Post,
  PostPair,
  PostSummary,
  PostSummaryPair,
} from "@/lib/posts";

const POSTS_PER_PAGE = 10;

type PostDetailProps = {
  pair: PostPair;
  allPairs: PostSummaryPair[];
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

export function PostDetail({ pair, allPairs }: PostDetailProps) {
  const { locale, t } = useLanguage();
  const post = t.postPage;
  const chosen = useMemo(
    () => chooseVariant<Post>(pair, locale),
    [pair, locale],
  );

  // Sidebar list, resolved against the current locale.
  const sidebarItems = useMemo(
    () =>
      allPairs
        .map((p) => chooseVariant<PostSummary>(p, locale))
        .filter((c): c is Chosen<PostSummary> => c !== null),
    [allPairs, locale],
  );

  const currentSlug = chosen?.value.slug ?? "";

  // Find which page contains the current post so the sidebar opens on the
  // right page by default.
  const currentIndex = useMemo(
    () => sidebarItems.findIndex((c) => c.value.slug === currentSlug),
    [sidebarItems, currentSlug],
  );

  const initialPage =
    currentIndex >= 0 ? Math.floor(currentIndex / POSTS_PER_PAGE) + 1 : 1;

  const [pageIndex, setPageIndex] = useState(initialPage);

  // When the locale flips (or the user navigates to a different post via the
  // sidebar) jump to the page containing the now-current post.
  useEffect(() => {
    setPageIndex(initialPage);
  }, [initialPage]);

  if (!chosen) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-32 md:px-10">
        <p className="font-serif text-2xl text-ink">Post not found.</p>
        <Link
          href="/posts"
          className="link mt-6 inline-block text-sm tracking-widest text-ink-muted"
        >
          ← {post.backToPosts}
        </Link>
      </section>
    );
  }

  const { value: postData, fallback, availableIn } = chosen;
  const fallbackNote =
    availableIn === "en" ? post.onlyInEnglishNote : post.onlyInKoreanNote;

  const totalPages = Math.max(1, Math.ceil(sidebarItems.length / POSTS_PER_PAGE));
  const safePage = Math.min(pageIndex, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pageItems = sidebarItems.slice(pageStart, pageStart + POSTS_PER_PAGE);

  return (
    <article
      className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-12"
      lang={postData.lang}
    >
      <Link
        href="/posts"
        className="link inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted"
      >
        <span aria-hidden="true">←</span>
        <span>{post.backToPosts}</span>
      </Link>

      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-10">
        {/* Sidebar — list of all posts with pagination. */}
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <span className="eyebrow">{post.allPostsLabel}</span>
            <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
              {pageItems.map(({ value: p, fallback: isFallback, availableIn: lang }) => {
                const active = p.slug === currentSlug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/posts/${p.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={
                        "block text-sm leading-snug transition-colors " +
                        (active
                          ? "text-accent"
                          : "text-ink-muted hover:text-ink")
                      }
                    >
                      <span className="block text-[0.65rem] uppercase tracking-widest text-ink-faint">
                        {formatDate(p.date, locale)}
                      </span>
                      <span className="mt-0.5 block">
                        {p.title}
                        {isFallback && (
                          <span className="ml-2 inline-block rounded-full border border-ink/15 px-1.5 py-0.5 align-middle text-[0.55rem] uppercase tracking-widest text-ink-muted">
                            {lang === "en"
                              ? t.postsPage.onlyInEnglish
                              : t.postsPage.onlyInKorean}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <>
                <nav
                  className="mt-6 flex items-center justify-between gap-2 text-[0.65rem] uppercase tracking-widest"
                  aria-label="Posts pagination"
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
                    ← {post.prevLabel}
                  </button>
                  <span className="text-ink-faint">
                    {safePage} / {totalPages}
                  </span>
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
                    {post.nextLabel} →
                  </button>
                </nav>
              </>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="md:col-span-9">
          <header className="border-b border-ink/10 pb-8">
            <p className="text-xs uppercase tracking-widest text-ink-muted">
              <time dateTime={postData.date}>
                {formatDate(postData.date, locale)}
              </time>
            </p>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
              {postData.title}
            </h1>
            {postData.tags.length > 0 && (
              <p className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-widest text-ink-muted">
                {postData.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </p>
            )}
            {fallback && (
              <p className="mt-6 inline-block border border-ink/15 px-3 py-1 text-xs uppercase tracking-widest text-ink-muted">
                {fallbackNote}
              </p>
            )}
          </header>

          <div className="prose prose-ink mt-10 max-w-prose prose-p:leading-relaxed prose-p:text-ink-soft md:prose-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {postData.body}
            </ReactMarkdown>
          </div>

          <div className="mt-16 max-w-prose">
            <Comments />
          </div>
        </div>
      </div>
    </article>
  );
}
