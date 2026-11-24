/**
 * Spec linter — kiểm tra chéo AppSpec, thay cho bước "đối chiếu contract" thủ công
 * (AI_ClassMate_2G3_API_Contract_Reconciliation / UI_API_Contract_Audit).
 *
 * errors   → phải sửa trước khi sinh code
 * warnings → nên xem lại, không chặn
 */
import { AppSpec } from "./schema.ts";

export interface LintResult {
  errors: string[];
  warnings: string[];
}

const PII_HINTS = ["phone", "address", "email", "cccd", "cmnd", "birth", "dob", "parentname"];
const BUILTIN_FIELDS = new Set(["id", "createdAt", "updatedAt"]);

function dupes(values: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const v of values) (seen.has(v) ? out : seen).add(v);
  return [...out];
}

export function lintSpec(input: unknown): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const parsed = AppSpec.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`schema: ${issue.path.join(".") || "(root)"} — ${issue.message}`);
    }
    return { errors, warnings };
  }
  const spec = parsed.data;

  // --- Định danh & đặt tên
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.meta.slug)) {
    errors.push(`meta.slug "${spec.meta.slug}" phải là kebab-case`);
  }
  const entityNames = new Set(spec.entities.map((e) => e.name));
  const ruleIds = new Set(spec.rules.map((r) => r.id));
  const taskIds = new Set(spec.ai_tasks.map((t) => t.id));

  for (const d of dupes(spec.entities.map((e) => e.name))) errors.push(`entity trùng tên: ${d}`);
  for (const d of dupes(spec.rules.map((r) => r.id))) errors.push(`rule trùng id: ${d}`);
  for (const d of dupes(spec.screens.map((s) => s.id))) errors.push(`screen trùng id: ${d}`);
  for (const d of dupes(spec.ai_tasks.map((t) => t.id))) errors.push(`ai_task trùng id: ${d}`);
  for (const d of dupes(spec.rules.flatMap((r) => (r.function_name ? [r.function_name] : []))))
    errors.push(`rule trùng function_name: ${d}`);

  // --- Entities & fields
  for (const e of spec.entities) {
    if (!/^[A-Z][A-Za-z0-9]*$/.test(e.name)) errors.push(`entity "${e.name}" phải là PascalCase`);
    if (e.fields.length === 0) errors.push(`entity ${e.name} không có field nào`);
    for (const d of dupes(e.fields.map((f) => f.name))) errors.push(`${e.name}: field trùng tên ${d}`);
    for (const f of e.fields) {
      const where = `${e.name}.${f.name}`;
      if (BUILTIN_FIELDS.has(f.name)) errors.push(`${where}: tên field dành riêng cho hệ thống`);
      if (!/^[a-z][A-Za-z0-9]*$/.test(f.name)) errors.push(`${where}: tên field phải là camelCase`);
      if (f.type === "enum" && f.enum_values.length === 0) errors.push(`${where}: enum chưa có enum_values`);
      if (f.type === "ref" && (!f.ref || !entityNames.has(f.ref)))
        errors.push(`${where}: ref tới entity không tồn tại (${f.ref})`);
      if (f.type !== "ref" && f.ref) warnings.push(`${where}: có ref nhưng type không phải ref`);
      if (PII_HINTS.some((h) => f.name.toLowerCase().includes(h)))
        warnings.push(`${where}: có vẻ là dữ liệu định danh — không được gửi trường này tới LLM`);
    }
  }

  // --- Rules
  for (const r of spec.rules) {
    if (r.kind === "policy") {
      if (r.function_name) warnings.push(`${r.id}: policy không cần function_name`);
      continue;
    }
    if (!r.function_name || !/^[a-z][A-Za-z0-9]*$/.test(r.function_name))
      errors.push(`${r.id}: ${r.kind} cần function_name camelCase`);
    if (!r.signature) errors.push(`${r.id}: ${r.kind} cần signature`);
    if (r.status === "CONFIRMED" && r.examples.length === 0)
      errors.push(`${r.id}: rule CONFIRMED phải có ít nhất 1 ví dụ để sinh test`);
    for (const [i, ex] of r.examples.entries()) {
      for (const [k, v] of [
        ["input_json", ex.input_json],
        ["expected_json", ex.expected_json],
      ] as const) {
        try {
          JSON.parse(v);
        } catch {
          errors.push(`${r.id}.examples[${i}].${k} không phải JSON hợp lệ`);
        }
      }
    }
  }

  // --- Screens
  if (spec.screens.length === 0) errors.push("spec chưa có screen nào");
  for (const s of spec.screens) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) errors.push(`screen "${s.id}" phải là kebab-case`);
    if (s.kind === "entity_list" && (!s.entity || !entityNames.has(s.entity)))
      errors.push(`screen ${s.id}: entity_list cần entity hợp lệ (${s.entity})`);
    for (const en of s.uses_entities)
      if (!entityNames.has(en)) errors.push(`screen ${s.id}: dùng entity không tồn tại ${en}`);
    for (const rid of s.uses_rules)
      if (!ruleIds.has(rid)) errors.push(`screen ${s.id}: dùng rule không tồn tại ${rid}`);
    for (const tid of s.uses_ai_tasks)
      if (!taskIds.has(tid)) errors.push(`screen ${s.id}: dùng ai_task không tồn tại ${tid}`);
  }
  if (spec.ai_tasks.length > 0 && !spec.screens.some((s) => s.kind === "ai_assistant"))
    warnings.push("có ai_tasks nhưng chưa có screen ai_assistant");
  if (spec.rules.length > 0 && !spec.screens.some((s) => s.kind === "rules_settings"))
    warnings.push("có rules nhưng chưa có screen rules_settings để giáo viên xác nhận");

  // --- AI tasks (quy tắc cứng: human-in-the-loop)
  for (const t of spec.ai_tasks) {
    if (!t.requires_approval) errors.push(`ai_task ${t.id}: requires_approval phải là true`);
    if (!entityNames.has(t.subject_entity))
      errors.push(`ai_task ${t.id}: subject_entity không tồn tại (${t.subject_entity})`);
    for (const en of t.context_entities)
      if (!entityNames.has(en)) errors.push(`ai_task ${t.id}: context_entity không tồn tại ${en}`);
  }

  // --- Seed
  const seedIds = new Map<string, Set<string>>();
  const seedRows: { entity: string; rows: Record<string, unknown>[] }[] = [];
  for (const s of spec.seed) {
    const entity = spec.entities.find((e) => e.name === s.entity);
    if (!entity) {
      errors.push(`seed: entity không tồn tại ${s.entity}`);
      continue;
    }
    let rows: unknown;
    try {
      rows = JSON.parse(s.rows_json);
    } catch {
      errors.push(`seed ${s.entity}: rows_json không phải JSON hợp lệ`);
      continue;
    }
    if (!Array.isArray(rows)) {
      errors.push(`seed ${s.entity}: rows_json phải là mảng`);
      continue;
    }
    const ids = seedIds.get(s.entity) ?? new Set<string>();
    const fieldNames = new Set(entity.fields.map((f) => f.name));
    rows.forEach((row, i) => {
      if (typeof row !== "object" || row === null || Array.isArray(row)) {
        errors.push(`seed ${s.entity}[${i}]: phải là object`);
        return;
      }
      const rec = row as Record<string, unknown>;
      if (typeof rec.id !== "string") errors.push(`seed ${s.entity}[${i}]: thiếu "id" dạng chuỗi`);
      else ids.add(rec.id);
      for (const k of Object.keys(rec))
        if (k !== "id" && !fieldNames.has(k)) errors.push(`seed ${s.entity}[${i}]: field lạ "${k}"`);
      for (const f of entity.fields)
        if (f.required && rec[f.name] === undefined)
          errors.push(`seed ${s.entity}[${i}]: thiếu field bắt buộc "${f.name}"`);
    });
    seedIds.set(s.entity, ids);
    seedRows.push({ entity: s.entity, rows: rows as Record<string, unknown>[] });
  }
  // Ref trong seed phải trỏ tới id có thật
  for (const { entity, rows } of seedRows) {
    const def = spec.entities.find((e) => e.name === entity)!;
    for (const f of def.fields.filter((x) => x.type === "ref" && x.ref)) {
      const targets = seedIds.get(f.ref!) ?? new Set<string>();
      rows.forEach((row, i) => {
        const v = row[f.name];
        if (v !== undefined && v !== null && !targets.has(String(v)))
          errors.push(`seed ${entity}[${i}].${f.name}: tham chiếu id không tồn tại "${String(v)}"`);
      });
    }
  }

  // --- Giả định chưa xác nhận
  const pending = spec.rules.filter((r) => r.status === "PENDING").length +
    spec.assumptions.filter((a) => a.status === "PENDING").length;
  if (pending > 0) warnings.push(`còn ${pending} quy tắc/giả định PENDING cần người dùng xác nhận`);

  return { errors, warnings };
}
