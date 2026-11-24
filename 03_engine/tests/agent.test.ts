/**
 * Test không gọi LLM: linter, generator, chuyển đổi JSON Schema.
 *   npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { lintSpec } from "../src/spec/lint.ts";
import { AppSpec } from "../src/spec/schema.ts";
import { generateApp, llmOwnedFiles, splitSignature } from "../src/generator/index.ts";
import { strictJsonSchema } from "../src/llm.ts";

const golden = JSON.parse(fs.readFileSync(new URL("../spec/examples/classmate-2g3.json", import.meta.url), "utf8"));

test("spec mẫu ClassMate hợp lệ", () => {
  const r = lintSpec(golden);
  assert.deepEqual(r.errors, []);
});

test("linter bắt ref sai, ai_task không cần duyệt, seed tham chiếu sai", () => {
  const bad = structuredClone(golden);
  bad.entities[2].fields[0].ref = "Khong";
  bad.ai_tasks[0].requires_approval = false;
  bad.seed[2].rows_json = JSON.stringify([{ id: "x", student: "hs99", criterion: "b-01", date: "2026-09-01", status: "CONFIRMED" }]);
  const { errors } = lintSpec(bad);
  assert.ok(errors.some((e) => e.includes("ref tới entity không tồn tại")), errors.join("\n"));
  assert.ok(errors.some((e) => e.includes("requires_approval")));
  assert.ok(errors.some((e) => e.includes("hs99")));
});

test("linter yêu cầu ví dụ cho rule CONFIRMED", () => {
  const bad = structuredClone(golden);
  bad.rules[3].examples = [];
  assert.ok(lintSpec(bad).errors.some((e) => e.includes("R-004")));
});

test("splitSignature tách đúng tham số và kiểu trả về", () => {
  assert.deepEqual(splitSignature("(args: { total: number }) => number"), ["(args: { total: number })", "number"]);
  assert.deepEqual(
    splitSignature("(args: { xs: Array<{ a: number }> }) => { ok: boolean }"),
    ["(args: { xs: Array<{ a: number }> })", "{ ok: boolean }"],
  );
});

test("generator sinh đủ file và test từ ví dụ", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "eduagent-"));
  const spec = AppSpec.parse(golden);
  generateApp(spec, out);
  for (const rel of [...llmOwnedFiles(spec), "src/spec.json", "data/seed.json", "src/lib/rules.test.ts", "HUONG_DAN.md"])
    assert.ok(fs.existsSync(path.join(out, rel)), rel);
  const testFile = fs.readFileSync(path.join(out, "src/lib/rules.test.ts"), "utf8");
  assert.equal((testFile.match(/^test\(/gm) ?? []).length, 12);
  assert.match(fs.readFileSync(path.join(out, "package.json"), "utf8"), /"name": "classmate-2g3"/);
  fs.rmSync(out, { recursive: true, force: true });
});

test("generator giữ file LLM đã viết khi sinh lại", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "eduagent-"));
  const spec = AppSpec.parse(golden);
  generateApp(spec, out);
  fs.writeFileSync(path.join(out, "src/lib/rules.ts"), "// đã viết\n");
  generateApp(spec, out, { keepLlmFiles: true });
  assert.equal(fs.readFileSync(path.join(out, "src/lib/rules.ts"), "utf8"), "// đã viết\n");
  fs.rmSync(out, { recursive: true, force: true });
});

test("JSON Schema cho structured outputs: object chặt, mọi khóa required", () => {
  const js = strictJsonSchema(AppSpec) as { additionalProperties: boolean; required: string[]; properties: Record<string, unknown> };
  assert.equal(js.additionalProperties, false);
  assert.deepEqual(js.required.sort(), Object.keys(js.properties).sort());
  assert.ok(!("$schema" in js));
});
