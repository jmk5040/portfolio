# Mankeun Jeong — Portfolio

A minimal, typography-led portfolio site for Mankeun Jeong, a multidisciplinary
artist. Built with Next.js (App Router), TypeScript, and Tailwind CSS, with
- a built-in Korean / English language toggle,
- a master-detail project page (sticky three-column layout),
- a Markdown-driven casual blog with built-in search and optional Giscus
  comments,
- a sitemap and robots file so search engines can index every page.

## Tech stack

- **Next.js 15** (App Router, React Server Components, statically generated routes)
- **React 19** · **TypeScript**
- **Tailwind CSS** with `@tailwindcss/typography` (custom paper / ink palette)
- **Inter + EB Garamond + Noto Sans/Serif KR** via Google Fonts
- **gray-matter + react-markdown + remark-gfm** for the blog

## Routes

| Path | Description |
| --- | --- |
| `/` | Home — name, bio, and the full list of projects |
| `/works/[slug]` | Project page with three-column **Projects · In this project · Project contents** layout (statically generated) |
| `/publications` | Journal papers, writings/catalogues, and press, formatted per type |
| `/cv` | Education + downloadable résumé PDF |
| `/posts` | Casual blog index with live search and tag filter |
| `/posts/[slug]` | Individual post page (Markdown body + optional Giscus comments) |
| `/contact` | Email, studio, and social channels |
| `/sitemap.xml`, `/robots.txt` | Auto-generated for search-engine crawling |

`/works` is a permanent 308 redirect to `/`. The top navigation order is:
**Works · Publications · C.V. · Posts · Contact**, with the active section
underlined.

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Other useful scripts:

```bash
npm run build   # production build (statically generates project + post pages)
npm run start   # serve the production build locally
npm run lint    # ESLint (next/core-web-vitals)
```

## Project structure

```
content/
├── posts/                       # Markdown blog posts (one file per post)
├── works/                       # Markdown project files (one file per project per language)
└── publications/                # Frontmatter-only markdown files for papers, essays, press
    ├── journal/
    ├── writings/
    └── press/

src/
├── app/
│   ├── layout.tsx               # Fonts, metadata, Nav, Footer, LanguageProvider
│   ├── page.tsx                 # Home: HomeIntro + ProjectIndex
│   ├── globals.css
│   ├── sitemap.ts               # /sitemap.xml
│   ├── robots.ts                # /robots.txt
│   ├── works/[slug]/page.tsx
│   ├── publications/page.tsx
│   ├── cv/page.tsx
│   ├── posts/
│   │   ├── page.tsx             # Index (loads posts via fs)
│   │   └── [slug]/page.tsx      # Post detail (statically generated)
│   └── contact/page.tsx
├── components/
│   ├── LanguageProvider.tsx
│   ├── LanguageToggle.tsx
│   ├── Nav.tsx                  # Sticky top nav with active-page underline
│   ├── Footer.tsx
│   ├── PageHeader.tsx
│   ├── HomeIntro.tsx            # Name + bio block
│   ├── ProjectIndex.tsx         # Project list
│   ├── ProjectDetail.tsx        # 3-column project page with scroll-spy
│   ├── ImagePlaceholder.tsx
│   ├── Publications.tsx
│   ├── CV.tsx
│   ├── Contact.tsx
│   ├── PostsIndex.tsx           # Search + tag filter for blog
│   ├── PostDetail.tsx           # Renders Markdown + comments
│   └── Comments.tsx             # Giscus (opt-in)
└── lib/
    ├── i18n.ts                  # UI copy, education, contact, social links (EN + KO)
    ├── works.ts                 # Reads content/works/*.md at build time
    ├── posts.ts                 # Reads content/posts/*.md at build time
    └── publications.ts          # Reads content/publications/{journal,writings,press}/*.md

public/
└── resume.pdf                   # Drop your CV here (replace the placeholder)
```

## Editing content

### Static UI copy (most things)

