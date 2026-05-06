"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.toggle.label}
      className="inline-flex items-center text-[0.7rem] tracking-widest text-ink-muted"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={
          "px-1.5 py-1 transition-colors " +
          (locale === "en" ? "text-ink" : "hover:text-ink")
        }
      >
        {t.toggle.en}
      </button>
      <span aria-hidden="true" className="text-ink-faint">
        /
      </span>
      <button
        type="button"
        onClick={() => setLocale("ko")}
        aria-pressed={locale === "ko"}
        className={
          "px-1.5 py-1 transition-colors " +
          (locale === "ko" ? "text-ink" : "hover:text-ink")
        }
      >
        {t.toggle.ko}
      </button>
    </div>
  );
}
