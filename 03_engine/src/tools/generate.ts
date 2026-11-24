/**
 * CLI: npm run generate -- <spec.json> <thư mục ra>
 * Chỉ chạy generator tất định (không gọi LLM) — dùng để kiểm tra template với một spec.
 */
import fs from "node:fs";
import { AppSpec } from "../spec/schema.ts";
import { lintSpec } from "../spec/lint.ts";
import { generateApp } from "../generator/index.ts";

const [file, out] = process.argv.slice(2);
if (!file || !out) {
  console.error("Cách dùng: npm run generate -- <spec.json> <thư mục ra>");
  process.exit(2);
}
const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const { errors } = lintSpec(raw);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
generateApp(AppSpec.parse(raw), out, { keepLlmFiles: true });
console.log(`✓ Đã sinh app khung vào ${out}`);
