/**
 * Generator tất định (không dùng LLM): AppSpec + template → app khung chạy được.
 *
 * Sinh ra:
 *   src/spec.json, data/seed.json           — dữ liệu điều khiển app
 *   src/lib/rules.test.ts                   — test sinh từ examples của rule (LLM KHÔNG được sửa)
 *   src/components/screens/registry.ts      — bảng định tuyến màn hình custom
 *   HUONG_DAN.md                            — hướng dẫn 1 trang cho người dùng
 * và các file stub mà Codegen (LLM) sẽ viết tiếp — xem LLM_OWNED_FILES.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AppSpec, Rule, Screen } from "../spec/schema.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
export const TEMPLATE_DIR = path.resolve(here, "../../template");

/** File mà stage Codegen được phép ghi. Mọi file khác thuộc template/generator. */
export function llmOwnedFiles(spec: AppSpec): string[] {
  return [
    "src/lib/rules.ts",
    "src/lib/hooks.ts",
    "src/lib/derived.ts",
    "src/lib/ai-prompts.ts",
    ...customScreens(spec).map((s) => screenFile(s)),
  ];
}

export function customScreens(spec: AppSpec): Screen[] {
  return spec.screens.filter((s) => s.kind === "dashboard" || s.kind === "custom");
}

export function screenFile(s: Screen): string {
  return `src/components/screens/${s.id}.tsx`;
}

const SKIP = new Set(["node_modules", ".next", "db.json"]);

