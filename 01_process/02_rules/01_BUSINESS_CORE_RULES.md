# 🏛️ Quy Tắc 01: Đạo Đức Nghiệp Vụ & Bảo Vệ Người Dùng (Business Core Rules)

> **Phạm vi áp dụng:** Bắt buộc tuân thủ ở mọi giai đoạn: Lên giải pháp (Solution Spec), Thiết kế giao diện (UI/UX) và Xây dựng tính năng.

---

## 1. Nguyên Tắc Bảo Vệ Tâm Lý & Danh Dự Người Dùng (User Dignity Protection)
1. **Tuyệt đối không bêu tên hay công khai số liệu tiêu cực:**
   - Trong môi trường giáo dục/lớp học: Điểm rèn luyện có thể âm trong logic nội bộ để cảnh báo giáo viên, nhưng trên giao diện báo cáo chung hoặc gửi phụ huynh **phải hiển thị trạng thái `N/A`** hoặc chuyển thành *"Mục tiêu cần rèn luyện"*.
   - Trong các hệ thống đánh giá khác: Không xếp hạng từ dưới lên (Wall of Shame), không gán nhãn miệt thị đối tượng sử dụng.
2. **Khích lệ sự tiến bộ cá nhân thay vì so sánh ganh đua:**
   - So sánh đối tượng với chính họ ở kỳ trước để ghi nhận sự cải thiện, thay vì tạo bảng xếp hạng công khai gây áp lực và mặc cảm.
3. **Tuân thủ quy định chuẩn của ngành:**
   - Với giáo dục tiểu học: Bắt buộc tuân thủ **Thông tư 27/2020/TT-BGDĐT** (đánh giá bằng nhận xét, khen ngợi sự nỗ lực, tôn trọng sự khác biệt cá nhân).
   - Với các ngành nghề khác: Tuân thủ quy tắc ứng xử nội bộ và chuẩn mực văn hóa tổ chức.

---

## 2. Tính Minh Bạch & Khả Năng Giải Trình (Transparency & Auditability)
1. **Mọi con số đều phải có căn cứ (Proof & Evidence):**
   - Không có điểm số hoặc kết quả đánh giá nào được sinh ra từ hư không. Mọi số liệu tổng hợp phải truy vết được về các sự kiện hành vi (`BehaviorEvent` / `Transaction`) cụ thể kèm thời gian và người ghi nhận.
2. **Quyền khiếu nại và điều chỉnh:**
   - Hệ thống phải cho phép giáo viên/người quản lý chỉnh sửa hoặc vô hiệu hóa các bản ghi sai sót và ghi lại lý do điều chỉnh (`Audit Log`).
