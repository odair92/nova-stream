import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  component: () => (
    <ResourceManager
      table="customers"
      title="Clientes"
      description="Cadastro de clientes gerado pelos pedidos."
      orderBy="created_at"
      ascending={false}
      fields={[
        { name: "name", label: "Nome" },
        { name: "email", label: "E-mail" },
        { name: "cpf", label: "CPF/CNPJ" },
        { name: "phone", label: "Telefone" },
        { name: "whatsapp", label: "WhatsApp" },
        {
          name: "status",
          label: "Status",
          type: "select",
          defaultValue: "active",
          options: [
            { value: "active", label: "Ativo" },
            { value: "inactive", label: "Inativo" },
            { value: "blocked", label: "Bloqueado" },
          ],
        },
        { name: "notes", label: "Observações", type: "textarea" },
      ]}
      columns={[
        { name: "name", label: "Nome" },
        { name: "email", label: "E-mail" },
        { name: "whatsapp", label: "WhatsApp" },
        { name: "status", label: "Status" },
        {
          name: "created_at",
          label: "Cadastro",
          render: (row) => formatDateTime(String(row.created_at)),
        },
      ]}
    />
  ),
});
