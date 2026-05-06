"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/components/LanguageProvider";

// Giscus configuration is read from public env vars at build time. To enable
// comments, copy `.env.example` to `.env.local` and fill in the four IDs.
// See https://giscus.app for instructions on obtaining them.
const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

const isConfigured = Boolean(repo && repoId && category && categoryId);

export function Comments() {
  const { locale, t } = useLanguage();
  const pathname = usePathname() ?? "";
  const ref = useRef<HTMLDivElement>(null);

  // Link straight to the GitHub Discussions tab, pre-filtered by the current
  // post's pathname. Giscus uses pathname mapping, so each post's discussion
  // title contains the path — searching for it narrows the list to the
  // single relevant thread (or shows "no results" before anyone has commented).
  const manageHref =
    isConfigured && repo
      ? `https://github.com/${repo}/discussions?discussions_q=${encodeURIComponent(pathname)}`
      : null;

  useEffect(() => {
    if (!isConfigured) return;
    const node = ref.current;
    if (!node || node.children.length > 0) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo!);
    script.setAttribute("data-repo-id", repoId!);
    script.setAttribute("data-category", category!);
    script.setAttribute("data-category-id", categoryId!);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", locale === "ko" ? "ko" : "en");
    script.setAttribute("data-loading", "lazy");

    node.appendChild(script);

    return () => {
      // Clean up on locale change so Giscus reloads with the right language.
      while (node.firstChild) node.removeChild(node.firstChild);
    };
  }, [locale]);

  return (
    <section className="mt-20 border-t border-ink/10 pt-10">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
          {t.postPage.commentsHeading}
        </h2>
        {manageHref && (
          <a
            href={manageHref}
            target="_blank"
            rel="noopener noreferrer"
            className="link inline-flex items-baseline gap-2 text-xs uppercase tracking-widest text-ink-muted"
          >
            {t.postPage.commentsManageOnGitHub}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>

      {isConfigured ? (
        <div ref={ref} className="mt-8" />
      ) : (
        <p className="mt-6 text-sm text-ink-muted">
          {t.postPage.commentsDisabledNote}
        </p>
      )}
    </section>
  );
}
