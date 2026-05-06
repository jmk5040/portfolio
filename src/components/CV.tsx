"use client";

import type { EducationEntry } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";

function CVEntrySection({
  title,
  entries,
}: {
  title: string;
  entries: EducationEntry[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
      <div className="grid gap-6 border-t border-ink/10 pt-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-3">
          <span className="eyebrow">{title}</span>
        </div>
        <ul className="md:col-span-9">
          {entries.map((entry, index) => (
            <li
              key={index}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-ink/10 py-8 first:border-t-0 md:gap-10"
            >
              <span className="col-span-12 text-xs uppercase tracking-widest text-ink-muted md:col-span-3">
                {entry.period}
              </span>
              <div className="col-span-12 md:col-span-9">
                <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                  {entry.school}
                </h3>
                <p className="mt-2 max-w-prose text-base leading-relaxed text-ink-soft">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CV() {
  const { t } = useLanguage();
  const cv = t.cvPage;

  return (
    <>
      <PageHeader eyebrow={cv.eyebrow} heading={cv.heading} intro={cv.intro} />

      <CVEntrySection title={cv.educationHeading} entries={cv.education} />
      <CVEntrySection title={cv.grantsHeading} entries={cv.grants} />
      <CVEntrySection title={cv.awardsHeading} entries={cv.awards} />
      <CVEntrySection title={cv.exhibitionsHeading} entries={cv.exhibitions} />

      <section className="mx-auto w-full max-w-6xl px-6 pb-32 md:px-10 md:pb-40">
        <div className="grid gap-6 border-t border-ink/10 pt-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <span className="eyebrow">{cv.downloadHeading}</span>
          </div>
          <div className="md:col-span-9">
            <p className="max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
              {cv.downloadBody}
            </p>
            <a
              href="/resume.pdf"
              download
              className="mt-8 inline-flex items-center gap-3 border border-ink px-5 py-3 text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <span>{cv.downloadLabel}</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
