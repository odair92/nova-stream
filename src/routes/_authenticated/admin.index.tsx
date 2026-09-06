import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBRL, formatDateTime } from "@/lib/format";
import { getDashboard } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const dashboard = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => dashboard() });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const cards = [
    { label: "Receita total", value: formatBRL(data.revenue) },
    { label: "Receita 30 dias", value: formatBRL(data.revenue30) },
    { label: "Pedidos pagos", value: String(data.paidCount) },
    { label: "Pedidos pendentes", value: String(data.pendingCount) },
    { label: "Clientes", value: String(data.customerCount) },
    { label: "Planos ativos", value: String(data.activePlans) },
  ];

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumo de vendas e pedidos recentes.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-xl">Receita por dia</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="currentColor" className="text-xs" />
              <YAxis stroke="currentColor" className="text-xs" />
              <Tooltip
                formatter={(value: number) => formatBRL(Number(value))}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <h2 className="p-5 text-xl">Pedidos recentes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Nenhum pedido ainda.
                </TableCell>
              </TableRow>
            ) : null}
            {data.recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_number}</TableCell>
                <TableCell>{formatBRL(Number(order.total))}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "paid" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDateTime(order.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
