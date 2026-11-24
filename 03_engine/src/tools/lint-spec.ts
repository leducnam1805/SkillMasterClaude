/** CLI: npm run lint-spec -- <spec.json> */
import fs from "node:fs";
import { lintSpec } from "../spec/lint.ts";

const file = process.argv[2];
if (!file) {
  console.error("Cách dùng: npm run lint-spec -- <đường dẫn spec.json>");
  process.exit(2);
}
const { errors, warnings } = lintSpec(JSON.parse(fs.readFileSync(file, "utf8")));
for (const w of warnings) console.log(`⚠  ${w}`);
for (const e of errors) console.log(`✗  ${e}`);
console.log(errors.length === 0 ? `✓ Spec hợp lệ (${warnings.length} cảnh báo)` : `✗ ${errors.length} lỗi`);
process.exit(errors.length === 0 ? 0 : 1);
