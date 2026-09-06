import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: () => (
    <ResourceManager
      table="catalog_categories"
      title="Categorias do catálogo"
      description="Trilhas de conteúdo exibidas na vitrine (ex.: Filmes, Séries, Esportes)."
      fields={[
        { name: "name", label: "Nome" },
        { name: "slug", label: "Slug" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativa", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "name", label: "Nome" },
        { name: "slug", label: "Slug" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativa" },
      ]}
    />
  ),
});
