import type { NextRequest } from "next/server";
import { updateDraft, ValidationError, type Draft } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/ai/drafts/[id]">) {
  const { id } = await ctx.params;
  const body = (await req.json()) as { text?: string; status?: Draft["status"] };
  try {
    return Response.json({ data: updateDraft(id, body) });
  } catch (e) {
    if (e instanceof ValidationError) return Response.json({ error: e.message }, { status: 400 });
    throw e;
  }
}
