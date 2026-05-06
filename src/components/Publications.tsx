"use client";

import { Fragment, type ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import type { Locale } from "@/lib/i18n";
import type {
  JournalPaper,
  PressItem,
  Writing,
} from "@/lib/publications";

type Props = {
  journalPapers: JournalPaper[];
  writings: Writing[];
  press: PressItem[];
};

const HIGHLIGHT_NAMES = ["Jeong, Mankeun", "Jeong, M.", "정만근"];

function highlightAuthors(authors: string): ReactNode {
  // Find the first matching highlight name (longest first), and bold every
  // occurrence. Falls back to plain text when nothing matches.
  for (const name of HIGHLIGHT_NAMES) {
    if (authors.includes(name)) {
      const parts = authors.split(name);
      return parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <strong className="font-medium text-ink">{name}</strong>
          )}
        </Fragment>
      ));
    }
  }
  return authors;
}

function pickWritingTitle(
  title: Writing["title"] | PressItem["title"],
  locale: Locale,
): { text: string; fallback: boolean; fallbackLang?: Locale } {
  if (typeof title === "string") return { text: title, fallback: false };
  const primary = title[locale];
  if (primary) return { text: primary, fallback: false };
  const other: Locale = locale === "en" ? "ko" : "en";
  const fallback = title[other];
  if (fallback) return { text: fallback, fallback: true, fallbackLang: other };
  return { text: "", fallback: false };
}

function JournalRow({
  item,
  doiLabel,
  arxivLabel,
  contributionLabel,
}: {
  item: JournalPaper;
  doiLabel: string;
  arxivLabel: string;
  contributionLabel: string;
}) {
  const { locale } = useLanguage();

  const citationParts: string[] = [item.venue];
  if (item.volume) citationParts.push(item.volume);
  if (item.pages) citationParts.push(item.pages);

  const titleHref = item.doi
    ? `https://doi.org/${item.doi}`
    : item.arxiv
      ? `https://arxiv.org/abs/${item.arxiv}`
      : item.ads
        ? `https://ui.adsabs.harvard.edu/abs/${item.ads}`
        : item.link;

  // Optional contribution note: written either as a single string or as a
  // `{ en, ko }` object. We pick the viewer's locale, falling back to the
  // other language if only one was provided.
  const contributionText = item.contribution
    ? pickWritingTitle(item.contribution, locale).text
    : "";

  return (
    <li className="grid grid-cols-12 gap-4 border-b border-ink/10 py-8 md:gap-10 md:py-10">
      <span className="col-span-2 font-serif text-sm leading-snug text-ink-muted md:text-base">
        {item.year}
      </span>
      <div className="col-span-10 space-y-2 md:col-span-10">
        <p className="text-sm leading-snug text-ink-soft">
          {highlightAuthors(item.authors)}
        </p>
        <p className="font-serif text-lg leading-snug text-ink md:text-xl">
          {titleHref ? (
            <a
              href={titleHref}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </p>
        <p className="text-sm italic leading-snug text-ink-soft">
          {citationParts.join(", ")}
          {(item.volume || item.pages) ? "." : ""}
        </p>
        {(item.doi || item.arxiv) && (
          <p className="font-mono text-xs text-ink-muted">
            {item.doi && (
              <span className="mr-4">
                <span className="mr-2 text-ink-faint">{doiLabel}</span>
                <a
                  href={`https://doi.org/${item.doi}`}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.doi}
                </a>
              </span>
            )}
            {item.arxiv && (
              <span>
                <span className="mr-2 text-ink-faint">{arxivLabel}</span>
                <a
                  href={`https://arxiv.org/abs/${item.arxiv}`}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.arxiv}
                </a>
              </span>
            )}
          </p>
        )}
        {contributionText && (
          <p className="!mt-3 max-w-prose border-l border-ink/15 pl-4 text-sm leading-relaxed text-ink-soft">
            <span className="mr-2 align-baseline text-[0.65rem] uppercase tracking-widest text-ink-muted">
              {contributionLabel}
            </span>
            {contributionText}
          </p>
        )}
      </div>
    </li>
  );
}

