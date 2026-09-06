import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: () => (
    <ResourceManager
      table="banners"
      title="Banners"
      description="Slides do topo da página inicial."
      fields={[
        { name: "title", label: "Título" },
        { name: "subtitle", label: "Subtítulo" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "desktop_image", label: "Imagem desktop (URL)", placeholder: "/images/hero-1.jpg" },
        { name: "mobile_image", label: "Imagem mobile (URL)" },
        { name: "button_text", label: "Texto do botão" },
        { name: "button_url", label: "Link do botão", placeholder: "#planos" },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "title", label: "Título" },
        { name: "subtitle", label: "Subtítulo" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
