import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/beneficios")({
  component: () => (
    <ResourceManager
      table="benefits"
      title="Benefícios"
      description="Vantagens destacadas na página inicial."
      fields={[
        { name: "title", label: "Título" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "icon", label: "Ícone", placeholder: "Zap, Tv, ShieldCheck..." },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "title", label: "Título" },
        { name: "icon", label: "Ícone" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
