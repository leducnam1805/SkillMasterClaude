/**
 * Prompt cho từng ai_task, và số liệu tính sẵn (bằng rules.ts) đưa vào ngữ cảnh AI.
 */
import { latestMonth, monthlySummary } from "./derived";

const SYSTEM =
  "Bạn là trợ lý của giáo viên chủ nhiệm lớp 2 (học sinh 7-8 tuổi). Viết tiếng Việt, ấm áp, tôn trọng học sinh. " +
  "Chỉ dựa trên minh chứng và số liệu được cung cấp; không bịa sự việc; không dán nhãn tiêu cực ('hư', 'kém'); " +
  "không tự tính điểm, không đề xuất hình thức kỷ luật. Gọi học sinh là 'em' kèm tên gọi. " +
  "Kết quả là bản nháp để giáo viên chỉnh sửa.";

export const taskPrompts: Record<string, { system: string; instructions: string }> = {
  default: { system: SYSTEM, instructions: "Viết ngắn gọn, chỉ trả về nội dung." },
  monthly_comment: {
    system: SYSTEM,
    instructions:
      "Viết nhận xét cuối tháng 3-4 câu (tối đa 90 từ): (1) điểm mạnh và việc tốt cụ thể em đã làm, " +
      "(2) một nội dung cần rèn luyện, diễn đạt thành mục tiêu tích cực, (3) lời động viên. " +
      "Nếu tổng điểm âm, không nhắc con số âm. Chỉ trả về đoạn nhận xét.",
  },
  support_plan: {
    system: SYSTEM,
    instructions:
      "Lập kế hoạch rèn luyện tuần tới dạng gạch đầu dòng: Mục tiêu (1-2 mục tiêu nhỏ, đo được), " +
      "Giáo viên hỗ trợ (2-3 việc cụ thể trên lớp), Cách theo dõi (ghi nhận gì, khi nào), Phối hợp gia đình (1 gợi ý). " +
      "Tối đa 120 từ.",
  },
  parent_message: {
    system: SYSTEM,
    instructions:
      "Viết tin nhắn gửi phụ huynh (tối đa 100 từ): chào hỏi, 1-2 điều tích cực cụ thể, 1 điều cần phối hợp " +
      "(nêu sự việc, không phán xét), gợi ý một việc nhỏ gia đình có thể làm, lời cảm ơn. Không nêu điểm số.",
  },
};

/** Số liệu đã tính sẵn cho học sinh trong tháng gần nhất có dữ liệu. */
export function buildFacts(taskId: string, subjectId: string): string {
  void taskId;
  const month = latestMonth();
  const row = monthlySummary(month).find((r) => r.studentId === subjectId);
  if (!row) return "";
  return [
    `Tháng: ${month}`,
    `Điểm cộng: +${row.bonus}; điểm cần rèn: ${row.penalty}`,
    row.total >= 0 ? `Tổng điểm: ${row.total}; số quà: ${row.gifts}; điểm dư: ${row.remainder}` : "Tổng điểm: chưa đạt mốc quà (đặt thành mục tiêu rèn luyện)",
  ].join("\n");
}
