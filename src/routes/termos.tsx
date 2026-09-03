import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — NexaPlay" },
      {
        name: "description",
        content:
          "Termos de Uso do NexaPlay: regras de contratação, pagamento via PIX, uso do serviço e cancelamento.",
      },
      { property: "og:title", content: "Termos de Uso — NexaPlay" },
      {
        property: "og:description",
        content: "Regras de contratação, pagamento, uso do serviço e cancelamento.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link to="/" className="text-sm text-primary">
        ← Voltar
      </Link>
      <h1 className="mt-6 text-4xl">Termos de Uso</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ao contratar qualquer plano do NexaPlay, você concorda com os termos descritos abaixo. Leia
          com atenção antes de finalizar a assinatura.
        </p>
        <section>
          <h2 className="text-xl text-foreground">1. Serviço</h2>
          <p className="mt-2">
            O NexaPlay comercializa planos de acesso a um serviço de streaming de conteúdo
            devidamente licenciado. O acesso é pessoal e o número de dispositivos simultâneos é
            definido pelo plano contratado.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">2. Contratação e pagamento</h2>
          <p className="mt-2">
            A contratação ocorre mediante pagamento via PIX. A confirmação é automática e os dados de
            acesso são enviados pelo WhatsApp informado no checkout. Dados de cobrança são obrigatórios
            para emissão do PIX.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">3. Uso adequado</h2>
          <p className="mt-2">
            É proibido revender, compartilhar publicamente ou redistribuir credenciais de acesso. O
            descumprimento pode gerar suspensão imediata, sem reembolso.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">4. Cancelamento e reembolso</h2>
          <p className="mt-2">
            Você pode solicitar cancelamento a qualquer momento pelo WhatsApp de atendimento. O
            direito de arrependimento é garantido em até 7 dias da contratação, conforme o Código de
            Defesa do Consumidor.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">5. Suporte</h2>
          <p className="mt-2">
            O suporte é prestado pelos canais oficiais divulgados no site, dentro dos horários
            informados no plano contratado.
          </p>
        </section>
      </div>
    </main>
  );
}
