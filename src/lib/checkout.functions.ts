import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const documentSchema = z
  .string()
  .transform((value) => value.replace(/\D+/g, ""))
  .refine((value) => value.length === 11 || value.length === 14, {
    message: "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido",
  });

const checkoutSchema = z.object({
  planSlug: z.string().min(1).max(80),
  name: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .transform((value) => value.replace(/\D+/g, ""))
    .refine((value) => value.length >= 10 && value.length <= 13, {
      message: "Informe um WhatsApp com DDD",
    }),
  document: documentSchema,
  coupon: z.string().trim().max(40).optional(),
  acceptTerms: z.literal(true),
});

function orderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NP-${stamp}${rand}`;
}

export const createPixCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPixCharge } = await import("./pixgo.server");

    const { data: plan, error: planError } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("slug", data.planSlug)
      .eq("active", true)
      .maybeSingle();

    if (planError || !plan) {
      throw new Error("Plano não encontrado ou indisponível.");
    }

    const subtotal = Number(
      plan.promotional_price && Number(plan.promotional_price) > 0
        ? plan.promotional_price
        : plan.price,
    );

    let discount = 0;
    let couponId: string | null = null;
    if (data.coupon) {
      const { data: coupon } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .ilike("code", data.coupon)
        .eq("active", true)
        .maybeSingle();

      const now = Date.now();
      const valid =
        coupon &&
        (!coupon.starts_at || new Date(coupon.starts_at).getTime() <= now) &&
        (!coupon.expires_at || new Date(coupon.expires_at).getTime() >= now) &&
        (!coupon.maximum_uses || (coupon.uses ?? 0) < coupon.maximum_uses) &&
        (!coupon.minimum_amount || subtotal >= Number(coupon.minimum_amount));

      if (valid && coupon) {
        couponId = coupon.id;
        discount =
          coupon.type === "percent"
            ? Math.min(subtotal, (subtotal * Number(coupon.value)) / 100)
            : Math.min(subtotal, Number(coupon.value));
      }
    }

    const total = Math.max(1, Number((subtotal - discount).toFixed(2)));

    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    let customerId = existingCustomer?.id ?? null;
    if (customerId) {
      await supabaseAdmin
        .from("customers")
        .update({
          name: data.name,
          cpf: data.document,
          phone: data.phone,
          whatsapp: data.phone,
        })
        .eq("id", customerId);
    } else {
      const { data: inserted, error: customerError } = await supabaseAdmin
        .from("customers")
        .insert({
          name: data.name,
          email: data.email,
          cpf: data.document,
          phone: data.phone,
          whatsapp: data.phone,
          status: "active",
        })
        .select("id")
        .single();
      if (customerError || !inserted) throw new Error("Não foi possível registrar seus dados.");
      customerId = inserted.id;
    }

    const number = orderNumber();
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: number,
        plan_id: plan.id,
        customer_id: customerId,
        coupon_id: couponId,
        subtotal,
        discount,
        total,
        payment_method: "pix",
        payment_provider: "pixgo",
        status: "pending",
        source: "landing",
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) throw new Error("Não foi possível criar o pedido.");

    let charge;
    try {
      charge = await createPixCharge({
        amount: total,
        description: `${plan.name} — ${number}`,
        reference: number,
        payer: {
          name: data.name,
          document: data.document,
          email: data.email,
          phone: data.phone,
        },
      });
    } catch (error) {
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      const code = error instanceof Error ? error.message : "PIXGO_REQUEST_FAILED";
      if (code === "PIXGO_NOT_CONFIGURED") {
        throw new Error(
          "Pagamento via PIX temporariamente indisponível. Finalize pelo WhatsApp que respondemos na hora.",
        );
      }
      throw new Error("Não foi possível gerar o PIX agora. Tente novamente em instantes.");
    }

    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        payment_id: `${number}-PIX`,
        external_id: charge.externalId,
        order_id: order.id,
        plan_id: plan.id,
        customer_id: customerId,
        amount: total,
        status: "pending",
        provider: "pixgo",
        qr_code: charge.qrCode,
        qr_image_url: charge.qrCodeImage,
        expires_at: charge.expiresAt,
      })
      .select("id, payment_id")
      .single();

    if (paymentError || !payment) throw new Error("Não foi possível registrar o pagamento.");

    await supabaseAdmin
      .from("orders")
      .update({ payment_id: payment.payment_id })
      .eq("id", order.id);

    return {
      orderNumber: order.order_number,
      paymentId: payment.payment_id,
      amount: total,
      subtotal,
      discount,
      qrCode: charge.qrCode,
      qrImageUrl: charge.qrCodeImage,
      expiresAt: charge.expiresAt,
      planName: plan.name,
    };
  });

export const getCheckoutStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ paymentId: z.string().min(3).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("status, amount, expires_at, completed_at, order_id")
      .eq("payment_id", data.paymentId)
      .maybeSingle();

    if (!payment) return { status: "not_found" as const };

    return {
      status: payment.status,
      amount: Number(payment.amount),
      expiresAt: payment.expires_at,
      completedAt: payment.completed_at,
    };
  });
