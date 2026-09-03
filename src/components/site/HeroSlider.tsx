import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types";

export function HeroSlider({ banners, onCta }: { banners: Banner[]; onCta: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section id="inicio" className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet={banner.desktop_image ?? ""} />
            <img
              src={banner.mobile_image ?? banner.desktop_image ?? ""}
              alt={banner.title}
              width={1920}
              height={1080}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={cn(
              "max-w-2xl transition-all duration-700",
              i === index ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4",
            )}
          >
            {banner.subtitle ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                {banner.subtitle}
              </p>
            ) : null}
            <h1 className="text-4xl leading-none sm:text-6xl lg:text-7xl">{banner.title}</h1>
            {banner.description ? (
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {banner.description}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="font-semibold" onClick={onCta}>
                {banner.button_text || "VER PLANOS"}
              </Button>
            </div>
          </div>
        ))}

        {banners.length > 1 ? (
          <div className="mt-10 flex gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Ir para o banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-10 bg-primary" : "w-5 bg-foreground/30",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
