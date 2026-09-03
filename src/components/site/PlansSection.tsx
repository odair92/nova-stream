import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { discountPercent, effectivePrice, formatBRL, hasDiscount } from "@/lib/format";
import type { Plan } from "@/lib/types";

export function PlansSection({
  plans,
  onSelect,
}: {
  plans: Plan[];
  onSelect: (plan: Plan) => void;
}) {
  return (
    <section id="planos" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Planos</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Escolha o plano ideal</h2>
          <p className="mt-3 text-muted-foreground">
            Pagamento via PIX com confirmação automática e ativação rápida.
          </p>
        </header>

        {plans.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            Nenhum plano disponível no momento.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6",
                  plan.highlighted
                    ? "border-primary shadow-[0_0_45px_-15px_var(--color-primary)]"
                    : "border-border",
                )}
              >
                {plan.badge ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {plan.badge}
                  </span>
                ) : null}

                <h3 className="text-2xl">{plan.name}</h3>
                {plan.short_description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{plan.short_description}</p>
                ) : null}

                <div className="mt-5">
                  {hasDiscount(plan) ? (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatBRL(plan.price)}
                    </p>
                  ) : null}
                  <p className="flex items-end gap-2">
                    <span className="font-display text-4xl text-foreground">
                      {formatBRL(effectivePrice(plan))}
                    </span>
                    <span className="pb-1 text-xs text-muted-foreground">
                      / {plan.duration_label ?? `${plan.duration_days} dias`}
                    </span>
                  </p>
                  {hasDiscount(plan) ? (
                    <p className="mt-1 text-xs font-semibold text-primary">
                      Economize {discountPercent(plan)}%
                    </p>
                  ) : null}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 w-full font-semibold"
                  variant={plan.highlighted ? "default" : "secondary"}
                  onClick={() => onSelect(plan)}
                >
                  {plan.button_text || "ASSINAR AGORA"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
