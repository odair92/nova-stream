import type { HowItWorksSettings } from "@/lib/types";

export function HowItWorksSection({ content }: { content: HowItWorksSettings }) {
  if (!content.steps || content.steps.length === 0) return null;

  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">{content.title}</h2>
        {content.subtitle ? <p className="mt-3 text-muted-foreground">{content.subtitle}</p> : null}
      </header>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border border-border bg-card p-6">
            <span className="font-display text-3xl text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
