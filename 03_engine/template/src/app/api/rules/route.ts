import type { NextRequest } from "next/server";
import { ruleStatuses, setRuleStatus } from "@/lib/store";
import { spec } from "@/lib/spec";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = ruleStatuses();
  return Response.json({ data: spec.rules.map((r) => ({ ...r, status: status[r.id] })) });
}

export async function POST(req: NextRequest) {
  const { id, status } = (await req.json()) as { id: string; status: "CONFIRMED" | "PENDING" };
  if (!spec.rules.some((r) => r.id === id) || !["CONFIRMED", "PENDING"].includes(status))
    return Response.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  setRuleStatus(id, status);
  return Response.json({ ok: true });
}
