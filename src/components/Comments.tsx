"use client";

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
  const ref = useRef<HTMLDivElement>(null);

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
      <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
        {t.postPage.commentsHeading}
      </h2>

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
