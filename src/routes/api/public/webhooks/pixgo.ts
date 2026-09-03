import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/public/webhooks/pixgo")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const secret = process.env["PIXGO_WEBHOOK_SECRET"];
        const signature =
          request.headers.get("x-pixgo-signature") ??
          request.headers.get("x-signature") ??
          request.headers.get("x-webhook-signature") ??
          "";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { normalizePixgoStatus } = await import("@/lib/pixgo.server");

        let payload: Record<string, unknown> = {};
        try {
          payload = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        let signatureValid = false;
        if (secret) {
          const expected = createHmac("sha256", secret).update(raw).digest("hex");
          const provided = signature.replace(/^sha256=/, "").trim();
          signatureValid =
            provided.length === expected.length &&
            timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
        }

        const data = ((payload["data"] as Record<string, unknown>) ?? payload) as Record<
          string,
          unknown
        >;
        const externalId =
          (data["id"] as string) ??
          (data["charge_id"] as string) ??
          (data["transaction_id"] as string) ??
          null;
        const reference =
          (data["external_reference"] as string) ?? (data["reference"] as string) ?? null;
        const status = normalizePixgoStatus(data["status"] as string);

        await supabaseAdmin.from("webhook_logs").insert({
          provider: "pixgo",
          event: (payload["event"] as string) ?? (payload["type"] as string) ?? "unknown",
          external_id: externalId,
          payload: payload as never,
          signature_valid: signatureValid,
          processed: false,
        });

        if (!secret || !signatureValid) {
          return new Response("Invalid signature", { status: 401 });
        }

        const query = supabaseAdmin.from("payments").select("id, order_id, status, payment_id");
        const { data: payment } = externalId
          ? await query.eq("external_id", externalId).maybeSingle()
          : await query.eq("payment_id", `${reference}-PIX`).maybeSingle();

        if (!payment) {
          return new Response("ok", { status: 200 });
        }

        // Idempotent: already settled, nothing to do.
        if (payment.status === status || payment.status === "paid") {
          await supabaseAdmin
            .from("webhook_logs")
            .update({ processed: true })
            .eq("external_id", externalId ?? "")
            .eq("processed", false);
          return new Response("ok", { status: 200 });
        }

        const nowIso = new Date().toISOString();
        await supabaseAdmin
          .from("payments")
          .update({
            status,
            completed_at: status === "paid" ? nowIso : null,
          })
          .eq("id", payment.id);

        if (payment.order_id) {
          await supabaseAdmin
            .from("orders")
            .update({
              status: status === "paid" ? "paid" : status,
              paid_at: status === "paid" ? nowIso : null,
              expired_at: status === "expired" ? nowIso : null,
            })
            .eq("id", payment.order_id);
        }

        await supabaseAdmin
          .from("webhook_logs")
          .update({ processed: true })
          .eq("external_id", externalId ?? "")
          .eq("processed", false);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
