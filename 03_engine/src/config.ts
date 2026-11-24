import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "..");
export const AGENT_ROOT = path.resolve(ROOT, "..");
export const PROMPTS_DIR = path.join(AGENT_ROOT, "02_prompts");
export const KNOWLEDGE_DIR = path.join(AGENT_ROOT, "01_process", "04_knowledge");
export const RUNS_DIR = path.join(AGENT_ROOT, "04_workspace", "outputs");

export type Stage = "intake" | "design" | "spec" | "codegen";
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

const DEFAULT_MODEL = "claude-opus-5-5";

export const STAGE_CONFIG: Record<Stage, { model: string; effort: Effort }> = {
  intake: { model: process.env.EDUAGENT_MODEL_INTAKE ?? DEFAULT_MODEL, effort: "low" },
  design: { model: process.env.EDUAGENT_MODEL_DESIGN ?? DEFAULT_MODEL, effort: "high" },
  spec: { model: process.env.EDUAGENT_MODEL_SPEC ?? DEFAULT_MODEL, effort: "high" },
  codegen: { model: process.env.EDUAGENT_MODEL_CODEGEN ?? DEFAULT_MODEL, effort: "high" },
};

export const LIMITS = {
  /** Số lần Spec Builder tự sửa khi linter báo lỗi */
  specRepairRounds: 3,
  /** Số vòng Codegen ↔ Verifier tự sửa lỗi */
  fixRounds: 3,
  /** Số lượt gọi tool tối đa trong một phiên Codegen */
  codegenIterations: 60,
  /** Số câu hỏi làm rõ tối đa */
  maxQuestions: 5,
};
