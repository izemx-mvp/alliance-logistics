import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoAsset from "@/assets/alliance-logo.png.asset.json";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/suivi", label: "Suivi" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Alliance Logistics — Accueil" className={cn("shrink-0", className)}>
      <img
        src={logoAsset.url}
        alt="Alliance Logistics"
        className="h-10 w-auto"
        width={284}
        height={100}
      />
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-header" : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                isActive(pathname, item.to)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              aria-current={isActive(pathname, item.to) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/suivi"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Espace client
          </Link>
          <Button asChild>
            <Link to="/cotation">Demander une cotation</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/cotation">Cotation</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo className="mb-8 block" />
              <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium",
                      isActive(pathname, item.to)
                        ? "bg-secondary text-primary"
                        : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/cotation">Demander une cotation</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link to="/suivi">Espace client</Link>
                </Button>
              </div>
              <a
                href={`tel:${site.contact.phones[0].replace(/\s/g, "")}`}
                className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Phone className="size-4" /> {site.contact.phones[0]}
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
