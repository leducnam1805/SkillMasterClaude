/**
 * Kho dữ liệu cục bộ dạng file JSON (data/db.json), khởi tạo từ data/seed.json.
 * Đủ cho 1 giáo viên / 1 lớp, chạy offline, không cần cài CSDL.
 *
 * Nguyên tắc (rút từ AI-ClassMate-2G3):
 *  - Ô trống ≠ 0: chuỗi rỗng được lưu là "không có giá trị", không tự gán 0.
 *  - Không ghi đè im lặng: mọi thay đổi ghi vào audit (trước/sau, lý do).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { entityDef, spec, type EntityDef } from "./spec";
import { beforeCreate, beforeUpdate } from "./hooks";

export type Row = Record<string, unknown> & { id: string; createdAt: string; updatedAt: string };

export interface AuditEntry {
  at: string;
  actor: string;
  action: "create" | "update" | "delete" | "rule_status" | "draft_create" | "draft_update";
  target: string;
  before: unknown;
  after: unknown;
  reason: string | null;
}

export interface Draft {
  id: string;
  taskId: string;
  subjectId: string;
  tone: string;
  text: string;
  status: "DRAFT" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

interface Db {
  collections: Record<string, Row[]>;
  audit: AuditEntry[];
  ruleStatus: Record<string, "CONFIRMED" | "PENDING">;
  drafts: Draft[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SEED_FILE = path.join(DATA_DIR, "seed.json");

export class ValidationError extends Error {}

function now(): string {
  return new Date().toISOString();
}

function load(): Db {
  if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, "utf8")) as Db;
  const seed: Record<string, Record<string, unknown>[]> = fs.existsSync(SEED_FILE)
    ? JSON.parse(fs.readFileSync(SEED_FILE, "utf8"))
    : {};
  const t = now();
  const db: Db = { collections: {}, audit: [], ruleStatus: {}, drafts: [] };
  for (const e of spec.entities) {
    db.collections[e.name] = (seed[e.name] ?? []).map((r) => ({
      ...r,
      id: String(r.id ?? crypto.randomUUID()),
      createdAt: t,
      updatedAt: t,
    }));
  }
  save(db);
  return db;
}

function save(db: Db): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

/** Chuẩn hóa & kiểm tra dữ liệu theo định nghĩa field trong spec. */
export function normalize(entity: EntityDef, input: Record<string, unknown>, partial: boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const db = load();
  for (const f of entity.fields) {
    if (!(f.name in input)) {
      if (!partial && f.required) throw new ValidationError(`Thiếu "${f.label}"`);
      continue;
    }
    let v = input[f.name];
    if (v === "" || v === undefined) v = null; // ô trống ≠ 0
    if (v === null) {
      if (f.required) throw new ValidationError(`"${f.label}" không được để trống`);
      out[f.name] = null;
      continue;
    }
    switch (f.type) {
      case "int":
      case "number": {
        const n = Number(v);
        if (!Number.isFinite(n) || (f.type === "int" && !Number.isInteger(n)))
          throw new ValidationError(`"${f.label}" phải là số${f.type === "int" ? " nguyên" : ""}`);
        v = n;
        break;
      }
      case "boolean":
        v = v === true || v === "true" || v === "on" || v === 1;
        break;
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v))) throw new ValidationError(`"${f.label}" phải có dạng YYYY-MM-DD`);
        v = String(v);
        break;
      case "enum":
        if (!f.enum_values.includes(String(v)))
          throw new ValidationError(`"${f.label}" phải là một trong: ${f.enum_values.join(", ")}`);
        v = String(v);
        break;
      case "ref":
        if (!(db.collections[f.ref!] ?? []).some((r) => r.id === String(v)))
          throw new ValidationError(`"${f.label}" tham chiếu bản ghi không tồn tại`);
        v = String(v);
        break;
      default:
        v = String(v);
    }
    out[f.name] = v;
  }
  return out;
}

/** Ngữ cảnh cho hooks: quy tắc PENDING không được tự động áp dụng để chặn thao tác. */
function hookContext() {
  const status = ruleStatuses();
  return { ruleStatus: (id: string) => status[id] ?? "PENDING" };
}

export function list(entity: string): Row[] {
  return load().collections[entity] ?? [];
}

export function get(entity: string, id: string): Row | undefined {
  return list(entity).find((r) => r.id === id);
}

