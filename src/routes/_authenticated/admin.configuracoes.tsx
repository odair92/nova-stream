import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getSettings, saveSetting } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: SettingsPage,
});

type Group = {
  key: string;
  title: string;
  description: string;
  fields: { name: string; label: string; type?: "text" | "textarea" | "boolean"; help?: string }[];
};

const groups: Group[] = [
  {
    key: "site",
    title: "Marca e SEO",
    description: "Nome, cores e informações que aparecem nas buscas.",
    fields: [
      { name: "name", label: "Nome do serviço" },
      { name: "logo_text", label: "Texto da logo" },
      { name: "logo_url", label: "Logo (URL)" },
      { name: "favicon_url", label: "Favicon (URL)" },
      { name: "primary_color", label: "Cor principal", help: "Ex.: #E50914" },
      { name: "seo_title", label: "Título para buscas" },
      { name: "seo_description", label: "Descrição para buscas", type: "textarea" },
    ],
  },
  {
    key: "whatsapp",
    title: "WhatsApp",
    description: "Número e mensagens usadas nos botões de atendimento.",
    fields: [
      { name: "enabled", label: "Ativar atendimento", type: "boolean" },
      { name: "float_button", label: "Mostrar botão flutuante", type: "boolean" },
      { name: "number", label: "Número com DDI e DDD", help: "Ex.: 5511958685995" },
      { name: "button_text", label: "Texto do botão" },
      { name: "default_message", label: "Mensagem padrão", type: "textarea", help: "Use {{plan_name}}" },
      {
        name: "post_payment_message",
        label: "Mensagem após pagamento",
        type: "textarea",
        help: "Use {{order_number}}",
      },
    ],
  },
  {
    key: "header",
    title: "Topo do site",
    description: "Texto do botão principal do menu.",
    fields: [{ name: "cta_text", label: "Texto do botão" }],
  },
  {
    key: "contact",
    title: "Contato e redes",
    description: "Dados exibidos no rodapé.",
    fields: [
      { name: "email", label: "E-mail" },
      { name: "phone", label: "Telefone" },
      { name: "instagram", label: "Instagram" },
      { name: "facebook", label: "Facebook" },
      { name: "tiktok", label: "TikTok" },
    ],
  },
  {
    key: "footer",
    title: "Rodapé",
    description: "Texto institucional e direitos autorais.",
    fields: [
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "copyright", label: "Direitos autorais" },
    ],
  },
  {
    key: "how_it_works",
    title: "Como funciona",
    description: "Títulos da seção explicativa.",
    fields: [
      { name: "title", label: "Título" },
      { name: "subtitle", label: "Subtítulo", type: "textarea" },
    ],
  },
];

function SettingsPage() {
  const load = useServerFn(getSettings);
  const save = useServerFn(saveSetting);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: () => load() });
  const [form, setForm] = useState<Record<string, Record<string, unknown>>>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (key: string) => save({ data: { key, value: form[key] ?? {} } }),
    onSuccess: () => {
      toast.success("Configurações salvas");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["landing-content"] });
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  function setValue(key: string, field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), [field]: value } }));
  }

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes gerais do site. As alterações aparecem imediatamente na página pública.
        </p>
      </header>

      {groups.map((group) => (
        <div key={group.key} className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl">{group.title}</h2>
          <p className="mb-5 text-sm text-muted-foreground">{group.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => {
              const value = (form[group.key] ?? {})[field.name];
              const id = `${group.key}-${field.name}`;
              return (
                <div key={id} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label className="mb-2 block" htmlFor={id}>
                    {field.label}
                  </Label>
                  {field.type === "boolean" ? (
                    <div className="flex h-9 items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={Boolean(value)}
                        onCheckedChange={(checked) =>
                          setValue(group.key, field.name, Boolean(checked))
                        }
                      />
                      <span className="text-sm text-muted-foreground">Ativado</span>
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={id}
                      rows={3}
                      value={value == null ? "" : String(value)}
                      onChange={(event) => setValue(group.key, field.name, event.target.value)}
                    />
                  ) : (
                    <Input
                      id={id}
                      value={value == null ? "" : String(value)}
                      onChange={(event) => setValue(group.key, field.name, event.target.value)}
                    />
                  )}
                  {field.help ? (
                    <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <Button
            className="mt-5"
            onClick={() => mutation.mutate(group.key)}
            disabled={mutation.isPending}
          >
            Salvar
          </Button>
        </div>
      ))}
    </section>
  );
}
