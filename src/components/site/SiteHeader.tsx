import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeaderSettings, SiteSettings } from "@/lib/types";

export function SiteHeader({
  site,
  header,
  onCta,
}: {
  site: SiteSettings;
  header: HeaderSettings;
  onCta: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "bg-background/95 backdrop-blur border-b border-border" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="flex items-center gap-2">
          {site.logo_url ? (
            <img src={site.logo_url} alt={site.name} className="h-8 w-auto" />
          ) : (
            <span className="font-display text-2xl tracking-wide text-primary">
              {site.logo_text || site.name}
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {header.menu?.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={onCta} className="hidden font-semibold md:inline-flex">
            {header.cta_text}
          </Button>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          >
            {open ? <Menu className="h-5 w-5 rotate-90" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {header.menu?.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-muted-foreground"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setOpen(false);
                onCta();
              }}
              className="my-3 font-semibold"
            >
              {header.cta_text}
            </Button>
          </nav>
        </div>
      ) : null}
      
    </header>
  );
}
