/**
 * CLI: npm run verify-reference [thư mục ra]
 * Sinh app từ spec mẫu ClassMate + chép bản tham chiếu (phần "LLM viết" do người viết tay),
 * rồi chạy Verifier. Chứng minh hợp đồng template ↔ Codegen hoạt động mà không cần gọi LLM.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, RUNS_DIR } from "../config.ts";
import { AppSpec } from "../spec/schema.ts";
import { generateApp } from "../generator/index.ts";
import { verify } from "../stages/verifier.ts";

const SPEC = path.join(ROOT, "spec/examples/classmate-2g3.json");
const REF = path.join(ROOT, "spec/examples/classmate-2g3.reference");
const out = path.resolve(process.argv[2] ?? path.join(RUNS_DIR, "reference-classmate"));

function overlay(src: string, dst: string): void {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) overlay(s, d);
    else {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
}

const spec = AppSpec.parse(JSON.parse(fs.readFileSync(SPEC, "utf8")));
generateApp(spec, out);
overlay(REF, out);
console.log(`App tham chiếu: ${out}`);
const results = verify(out);
for (const r of results) {
  console.log(`${r.ok ? "✓" : "✗"} ${r.check} (${r.seconds}s)`);
  if (!r.ok) console.log(r.log);
}
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
