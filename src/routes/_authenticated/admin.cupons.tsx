import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/cupons")({
  component: () => (
    <ResourceManager
      table="coupons"
      title="Cupons de desconto"
      description="Códigos aplicáveis no pagamento."
      orderBy="created_at"
      ascending={false}
      fields={[
        { name: "code", label: "Código", placeholder: "PROMO10" },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          defaultValue: "percentage",
          options: [
            { value: "percentage", label: "Percentual (%)" },
            { value: "fixed", label: "Valor fixo (R$)" },
          ],
        },
        { name: "value", label: "Valor do desconto", type: "number" },
        { name: "minimum_amount", label: "Valor mínimo do pedido (R$)", type: "number" },
        { name: "maximum_uses", label: "Limite de usos", type: "number" },
        { name: "active", label: "Ativo", type: "boolean", defaultValue: true },
      ]}
      columns={[
        { name: "code", label: "Código" },
        { name: "type", label: "Tipo" },
        { name: "value", label: "Desconto" },
        { name: "uses", label: "Usos" },
        { name: "active", label: "Ativo" },
      ]}
    />
  ),
});