export function create(entity: string, input: Record<string, unknown>, actor = "teacher"): Row {
  const def = entityDef(entity);
  const data = normalize(def, input, false);
  const db = load();
  const existing = db.collections[entity] ?? [];
  const problem = beforeCreate(entity, data, existing, hookContext());
  if (problem) throw new ValidationError(problem);
  const t = now();
  const row: Row = { ...data, id: crypto.randomUUID(), createdAt: t, updatedAt: t };
  db.collections[entity] = [...existing, row];
  db.audit.push({ at: t, actor, action: "create", target: `${entity}/${row.id}`, before: null, after: row, reason: null });
  save(db);
  return row;
}

export function update(entity: string, id: string, patch: Record<string, unknown>, actor = "teacher", reason: string | null = null): Row {
  const def = entityDef(entity);
  const data = normalize(def, patch, true);
  const db = load();
  const rows = db.collections[entity] ?? [];
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) throw new ValidationError("Không tìm thấy bản ghi");
  const before = rows[idx];
  const problem = beforeUpdate(entity, before, data, rows, hookContext());
  if (problem) throw new ValidationError(problem);
  const after: Row = { ...before, ...data, updatedAt: now() };
  rows[idx] = after;
  db.audit.push({ at: after.updatedAt, actor, action: "update", target: `${entity}/${id}`, before, after, reason });
  save(db);
  return after;
}

export function remove(entity: string, id: string, actor = "teacher", reason: string | null = null): void {
  const db = load();
  const rows = db.collections[entity] ?? [];
  const before = rows.find((r) => r.id === id);
  if (!before) throw new ValidationError("Không tìm thấy bản ghi");
  // Không cho xóa nếu còn bản ghi khác tham chiếu tới
  for (const e of spec.entities) {
    for (const f of e.fields.filter((x) => x.type === "ref" && x.ref === entity)) {
      if ((db.collections[e.name] ?? []).some((r) => r[f.name] === id))
        throw new ValidationError(`Không thể xóa: còn ${e.label} tham chiếu tới bản ghi này`);
    }
  }
  db.collections[entity] = rows.filter((r) => r.id !== id);
  db.audit.push({ at: now(), actor, action: "delete", target: `${entity}/${id}`, before, after: null, reason });
  save(db);
}

export function auditLog(limit = 100): AuditEntry[] {
  return load().audit.slice(-limit).reverse();
}

// --- Trạng thái quy tắc (giáo viên xác nhận trong app)
export function ruleStatuses(): Record<string, "CONFIRMED" | "PENDING"> {
  const overrides = load().ruleStatus;
  return Object.fromEntries(spec.rules.map((r) => [r.id, overrides[r.id] ?? r.status]));
}

export function setRuleStatus(id: string, status: "CONFIRMED" | "PENDING", actor = "teacher"): void {
  const db = load();
  const before = db.ruleStatus[id] ?? spec.rules.find((r) => r.id === id)?.status ?? null;
  db.ruleStatus[id] = status;
  db.audit.push({ at: now(), actor, action: "rule_status", target: `rule/${id}`, before, after: status, reason: null });
  save(db);
}

// --- Bản nháp AI (human-in-the-loop)
export function listDrafts(): Draft[] {
  return load().drafts.slice().reverse();
}

export function addDraft(d: Omit<Draft, "id" | "createdAt" | "updatedAt" | "status">): Draft {
  const db = load();
  const t = now();
  const draft: Draft = { ...d, id: crypto.randomUUID(), status: "DRAFT", createdAt: t, updatedAt: t };
  db.drafts.push(draft);
  db.audit.push({ at: t, actor: "ai", action: "draft_create", target: `draft/${draft.id}`, before: null, after: draft, reason: null });
  save(db);
  return draft;
}

export function updateDraft(id: string, patch: { text?: string; status?: Draft["status"] }, actor = "teacher"): Draft {
  const db = load();
  const idx = db.drafts.findIndex((d) => d.id === id);
  if (idx < 0) throw new ValidationError("Không tìm thấy bản nháp");
  const before = db.drafts[idx];
  const after: Draft = { ...before, ...patch, updatedAt: now() };
  db.drafts[idx] = after;
  db.audit.push({ at: after.updatedAt, actor, action: "draft_update", target: `draft/${id}`, before, after, reason: null });
  save(db);
  return after;
}
