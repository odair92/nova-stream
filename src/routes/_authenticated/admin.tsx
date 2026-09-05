import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  BadgePercent,
  CreditCard,
  Film,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  MessageSquareQuote,
  MonitorSmartphone,
  Settings,
  ShoppingCart,
  Sparkles,
  Tags,
  Ticket,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSession } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel NexaPlay — Gestão de vendas e conteúdo" },
      {
        name: "description",
        content: "Gerencie planos, pedidos, pagamentos, clientes e todo o conteúdo do site NexaPlay.",
      },
      { property: "og:title", content: "Painel NexaPlay" },
      { property: "og:description", content: "Gestão de vendas, clientes e conteúdo da NexaPlay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/planos", label: "Planos", icon: ListOrdered },
  { to: "/admin/cupons", label: "Cupons", icon: Ticket },
  { to: "/admin/banners", label: "Banners", icon: BadgePercent },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/catalogo", label: "Catálogo", icon: Film },
  { to: "/admin/beneficios", label: "Benefícios", icon: Sparkles },
  { to: "/admin/dispositivos", label: "Dispositivos", icon: MonitorSmartphone },
  { to: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { to: "/admin/faq", label: "Perguntas frequentes", icon: HelpCircle },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function AdminLayout() {
  const session = useServerFn(getAdminSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => session(),
    retry: false,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="border-b border-border bg-card lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="font-display text-xl text-primary">
            NexaPlay
          </Link>
          <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              activeProps={{ className: "bg-primary/15 text-primary" }}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-5 lg:p-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !data?.isAdmin ? (
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
            <h1 className="text-2xl">Acesso restrito</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sua conta não tem permissão de administrador. Peça a um administrador para liberar seu
              acesso.
            </p>
            <Button className="mt-6" variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
