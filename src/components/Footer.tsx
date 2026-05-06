"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-xs uppercase tracking-widest text-ink-muted md:flex-row md:items-center md:px-10">
        <span>
          © {year} — {t.footer.rights}
        </span>
        <span>{t.footer.builtWith}</span>
      </div>
    </footer>
  );
}
