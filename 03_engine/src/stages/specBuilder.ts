/**
 * Stage ③ Spec Builder: mô hình đã chọn → AppSpec, tự sửa theo linter.
 * Cũng dùng cho bước ④ (người dùng yêu cầu chỉnh sửa spec).
 */
import fs from "node:fs";
import path from "node:path";
import type Anthropic from "@anthropic-ai/sdk";
import { LIMITS, ROOT } from "../config.ts";
import { asAssistant, loadPrompt, structured, StageError } from "../llm.ts";
import { AppSpec } from "../spec/schema.ts";
import { lintSpec, type LintResult } from "../spec/lint.ts";
import type { SolutionModel } from "./designer.ts";

export interface SpecSession {
  messages: Anthropic.Beta.BetaMessageParam[];
  spec: AppSpec;
  lint: LintResult;
}

function system(): string {
  const example = fs.readFileSync(path.join(ROOT, "spec/examples/classmate-2g3.json"), "utf8");
  return `${loadPrompt("spec")}\n\n# Ví dụ AppSpec hoàn chỉnh (dự án AI ClassMate 2G3)\n\n\`\`\`json\n${example}\n\`\`\`\n`;
}

async function loop(messages: Anthropic.Beta.BetaMessageParam[], onProgress: (m: string) => void): Promise<SpecSession> {
  for (let round = 0; ; round++) {
    const { data, message } = await structured({ stage: "spec", system: system(), schema: AppSpec, messages });
    messages.push(asAssistant(message));
    const lint = lintSpec(data);
    if (lint.errors.length === 0) return { messages, spec: data, lint };
    if (round >= LIMITS.specRepairRounds)
      throw new StageError(`Spec vẫn còn ${lint.errors.length} lỗi sau ${round + 1} lần sửa:\n- ${lint.errors.join("\n- ")}`);
    onProgress(`Linter phát hiện ${lint.errors.length} lỗi — đang tự sửa (lần ${round + 1})...`);
    messages.push({
      role: "user",
      content: `Linter báo lỗi. Sửa hết và trả về toàn bộ AppSpec:\n- ${lint.errors.join("\n- ")}`,
    });
  }
}

export async function buildSpec(context: string, model: SolutionModel, onProgress: (m: string) => void): Promise<SpecSession> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: `${context}\n\n## Mô hình giải pháp đã chọn\n${JSON.stringify(model, null, 2)}\n\nHãy viết AppSpec.`,
    },
  ];
  return loop(messages, onProgress);
}

export async function reviseSpec(session: SpecSession, feedback: string, onProgress: (m: string) => void): Promise<SpecSession> {
  const messages = [
    ...session.messages,
    {
      role: "user" as const,
      content:
        `Người dùng yêu cầu chỉnh sửa:\n"""\n${feedback}\n"""\n` +
        "Áp dụng thay đổi (những gì người dùng nói rõ thì chuyển sang CONFIRMED) và trả về toàn bộ AppSpec.",
    },
  ];
  return loop(messages, onProgress);
}
