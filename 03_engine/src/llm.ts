/**
 * Lớp gọi Claude dùng chung cho các stage.
 * - Structured outputs (JSON Schema sinh từ Zod) + kiểm tra lại bằng Zod.
 * - Server-side fallback khi bị từ chối (refusal).
 * - Ghi nhận token theo stage để đo chi phí (usage.json của mỗi run).
 */
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { PROMPTS_DIR, STAGE_CONFIG, type Stage } from "./config.ts";

export const client = new Anthropic();
export const BETAS = ["server-side-fallback-2026-07-01"];

export class StageError extends Error {}

// ---------------------------------------------------------------- usage
export interface UsageRow {
  stage: Stage;
  model: string;
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}
export const usageLog: UsageRow[] = [];

export function recordUsage(stage: Stage, msg: Anthropic.Beta.BetaMessage): void {
  usageLog.push({
    stage,
    model: msg.model,
    input: msg.usage.input_tokens,
    output: msg.usage.output_tokens,
    cacheRead: msg.usage.cache_read_input_tokens ?? 0,
    cacheWrite: msg.usage.cache_creation_input_tokens ?? 0,
  });
}

// ---------------------------------------------------------------- prompts
const promptCache = new Map<string, string>();

const PROMPT_ALIASES: Record<string, string> = {
  intake: "intake.md",
  designer: "designer.md",
  spec: "spec.md",
  codegen: "codegen.md",
  verifier: "verifier.md",
  "01_AGENT_INTAKE_BA": "01_AGENT_INTAKE_BA.md",
  "02_AGENT_SOLUTION_ARCHITECT": "02_AGENT_SOLUTION_ARCHITECT.md",
  "03_AGENT_CODEGEN": "03_AGENT_CODEGEN.md",
  "04_AGENT_QA_TESTER": "04_AGENT_QA_TESTER.md",
};

function stripFrontmatter(text: string): string {
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      return text.slice(end + 4).trim();
    }
  }
  return text.trim();
}

function resolvePromptPath(name: string): string {
  const direct = path.join(PROMPTS_DIR, name.endsWith(".md") ? name : `${name}.md`);
  if (fs.existsSync(direct)) return direct;
  const alias = PROMPT_ALIASES[name];
  if (alias) {
    const aliasPath = path.join(PROMPTS_DIR, alias);
    if (fs.existsSync(aliasPath)) return aliasPath;
  }
  throw new StageError(`Không tìm thấy file prompt cho stage '${name}' trong thư mục ${PROMPTS_DIR}`);
}

export function loadPrompt(name: string): string {
  if (!promptCache.has(name)) {
    const corePath = path.join(PROMPTS_DIR, "_core_rules.md");
    const core = fs.existsSync(corePath) ? fs.readFileSync(corePath, "utf8") : "";
    const promptPath = resolvePromptPath(name);
    const body = stripFrontmatter(fs.readFileSync(promptPath, "utf8"));
    const combined = core ? `${body}\n\n${core.trim()}\n` : `${body}\n`;
    promptCache.set(name, combined);
  }
  return promptCache.get(name)!;
}

// ---------------------------------------------------------------- JSON schema
/** Zod → JSON Schema chặt (additionalProperties:false, mọi khóa đều required) cho structured outputs. */
export function strictJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const js = z.toJSONSchema(schema) as Record<string, unknown>;
  delete js.$schema;
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    if (obj.type === "object" && obj.properties && typeof obj.properties === "object") {
      obj.additionalProperties = false;
      obj.required = Object.keys(obj.properties as object);
    }
    Object.values(obj).forEach(walk);
  };
  walk(js);
  return js;
}

// ---------------------------------------------------------------- structured call
export interface StructuredCall<T extends z.ZodType> {
  stage: Stage;
  system: string;
  messages: Anthropic.Beta.BetaMessageParam[];
  schema: T;
}

export async function structured<T extends z.ZodType>(
  call: StructuredCall<T>,
): Promise<{ data: z.infer<T>; message: Anthropic.Beta.BetaMessage }> {
  const { model, effort } = STAGE_CONFIG[call.stage];
  const stream = client.beta.messages.stream({
    model,
    max_tokens: 64000,
    betas: BETAS,
    fallbacks: "default",
    system: [{ type: "text", text: call.system, cache_control: { type: "ephemeral" } }],
    messages: call.messages,
    output_config: {
      effort,
      format: { type: "json_schema", schema: strictJsonSchema(call.schema) },
    },
  });
  const message = await stream.finalMessage();
  recordUsage(call.stage, message);

  if (message.stop_reason === "refusal")
    throw new StageError(`[${call.stage}] Claude từ chối yêu cầu (${message.stop_details?.category ?? "không rõ"}).`);
  if (message.stop_reason === "max_tokens") throw new StageError(`[${call.stage}] Kết quả bị cắt do max_tokens.`);

  const text = message.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new StageError(`[${call.stage}] Kết quả không phải JSON hợp lệ.`);
  }
  const parsed = call.schema.safeParse(json);
  if (!parsed.success) throw new StageError(`[${call.stage}] Sai schema: ${parsed.error.message}`);
  return { data: parsed.data, message };
}

/** Câu trả lời trợ lý dạng nội dung đầy đủ, để nối tiếp hội thoại nhiều lượt. */
export function asAssistant(message: Anthropic.Beta.BetaMessage): Anthropic.Beta.BetaMessageParam {
  return { role: "assistant", content: message.content as Anthropic.Beta.BetaContentBlockParam[] };
}
