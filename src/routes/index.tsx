import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { BenefitsSection } from "@/components/site/BenefitsSection";
import { CatalogSection } from "@/components/site/CatalogSection";
import { DevicesSection } from "@/components/site/DevicesSection";
import { FaqSection } from "@/components/site/FaqSection";
import { HeroSlider } from "@/components/site/HeroSlider";
import { HowItWorksSection } from "@/components/site/HowItWorksSection";
import { PlansSection } from "@/components/site/PlansSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SubscribeModal } from "@/components/site/SubscribeModal";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { ThemeColor } from "@/components/site/ThemeColor";
import { WhatsappFloat } from "@/components/site/WhatsappFloat";
import { landingContentQueryOptions } from "@/lib/landing";
import type { Plan } from "@/lib/types";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingContentQueryOptions),
  head: () => ({
    meta: [
      { title: "NexaPlay — Entretenimento sem limites, planos via PIX" },
      {
        name: "description",
        content:
          "Filmes, séries, esportes e infantil em um só lugar. Planos a partir de R$ 29,90, ativação rápida e pagamento via PIX com confirmação automática.",
      },
      { property: "og:title", content: "NexaPlay — Entretenimento sem limites" },
      {
        property: "og:description",
        content:
          "Assista em Smart TV, celular, tablet ou computador. Planos com pagamento via PIX e ativação rápida.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  const { data } = useSuspenseQuery(landingContentQueryOptions);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const goToPlans = () => {
    const target = document.getElementById("planos");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeColor color={data.site.primary_color} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: data.site.name,
            description: data.site.seo_description,
            email: data.contact.email || undefined,
            telephone: data.contact.phone || undefined,
          }),
        }}
      />

      <SiteHeader site={data.site} header={data.header} onCta={goToPlans} />

      <main>
        <HeroSlider banners={data.banners} onCta={goToPlans} />
        <CatalogSection categories={data.categories} />
        <BenefitsSection benefits={data.benefits} />
        <DevicesSection devices={data.devices} />
        <PlansSection plans={data.plans} onSelect={setSelectedPlan} />
        <HowItWorksSection content={data.howItWorks} />
        <TestimonialsSection testimonials={data.testimonials} />
        <FaqSection faqs={data.faqs} />
      </main>

      <SiteFooter
        site={data.site}
        footer={data.footer}
        contact={data.contact}
        header={data.header}
      />
      <WhatsappFloat whatsapp={data.whatsapp} />
      <SubscribeModal
        plan={selectedPlan}
        whatsapp={data.whatsapp}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
}
