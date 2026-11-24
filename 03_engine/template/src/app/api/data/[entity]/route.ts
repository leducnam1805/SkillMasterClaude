import type { NextRequest } from "next/server";
import { create, list, ValidationError } from "@/lib/store";
import { spec } from "@/lib/spec";

export const dynamic = "force-dynamic";

function known(entity: string) {
  return spec.entities.some((e) => e.name === entity);
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/data/[entity]">) {
  const { entity } = await ctx.params;
  if (!known(entity)) return Response.json({ error: "Không có entity này" }, { status: 404 });
  return Response.json({ data: list(entity) });
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/data/[entity]">) {
  const { entity } = await ctx.params;
  if (!known(entity)) return Response.json({ error: "Không có entity này" }, { status: 404 });
  try {
    const row = create(entity, await req.json());
    return Response.json({ data: row }, { status: 201 });
  } catch (e) {
    if (e instanceof ValidationError) return Response.json({ error: e.message }, { status: 400 });
    throw e;
  }
}
