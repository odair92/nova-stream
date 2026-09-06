import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatBRL, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/pagamentos")({
  component: () => (
    <ResourceManager
      table="payments"
      title="Pagamentos"
      description="Cobranças PIX geradas e seus status."
      orderBy="created_at"
      ascending={false}
      canCreate={false}
      canDelete={false}
      fields={[
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pending", label: "Pendente" },
            { value: "paid", label: "Pago" },
            { value: "expired", label: "Expirado" },
            { value: "failed", label: "Falhou" },
          ],
        },
      ]}
      columns={[
        { name: "payment_id", label: "Cobrança" },
        { name: "amount", label: "Valor", render: (row) => formatBRL(Number(row.amount)) },
        { name: "status", label: "Status" },
        { name: "provider", label: "Provedor" },
        {
          name: "created_at",
          label: "Criado em",
          render: (row) => formatDateTime(String(row.created_at)),
        },
      ]}
    />
  ),
});
