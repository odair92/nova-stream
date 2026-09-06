import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/depoimentos")({
  component: () => (
    <ResourceManager
      table="testimonials"
      title="Depoimentos"
      description="Avaliações de clientes exibidas na página inicial."
      fields={[
        { name: "name", label: "Nome" },
        { name: "text", label: "Depoimento", type: "textarea" },
        { name: "avatar", label: "Foto (URL)" },
        { name: "rating", label: "Nota (1 a 5)", type: "number", defaultValue: 5 },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "name", label: "Nome" },
        { name: "rating", label: "Nota" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
