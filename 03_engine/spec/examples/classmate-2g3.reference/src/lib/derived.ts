/**
 * Các phép tổng hợp dùng chung (chỉ chạy phía server): đọc ./store, tính bằng ./rules.
 */
import { list, type Row } from "./store";
import { calcGifts, calcMonthlyTotal, calcRemainder } from "./rules";

export interface StudentMonth {
  studentId: string;
  name: string;
  group: string | null;
  bonus: number;
  penalty: number;
  total: number;
  gifts: number;
  remainder: number;
  events: { date: string; label: string; points: number; note: string | null }[];
}

/** Các tháng (YYYY-MM) có dữ liệu, mới nhất trước. */
export function monthsWithData(): string[] {
  const set = new Set(list("BehaviorEvent").map((e) => String(e.date).slice(0, 7)));
  return [...set].sort().reverse();
}

export function latestMonth(): string {
  return monthsWithData()[0] ?? new Date().toISOString().slice(0, 7);
}

/** Bảng tổng kết theo học sinh, chỉ tính sự việc CONFIRMED trong tháng (R-003, R-004, R-005). */
export function monthlySummary(month: string): StudentMonth[] {
  const criteria = new Map<string, Row>(list("Criterion").map((c) => [c.id, c]));
  const events = list("BehaviorEvent").filter((e) => e.status === "CONFIRMED" && String(e.date).startsWith(month));
  return list("Student").map((s) => {
    const mine = events.filter((e) => e.student === s.id);
    const items = mine.map((e) => {
      const c = criteria.get(String(e.criterion));
      return {
        date: String(e.date),
        label: c ? String(c.label) : "?",
        points: c ? Number(c.points) : 0,
        note: e.note ? String(e.note) : null,
      };
    });
    const points = items.map((i) => i.points);
    const total = calcMonthlyTotal({ points });
    return {
      studentId: s.id,
      name: String(s.displayName),
      group: s.group ? String(s.group) : null,
      bonus: points.filter((p) => p > 0).reduce((a, b) => a + b, 0),
      penalty: points.filter((p) => p < 0).reduce((a, b) => a + b, 0),
      total,
      gifts: calcGifts({ total }),
      remainder: calcRemainder({ total }),
      events: items,
    };
  });
}
