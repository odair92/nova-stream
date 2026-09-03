import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type {
  Banner,
  Benefit,
  CatalogCategory,
  CatalogItem,
  ContactSettings,
  DeviceItem,
  Faq,
  FooterSettings,
  HeaderSettings,
  HowItWorksSettings,
  LandingContent,
  Plan,
  SiteSettings,
  Testimonial,
  WhatsappSettings,
} from "./types";

type SettingsMap = Record<string, Record<string, unknown>>;

function pick<T>(map: SettingsMap, key: string, fallback: T): T {
  const value = map[key];
  return value ? ({ ...(fallback as object), ...value } as T) : fallback;
}

const defaults = {
  site: {
    name: "Streaming",
    logo_text: "Streaming",
    logo_url: null,
    favicon_url: null,
    primary_color: "#E50914",
    seo_title: "Streaming",
    seo_description: "Planos de streaming com pagamento via PIX.",
  } as SiteSettings,
  whatsapp: {
    enabled: false,
    float_button: false,
    number: "",
    button_text: "FALAR NO WHATSAPP",
    default_message: "Olá! Gostaria de contratar o plano {{plan_name}}.",
    post_payment_message: "Olá, realizei o pagamento do pedido {{order_number}}.",
  } as WhatsappSettings,
  header: { cta_text: "ASSINAR AGORA", menu: [] } as HeaderSettings,
  contact: { email: "", phone: "", instagram: "", facebook: "", tiktok: "" } as ContactSettings,
  footer: { description: "", copyright: "" } as FooterSettings,
  howItWorks: { title: "Como funciona", subtitle: "", steps: [] } as HowItWorksSettings,
};

export async function fetchLandingContent(): Promise<LandingContent> {
  const [settings, plans, banners, categories, items, benefits, devices, testimonials, faqs] =
    await Promise.all([
      supabase.from("settings").select("key, value"),
      supabase.from("plans").select("*").eq("active", true).order("position"),
      supabase.from("banners").select("*").eq("active", true).order("position"),
      supabase.from("catalog_categories").select("*").eq("active", true).order("position"),
      supabase.from("catalog_items").select("*").eq("active", true).order("position"),
      supabase.from("benefits").select("*").eq("active", true).order("position"),
      supabase.from("devices").select("*").eq("active", true).order("position"),
      supabase.from("testimonials").select("*").eq("active", true).order("position"),
      supabase.from("faqs").select("*").eq("active", true).order("position"),
    ]);

  const settingsMap: SettingsMap = {};
  for (const row of settings.data ?? []) {
    settingsMap[row.key] = (row.value ?? {}) as Record<string, unknown>;
  }

  const itemRows = (items.data ?? []) as unknown as (CatalogItem & { category_id: string | null })[];

  const catalogCategories: CatalogCategory[] = (categories.data ?? [])
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      items: itemRows
        .filter((item) => item.category_id === category.id)
        .map(({ ...item }) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          poster_url: item.poster_url,
          year: item.year,
          rating: item.rating,
          tags: item.tags ?? [],
          featured: item.featured,
        })),
    }))
    .filter((category) => category.items.length > 0);

  return {
    site: pick(settingsMap, "site", defaults.site),
    whatsapp: pick(settingsMap, "whatsapp", defaults.whatsapp),
    header: pick(settingsMap, "header", defaults.header),
    contact: pick(settingsMap, "contact", defaults.contact),
    footer: pick(settingsMap, "footer", defaults.footer),
    howItWorks: pick(settingsMap, "how_it_works", defaults.howItWorks),
    plans: (plans.data ?? []).map((plan) => ({
      ...plan,
      price: Number(plan.price),
      promotional_price: plan.promotional_price == null ? null : Number(plan.promotional_price),
      features: (plan.features ?? []) as string[],
    })) as Plan[],
    banners: (banners.data ?? []) as Banner[],
    categories: catalogCategories,
    benefits: (benefits.data ?? []) as Benefit[],
    devices: (devices.data ?? []) as DeviceItem[],
    testimonials: (testimonials.data ?? []) as Testimonial[],
    faqs: (faqs.data ?? []) as Faq[],
  };
}

export const landingContentQueryOptions = queryOptions({
  queryKey: ["landing-content"],
  queryFn: fetchLandingContent,
  staleTime: 60_000,
});
