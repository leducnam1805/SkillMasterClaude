import type { NextRequest } from "next/server";
import { get, remove, update, ValidationError } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/data/[entity]/[id]">) {
  const { entity, id } = await ctx.params;
  const row = get(entity, id);
  return row ? Response.json({ data: row }) : Response.json({ error: "Không tìm thấy" }, { status: 404 });
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/data/[entity]/[id]">) {
  const { entity, id } = await ctx.params;
  try {
    const { reason = null, ...patch } = (await req.json()) as Record<string, unknown> & { reason?: string | null };
    return Response.json({ data: update(entity, id, patch, "teacher", reason) });
  } catch (e) {
    if (e instanceof ValidationError) return Response.json({ error: e.message }, { status: 400 });
    throw e;
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/data/[entity]/[id]">) {
  const { entity, id } = await ctx.params;
  try {
    remove(entity, id, "teacher", req.nextUrl.searchParams.get("reason"));
    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof ValidationError) return Response.json({ error: e.message }, { status: 400 });
    throw e;
  }
}
