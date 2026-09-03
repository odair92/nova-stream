import type { Plan, WhatsappSettings } from "./types";

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function effectivePrice(plan: Pick<Plan, "price" | "promotional_price">): number {
  return plan.promotional_price && plan.promotional_price > 0 ? plan.promotional_price : plan.price;
}

export function hasDiscount(plan: Pick<Plan, "price" | "promotional_price">): boolean {
  return !!plan.promotional_price && plan.promotional_price > 0 && plan.promotional_price < plan.price;
}

export function discountPercent(plan: Pick<Plan, "price" | "promotional_price">): number {
  if (!hasDiscount(plan)) return 0;
  return Math.round((1 - effectivePrice(plan) / plan.price) * 100);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

export function maskDocument(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => values[key] ?? "");
}

export function whatsappUrl(number: string, message: string): string {
  return `https://wa.me/${onlyDigits(number)}?text=${encodeURIComponent(message)}`;
}

export function planWhatsappUrl(wa: WhatsappSettings, plan: Plan): string {
  return whatsappUrl(
    wa.number,
    fillTemplate(wa.default_message, {
      plan_name: plan.name,
      plan_price: formatBRL(effectivePrice(plan)),
      plan_duration: plan.duration_label ?? `${plan.duration_days} dias`,
    }),
  );
}
