/**
 * Đọc AppSpec (src/spec.json) — app được "điều khiển bởi spec":
 * menu, bảng CRUD, form, trợ lý AI, quy tắc đều sinh từ file này.
 */
import specJson from "@/spec.json";

export type FieldType = "string" | "text" | "int" | "number" | "boolean" | "date" | "enum" | "ref";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  enum_values: string[];
  ref: string | null;
}

export interface EntityDef {
  name: string;
  label: string;
  description: string;
  fields: FieldDef[];
}

export interface RuleDef {
  id: string;
  title: string;
  description: string;
  kind: "formula" | "constraint" | "policy";
  function_name: string | null;
  signature: string | null;
  status: "CONFIRMED" | "PENDING";
}

export interface ScreenDef {
  id: string;
  title: string;
  purpose: string;
  kind: "dashboard" | "entity_list" | "custom" | "ai_assistant" | "rules_settings";
  entity: string | null;
  uses_entities: string[];
  uses_rules: string[];
  uses_ai_tasks: string[];
}

export interface AiTaskDef {
  id: string;
  title: string;
  purpose: string;
  subject_entity: string;
  context_entities: string[];
  tones: string[];
  requires_approval: boolean;
}

export interface AppSpecLite {
  meta: { name: string; slug: string; summary: string };
  entities: EntityDef[];
  rules: RuleDef[];
  screens: ScreenDef[];
  ai_tasks: AiTaskDef[];
}

export const spec = specJson as unknown as AppSpecLite;

export function entityDef(name: string): EntityDef {
  const e = spec.entities.find((x) => x.name === name);
  if (!e) throw new Error(`Không có entity ${name}`);
  return e;
}

export function screenDef(id: string): ScreenDef | undefined {
  return spec.screens.find((s) => s.id === id);
}

/** Trường dùng để hiển thị tên một bản ghi. */
const LABEL_FIELDS = ["displayName", "name", "title", "label", "code"];

export function rowLabel(entity: EntityDef, row: Record<string, unknown>): string {
  for (const f of LABEL_FIELDS) {
    if (entity.fields.some((x) => x.name === f) && row[f] != null && row[f] !== "") return String(row[f]);
  }
  const firstString = entity.fields.find((f) => f.type === "string");
  if (firstString && row[firstString.name] != null) return String(row[firstString.name]);
  return String(row.id);
}

/** Những tên trường có thể là thông tin định danh — không bao giờ gửi tới LLM. */
export const PII_HINTS = ["phone", "address", "email", "cccd", "cmnd", "birth", "dob", "parentname", "fullname"];
export function isPiiField(name: string): boolean {
  const n = name.toLowerCase();
  return PII_HINTS.some((h) => n.includes(h));
}
