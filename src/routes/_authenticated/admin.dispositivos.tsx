import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/dispositivos")({
  component: () => (
    <ResourceManager
      table="devices"
      title="Dispositivos"
      description="Aparelhos compatíveis exibidos no site."
      fields={[
        { name: "name", label: "Nome" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "icon", label: "Ícone", placeholder: "Tv, Smartphone, Monitor..." },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "name", label: "Nome" },
        { name: "icon", label: "Ícone" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
