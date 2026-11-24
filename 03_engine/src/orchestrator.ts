/**
 * Orchestrator: chạy pipeline ① → ⑦, lưu mọi sản phẩm trung gian vào runs/<id>/
 * để có thể xem lại, chấm điểm (evals) hoặc chạy lại từ một bước.
 *
 * Giao tiếp với người dùng qua interface UI → CLI hôm nay, web UI sau này.
 */
import fs from "node:fs";
import path from "node:path";
import { LIMITS, RUNS_DIR } from "./config.ts";
import { usageLog } from "./llm.ts";
import { AppSpec } from "./spec/schema.ts";
import { lintSpec } from "./spec/lint.ts";
import { generateApp } from "./generator/index.ts";
import { runIntake, type Answer } from "./stages/intake.ts";
import { formatContext, runDesigner } from "./stages/designer.ts";
import { buildSpec, reviseSpec, type SpecSession } from "./stages/specBuilder.ts";
import { runCodegen } from "./stages/codegen.ts";
import { ensureInstalled, verify, type CheckResult } from "./stages/verifier.ts";

export interface UI {
  info(msg: string): void;
  /** Hỏi một câu có lựa chọn; trả về chỉ số được chọn, hoặc chuỗi người dùng tự nhập. */
  choose(question: string, options: string[], defaultIndex: number): Promise<{ index: number | null; text: string; explicit: boolean }>;
  /** Hỏi câu trả lời tự do; chuỗi rỗng = đồng ý / bỏ qua. */
  ask(question: string): Promise<string>;
}

export interface RunOptions {
  prompt?: string;
  /** Bỏ qua ①–④, sinh app trực tiếp từ một spec có sẵn */
  specFile?: string;
  /** Không hỏi người dùng: dùng mọi lựa chọn mặc định (dùng cho evals) */
  auto?: boolean;
  runDir?: string;
}

