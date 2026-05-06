"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";

export function Contact() {
  const { t } = useLanguage();
  const c = t.contactPage;

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} heading={c.heading} intro={c.intro} />

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10">
        <dl className="grid gap-6 border-t border-ink/10 pt-14 md:grid-cols-12 md:gap-10">
          <dt className="md:col-span-3">
            <span className="eyebrow">{c.emailLabel}</span>
          </dt>
          <dd className="md:col-span-9">
            <a
              href={`mailto:${c.email}`}
              className="link font-serif text-2xl text-ink md:text-3xl"
            >
              {c.email}
            </a>
          </dd>

          <dt className="md:col-span-3">
            <span className="eyebrow">{c.locationLabel}</span>
          </dt>
          <dd className="md:col-span-9 font-serif text-xl text-ink-soft md:text-2xl">
            {c.location}
          </dd>

          <dt className="md:col-span-3">
            <span className="eyebrow">{c.socialLabel}</span>
          </dt>
          <dd className="md:col-span-9">
            <ul className="space-y-2">
              {c.social.map((item) => (
                <li key={item.label} className="flex items-baseline gap-4">
                  <span className="w-32 shrink-0 text-xs uppercase tracking-widest text-ink-muted">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-base text-ink"
                  >
                    {item.handle}
                  </a>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-32 md:px-10 md:pb-40">
        <div className="grid gap-6 border-t border-ink/10 pt-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <span className="eyebrow">{c.pressNoteHeading}</span>
          </div>
          <p className="max-w-prose text-base leading-relaxed text-ink-soft md:col-span-9 md:text-lg">
            {c.pressNoteBody}
          </p>
        </div>
      </section>
    </>
  );
}
