import { useLang } from "@/i18n";
import { images, type ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * Renders a registered photo with intrinsic width/height (no layout shift).
 * `priority` is for hero images: eager + fetchpriority="high"; otherwise lazy.
 */
export function SiteImage({
  image,
  priority = false,
  className,
  sizes = "100vw",
  decorative = false,
}: {
  image: ImageKey;
  priority?: boolean;
  className?: string;
  sizes?: string;
  decorative?: boolean;
}) {
  const lang = useLang();
  const data = images[image];
  return (
    <img
      src={data.src}
      width={data.width}
      height={data.height}
      alt={decorative ? "" : data.alt[lang]}
      sizes={sizes}
      decoding="async"
      {...(priority
        ? { fetchPriority: "high" as const, loading: "eager" as const }
        : { loading: "lazy" as const })}
      className={cn("object-cover", className)}
    />
  );
}
