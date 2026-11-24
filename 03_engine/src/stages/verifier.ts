/** Stage ⑥ Verifier: chạy kiểm tra thật trên app sinh ra (không dùng LLM). */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export type CheckName = "install" | "test" | "typecheck" | "build";

export interface CheckResult {
  check: CheckName;
  ok: boolean;
  seconds: number;
  log: string;
}

const COMMANDS: Record<CheckName, string> = {
  install: "npm install --no-audit --no-fund",
  test: "npm test",
  typecheck: "npm run typecheck",
  build: "npm run build",
};

function tail(s: string, max = 6000): string {
  return s.length > max ? `...(cắt bớt)...\n${s.slice(-max)}` : s;
}

export function runCheck(appDir: string, check: CheckName): CheckResult {
  const start = Date.now();
  const r = spawnSync(COMMANDS[check], {
    cwd: appDir,
    shell: true,
    encoding: "utf8",
    timeout: 10 * 60 * 1000,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", FORCE_COLOR: "0" },
  });
  return {
    check,
    ok: r.status === 0,
    seconds: Math.round((Date.now() - start) / 1000),
    log: tail(`${r.stdout ?? ""}\n${r.stderr ?? ""}`.trim()),
  };
}

export function ensureInstalled(appDir: string): CheckResult | null {
  if (fs.existsSync(path.join(appDir, "node_modules", "next"))) return null;
  return runCheck(appDir, "install");
}

/** Chạy test → typecheck → build, dừng ở bước lỗi đầu tiên. */
export function verify(appDir: string): CheckResult[] {
  const results: CheckResult[] = [];
  const install = ensureInstalled(appDir);
  if (install) {
    results.push(install);
    if (!install.ok) return results;
  }
  for (const check of ["test", "typecheck", "build"] as const) {
    const r = runCheck(appDir, check);
    results.push(r);
    if (!r.ok) break;
  }
  return results;
}
