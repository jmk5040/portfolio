import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/*
  Tailwind reads its colour tokens from the CSS variables defined in
  `src/styles/theme.css`. The `rgb(var(--name) / <alpha-value>)` pattern
  is the recommended Tailwind 3 idiom — it lets utilities like
  `text-ink/40` or `bg-accent/15` mix the alpha through the same variable.
  See: https://tailwindcss.com/docs/customizing-colors#using-css-variables
*/
const withAlpha = (varName: string) =>
  `rgb(var(${varName}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: withAlpha("--color-ink"),
          soft: withAlpha("--color-ink-soft"),
          muted: withAlpha("--color-ink-muted"),
          faint: withAlpha("--color-ink-faint"),
        },
        paper: {
          DEFAULT: withAlpha("--color-paper"),
          warm: withAlpha("--color-paper-warm"),
        },
        accent: {
          DEFAULT: withAlpha("--color-accent"),
          soft: withAlpha("--color-accent-soft"),
        },
      },
      maxWidth: {
        prose: "62ch",
      },
      letterSpacing: {
        wider: ".08em",
        widest: ".22em",
      },
      typography: () => ({
        ink: {
          css: {
            "--tw-prose-body": "rgb(var(--color-ink-soft))",
            "--tw-prose-headings": "rgb(var(--color-ink))",
            "--tw-prose-lead": "rgb(var(--color-ink-soft))",
            "--tw-prose-links": "rgb(var(--color-ink))",
            "--tw-prose-bold": "rgb(var(--color-ink))",
            "--tw-prose-counters": "rgb(var(--color-ink-muted))",
            "--tw-prose-bullets": "rgb(var(--color-ink-faint))",
            "--tw-prose-hr": "rgb(var(--color-ink-faint))",
            "--tw-prose-quotes": "rgb(var(--color-ink-soft))",
            // Blockquote left border picks up the accent — the only spot
            // inside the prose block that does, so it's a clear visual
            // signal without overpowering body text.
            "--tw-prose-quote-borders": "rgb(var(--color-accent))",
            "--tw-prose-captions": "rgb(var(--color-ink-muted))",
            "--tw-prose-code": "rgb(var(--color-ink))",
            "--tw-prose-pre-code": "rgb(var(--color-ink))",
            "--tw-prose-pre-bg": "rgb(var(--color-paper-warm))",
            "--tw-prose-th-borders": "rgb(var(--color-ink-faint))",
            "--tw-prose-td-borders": "rgb(var(--color-ink-faint))",
            "--tw-prose-kbd": "rgb(var(--color-ink))",
            "--tw-prose-kbd-shadows": "17 17 17",
            h1: { fontFamily: "var(--font-serif)", fontWeight: "500" },
            h2: { fontFamily: "var(--font-serif)", fontWeight: "500" },
            h3: { fontFamily: "var(--font-serif)", fontWeight: "500" },
            a: {
              fontWeight: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            },
            blockquote: { fontStyle: "italic" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
