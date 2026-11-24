/**
 * Quy tắc nghiệp vụ dạng hàm thuần — điểm số, quà... chỉ được tính ở đây, không bao giờ do AI.
 * Không import gì (để chạy được bằng `node --test`). Test: rules.test.ts (sinh từ spec).
 */

/** R-003 — Tổng điểm tháng [CONFIRMED] */
export function calcMonthlyTotal(args: { points: number[] }): number {
  return args.points.reduce((sum, p) => sum + p, 0);
}

/** R-004 — Số quà [CONFIRMED]: mỗi 10 điểm = 1 quà; tổng < 10 (kể cả âm) thì 0. */
export function calcGifts(args: { total: number }): number {
  return args.total >= 10 ? Math.floor(args.total / 10) : 0;
}

/** R-005 — Điểm dư [CONFIRMED]: tổng ≥ 0 thì tổng mod 10, tổng âm thì 0. */
export function calcRemainder(args: { total: number }): number {
  return args.total >= 0 ? args.total % 10 : 0;
}

/** R-006 — Chống ghi trùng [PENDING]: cùng học sinh, cùng tiêu chí, cùng ngày. */
export function isDuplicateEvent(args: {
  existing: { student: string; criterion: string; date: string }[];
  candidate: { student: string; criterion: string; date: string };
}): boolean {
  const c = args.candidate;
  return args.existing.some((e) => e.student === c.student && e.criterion === c.criterion && e.date === c.date);
}
