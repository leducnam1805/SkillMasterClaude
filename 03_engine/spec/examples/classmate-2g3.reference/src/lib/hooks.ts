/**
 * Kiểm tra nghiệp vụ trước khi ghi dữ liệu.
 * R-006 (chống ghi trùng) chỉ chặn khi giáo viên đã xác nhận quy tắc;
 * khi còn PENDING, vẫn cho ghi (quy tắc chỉ là gợi ý).
 */
import { isDuplicateEvent } from "./rules";

type Rec = Record<string, unknown>;
export interface HookContext {
  ruleStatus(id: string): "CONFIRMED" | "PENDING";
}

const asEvent = (r: Rec) => ({ student: String(r.student), criterion: String(r.criterion), date: String(r.date) });

export function beforeCreate(entity: string, data: Rec, existing: Rec[], ctx: HookContext): string | null {
  if (entity === "BehaviorEvent" && ctx.ruleStatus("R-006") === "CONFIRMED") {
    const active = existing.filter((e) => e.status !== "REJECTED").map(asEvent);
    if (isDuplicateEvent({ existing: active, candidate: asEvent(data) }))
      return "Sự việc này đã được ghi nhận cho học sinh trong cùng ngày (quy tắc R-006).";
  }
  return null;
}

export function beforeUpdate(entity: string, before: Rec, patch: Rec, existing: Rec[], ctx: HookContext): string | null {
  void entity; void before; void patch; void existing; void ctx;
  return null;
}
