import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Tables the admin panel is allowed to manage. */
const TABLES = [
  "plans",
  "banners",
  "catalog_categories",
  "catalog_items",
  "benefits",
  "devices",
  "testimonials",
  "faqs",
  "coupons",
  "customers",
  "orders",
  "payments",
] as const;

export type AdminTable = (typeof TABLES)[number];

const tableSchema = z.enum(TABLES);

type AnyRow = Record<string, unknown>;

async function assertAdmin(supabase: unknown, userId: string) {
  const db = supabase as any;
  const { data, error } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("FORBIDDEN");
}

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase as any;
    const [{ data: roles }, { data: profile }] = await Promise.all([
      db.from("user_roles").select("role").eq("user_id", context.userId),
      db.from("profiles").select("email, full_name").eq("id", context.userId).maybeSingle(),
    ]);
    const roleList = ((roles ?? []) as { role: string }[]).map((r) => r.role);
    return {
      userId: context.userId,
      email: (profile?.email as string | null) ?? null,
      fullName: (profile?.full_name as string | null) ?? null,
      isAdmin: roleList.includes("admin"),
      roles: roleList,
    };
  });

export const listRows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        orderBy: z.string().max(40).optional(),
        ascending: z.boolean().optional(),
        limit: z.number().int().min(1).max(500).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    let query = db.from(data.table).select("*").limit(data.limit ?? 200);
    query = query.order(data.orderBy ?? "created_at", { ascending: data.ascending ?? false });
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as AnyRow[];
  });

export const saveRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        id: z.string().uuid().optional(),
        values: z.record(z.string(), z.unknown()),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    const values = { ...data.values };
    delete values.id;
    delete values.created_at;
    delete values.updated_at;

    if (data.id) {
      const { data: row, error } = await db
        .from(data.table)
        .update(values)
        .eq("id", data.id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return row as AnyRow;
    }

    const { data: row, error } = await db.from(data.table).insert(values).select().maybeSingle();
    if (error) throw new Error(error.message);
    return row as AnyRow;
  });

export const deleteRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    const { error } = await db.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    const { data, error } = await db.from("settings").select("key, value");
    if (error) throw new Error(error.message);
    const map: Record<string, Record<string, unknown>> = {};
    for (const row of (data ?? []) as { key: string; value: Record<string, unknown> }[]) {
      map[row.key] = row.value ?? {};
    }
    return map;
  });

export const saveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ key: z.string().min(1).max(60), value: z.record(z.string(), z.unknown()) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    const { error } = await db
      .from("settings")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase as any;
    const [orders, customers, plans] = await Promise.all([
      db.from("orders").select("id, order_number, total, status, created_at, paid_at").order("created_at", { ascending: false }).limit(200),
      db.from("customers").select("id", { count: "exact", head: true }),
      db.from("plans").select("id", { count: "exact", head: true }).eq("active", true),
    ]);

    const rows = (orders.data ?? []) as {
      id: string;
      order_number: string;
      total: number | string;
      status: string;
      created_at: string;
      paid_at: string | null;
    }[];

    const paid = rows.filter((r) => r.status === "paid");
    const revenue = paid.reduce((sum, r) => sum + Number(r.total), 0);
    const now = Date.now();
    const revenue30 = paid
      .filter((r) => now - new Date(r.paid_at ?? r.created_at).getTime() < 30 * 864e5)
      .reduce((sum, r) => sum + Number(r.total), 0);

    const byDay = new Map<string, number>();
    for (const r of paid) {
      const day = (r.paid_at ?? r.created_at).slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + Number(r.total));
    }

    return {
      revenue,
      revenue30,
      orderCount: rows.length,
      paidCount: paid.length,
      pendingCount: rows.filter((r) => r.status === "pending").length,
      customerCount: customers.count ?? 0,
      activePlans: plans.count ?? 0,
      recentOrders: rows.slice(0, 8).map((r) => ({ ...r, total: Number(r.total) })),
      chart: [...byDay.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([day, total]) => ({ day: day.slice(5), total })),
    };
  });