function WritingRow({
  item,
  readLabel,
  koOriginalNote,
  enOriginalNote,
}: {
  item: Writing | PressItem;
  readLabel: string;
  koOriginalNote: string;
  enOriginalNote: string;
}) {
  const { locale } = useLanguage();
  const chosen = pickWritingTitle(item.title, locale);
  const title = chosen.text;

  // A small badge appears when (a) the writer wrote in a different language
  // than the viewer is reading, OR (b) we had to fall back because there's no
  // translation in the viewer's language. Both situations communicate the
  // same thing: "the original is not in your current language".
  const showOriginalNote =
    item.lang && item.lang !== locale ? item.lang : null;
  const note =
    showOriginalNote === "ko"
      ? koOriginalNote
      : showOriginalNote === "en"
        ? enOriginalNote
        : null;

  const titleNode = item.link ? (
    <a
      href={item.link}
      className="link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  ) : (
    title
  );

  return (
    <li className="grid grid-cols-12 items-baseline gap-4 border-b border-ink/10 py-6 md:gap-10 md:py-8">
      <span className="col-span-2 font-serif text-sm text-ink-muted md:text-base">
        {item.year}
      </span>
      <div className="col-span-10 max-w-prose space-y-1 md:col-span-7">
        <p className="text-base leading-relaxed text-ink">{titleNode}</p>
        {note && (
          <p className="text-xs uppercase tracking-widest text-ink-muted">
            {note}
          </p>
        )}
      </div>
      <span className="col-span-12 text-xs uppercase tracking-widest text-ink-muted md:col-span-3 md:text-right">
        {item.link ? (
          <a
            href={item.link}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${readLabel}: ${item.venue}`}
          >
            {item.venue}
          </a>
        ) : (
          item.venue
        )}
      </span>
    </li>
  );
}

function Group({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 pt-10">
      <header className="mb-2">
        <span className="eyebrow">{eyebrow}</span>
      </header>
      <ol>{children}</ol>
    </section>
  );
}

function SubGroup({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <header className="mb-1">
        <span className="text-xs uppercase tracking-widest text-ink-muted">
          {eyebrow}
        </span>
      </header>
      <ol>{children}</ol>
    </section>
  );
}

export function Publications({ journalPapers, writings, press }: Props) {
  const { t } = useLanguage();
  const page = t.publicationsPage;

  const firstAuthor = journalPapers.filter((p) => p.firstAuthor);
  const coAuthor = journalPapers.filter((p) => !p.firstAuthor);

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} heading={page.heading} intro={page.intro} />

      <div className="mx-auto w-full max-w-6xl space-y-20 px-6 pb-32 md:px-10 md:pb-40">
        {page.archive && page.archive.links.length > 0 && (
          <section className="border-t border-ink/10 pt-10">
            <header className="mb-3">
              <span className="eyebrow">{page.archive.heading}</span>
            </header>
            <p className="max-w-prose text-sm leading-relaxed text-ink-soft md:text-base">
              {page.archive.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {page.archive.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-flex items-baseline gap-2 text-base text-ink"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-ink-faint">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {journalPapers.length > 0 ? (
          <Group eyebrow={page.journalHeading}>
            {firstAuthor.length > 0 && (
              <SubGroup eyebrow={page.firstAuthorHeading}>
                {firstAuthor.map((item) => (
                  <JournalRow
                    key={item.title}
                    item={item}
                    doiLabel={page.doiLabel}
                    arxivLabel={page.arxivLabel}
                    contributionLabel={page.contributionLabel}
                  />
                ))}
              </SubGroup>
            )}
            {coAuthor.length > 0 && (
              <SubGroup eyebrow={page.coAuthorHeading}>
                {coAuthor.map((item) => (
                  <JournalRow
                    key={item.title}
                    item={item}
                    doiLabel={page.doiLabel}
                    arxivLabel={page.arxivLabel}
                    contributionLabel={page.contributionLabel}
                  />
                ))}
              </SubGroup>
            )}
          </Group>
        ) : (
          <Group eyebrow={page.journalHeading}>
            <li className="py-6 text-sm text-ink-muted">{page.emptyJournal}</li>
          </Group>
        )}

        {writings.length > 0 && (
          <Group eyebrow={page.writingsHeading}>
            {writings.map((item, index) => (
              <WritingRow
                key={index}
                item={item}
                readLabel={page.readLabel}
                koOriginalNote={page.koOriginalNote}
                enOriginalNote={page.enOriginalNote}
              />
            ))}
          </Group>
        )}

        {press.length > 0 && (
          <Group eyebrow={page.pressHeading}>
            {press.map((item, index) => (
              <WritingRow
                key={index}
                item={item}
                readLabel={page.readLabel}
                koOriginalNote={page.koOriginalNote}
                enOriginalNote={page.enOriginalNote}
              />
            ))}
          </Group>
        )}
      </div>
    </>
  );
}
