import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: LinkProps["to"] };

/** Visual breadcrumb (the BreadcrumbList JSON-LD is emitted by each route's head). */
export function Breadcrumbs({
  items,
  dark,
  className,
}: {
  items: Crumb[];
  dark?: boolean;
  className?: string;
}) {
  const t = useT();
  return (
    <nav aria-label={t.a11y.breadcrumb} className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-sm",
          dark ? "text-white/70" : "text-muted-foreground",
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  to={item.href}
                  className={cn(
                    "rounded-sm transition-colors",
                    dark ? "hover:text-white" : "hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && (dark ? "text-white" : "text-foreground"))}
                >
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
