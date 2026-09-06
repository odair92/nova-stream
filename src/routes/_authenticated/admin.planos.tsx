import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/planos")({
  component: () => (
    <ResourceManager
      table="plans"
      title="Planos"
      description="Preços, duração, benefícios e destaque dos planos exibidos no site."
      orderBy="position"
      fields={[
        { name: "name", label: "Nome" },
        { name: "slug", label: "Slug (URL)", help: "Ex.: mensal, trimestral" },
        { name: "short_description", label: "Descrição curta" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "price", label: "Preço (R$)", type: "number" },
        { name: "promotional_price", label: "Preço promocional (R$)", type: "number" },
        { name: "duration_days", label: "Duração (dias)", type: "number", defaultValue: 30 },
        { name: "duration_label", label: "Rótulo de duração", placeholder: "1 mês" },
        { name: "devices", label: "Telas simultâneas", type: "number", defaultValue: 1 },
        { name: "quality", label: "Qualidade", placeholder: "4K / FHD" },
        { name: "badge", label: "Selo", placeholder: "MAIS VENDIDO" },
        { name: "button_text", label: "Texto do botão", defaultValue: "ASSINAR AGORA" },
        { name: "features", label: "Benefícios (um por linha)", type: "list" },
        { name: "highlighted", label: "Destacar plano", type: "boolean" },
        { name: "payment_enabled", label: "Permitir PIX", type: "boolean", defaultValue: true },
        { name: "whatsapp_enabled", label: "Permitir WhatsApp", type: "boolean", defaultValue: true },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "name", label: "Nome" },
        {
          name: "price",
          label: "Preço",
          render: (row) =>
            row.promotional_price
              ? `${formatBRL(Number(row.promotional_price))} (de ${formatBRL(Number(row.price))})`
              : formatBRL(Number(row.price)),
        },
        { name: "duration_label", label: "Duração" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
