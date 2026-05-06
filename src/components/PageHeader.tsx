import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  heading: string;
  intro?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, heading, intro, children }: PageHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-6xl px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="mt-6 font-serif text-4xl font-medium leading-tight text-ink md:text-5xl">
        {heading}
      </h1>
      {intro && (
        <p className="mt-6 max-w-prose text-base leading-relaxed text-ink-soft md:text-lg">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
