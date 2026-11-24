/**
 * AppSpec — hợp đồng duy nhất giữa các stage của agent.
 *
 * Thay cho hàng chục file .md (SRS, API, UI...) như ở AI-ClassMate-2G3:
 * mọi thông tin thiết kế nằm trong một JSON, kiểm tra được bằng máy (xem lint.ts).
 *
 * Lưu ý thiết kế để dùng được với Structured Outputs:
 *  - không dùng record/khóa động → dùng mảng
 *  - mọi trường đều bắt buộc; "không có" thì dùng null hoặc mảng rỗng
 *  - dữ liệu tự do (seed, ví dụ test) lưu dưới dạng chuỗi JSON
 */
import { z } from "zod";

export const RuleStatus = z.enum(["CONFIRMED", "PENDING"]);

export const FieldType = z.enum([
  "string",
  "text",
  "int",
  "number",
  "boolean",
  "date",
  "enum",
  "ref",
]);

export const Field = z.object({
  name: z.string().describe("Tên kỹ thuật, camelCase, ví dụ: studentId"),
  label: z.string().describe("Nhãn tiếng Việt hiển thị trên giao diện"),
  type: FieldType,
  required: z.boolean(),
  enum_values: z.array(z.string()).describe("Chỉ dùng khi type=enum, ngược lại để []"),
  ref: z.string().nullable().describe("Tên entity được tham chiếu khi type=ref, ngược lại null"),
});

export const Entity = z.object({
  name: z.string().describe("PascalCase, ví dụ: Student"),
  label: z.string(),
  description: z.string(),
  fields: z.array(Field),
});

export const RuleExample = z.object({
  input_json: z.string().describe('Đối số của hàm dạng JSON, ví dụ: {"total":25}'),
  expected_json: z.string().describe("Giá trị trả về mong đợi dạng JSON, ví dụ: 2"),
});

export const Rule = z.object({
  id: z.string().describe("R-001, R-002..."),
  title: z.string(),
  description: z.string(),
  kind: z.enum(["formula", "constraint", "policy"]).describe(
    "formula/constraint: có hàm thuần để tính/kiểm tra; policy: nguyên tắc hành xử, không có hàm",
  ),
  function_name: z
    .string()
    .nullable()
    .describe("camelCase, ví dụ: calcGifts. Bắt buộc với formula/constraint; null với policy"),
  signature: z
    .string()
    .nullable()
    .describe("Chữ ký TypeScript, ví dụ: (args: { total: number }) => number"),
  status: RuleStatus.describe("PENDING nếu người dùng chưa xác nhận rõ ràng"),
  examples: z.array(RuleExample),
});

export const ScreenKind = z.enum([
  "dashboard",
  "entity_list",
  "custom",
  "ai_assistant",
  "rules_settings",
]);

export const Screen = z.object({
  id: z.string().describe("kebab-case, ví dụ: quick-entry"),
  title: z.string(),
  purpose: z.string(),
  kind: ScreenKind,
  entity: z.string().nullable().describe("Bắt buộc với entity_list"),
  uses_entities: z.array(z.string()),
  uses_rules: z.array(z.string()),
  uses_ai_tasks: z.array(z.string()),
});

export const AiTask = z.object({
  id: z.string().describe("snake_case, ví dụ: monthly_comment"),
  title: z.string(),
  purpose: z.string(),
  subject_entity: z.string().describe("Entity mà nội dung AI viết về, ví dụ: Student"),
  context_entities: z.array(z.string()).describe("Entity cung cấp minh chứng, ví dụ: BehaviorEvent"),
  tones: z.array(z.string()),
  requires_approval: z.boolean().describe("Luôn true với nội dung về học sinh"),
});

export const Seed = z.object({
  entity: z.string(),
  rows_json: z.string().describe('Mảng JSON các bản ghi, mỗi bản ghi có "id" (chuỗi)'),
});

export const Assumption = z.object({
  id: z.string(),
  text: z.string(),
  status: RuleStatus,
});

export const AppSpec = z.object({
  meta: z.object({
    name: z.string(),
    slug: z.string().describe("kebab-case, dùng làm tên thư mục app"),
    summary: z.string(),
  }),
  problem: z.object({
    persona: z.string(),
    goal: z.string(),
    pain_points: z.array(z.string()),
  }),
  solution_model: z.object({
    name: z.string(),
    rationale: z.string(),
    loop: z.array(z.string()).describe("Vòng lặp sư phạm, ví dụ: Ghi nhận → Phân tích → ..."),
  }),
  users: z.array(z.object({ role: z.string(), description: z.string() })),
  entities: z.array(Entity),
  rules: z.array(Rule),
  screens: z.array(Screen),
  ai_tasks: z.array(AiTask),
  seed: z.array(Seed),
  assumptions: z.array(Assumption),
  non_functional: z.array(z.string()),
});

export type AppSpec = z.infer<typeof AppSpec>;
export type Entity = z.infer<typeof Entity>;
export type Rule = z.infer<typeof Rule>;
export type Screen = z.infer<typeof Screen>;
export type AiTask = z.infer<typeof AiTask>;
