# 🤖 Quy Tắc 02: Ứng Xử Của AI & Kiểm Duyệt Con Người (AI Ethics & HITL Rules)

> **Phạm vi áp dụng:** Áp dụng cho mọi tính năng có tích hợp Trí tuệ Nhân tạo (LLM / Generative AI / Agentic Tasks).

---

## 1. Cơ Chế Kiểm Duyệt Tối Cao Của Con Người (Human-in-the-Loop - HITL)
1. **AI chỉ tạo bản nháp (Drafts Only):**
   - Mọi nội dung do AI sinh ra (nhận xét tháng, kế hoạch giáo dục, email thông báo, báo cáo đánh giá) **bắt buộc mang trạng thái `DRAFT`**.
   - Tuyệt đối cấm AI tự động phát hành, lưu vào hồ sơ chính thức hoặc tự động gửi đi mà chưa có sự kiểm tra và bấm nút **`DUYỆT (APPROVE)`** của con người.
2. **Giao diện chỉnh sửa trực quan trước khi duyệt:**
   - Hệ thống phải cung cấp ô soạn thảo cho phép người dùng đọc, chỉnh sửa câu từ của AI trước khi xác nhận lưu chính thức.

---

## 2. Tách Biệt Tuyệt Đối Giữa "Tính Toán" Và "Viết Lời"
1. **Code thuần làm toán, AI chỉ diễn ngôn:**
   - Toàn bộ việc tính tổng điểm, cộng trừ, phát hiện vi phạm, đổi số lượng quà do **Code thuần (Deterministic Functions)** đảm nhiệm.
   - **Tuyệt đối không giao cho AI tự tính toán hay suy luận số học**, vì LLM có nguy cơ ảo giác (Hallucination) tính sai số.
2. **AI nhận dữ liệu đầu vào đã tính sẵn:**
   - Prompt truyền vào cho AI chỉ bao gồm: Tên học sinh, số liệu đã tính sẵn (ví dụ: `Tổng điểm: 25, Điểm cộng: 25, Vi phạm: 0`) và yêu cầu AI chuyển đổi số liệu đó thành lời nhận xét sư phạm giàu tính nhân văn.

---

## 3. Tông Giọng & Đạo Đức Ngôn Từ Của AI
1. **Đa dạng hóa góc nhìn sư phạm (Tones):**
   - Hệ thống phải cho phép chọn các tông giọng khác nhau: *Khích lệ ấm áp, Rèn luyện kiên nhẫn, Biểu dương gương mẫu*.
2. **Ngôn từ chuẩn mực:**
   - Cấm AI sử dụng từ ngữ mang tính tiêu cực, công kích cá nhân, dán nhãn tiêu cực (như "học sinh cá biệt", "chậm tiến"). Lời nhận xét phải hướng tới giải pháp và sự đồng hành.
