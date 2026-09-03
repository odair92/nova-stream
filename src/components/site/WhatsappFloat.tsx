import { MessageCircle } from "lucide-react";

import { whatsappUrl } from "@/lib/format";
import type { WhatsappSettings } from "@/lib/types";

export function WhatsappFloat({ whatsapp }: { whatsapp: WhatsappSettings }) {
  if (!whatsapp.enabled || !whatsapp.float_button || !whatsapp.number) return null;

  return (
    <a
      href={whatsappUrl(whatsapp.number, "Olá! Gostaria de saber mais sobre os planos.")}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
