import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/faq")({
  component: () => (
    <ResourceManager
      table="faqs"
      title="Perguntas frequentes"
      description="Dúvidas exibidas no final da página inicial."
      fields={[
        { name: "question", label: "Pergunta" },
        { name: "answer", label: "Resposta", type: "textarea" },
        { name: "position", label: "Ordem", type: "number", defaultValue: 0 },
        { name: "active", label: "Ativa", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "question", label: "Pergunta" },
        { name: "position", label: "Ordem" },
        { name: "active", label: "Ativa" },
      ]}
    />
  ),
});
