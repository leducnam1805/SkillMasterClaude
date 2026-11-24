/**
 * Sinh bản nháp bằng Claude cho các ai_tasks trong spec.
 * - Chỉ gửi tên gọi + chuỗi sự việc; bỏ mọi trường có dấu hiệu định danh.
 * - Kết quả luôn là DRAFT, giáo viên phải sửa/duyệt (requires_approval).
 * - AI không tính điểm: các con số được tính sẵn bằng code (lib/rules.ts) rồi đưa vào ngữ cảnh.
 */
import Anthropic from "@anthropic-ai/sdk";
import { entityDef, isPiiField, rowLabel, spec, type AiTaskDef } from "./spec";
import { addDraft, get, list, type Draft, type Row } from "./store";
import { buildFacts, taskPrompts } from "./ai-prompts";

const MODEL = process.env.CLASS_AI_MODEL ?? "claude-opus-5-5";

export class AiNotConfiguredError extends Error {}

/** Bản ghi ngữ cảnh: các bản ghi tham chiếu tới chủ thể, với ref đã được thay bằng nhãn dễ đọc. */
function contextFor(task: AiTaskDef, subjectId: string): string[] {
  const lines: string[] = [];
  for (const entityName of task.context_entities) {
    const def = entityDef(entityName);
    const linkFields = def.fields.filter((f) => f.type === "ref" && f.ref === task.subject_entity);
    if (linkFields.length === 0) continue;
    const rows = list(entityName).filter((r) => linkFields.some((f) => r[f.name] === subjectId));
    for (const r of rows) lines.push(`- ${describeRow(entityName, r, task.subject_entity)}`);
  }
  return lines;
}

function describeRow(entityName: string, row: Row, skipRefTo: string): string {
  const def = entityDef(entityName);
  const parts: string[] = [];
  for (const f of def.fields) {
    if (isPiiField(f.name)) continue;
    const v = row[f.name];
    if (v === null || v === undefined || v === "") continue;
    if (f.type === "ref") {
      if (f.ref === skipRefTo) continue;
      const target = get(f.ref!, String(v));
      const targetDef = entityDef(f.ref!);
      const extra = target
        ? targetDef.fields
            .filter((tf) => tf.type === "int" || tf.type === "number")
            .map((tf) => `${tf.label}: ${String(target[tf.name])}`)
        : [];
      parts.push(`${f.label}: ${target ? rowLabel(targetDef, target) : v}${extra.length ? ` (${extra.join(", ")})` : ""}`);
    } else {
      parts.push(`${f.label}: ${String(v)}`);
    }
  }
  return parts.join("; ");
}

export async function generateDraft(taskId: string, subjectId: string, tone: string): Promise<Draft> {
  const task = spec.ai_tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Không có tác vụ AI ${taskId}`);
  const subjectDef = entityDef(task.subject_entity);
  const subject = get(task.subject_entity, subjectId);
  if (!subject) throw new Error("Không tìm thấy đối tượng");
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN)
    throw new AiNotConfiguredError("Chưa cấu hình ANTHROPIC_API_KEY trong .env.local");

  const name = rowLabel(subjectDef, subject);
  const evidence = contextFor(task, subjectId);
  const facts = buildFacts(task.id, subjectId);
  const prompt = taskPrompts[task.id] ?? taskPrompts.default;

  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: prompt.system,
    messages: [
      {
        role: "user",
        content: [
          `Tác vụ: ${task.title} — ${task.purpose}`,
          `Giọng văn: ${tone || task.tones[0] || "Khích lệ"}`,
          `Tên gọi: ${name}`,
          facts ? `Số liệu đã tính sẵn (không tự tính lại):\n${facts}` : "",
          `Minh chứng đã ghi nhận:\n${evidence.length ? evidence.join("\n") : "(chưa có sự việc nào)"}`,
          prompt.instructions,
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("AI từ chối yêu cầu này, vui lòng tự soạn.");
  const text = response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
  return addDraft({ taskId, subjectId, tone, text });
}
