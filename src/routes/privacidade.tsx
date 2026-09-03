import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — NexaPlay" },
      {
        name: "description",
        content:
          "Como o NexaPlay coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade — NexaPlay" },
      {
        property: "og:description",
        content: "Coleta, uso, retenção e proteção de dados pessoais conforme a LGPD.",
      },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link to="/" className="text-sm text-primary">
        ← Voltar
      </Link>
      <h1 className="mt-6 text-4xl">Política de Privacidade</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl text-foreground">1. Dados coletados</h2>
          <p className="mt-2">
            Coletamos nome, e-mail, telefone/WhatsApp e CPF/CNPJ, necessários para emissão da cobrança
            PIX e envio dos dados de acesso.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">2. Finalidade</h2>
          <p className="mt-2">
            Os dados são utilizados exclusivamente para processar pagamentos, liberar o acesso, prestar
            suporte e cumprir obrigações legais e fiscais.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">3. Compartilhamento</h2>
          <p className="mt-2">
            Compartilhamos apenas o necessário com o provedor de pagamentos para processar a cobrança.
            Não vendemos nem cedemos dados para fins publicitários de terceiros.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">4. Segurança</h2>
          <p className="mt-2">
            Utilizamos conexões criptografadas, controle de acesso por função e armazenamento com
            políticas de segurança em nível de linha. Chaves de integração ficam somente no servidor.
          </p>
        </section>
        <section>
          <h2 className="text-xl text-foreground">5. Seus direitos</h2>
          <p className="mt-2">
            Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados pelos canais
            de atendimento. Dados fiscais podem ser mantidos pelo prazo exigido em lei.
          </p>
        </section>
      </div>
    </main>
  );
}
