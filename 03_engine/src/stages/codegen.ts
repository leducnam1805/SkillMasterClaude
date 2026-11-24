/**
 * Stage ⑤ Codegen: Claude viết phần đặc thù (rules, hooks, prompts AI, màn hình custom)
 * qua các tool có giới hạn: chỉ được ghi file trong danh sách cho phép.
 */
import fs from "node:fs";
import path from "node:path";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { LIMITS, ROOT, STAGE_CONFIG } from "../config.ts";
import { BETAS, client, loadPrompt, recordUsage, StageError } from "../llm.ts";
import { llmOwnedFiles } from "../generator/index.ts";
import type { AppSpec } from "../spec/schema.ts";
import { runCheck, type CheckResult } from "./verifier.ts";

const HIDDEN = new Set(["node_modules", ".next", ".git"]);
const REFERENCE_DIR = path.join(ROOT, "spec/examples/classmate-2g3.reference");

/** System prompt = hướng dẫn + bản tham chiếu ClassMate làm ví dụ mẫu (ổn định → cache được). */
function codegenSystem(): string {
  const files: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else files.push(`### ${toPosix(path.relative(REFERENCE_DIR, p))}\n\`\`\`tsx\n${fs.readFileSync(p, "utf8")}\n\`\`\``);
    }
  };
  if (fs.existsSync(REFERENCE_DIR)) walk(REFERENCE_DIR);
  return `${loadPrompt("codegen")}\n\n# Ví dụ mẫu: phần đặc thù đã viết cho spec AI ClassMate 2G3\n\nHọc cách tổ chức, không sao chép máy móc — spec của bạn có thể khác hoàn toàn.\n\n${files.join("\n\n")}\n`;
}

/** Chuẩn hóa đường dẫn model gửi lên; null nếu thoát ra ngoài thư mục app. */
function resolveInside(appDir: string, rel: string): string | null {
  const target = path.resolve(appDir, rel);
  const relative = path.relative(appDir, target);
  if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) return null;
  if (relative.split(path.sep).some((p) => HIDDEN.has(p))) return null;
  return target;
}

function toPosix(p: string): string {
  return p.split(path.sep).join("/");
}

function makeTools(appDir: string, allowed: Set<string>, onProgress: (m: string) => void) {
  const listFiles = betaZodTool({
    name: "list_files",
    description: "Liệt kê file trong một thư mục của app (đệ quy, bỏ node_modules/.next).",
    inputSchema: z.object({ dir: z.string().describe('Đường dẫn tương đối, ví dụ "src"') }),
    run: async ({ dir }) => {
      const root = resolveInside(appDir, dir);
      if (!root || !fs.existsSync(root)) return "Thư mục không tồn tại hoặc không được phép.";
      const out: string[] = [];
      const walk = (d: string) => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          if (HIDDEN.has(e.name)) continue;
          const p = path.join(d, e.name);
          if (e.isDirectory()) walk(p);
          else out.push(toPosix(path.relative(appDir, p)));
        }
      };
      walk(root);
      return out.join("\n");
    },
  });

  const readFile = betaZodTool({
    name: "read_file",
    description: "Đọc nội dung một file trong app.",
    inputSchema: z.object({ path: z.string() }),
    run: async ({ path: rel }) => {
      const p = resolveInside(appDir, rel);
      if (!p || !fs.existsSync(p)) return "File không tồn tại hoặc không được phép.";
      return fs.readFileSync(p, "utf8");
    },
  });

  const writeFile = betaZodTool({
    name: "write_file",
    description: "Ghi toàn bộ nội dung một file. Chỉ được ghi các file trong danh sách cho phép.",
    inputSchema: z.object({ path: z.string(), contents: z.string() }),
    run: async ({ path: rel, contents }) => {
      const p = resolveInside(appDir, rel);
      const key = p ? toPosix(path.relative(appDir, p)) : rel;
      if (!p || !allowed.has(key))
        return `Không được phép ghi "${rel}". Danh sách cho phép:\n${[...allowed].join("\n")}`;
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, contents);
      onProgress(`  ✎ ${key}`);
      return `Đã ghi ${key} (${contents.length} ký tự).`;
    },
  });

  const check = betaZodTool({
    name: "run_check",
    description:
      'Chạy kiểm tra: "test" (node --test cho rules) hoặc "typecheck" (next typegen + tsc). Trả về kết quả và log.',
    inputSchema: z.object({ check: z.enum(["test", "typecheck"]) }),
    run: async ({ check }) => {
      onProgress(`  ▶ ${check}...`);
      const r = runCheck(appDir, check);
      onProgress(`  ${r.ok ? "✓" : "✗"} ${check} (${r.seconds}s)`);
      return `${r.ok ? "PASS" : "FAIL"}\n${r.log}`;
    },
  });

  return [listFiles, readFile, writeFile, check];
}

export interface CodegenInput {
  spec: AppSpec;
  appDir: string;
  /** Kết quả kiểm tra lỗi từ vòng trước (chế độ sửa lỗi) */
  failures?: CheckResult[];
  onProgress: (m: string) => void;
}

export async function runCodegen({ spec, appDir, failures, onProgress }: CodegenInput): Promise<string> {
  const allowed = new Set(llmOwnedFiles(spec));
  const { model, effort } = STAGE_CONFIG.codegen;

  const stubs = [...allowed]
    .map((rel) => `### ${rel}\n\`\`\`tsx\n${fs.readFileSync(path.join(appDir, rel), "utf8")}\n\`\`\``)
    .join("\n\n");

  const task = failures?.length
    ? "## Chế độ sửa lỗi\nVerifier báo lỗi dưới đây. Đọc lại file liên quan, sửa, chạy lại kiểm tra cho tới khi pass.\n\n" +
      failures.filter((f) => !f.ok).map((f) => `### ${f.check} — FAIL\n\`\`\`\n${f.log}\n\`\`\``).join("\n\n")
    : "## Nhiệm vụ\nViết đầy đủ các file được phép ghi để app hoàn chỉnh theo spec. Sau đó chạy `test` và `typecheck` cho tới khi pass.";

  const userContent = [
    `## AppSpec\n\`\`\`json\n${JSON.stringify(spec, null, 2)}\n\`\`\``,
    `## File được phép ghi (nội dung hiện tại)\n${stubs}`,
    `## File chỉ đọc quan trọng\nsrc/lib/store.ts, src/lib/spec.ts, src/lib/rules.test.ts, src/app/globals.css — đọc bằng read_file nếu cần.`,
    task,
  ].join("\n\n");

  const runner = client.beta.messages.toolRunner({
    model,
    max_tokens: 16000,
    betas: BETAS,
    fallbacks: "default",
    max_iterations: LIMITS.codegenIterations,
    output_config: { effort },
    system: [{ type: "text", text: codegenSystem(), cache_control: { type: "ephemeral" } }],
    tools: makeTools(appDir, allowed, onProgress),
    messages: [{ role: "user", content: userContent }],
  });

  for await (const message of runner) {
    recordUsage("codegen", message);
    for (const b of message.content) {
      if (b.type === "text" && b.text.trim()) onProgress(`  💬 ${b.text.trim().split("\n")[0].slice(0, 160)}`);
    }
    if (message.stop_reason === "refusal") throw new StageError("Codegen: Claude từ chối yêu cầu.");
  }
  const final = await runner.done();
  return final.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
}