export interface RunResult {
  runDir: string;
  appDir: string | null;
  spec: AppSpec | null;
  checks: CheckResult[];
  ok: boolean;
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export function summarizeSpec(spec: AppSpec): string {
  const pending = [
    ...spec.rules.filter((r) => r.status === "PENDING").map((r) => `${r.id} ${r.title}: ${r.description}`),
    ...spec.assumptions.filter((a) => a.status === "PENDING").map((a) => `${a.id}: ${a.text}`),
  ];
  return [
    `📦 ${spec.meta.name} — ${spec.meta.summary}`,
    `🎯 Mô hình: ${spec.solution_model.name}`,
    `   Vòng lặp: ${spec.solution_model.loop.join(" → ")}`,
    "",
    "🖥  Màn hình:",
    ...spec.screens.map((s) => `   • ${s.title} — ${s.purpose}`),
    "",
    "🗂  Dữ liệu: " + spec.entities.map((e) => `${e.label} (${e.fields.map((f) => f.label).join(", ")})`).join("; "),
    "",
    "📏 Quy tắc:",
    ...spec.rules.map((r) => `   ${r.status === "PENDING" ? "⏳" : "✓"} ${r.id} ${r.title}: ${r.description}`),
    ...(spec.ai_tasks.length ? ["", "🤖 AI soạn nháp (giáo viên duyệt):", ...spec.ai_tasks.map((t) => `   • ${t.title} — ${t.purpose}`)] : []),
    ...(pending.length ? ["", `⏳ Cần thầy/cô xác nhận (${pending.length}):`, ...pending.map((p) => `   - ${p}`)] : []),
  ].join("\n");
}

export async function run(ui: UI, opts: RunOptions): Promise<RunResult> {
  const runDir = opts.runDir ?? path.join(RUNS_DIR, stamp());
  fs.mkdirSync(runDir, { recursive: true });
  const save = (name: string, data: unknown) =>
    fs.writeFileSync(path.join(runDir, name), typeof data === "string" ? data : JSON.stringify(data, null, 2));
  const started = Date.now();
  ui.info(`📁 Thư mục run: ${runDir}`);

  let spec: AppSpec;

  if (opts.specFile) {
    // ---------------------------------------------------------------- spec có sẵn
    const raw = JSON.parse(fs.readFileSync(opts.specFile, "utf8"));
    const lint = lintSpec(raw);
    if (lint.errors.length) throw new Error(`Spec không hợp lệ:\n- ${lint.errors.join("\n- ")}`);
    spec = AppSpec.parse(raw);
    save("04-spec.json", spec);
  } else {
    const prompt = opts.prompt?.trim();
    if (!prompt) throw new Error("Thiếu mô tả bài toán.");
    save("00-prompt.txt", prompt);

    // ---------------------------------------------------------------- ① Intake
    ui.info("\n① Đang tìm hiểu bài toán...");
    const brief = await runIntake(prompt);
    save("01-brief.json", brief);
    ui.info(`\n💡 ${brief.understanding}`);
    if (!brief.feasible) {
      ui.info(`\n⚠️  Chưa thể làm theo mô tả này:\n- ${brief.concerns.join("\n- ")}`);
      return { runDir, appDir: null, spec: null, checks: [], ok: false };
    }
    for (const c of brief.concerns) ui.info(`⚠️  ${c}`);

    const answers: Answer[] = [];
    if (brief.questions.length) ui.info("\nĐể làm đúng ý thầy/cô, cho tôi hỏi vài câu (Enter = chọn mặc định ★):");
    for (const q of brief.questions) {
      const r = opts.auto
        ? { index: q.default_index, text: q.options[q.default_index] ?? "", explicit: false }
        : await ui.choose(q.question, q.options, q.default_index);
      answers.push({ id: q.id, question: q.question, answer: r.text, explicit: r.explicit });
    }
    save("02-answers.json", answers);

    // ---------------------------------------------------------------- ② Designer
    ui.info("\n② Đang thiết kế giải pháp...");
    const design = await runDesigner(prompt, brief, answers);
    save("03-design.json", design);
    ui.info("");
    design.models.forEach((m, i) => {
      ui.info(`${i === design.recommended_index ? "★" : " "} ${i + 1}. ${m.name}\n     ${m.description}\n     Chức năng: ${m.features.join("; ")}`);
    });
    ui.info(`\nGợi ý: ${design.rationale}`);
    let modelIndex = design.recommended_index;
    if (!opts.auto) {
      const r = await ui.choose("Chọn mô hình", design.models.map((m) => m.name), design.recommended_index);
      if (r.index !== null) modelIndex = r.index;
      else if (r.text) answers.push({ id: "model_note", question: "Ghi chú về mô hình", answer: r.text, explicit: true });
    }
    const chosen = design.models[modelIndex];
    const context = formatContext(prompt, brief, answers);

    // ---------------------------------------------------------------- ③ Spec
    ui.info(`\n③ Đang viết đặc tả app cho mô hình "${chosen.name}"...`);
    let session: SpecSession = await buildSpec(context, chosen, ui.info);
    save("04-spec.json", session.spec);

    // ---------------------------------------------------------------- ④ Gate
    for (;;) {
      ui.info(`\n④ Bản thiết kế:\n\n${summarizeSpec(session.spec)}`);
      for (const w of session.lint.warnings) ui.info(`   ⚠ ${w}`);
      if (opts.auto) break;
      const feedback = await ui.ask("\nĐồng ý để tạo app? (Enter = đồng ý, hoặc gõ điều muốn sửa)");
      if (!feedback.trim()) break;
      ui.info("Đang cập nhật thiết kế...");
      session = await reviseSpec(session, feedback, ui.info);
      save("04-spec.json", session.spec);
    }
    spec = session.spec;
  }

  // ---------------------------------------------------------------- ⑤ Generate + Codegen + ⑥ Verify
  const appDir = path.join(runDir, "app");
  ui.info(`\n⑤ Đang dựng app khung → ${appDir}`);
  generateApp(spec, appDir);

  ui.info("   Cài thư viện (lần đầu mất 1-3 phút)...");
  installDeps(appDir, ui);
  let checks: CheckResult[] = [];
  let failures: CheckResult[] | undefined;
  for (let round = 0; round <= LIMITS.fixRounds; round++) {
    ui.info(round === 0 ? "\n⑤ Claude đang viết phần đặc thù..." : `\n🔧 Sửa lỗi vòng ${round}/${LIMITS.fixRounds}...`);
    const note = await runCodegen({ spec, appDir, failures, onProgress: ui.info });
    save(`05-codegen-${round}.md`, note);

    ui.info("\n⑥ Kiểm tra: test → typecheck → build...");
    checks = verify(appDir);
    save(`06-verify-${round}.json`, checks);
    for (const c of checks) ui.info(`   ${c.ok ? "✓" : "✗"} ${c.check} (${c.seconds}s)`);
    if (checks.every((c) => c.ok)) break;
    failures = checks;
  }
  const ok = checks.length > 0 && checks.every((c) => c.ok);

  // ---------------------------------------------------------------- ⑦ Deliver
  const usage = summarizeUsage();
  save("usage.json", { ...usage, seconds: Math.round((Date.now() - started) / 1000) });
  ui.info(
    ok
      ? `\n⑦ ✅ Hoàn tất! App ở: ${appDir}\n   cd "${appDir}" && npm run dev   → http://localhost:3000\n   Hướng dẫn: ${path.join(appDir, "HUONG_DAN.md")}`
      : `\n⑦ ⚠️  App đã sinh nhưng còn lỗi sau ${LIMITS.fixRounds} vòng sửa. Xem ${runDir}/06-verify-*.json`,
  );
  ui.info(`   Token: vào ${usage.input.toLocaleString()} · ra ${usage.output.toLocaleString()} · cache đọc ${usage.cacheRead.toLocaleString()}`);
  return { runDir, appDir, spec, checks, ok };
}

function installDeps(appDir: string, ui: UI): void {
  const r = ensureInstalled(appDir);
  if (r && !r.ok) {
    ui.info(`✗ npm install lỗi:\n${r.log}`);
    throw new Error("Không cài được thư viện cho app.");
  }
}

function summarizeUsage() {
  const sum = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, byStage: {} as Record<string, { input: number; output: number }> };
  for (const u of usageLog) {
    sum.input += u.input;
    sum.output += u.output;
    sum.cacheRead += u.cacheRead;
    sum.cacheWrite += u.cacheWrite;
    const s = (sum.byStage[u.stage] ??= { input: 0, output: 0 });
    s.input += u.input;
    s.output += u.output;
  }
  return sum;
}
