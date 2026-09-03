import { Star } from "lucide-react";

import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-3xl sm:text-4xl">Quem assina, recomenda</h2>
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="w-[85%] shrink-0 snap-start rounded-xl border border-border bg-card p-6 sm:w-[360px]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm text-muted-foreground">
                “{testimonial.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold">{testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