`src/lib/i18n.ts` holds two parallel dictionaries (`en` and `ko`) for nav
labels, page headings, education, publications, contact, and all blog UI
strings. Keys must stay in sync between languages. Project content does **not**
live here — see below.

### Adding a new project

Projects live in `content/works/`, one file per project per language, named
the same way as blog posts. The filename is the URL slug:

```
content/works/
├── rooms-without-hours.en.md      # English version
├── rooms-without-hours.ko.md      # Korean version (paired by shared slug)
├── field-notes.en.md
├── field-notes.ko.md
├── soft-architecture.en.md
├── soft-architecture.ko.md
├── letters-to-a-stranger.en.md
└── letters-to-a-stranger.ko.md
```

Two files that share the same slug are **paired**: the language toggle on
the project page swaps between them, and the works list shows a single row
per slug.

Frontmatter (top of the file):

```markdown
---
title: "The Duck Among Us"
year: "2026"
medium: "Photography, performance"
---
```

Required: `title`, `year`, `medium`.

Body convention:

```markdown
The text **before the first `## ` heading** is the project Overview.
Multiple paragraphs work. So do blockquotes, lists, and **links**:
visit the [exhibition page](https://example.org) for context.

You can also add a footnote like this[^1] — GitHub Flavored Markdown is on.

![Alt text for screen readers](/works/<slug>/01.jpg "Caption shown under the image")

The image renders right where you place it, with the caption below it.

## First Part Title

The body of this part. Markdown.

![Detail shot](/works/<slug>/02.jpg "Untitled (Detail), 2025")

## Second Part Title

Body of the next part.

![Final view](placeholder-square "Detail")

[^1]: Footnotes appear at the bottom of the section, auto-numbered, with a
    back-arrow link.
```

- Each `## Title` heading begins a new Part. Use parts when a project has
  several distinct sub-works; skip them entirely (overview only) when a
  project is a single piece — that's perfectly fine.
- Slugs for the in-page sidebar (`#empty-interiors`, `#translucent-panels`,
  …) are derived automatically from the EN file's `## ` titles. The KO file
  inherits these slugs by position, so the same anchor URLs work in both
  languages even though the headings are written in Korean.
- **Images** are ordinary markdown — `![alt](src "caption")` — and render
  exactly where you put them. The `title` (the part in quotes) shows as a
  visible caption under the image. Use `placeholder`, `placeholder-portrait`,
  or `placeholder-square` as the `src` for a CSS placeholder while you're
  still drafting; replace with a real path under `/works/<slug>/...` when
  the photograph is ready (see *Adding real photographs* below).
- **Links** open in a new tab automatically when the URL starts with
  `http(s)://`. Internal links (e.g. `/posts`) stay in the same tab.
- **Footnotes** use the standard `[^id]` / `[^id]: …` GFM syntax.

#### Adding a Korean version of an existing project

1. Copy `content/works/<slug>.en.md` to `content/works/<slug>.ko.md`.
2. Translate `title`, `medium`, the overview text, and each `## Heading` plus
   its body. Keep `year` identical so the project sorts to the same place,
   and keep the **number and order** of `## ` headings the same so the
   sidebar slugs stay paired.
3. Save. The works list and `/works/<slug>` switch to Korean as soon as the
   language toggle is set to `KO`.

If a project exists in only one language, it still appears in the works list
in the other language with a small "EN only" / "KO only" badge, and the
project page shows the available content with a small note above it.

`generateStaticParams` picks up new files automatically — every `npm run
build` re-reads `content/works/`.

### Adding a new blog post

Posts live in `content/posts/`. The filename encodes both the URL slug and
the language:

```
content/posts/
├── notes-on-looking-slowly.en.md   # English version
├── notes-on-looking-slowly.ko.md   # Korean version (paired with the EN file)
├── field-notes-january.en.md       # English-only post
└── three-books-this-winter.en.md   # English-only post
```

The slug is the filename minus the `.<lang>.md` suffix. Two files that share
the same slug are **paired**: the EN/KO toggle on the post page automatically
swaps between them, and the post list shows a single row per slug.

Frontmatter:

```markdown
---
title: "Your post title"
date: "2026-03-04"
tags: ["studio", "method"]
excerpt: "A one-line summary used in the index and meta tags."
---

The body in **Markdown**. Headings, lists, quotes, links, images, tables,
strikethrough — all supported (GitHub Flavored Markdown is enabled).
```

Required: `title`, `date` (ISO `YYYY-MM-DD`).
Optional: `tags`, `excerpt`. The `lang` is taken from the filename suffix; you
can omit it from frontmatter.

#### Adding images to a post

Posts use the same image convention as projects. Drop the photo into
`public/posts/<slug>/` (any filename works — `01.jpg`, `figure1.png`,
`hero.jpg`, etc.) and reference it from the markdown wherever you want it
to appear:

```markdown
Some prose introducing the photo.

![Alt text for screen readers](/posts/notes-on-looking-slowly/01.jpg "Optional caption shown under the image")

More prose. The next image appears here:

![Detail shot](/posts/notes-on-looking-slowly/02.jpg "Untitled (Detail), 2025")
```

The image renders inline, full-width, with the `title` (the part in quotes)
as the visible caption. External links — including DOI / arXiv / press URLs
— open in a new tab automatically. Footnotes (`text[^1]` … `[^1]: …`) work
out of the box because GitHub Flavored Markdown is on.

Files under `public/` are served at the root of the site, so a file at
`public/posts/notes-on-looking-slowly/01.jpg` is reachable at the URL
`/posts/notes-on-looking-slowly/01.jpg`. Files under `content/` are not
served to the browser, so images must live in `public/`.

#### Adding a Korean version of an existing post

1. Find the file you want to translate, e.g. `content/posts/notes-on-looking-slowly.en.md`.
2. Create a new file next to it with the same slug and a `.ko.md` suffix:
   `content/posts/notes-on-looking-slowly.ko.md`.
3. Copy the frontmatter and translate `title`, `excerpt`, and the body.
   Keep `date` and `tags` identical so the two versions sort together and
   filter under the same tag pills.
4. Save. `/posts` and `/posts/notes-on-looking-slowly` now serve the Korean
   version when the language toggle is on `KO`.

If a post exists in only one language, it still appears in the list in the
other language with a small "EN only" / "KO only" badge, and the post page
shows the available content with a small note above the body.

Tag identifiers should stay in English (e.g. `studio`, `method`) so they
group across languages on the tag filter; the tag display text is the
identifier itself.

Files without a language suffix (`my-post.md`) are also supported — they're
treated as the language declared in their frontmatter `lang:` field, or
English by default.

### Adding a new publication

Publications live in `content/publications/`, split into three subfolders:

```
content/publications/
├── journal/      # Refereed journal papers
├── writings/     # Essays, criticism, catalogue texts
└── press/        # Press mentions / interviews
```

Each entry is one markdown file. The body is currently unused — only the
frontmatter matters. The page reads every `*.md` file in each subfolder at
build time, sorts by year (or `date` if set) descending, and renders.

#### Journal paper

Filename convention: `<year>-<firstauthor>-<keyword>.md` (just for tidy
sorting in your editor — the parser doesn't care about the filename).

```markdown
---
type: journal
firstAuthor: true              # true if Mankeun is the first author
authors: "Jeong, M., Im, M., Kim, J., et al."
year: "2026"
title: "KMTNet Synoptic Survey of Southern Sky II: ..."
venue: "Journal of Korean Astronomical Society"
volume: "59"
pages: "157-177"
doi: "10.5303/JKAS.2026.59.1.157"
arxiv: "2603.17442"            # optional
ads: "2026JKAS...59..157J"     # optional
contribution:                  # optional, see below
  en: "Led the survey design, data reduction pipeline, and analysis."
  ko: "관측 설계와 자료 처리, 분석을 주도하였다."
---
```

- `firstAuthor: true` → renders under **First-author** sub-heading.
  `false` (or omitted) → renders under **Co-authored**.
- For co-authored papers where Mankeun isn't in the first three authors,
  the convention used in the existing files is
  `"Lee, D., et al. (incl. Jeong, M.)"`. Any occurrence of `"Jeong, M."`
  or `"Jeong, Mankeun"` is bolded automatically in the rendered list.
- The title links to the DOI (or the arXiv abstract / ADS bibcode if no
  DOI is set). The DOI and arXiv ID are also shown as separate inline
  links below the citation.
- `contribution` is **optional**. Use it to add a one-line note clarifying
  what role you played on a paper — most useful on co-authored papers. It
  renders below the DOI/arXiv line, prefixed with a small "Contribution"
  eyebrow. Two forms are accepted:

  ```yaml
  # Single language (shown to everyone, regardless of EN/KO toggle):
  contribution: "Conducted morphology fitting with GALFIT for gas emission estimation."

  # Both languages (each viewer sees their own; falls back if only one is set):
  contribution:
    en: "Conducted morphology fitting of the comet with GALFIT ..."
    ko: "GALFIT을 이용한 혜성 형태 모델링을 수행하여 ..."
  ```

  Omit the field entirely to skip the note for that paper.

#### Essay or criticism (writings)

Filename convention: `<yyyy-mm-dd>-<keyword>.md`.

```markdown
---
type: writing
year: "2025"
date: "2025-11-10"             # optional, more precise than year
lang: ko                       # original language: en | ko
venue: pong.pub
link: "https://pong.pub/?p=3133"
title:
  ko: "정만근(1) 블랙홀과 종말론적 사고하기"
  en: "Mankeun Jeong (1): Black Holes and Eschatological Thinking"
---
```

- `title` may be a plain string or an object with `en`/`ko` keys.
  When the viewer's language differs from `lang`, the page picks the
  matching translation (or falls back to the available one) and shows a
  small "Originally published in Korean / English" note.
- A single-language title (e.g. `title: "A short essay"`) is fine — the
  same string is shown in both EN and KO modes.

#### Press mention

Identical frontmatter to a writing, but with `type: press`. Renders under
the **Press** group:

```markdown
---
type: press
year: "2024"
date: "2024-11-30"
lang: ko
venue: "Magazine name"
link: "https://example.com/article"
title:
  ko: "기사 제목"
  en: "English title (optional translation)"
---
```

#### After adding a file

`generateStaticParams` doesn't apply here (the publications page is a
single static route), but `npm run build` still re-reads every file each
time you build, so a new file always shows up after you re-deploy.

The full publication archive on **NASA ADS** stays linked from the
"External archives" block at the top of the page — that's where new papers
appear automatically as you publish. The static list in this repo is for
the curated highlights you want to show on the site itself.

### Adding real photographs to a project

Two steps. First, drop the photo file into `public/works/<slug>/` (any
filename works — `01.jpg`, `figure1.png`, `installation-view.jpg`, etc.).
Anything under `public/` is served at the root of the site, so a file at
`public/works/rooms-without-hours/01.jpg` is reachable at the URL
`/works/rooms-without-hours/01.jpg`. Files under `content/` are **not**
served to the browser — they're only read by the build — so images must
live in `public/`.

Second, reference that path from your markdown wherever you want the image
to appear:

```markdown
Some prose introducing the work.

![Long-exposure of a bare apartment room](/works/rooms-without-hours/01.jpg "Untitled (West Room), 2025")

More prose. The next image appears here:

![Detail of a doorway](/works/rooms-without-hours/02.jpg "Untitled (Threshold), 2025")
```

The image renders inline, full-width, with the `title` (the part in quotes)
as the visible caption underneath. No code changes needed.

## Theme & colour

All colours and font stacks live in a single file:

```
src/styles/theme.css
```

It defines CSS custom properties for every meaningful colour token (`ink`,
`paper`, `accent`, plus their soft / muted / faint variants) and the two
font families (`--font-sans`, `--font-serif`). Tailwind reads from those
variables — so the utility classes `text-ink`, `bg-paper-warm`,
`text-accent`, `border-ink/10`, `bg-accent/15` etc. all change the
moment you edit a value in `theme.css` and reload the page. No other
files need to be touched for a colour swap.

### Where the accent shows up

The accent (default: ruby, `#a4193d`) is used sparingly — about 1–2% of
the visual area, so the rest of the design stays minimal:

- the slide-in underline that appears under inline links on hover
- the active page indicator in the top nav
- the active number on pagination controls
- the highlighted entry in the post / project sidebar
- the left border of `<blockquote>`s in posts
- the text-selection highlight (subtle wash)

If you want a bolder design, you can paint more surfaces with `text-accent`,
`bg-accent`, `border-accent`, etc. — search the codebase for those classes
to see existing uses as a pattern.

### Trying alternative palettes

`theme.css` ships with several try-on alternatives in comments. To see one,
uncomment the relevant block (or just edit the value above it) and reload.
A few I've sketched in:

- a deeper, more book-cloth ruby (oxblood)
- a brighter rose
- ink blue, forest green, ochre
- a creamier paper, a cooler grey paper

### Changing fonts

The font stacks at the top of `theme.css` control which families the site
reads through `font-sans` and `font-serif`. To actually swap a typeface:

1. Edit the family name(s) in `theme.css`.
2. Update the Google Fonts URL in `src/app/layout.tsx` so the new family
   is fetched. (Or remove that `<link>` and rely on system fonts.)

The serif family is what `font-serif` Tailwind utilities and the typography
plugin's `h1`/`h2`/`h3` styles point at, so changing it affects every
heading on the site.

## Comments (optional, via Giscus)

Comments are off by default. To enable them:

1. Push the repo to **GitHub** and make it **public**.
2. Enable **Discussions** in the repo's *Settings → Features*.
3. Install the [Giscus GitHub App](https://github.com/apps/giscus) on the repo.
4. Visit <https://giscus.app>, paste your repo, choose a Discussion **Category** (e.g. *Comments*), and copy the four IDs it generates.
5. Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
   NEXT_PUBLIC_GISCUS_REPO_ID=...
   NEXT_PUBLIC_GISCUS_CATEGORY=Comments
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
   ```

6. Restart `npm run dev`. Each post page now embeds a comments widget
   underneath the article. Visitors sign in with GitHub to comment.

While the env vars are unset, the comments section renders a small note
explaining that Giscus is disabled — no external scripts load.

## Search

The `/posts` page has a built-in client-side search box. It matches case-
insensitively against:

- Post title
- Excerpt (frontmatter `excerpt`)
- Tags

Below the search box, every tag is also a clickable filter (toggle on/off).
The result count and "no results" state update live. No backend, no third
party — the post index is shipped at build time and filtered in the browser.

For external search engines (Google, Bing, etc.), the site exposes:

- **`/sitemap.xml`** — built from every static page, project, and post
- **`/robots.txt`** — allows all user agents and points to the sitemap

Both pick up new posts automatically on each deploy. Set
`NEXT_PUBLIC_SITE_URL` in your environment to your real domain so the URLs
in those files are correct.

## Deploying to Vercel

This project is ready for [Vercel](https://vercel.com) with zero
configuration.

1. Push the repo to GitHub.
2. In Vercel: **Add New… → Project**, import the repo, accept the defaults.
3. Add environment variables under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` (always)
   - The four `NEXT_PUBLIC_GISCUS_*` vars (only if enabling comments)
4. Click **Deploy**.

Or with the Vercel CLI:

```bash
npm i -g vercel
vercel        # first deploy / link
vercel --prod # promote to production
```

Add a custom domain under **Settings → Domains**.

## License

All site content (text, projects, biography, publications, posts) © Mankeun
Jeong. The site code is provided as a personal project; reuse the layout if
you find it useful.
