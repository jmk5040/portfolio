import type { ImageRatio } from "@/lib/works";

type ImagePlaceholderProps = {
  alt: string;
  caption?: string;
  ratio?: ImageRatio;
};

const ratioClass: Record<ImageRatio, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function ImagePlaceholder({
  alt,
  caption,
  ratio = "landscape",
}: ImagePlaceholderProps) {
  return (
    <figure className="space-y-3">
      <div
        role="img"
        aria-label={alt}
        className={
          "relative w-full overflow-hidden bg-paper-warm " + ratioClass[ratio]
        }
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.04),transparent_60%)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-6 bottom-4 text-[0.65rem] uppercase tracking-widest text-ink-faint"
        >
          Image placeholder
        </span>
      </div>
      {caption && (
        <figcaption className="text-xs leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
