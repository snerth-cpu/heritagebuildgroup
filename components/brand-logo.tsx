import Image from "next/image";
import { SITE_NAME } from "@/lib/seo";

const markSizes = {
  nav: { width: 92, height: 92, src: "/brand/hbg-primary.png" as const },
  compact: { width: 48, height: 48, src: "/brand/hbg-monogram.png" as const },
  section: { width: 72, height: 72, src: "/brand/hbg-primary.png" as const },
  cta: { width: 88, height: 88, src: "/brand/hbg-primary-transparent.png" as const },
  footer: { width: 120, height: 120, src: "/brand/hbg-primary-transparent.png" as const },
  hero: { width: 220, height: 220, src: "/brand/hbg-primary-transparent.png" as const },
} as const;

export type MarkSize = keyof typeof markSizes;

export function Mark({
  compact = false,
  size,
  priority = false,
  className = "",
  /** Pass empty string when a parent element already names the brand (avoids duplicate announcements). */
  alt,
}: {
  compact?: boolean;
  size?: MarkSize;
  priority?: boolean;
  className?: string;
  alt?: string;
}) {
  const resolved = size ?? (compact ? "compact" : "nav");
  const { width, height, src } = markSizes[resolved];
  const imageAlt = alt === undefined ? `${SITE_NAME} logo` : alt;
  const decorative = imageAlt === "";

  return (
    <span
      className={`brand brand--${resolved}${className ? ` ${className}` : ""}`}
      {...(decorative ? { "aria-hidden": true } : {})}
    >
      <Image
        className="brand__image"
        src={src}
        width={width}
        height={height}
        alt={imageAlt}
        priority={priority || resolved === "nav" || resolved === "hero"}
      />
    </span>
  );
}
