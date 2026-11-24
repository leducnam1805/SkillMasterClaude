/** Stage ① Intake: hiểu đề bài, liệt kê chỗ thiếu, sinh ≤5 câu hỏi có lựa chọn. */
import { z } from "zod";
import { LIMITS } from "../config.ts";
import { loadPrompt, structured } from "../llm.ts";

export const Brief = z.object({
  understanding: z.string().describe("1-2 câu: người dùng là ai, muốn đạt điều gì"),
  persona: z.string(),
  goal: z.string(),
  missing_info: z.array(z.string()),
  questions: z.array(
    z.object({
      id: z.string().describe("q1, q2..."),
      question: z.string(),
      options: z.array(z.string()).describe("2-4 lựa chọn cụ thể"),
      default_index: z.number().int(),
      why: z.string().describe("Câu trả lời ảnh hưởng tới app thế nào"),
    }),
  ),
  feasible: z.boolean(),
  concerns: z.array(z.string()),
});
export type Brief = z.infer<typeof Brief>;

export interface Answer {
  id: string;
  question: string;
  answer: string;
  /** true nếu người dùng chọn/nhập rõ ràng; false nếu dùng mặc định */
  explicit: boolean;
}

export async function runIntake(prompt: string): Promise<Brief> {
  const { data } = await structured({
    stage: "intake",
    system: loadPrompt("intake"),
    schema: Brief,
    messages: [{ role: "user", content: `Mô tả của người dùng:\n"""\n${prompt}\n"""` }],
  });
  data.questions = data.questions.slice(0, LIMITS.maxQuestions).map((q) => ({
    ...q,
    default_index: Math.min(Math.max(q.default_index, 0), Math.max(q.options.length - 1, 0)),
  }));
  return data;
}
