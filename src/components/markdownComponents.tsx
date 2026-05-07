"use client";

// Shared ReactMarkdown component overrides used by both project pages
// (`ProjectDetail`) and blog post pages (`PostDetail`). Keeping a single
// implementation means images, videos, attachments, and links render the
// same way everywhere.
//
//  - `![alt](path "Caption")` is overloaded by file extension:
//      * image  → <figure><img></figure>
//      * video  → <figure><video controls></figure>
//      * pdf    → <figure><iframe> + Download / Open link
//      * placeholder*  → CSS placeholder block (no real asset needed)
//  - A paragraph that is just a single such asset is unwrapped so the
//    figure can be a real block-level sibling (rather than illegally
//    nested inside <p>).
//  - External links — and links to common attachment file types — open
//    in a new tab.

import type { Components } from "react-markdown";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ImageRatio } from "@/lib/works";

const PLACEHOLDER_RE = /^placeholder(?:-(portrait|square))?$/;
const VIDEO_RE = /\.(mp4|mov|webm|ogv|m4v)(\?.*)?$/i;
const PDF_RE = /\.pdf(\?.*)?$/i;
const ATTACHMENT_RE =
  /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|rtf|key|pages|numbers)(\?.*)?$/i;

function srcToRatio(src: string): ImageRatio {
  const m = src.match(PLACEHOLDER_RE);
  if (m?.[1] === "portrait") return "portrait";
  if (m?.[1] === "square") return "square";
  return "landscape";
}

function basename(src: string): string {
  const stripped = src.split("?")[0] ?? src;
  return stripped.split("/").pop() || stripped;
}

export const markdownComponents: Components = {
  p({ node, children, ...props }) {
    const significant = (node?.children ?? []).filter(
      (c) => !(c.type === "text" && /^\s*$/.test(c.value)),
    );
    const only = significant.length === 1 ? significant[0] : null;
    if (only && only.type === "element" && only.tagName === "img") {
      return <>{children}</>;
    }
    return <p {...props}>{children}</p>;
  },
  img({ src, alt, title }) {
    const altText = typeof alt === "string" ? alt : "";
    const captionText = typeof title === "string" ? title : "";
    const srcText = typeof src === "string" ? src : "";

    if (PLACEHOLDER_RE.test(srcText)) {
      return (
        <ImagePlaceholder
          alt={altText}
          caption={captionText || undefined}
          ratio={srcToRatio(srcText)}
        />
      );
    }

    if (VIDEO_RE.test(srcText)) {
      return (
        <figure className="my-10 first:mt-0">
          <video
            src={srcText}
            controls
            preload="metadata"
            playsInline
            className="block w-full bg-ink/5"
            aria-label={altText || basename(srcText)}
          >
            {altText || basename(srcText)}
          </video>
          {captionText && (
            <figcaption className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
              {captionText}
            </figcaption>
          )}
        </figure>
      );
    }

    if (PDF_RE.test(srcText)) {
      const file = basename(srcText);
      const label = captionText || altText || file;
      return (
        <figure className="my-10 first:mt-0">
          <iframe
            src={srcText}
            title={label}
            className="block w-full h-[70vh] max-h-[800px] border border-ink/10 bg-paper-warm"
          />
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-xs leading-relaxed text-ink-muted">
            <span>{label}</span>
            <a
              href={srcText}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Open PDF
              <span aria-hidden="true"> ↗</span>
            </a>
          </figcaption>
        </figure>
      );
    }

    return (
      <figure className="my-10 first:mt-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcText}
          alt={altText}
          className="block w-full"
          loading="lazy"
        />
        {captionText && (
          <figcaption className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
            {captionText}
          </figcaption>
        )}
      </figure>
    );
  },
  a({ href, children, ...props }) {
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
    const isAttachment = typeof href === "string" && ATTACHMENT_RE.test(href);
    return (
      <a
        href={href}
        {...(isExternal || isAttachment
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};
