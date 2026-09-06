import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { listRows } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/catalogo")({
  component: CatalogAdmin,
});

function CatalogAdmin() {
  const list = useServerFn(listRows);
  const { data: categories } = useQuery({
    queryKey: ["admin", "catalog_categories", "position", true],
    queryFn: () =>
      list({ data: { table: "catalog_categories", orderBy: "position", ascending: true } }),
  });

  const options = (categories ?? []).map((row: Record<string, any>) => ({
    value: String(row.id),
    label: String(row.name),
  }));
  const nameById = new Map(options.map((option) => [option.value, option.label]));

  return (
    <ResourceManager
      table="catalog_items"
      title="Catálogo"
      description="Títulos exibidos nas trilhas da página inicial."
      fields={[
        { name: "title", label: "Título" },
        { name: "category_id", label: "Categoria", type: "select", options },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "poster_url", label: "Capa (URL)", placeholder: "/images/poster-1.jpg" },
        { name: "backdrop_url", label: "Imagem de fundo (URL)" },
        { name: "year", label: "Ano", type: "number" },
        { name: "rating", label: "Classificação", placeholder: "16+" },
        { name: "tags", label: "Tags (uma por linha)", type: "list" },
        { name: "featured", label: "Destaque", type: "boolean" },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "title", label: "Título" },
        {
          name: "category_id",
          label: "Categoria",
          render: (row) => nameById.get(String(row.category_id)) ?? "—",
        },
        { name: "year", label: "Ano" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  );
}
