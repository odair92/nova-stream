import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CheckCircle2, Copy, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPixCheckout, getCheckoutStatus } from "@/lib/checkout.functions";
import {
  effectivePrice,
  formatBRL,
  maskDocument,
  maskPhone,
  onlyDigits,
  whatsappUrl,
} from "@/lib/format";
import { landingContentQueryOptions } from "@/lib/landing";

export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingContentQueryOptions),
  head: () => ({
    meta: [
      { title: "Pagamento via PIX — NexaPlay" },
      {
        name: "description",
        content:
          "Finalize a contratação do seu plano NexaPlay com PIX. Confirmação automática e acesso liberado na hora.",
      },
      { property: "og:title", content: "Pagamento via PIX — NexaPlay" },
      {
        property: "og:description",
        content: "Pague com PIX e receba o acesso NexaPlay automaticamente pelo WhatsApp.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type CheckoutResult = Awaited<ReturnType<typeof createPixCheckout>>;

function CheckoutPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(landingContentQueryOptions);
  const plan = useMemo(() => data.plans.find((p) => p.slug === slug), [data, slug]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    coupon: "",
    acceptTerms: false,
  });
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const createCheckout = useServerFn(createPixCheckout);
  const checkStatus = useServerFn(getCheckoutStatus);

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof createPixCheckout>[0]) => createCheckout(payload),
    onSuccess: (res) => setResult(res),
    onError: (error: Error) =>
      toast.error(error.message || "Não foi possível gerar o PIX agora."),
  });

  const statusQuery = useQuery({
    queryKey: ["checkout-status", result?.paymentId],
    enabled: !!result?.paymentId,
    refetchInterval: 5000,
    queryFn: () => checkStatus({ data: { paymentId: result!.paymentId } }),
  });

  const paid = statusQuery.data?.status === "paid";

  useEffect(() => {
    if (paid) toast.success("Pagamento confirmado! Enviamos seu acesso pelo WhatsApp.");
  }, [paid]);

  if (!plan) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl">Plano não encontrado</h1>
        <p className="mt-3 text-muted-foreground">
          O plano que você tentou contratar não está mais disponível.
        </p>
        <Button className="mt-6" onClick={() => void navigate({ to: "/" })}>
          Ver planos disponíveis
        </Button>
      </main>
    );
  }

  const wa = data.whatsapp;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para a página inicial
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-border bg-card p-6">
          {result ? (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                {paid ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : (
                  <QrCode className="h-6 w-6 text-primary" />
                )}
                <h1 className="text-2xl">
                  {paid ? "Pagamento confirmado" : "Escaneie o QR Code para pagar"}
                </h1>
              </div>

              {paid ? (
                <p className="text-sm text-muted-foreground">
                  Pedido <span className="font-semibold text-foreground">{result.orderNumber}</span>{" "}
                  aprovado. O acesso será enviado pelo WhatsApp em instantes.
                </p>
              ) : (
                <>
                  {result.qrImageUrl ? (
                    <img
                      src={result.qrImageUrl}
                      alt={`QR Code PIX para o pedido ${result.orderNumber}`}
                      className="mx-auto h-56 w-56 rounded-lg bg-white p-2"
                    />
                  ) : null}

                  {result.qrCode ? (
                    <div className="space-y-2">
                      <Label>PIX copia e cola</Label>
                      <div className="flex gap-2">
                        <Input readOnly value={result.qrCode} className="font-mono text-xs" />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            void navigator.clipboard.writeText(result.qrCode ?? "");
                            toast.success("Código PIX copiado!");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Aguardando confirmação automática do pagamento...
                  </p>
                </>
              )}

              {wa?.enabled && wa.number ? (
                <Button asChild variant="secondary" className="w-full">
                  <a
                    href={whatsappUrl(
                      wa.number,
                      `Olá! Fiz o pedido ${result.orderNumber} do plano ${result.planName}.`,
                    )}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Falar com o suporte no WhatsApp
                  </a>
                </Button>
              ) : null}
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!form.acceptTerms) {
                  toast.error("É necessário aceitar os termos de uso.");
                  return;
                }
                mutation.mutate({
                  data: {
                    planSlug: plan.slug,
                    name: form.name,
                    email: form.email,
                    phone: onlyDigits(form.phone),
                    document: onlyDigits(form.document),
                    coupon: form.coupon || undefined,
                    acceptTerms: true,
                  },
                });
              }}
            >
              <h1 className="text-2xl">Seus dados</h1>
              <p className="text-sm text-muted-foreground">
                Precisamos destas informações para emitir o PIX e enviar seu acesso.
              </p>

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp com DDD</Label>
                  <Input
                    id="phone"
                    required
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">CPF ou CNPJ</Label>
                  <Input
                    id="document"
                    required
                    inputMode="numeric"
                    value={form.document}
                    onChange={(e) => setForm({ ...form, document: maskDocument(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon">Cupom de desconto (opcional)</Label>
                <Input
                  id="coupon"
                  value={form.coupon}
                  onChange={(e) => setForm({ ...form, coupon: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={form.acceptTerms}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, acceptTerms: checked === true })
                  }
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                  Li e aceito os{" "}
                  <Link to="/termos" className="text-primary underline">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacidade" className="text-primary underline">
                    política de privacidade
                  </Link>
                  .
                </Label>
              </div>

              <Button type="submit" className="w-full font-semibold" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="mr-2 h-4 w-4" />
                )}
                Gerar PIX de {formatBRL(effectivePrice(plan))}
              </Button>

              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Pagamento processado com segurança.
              </p>
            </form>
          )}
        </section>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl">Resumo do pedido</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-semibold">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duração</span>
              <span>{plan.duration_label ?? `${plan.duration_days} dias`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispositivos</span>
              <span>{plan.devices}</span>
            </div>
            {plan.quality ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualidade</span>
                <span>{plan.quality}</span>
              </div>
            ) : null}
            {result ? (
              <>
                {result.discount > 0 ? (
                  <div className="flex justify-between text-primary">
                    <span>Desconto</span>
                    <span>-{formatBRL(result.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <span>Total</span>
                  <span className="font-semibold">{formatBRL(result.amount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <span>Total</span>
                <span className="font-semibold">{formatBRL(effectivePrice(plan))}</span>
              </div>
            )}
          </div>

          {plan.features.length ? (
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
