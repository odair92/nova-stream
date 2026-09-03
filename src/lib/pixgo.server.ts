// PixGo integration. Runs on the server only — never import from client code.

export interface PixChargeInput {
  amount: number;
  description: string;
  reference: string;
  payer: { name: string; document: string; email: string; phone?: string };
  expiresInSeconds?: number;
}

export interface PixChargeResult {
  externalId: string;
  qrCode: string;
  qrCodeImage: string | null;
  expiresAt: string | null;
  status: string;
  raw: unknown;
}

const DEFAULT_BASE_URL = "https://api.pixgo.com.br/v1";

export function isPixgoConfigured(): boolean {
  return !!process.env["PIXGO_API_KEY"];
}

function pickString(source: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return null;
}

export async function createPixCharge(input: PixChargeInput): Promise<PixChargeResult> {
  const apiKey = process.env["PIXGO_API_KEY"];
  if (!apiKey) {
    throw new Error("PIXGO_NOT_CONFIGURED");
  }
  const baseUrl = (process.env["PIXGO_API_URL"] || DEFAULT_BASE_URL).replace(/\/+$/, "");

  const response = await fetch(`${baseUrl}/pix/charges`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      amount: Number(input.amount.toFixed(2)),
      value: Number(input.amount.toFixed(2)),
      description: input.description,
      external_reference: input.reference,
      reference: input.reference,
      expiration: input.expiresInSeconds ?? 3600,
      payer: {
        name: input.payer.name,
        document: input.payer.document,
        email: input.payer.email,
        phone: input.payer.phone,
      },
    }),
  });

  const text = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(text) as Record<string, unknown>;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    console.error("[pixgo] charge failed", response.status, text.slice(0, 500));
    throw new Error("PIXGO_REQUEST_FAILED");
  }

  const data = ((payload["data"] as Record<string, unknown>) ?? payload) as Record<string, unknown>;
  const pix = (data["pix"] as Record<string, unknown>) ?? data;

  const externalId = pickString(data, ["id", "charge_id", "transaction_id", "txid"]);
  const qrCode = pickString(pix, ["qr_code", "qrcode", "emv", "copy_paste", "payload", "brcode"]);

  if (!externalId || !qrCode) {
    console.error("[pixgo] unexpected response shape", text.slice(0, 500));
    throw new Error("PIXGO_UNEXPECTED_RESPONSE");
  }

  return {
    externalId,
    qrCode,
    qrCodeImage: pickString(pix, ["qr_code_image", "qr_code_url", "qrcode_image", "image_url"]),
    expiresAt: pickString(data, ["expires_at", "expiration_date", "due_date"]),
    status: pickString(data, ["status"]) ?? "pending",
    raw: payload,
  };
}

export function normalizePixgoStatus(status: string | null | undefined): "pending" | "paid" | "expired" | "failed" {
  const value = (status ?? "").toLowerCase();
  if (["paid", "approved", "completed", "confirmed", "success", "pago"].includes(value)) return "paid";
  if (["expired", "expirado"].includes(value)) return "expired";
  if (["failed", "canceled", "cancelled", "refused", "error"].includes(value)) return "failed";
  return "pending";
}
