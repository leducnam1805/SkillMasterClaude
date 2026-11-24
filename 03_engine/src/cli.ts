/**
 * CLI tương tác.
 *   npm run agent                                  # hỏi mô tả bài toán
 *   npm run agent -- "Tôi là giáo viên cấp 1..."   # truyền mô tả trực tiếp
 *   npm run agent -- --auto "..."                   # dùng mọi mặc định, không hỏi (evals)
 *   npm run agent -- --spec spec/examples/classmate-2g3.json   # sinh app từ spec có sẵn
 */
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import Anthropic from "@anthropic-ai/sdk";
import { run, type UI } from "./orchestrator.ts";

const args = process.argv.slice(2);
const auto = args.includes("--auto");
const specIdx = args.indexOf("--spec");
const specFile = specIdx >= 0 ? args[specIdx + 1] : undefined;
const promptArg = args.filter((a, i) => !a.startsWith("--") && !(specIdx >= 0 && i === specIdx + 1)).join(" ");

const rl = readline.createInterface({ input: stdin, output: stdout });

const ui: UI = {
  info: (m) => console.log(m),
  async choose(question, options, defaultIndex) {
    console.log(`\n❓ ${question}`);
    options.forEach((o, i) => console.log(`   ${i + 1}. ${o}${i === defaultIndex ? "  ★" : ""}`));
    const a = (await rl.question("   → Chọn số, hoặc gõ câu trả lời khác: ")).trim();
    if (!a) return { index: defaultIndex, text: options[defaultIndex] ?? "", explicit: false };
    const n = Number(a);
    if (Number.isInteger(n) && n >= 1 && n <= options.length) return { index: n - 1, text: options[n - 1], explicit: true };
    return { index: null, text: a, explicit: true };
  },
  ask: (q) => rl.question(`${q}\n→ `),
};

async function main() {
  let prompt = specFile ? undefined : promptArg;
  if (!specFile && !prompt) {
    console.log("Mô tả công việc/vấn đề của thầy/cô (khoảng 100 từ), Enter 2 lần để kết thúc:");
    const lines: string[] = [];
    for (;;) {
      const line = await rl.question("");
      if (!line.trim() && lines.length) break;
      lines.push(line);
    }
    prompt = lines.join("\n");
  }
  const result = await run(ui, { prompt, specFile, auto });
  process.exitCode = result.ok ? 0 : 1;
}

main()
  .catch((err) => {
    if (err instanceof Anthropic.AuthenticationError) console.error("✗ Chưa có/sai ANTHROPIC_API_KEY (hoặc chạy `ant auth login`).");
    else if (err instanceof Anthropic.RateLimitError) console.error("✗ Bị giới hạn tốc độ, thử lại sau ít phút.");
    else if (err instanceof Anthropic.APIError) console.error(`✗ Lỗi API ${err.status}: ${err.message}`);
    else console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
