import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { formatBRL, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/pedidos")({
  component: () => (
    <ResourceManager
      table="orders"
      title="Pedidos"
      description="Todos os pedidos gerados no site."
      orderBy="created_at"
      ascending={false}
      canCreate={false}
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
            { value: "canceled", label: "Cancelado" },
          ],
        },
      ]}
      columns={[
        { name: "order_number", label: "Pedido" },
        { name: "total", label: "Total", render: (row) => formatBRL(Number(row.total)) },
        { name: "discount", label: "Desconto", render: (row) => formatBRL(Number(row.discount)) },
        { name: "status", label: "Status" },
        {
          name: "created_at",
          label: "Criado em",
          render: (row) => formatDateTime(String(row.created_at)),
        },
      ]}
    />
  ),
});
