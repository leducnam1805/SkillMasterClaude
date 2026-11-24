/** Stage ② Solution Designer: đề xuất 2-3 mô hình giải pháp, khuyến nghị 1. */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { KNOWLEDGE_DIR } from "../config.ts";
import { loadPrompt, structured } from "../llm.ts";
import type { Answer, Brief } from "./intake.ts";

export const SolutionModel = z.object({
  name: z.string(),
  description: z.string(),
  how_it_motivates: z.string(),
  features: z.array(z.string()),
  risks: z.array(z.string()),
  fit: z.string().describe("Vì sao phù hợp/không phù hợp với câu trả lời của người dùng"),
});

export const Design = z.object({
  models: z.array(SolutionModel),
  recommended_index: z.number().int(),
  rationale: z.string(),
});
export type Design = z.infer<typeof Design>;
export type SolutionModel = z.infer<typeof SolutionModel>;

function knowledge(): string {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return "";
  return fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => fs.readFileSync(path.join(KNOWLEDGE_DIR, f), "utf8"))
    .join("\n\n---\n\n");
}

export function formatContext(prompt: string, brief: Brief, answers: Answer[]): string {
  return [
    `## Mô tả gốc của người dùng\n${prompt}`,
    `## Hiểu biết về bài toán\n${brief.understanding}\nNgười dùng: ${brief.persona}\nMục tiêu: ${brief.goal}`,
    `## Câu trả lời làm rõ\n${
      answers.length
        ? answers
            .map((a) => `- ${a.question} → ${a.answer}${a.explicit ? " (người dùng xác nhận)" : " (mặc định, CHƯA xác nhận)"}`)
            .join("\n")
        : "(không có)"
    }`,
  ].join("\n\n");
}

export async function runDesigner(prompt: string, brief: Brief, answers: Answer[]): Promise<Design> {
  const system = `${loadPrompt("designer")}\n\n# Kiến thức chuyên ngành\n\n${knowledge()}`;
  const { data } = await structured({
    stage: "design",
    system,
    schema: Design,
    messages: [{ role: "user", content: formatContext(prompt, brief, answers) }],
  });
  data.recommended_index = Math.min(Math.max(data.recommended_index, 0), data.models.length - 1);
  return data;
}
