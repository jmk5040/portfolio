"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function HomeIntro() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
      <span className="eyebrow">{t.home.eyebrow}</span>

      <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink md:text-7xl">
        {t.home.name}
      </h1>

      <p className="mt-10 max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
        {t.home.bio}
      </p>
    </section>
  );
}
