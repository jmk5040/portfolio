"use client";

// Shared ReactMarkdown component overrides used by both project pages
// (`ProjectDetail`) and blog post pages (`PostDetail`). Keeping a single
// implementation means images, links, and figure captions render the same
// way everywhere.
//
//  - Images: `placeholder*` srcs render the CSS placeholder; real paths
//    render a `<figure>` with the markdown title used as the visible
//    caption underneath.
//  - A paragraph that is just a single image is unwrapped so the figure
//    can be a real block-level sibling (rather than illegally nested
//    inside `<p>`).
//  - External links open in a new tab.

import type { Components } from "react-markdown";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { ImageRatio } from "@/lib/works";

const PLACEHOLDER_RE = /^placeholder(?:-(portrait|square))?$/;

function srcToRatio(src: string): ImageRatio {
  const m = src.match(PLACEHOLDER_RE);
  if (m?.[1] === "portrait") return "portrait";
  if (m?.[1] === "square") return "square";
  return "landscape";
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
    return (
      <a
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};
