import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { effectivePrice, formatBRL, planWhatsappUrl } from "@/lib/format";
import type { Plan, WhatsappSettings } from "@/lib/types";

export function SubscribeModal({
  plan,
  whatsapp,
  onClose,
}: {
  plan: Plan | null;
  whatsapp: WhatsappSettings;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={!!plan} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        {plan ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{plan.name}</DialogTitle>
              <DialogDescription>
                {formatBRL(effectivePrice(plan))} · {plan.duration_label ?? `${plan.duration_days} dias`} ·{" "}
                {plan.devices} {plan.devices > 1 ? "dispositivos" : "dispositivo"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              {plan.payment_enabled ? (
                <Button
                  className="w-full font-semibold"
                  onClick={() => {
                    onClose();
                    void navigate({ to: "/checkout/$slug", params: { slug: plan.slug } });
                  }}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Pagar com PIX
                </Button>
              ) : null}

              {plan.whatsapp_enabled && whatsapp.enabled && whatsapp.number ? (
                <Button asChild variant="secondary" className="w-full font-semibold">
                  <a
                    href={planWhatsappUrl(whatsapp, plan)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {whatsapp.button_text}
                  </a>
                </Button>
              ) : null}

              <p className="text-center text-xs text-muted-foreground">
                Confirmação automática do pagamento e envio do acesso pelo WhatsApp.
              </p>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
