"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

type NavLink = {
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
};

export function Nav() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: NavLink[] = [
    {
      href: "/",
      label: t.nav.works,
      matches: (p) => p === "/" || p.startsWith("/works"),
    },
    {
      href: "/publications",
      label: t.nav.publications,
      matches: (p) => p === "/publications",
    },
    {
      href: "/cv",
      label: t.nav.cv,
      matches: (p) => p === "/cv",
    },
    {
      href: "/posts",
      label: t.nav.posts,
      matches: (p) => p === "/posts" || p.startsWith("/posts/"),
    },
    {
      href: "/contact",
      label: t.nav.contact,
      matches: (p) => p === "/contact",
    },
  ];

  return (
    <header
      className={
        "sticky top-0 z-40 w-full border-b transition-colors " +
        (scrolled
          ? "border-ink/10 bg-paper/85 backdrop-blur"
          : "border-transparent bg-paper")
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-serif text-base italic text-ink"
          aria-label="Mankeun Jeong — home"
        >
          Mankeun Jeong
        </Link>

        <ul className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => {
            const active = link.matches(pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "relative pb-1 transition-colors " +
                    (active
                      ? "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-accent"
                      : "text-ink-muted hover:text-ink")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </nav>

      {/* Mobile nav row, shown below the brand on small screens */}
      <div className="border-t border-ink/5 md:hidden">
        <ul className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-6 py-3 text-sm">
          {links.map((link) => {
            const active = link.matches(pathname);
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-ink" : "text-ink-muted"}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