function copyDir(src: string, dst: string): void {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function write(root: string, rel: string, content: string): void {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

/** Tách "(args: {...}) => T" thành [params, returnType] tại "=>" ở mức ngoặc 0. */
export function splitSignature(sig: string): [string, string] {
  let depth = 0;
  for (let i = 0; i < sig.length - 1; i++) {
    const c = sig[i];
    if ("({[<".includes(c)) depth++;
    else if (")}]>".includes(c) && !(c === ">" && sig[i - 1] === "=")) depth--;
    else if (c === "=" && sig[i + 1] === ">" && depth === 0) {
      return [sig.slice(0, i).trim(), sig.slice(i + 2).trim()];
    }
  }
  throw new Error(`Chữ ký không hợp lệ: ${sig}`);
}

function codeRules(spec: AppSpec): Rule[] {
  return spec.rules.filter((r) => r.kind !== "policy" && r.function_name && r.signature);
}

function rulesStub(spec: AppSpec): string {
  const lines = [
    "/**",
    " * Quy tắc nghiệp vụ dạng hàm thuần — điểm số, quà... chỉ được tính ở đây, không bao giờ do AI.",
    " * Không import gì (để chạy được bằng `node --test`). Test: rules.test.ts (sinh từ spec).",
    " */",
    "",
  ];
  for (const r of codeRules(spec)) {
    const [params, ret] = splitSignature(r.signature!);
    lines.push(
      `/** ${r.id} — ${r.title} [${r.status}]\n * ${r.description}\n */`,
      `export function ${r.function_name}${params}: ${ret} {`,
      `  throw new Error("Chưa triển khai ${r.id}");`,
      "}",
      "",
    );
  }
  if (codeRules(spec).length === 0) lines.push("export {};", "");
  return lines.join("\n");
}

function rulesTest(spec: AppSpec): string {
  const lines = [
    "// File sinh tự động từ spec.rules[].examples — KHÔNG sửa tay. Sửa spec rồi sinh lại.",
    'import { test } from "node:test";',
    'import assert from "node:assert/strict";',
    'import * as rules from "./rules.ts";',
    "",
  ];
  let n = 0;
  for (const r of codeRules(spec)) {
    r.examples.forEach((ex, i) => {
      n++;
      const name = `${r.id} ${r.function_name} #${i + 1}${r.status === "PENDING" ? " (PENDING)" : ""}`;
      lines.push(
        `test(${JSON.stringify(name)}, () => {`,
        `  const input = JSON.parse(${JSON.stringify(ex.input_json)});`,
        `  const expected = JSON.parse(${JSON.stringify(ex.expected_json)});`,
        `  assert.deepEqual(rules.${r.function_name}(input), expected);`,
        "});",
        "",
      );
    });
  }
  if (n === 0) lines.push('test("chưa có ví dụ rule nào", () => {});', "");
  return lines.join("\n");
}

const HOOKS_STUB = `/**
 * Kiểm tra nghiệp vụ trước khi ghi dữ liệu (ví dụ: chống ghi trùng).
 * Trả về chuỗi lỗi tiếng Việt để chặn thao tác, hoặc null để cho phép.
 * Dùng các hàm constraint trong ./rules. Chỉ chặn khi ctx.ruleStatus(id) === "CONFIRMED".
 */
type Rec = Record<string, unknown>;
export interface HookContext {
  ruleStatus(id: string): "CONFIRMED" | "PENDING";
}

export function beforeCreate(entity: string, data: Rec, existing: Rec[], ctx: HookContext): string | null {
  void entity; void data; void existing; void ctx;
  return null;
}

export function beforeUpdate(entity: string, before: Rec, patch: Rec, existing: Rec[], ctx: HookContext): string | null {
  void entity; void before; void patch; void existing; void ctx;
  return null;
}
`;

const DERIVED_STUB = `/**
 * Các phép tổng hợp dùng chung (chỉ chạy phía server): đọc ./store, tính bằng ./rules.
 * Ví dụ: bảng tổng kết theo học sinh trong một tháng.
 */
export {};
`;

function aiPromptsStub(spec: AppSpec): string {
  const system =
    "Bạn là trợ lý của giáo viên tiểu học. Viết tiếng Việt, ấm áp, tôn trọng học sinh. " +
    "Chỉ dựa trên minh chứng được cung cấp; không bịa sự việc; không dán nhãn tiêu cực; " +
    "không tự tính điểm hay đề xuất kỷ luật. Kết quả là bản nháp để giáo viên chỉnh sửa.";
  const entries = spec.ai_tasks.map(
    (t) =>
      `  ${JSON.stringify(t.id)}: {\n    system: SYSTEM,\n    instructions: ${JSON.stringify(
        `Viết "${t.title}": ${t.purpose} Ngắn gọn (tối đa 120 từ), chỉ trả về nội dung, không tiêu đề.`,
      )},\n  },`,
  );
  return `/**
 * Prompt cho từng ai_task, và số liệu tính sẵn (bằng rules.ts) đưa vào ngữ cảnh AI.
 */
const SYSTEM = ${JSON.stringify(system)};

export const taskPrompts: Record<string, { system: string; instructions: string }> = {
  default: { system: SYSTEM, instructions: "Viết ngắn gọn, chỉ trả về nội dung." },
${entries.join("\n")}
};

/** Trả về các dòng số liệu đã tính sẵn về chủ thể (ví dụ tổng điểm, số quà), hoặc "" nếu không có. */
export function buildFacts(taskId: string, subjectId: string): string {
  void taskId; void subjectId;
  return "";
}
`;
}

function screenStub(s: Screen): string {
  const entities = JSON.stringify(s.uses_entities);
  return `import { list } from "@/lib/store";
import { entityDef } from "@/lib/spec";

/** ${s.title} — ${s.purpose} */
export default async function Screen() {
  const entities: string[] = ${entities};
  return (
    <div className="grid">
      {entities.map((name) => (
        <div className="card" key={name}>
          <div className="muted">{entityDef(name).label}</div>
          <div className="stat">{list(name).length}</div>
        </div>
      ))}
    </div>
  );
}
`;
}

function registry(spec: AppSpec): string {
  const screens = customScreens(spec);
  const imports = screens.map((s, i) => `import S${i} from "./${s.id}";`);
  const entries = screens.map((s, i) => `  ${JSON.stringify(s.id)}: S${i},`);
  return `// File sinh tự động — map id màn hình → component.
${imports.join("\n")}

export const customScreens: Record<string, () => React.ReactNode | Promise<React.ReactNode>> = {
${entries.join("\n")}
};
`;
}

export function guide(spec: AppSpec): string {
  const pendingRules = spec.rules.filter((r) => r.status === "PENDING");
  const pendingAssumptions = spec.assumptions.filter((a) => a.status === "PENDING");
  const lines = [
    `# ${spec.meta.name} — Hướng dẫn nhanh`,
    "",
    spec.meta.summary,
    "",
    "## Chạy ứng dụng",
    "",
    "```bash",
    "npm install",
    "npm run dev      # mở http://localhost:3000",
    "```",
    "",
    "Muốn dùng Trợ lý AI: tạo file `.env.local` với `ANTHROPIC_API_KEY=...`. Không có khóa, các chức năng khác vẫn chạy bình thường.",
    "",
    `## Mô hình: ${spec.solution_model.name}`,
    "",
    spec.solution_model.rationale,
    "",
    `Vòng lặp: ${spec.solution_model.loop.join(" → ")}`,
    "",
    "## Các màn hình",
    "",
    ...spec.screens.map((s) => `- **${s.title}** — ${s.purpose}`),
    "",
    "## Việc thầy/cô cần xác nhận",
    "",
  ];
  if (pendingRules.length + pendingAssumptions.length === 0) lines.push("Không có — mọi quy tắc đã được xác nhận.");
  for (const r of pendingRules) lines.push(`- [ ] **${r.id} ${r.title}**: ${r.description} (xác nhận ở màn hình Quy tắc)`);
  for (const a of pendingAssumptions) lines.push(`- [ ] **${a.id}**: ${a.text}`);
  lines.push(
    "",
    "## Nguyên tắc của ứng dụng",
    "",
    "- Điểm số, quà thưởng được tính bằng quy tắc cố định, không do AI quyết định.",
    "- Nội dung AI soạn luôn là bản nháp; thầy/cô sửa và duyệt trước khi dùng.",
    "- Mọi thay đổi dữ liệu đều được lưu vết.",
    "- Dữ liệu lưu trên máy (thư mục `data/`), chỉ tên gọi và sự việc được gửi tới AI.",
    "",
  );
  return lines.join("\n");
}

export interface GenerateOptions {
  /** Giữ nguyên các file LLM đã viết (khi sinh lại sau khi sửa spec). */
  keepLlmFiles?: boolean;
}

export function generateApp(spec: AppSpec, outDir: string, opts: GenerateOptions = {}): void {
  const owned = new Map<string, string>();
  if (opts.keepLlmFiles) {
    for (const rel of llmOwnedFiles(spec)) {
      const p = path.join(outDir, rel);
      if (fs.existsSync(p)) owned.set(rel, fs.readFileSync(p, "utf8"));
    }
  }

  copyDir(TEMPLATE_DIR, outDir);
  const pkgPath = path.join(outDir, "package.json");
  fs.writeFileSync(pkgPath, fs.readFileSync(pkgPath, "utf8").replace("__APP_SLUG__", spec.meta.slug));

  write(outDir, "src/spec.json", JSON.stringify(spec, null, 2) + "\n");
  const seed: Record<string, unknown[]> = {};
  for (const s of spec.seed) seed[s.entity] = JSON.parse(s.rows_json) as unknown[];
  write(outDir, "data/seed.json", JSON.stringify(seed, null, 2) + "\n");

  write(outDir, "src/lib/rules.ts", rulesStub(spec));
  write(outDir, "src/lib/rules.test.ts", rulesTest(spec));
  write(outDir, "src/lib/hooks.ts", HOOKS_STUB);
  write(outDir, "src/lib/derived.ts", DERIVED_STUB);
  write(outDir, "src/lib/ai-prompts.ts", aiPromptsStub(spec));
  for (const s of customScreens(spec)) write(outDir, screenFile(s), screenStub(s));
  write(outDir, "src/components/screens/registry.ts", registry(spec));
  write(outDir, "HUONG_DAN.md", guide(spec));

  for (const [rel, content] of owned) write(outDir, rel, content);
}
