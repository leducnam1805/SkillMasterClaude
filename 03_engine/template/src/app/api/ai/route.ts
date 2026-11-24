import type { NextRequest } from "next/server";
import { AiNotConfiguredError, generateDraft } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { taskId, subjectId, tone } = (await req.json()) as { taskId: string; subjectId: string; tone: string };
  try {
    return Response.json({ data: await generateDraft(taskId, subjectId, tone) }, { status: 201 });
  } catch (e) {
    const status = e instanceof AiNotConfiguredError ? 503 : 500;
    return Response.json({ error: e instanceof Error ? e.message : "Lỗi không xác định" }, { status });
  }
}
