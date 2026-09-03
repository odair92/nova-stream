import { DynamicIcon } from "./icon-map";
import type { Benefit } from "@/lib/types";

export function BenefitsSection({ benefits }: { benefits: Benefit[] }) {
  if (benefits.length === 0) return null;

  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-3xl sm:text-4xl">Por que assinar</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <DynamicIcon name={benefit.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-lg">{benefit.title}</h3>
              {benefit.description ? (
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
