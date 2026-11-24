# 🚪 Cổng Nghiệm Thu Đặc Tả Kỹ Thuật (Spec Completion Gate Checklist)

> **Mục tiêu:** Đây là "chốt chặn kiểm soát chất lượng" (Quality Gate 0) quan trọng nhất.  
> **QUY TẮC CỨNG:** Phải đạt 100% tiêu chí dưới đây TRƯỚC KHI được phép chuyển từ Giai đoạn 2 (Dự thảo Đặc tả Spec) sang Giai đoạn 3 (Thiết kế Kỹ thuật chi tiết: ERD, API, Batch, Screen). Không có ngoại lệ.

---

## 🚦 Bảng Đánh Giá Tiêu Chí Nghiệm Thu (Pass / Fail Criteria)

### Phần 1: Kiểm Soát Ranh Giới AI (Zero-Assumption & Decisions)
- [ ] **1.1. Công nghệ đã được xác nhận (Tech Stack Confirmed):** Không còn bất kỳ trường công nghệ nào (Frontend, Backend, Database, Auth) ở trạng thái phỏng đoán hoặc `PENDING`. Người dùng đã chọn chính thức.
- [ ] **1.2. Ranh giới chi phí ngoại vi (External Services Confirmed):** Đã làm rõ việc có sử dụng dịch vụ đám mây trả phí (Cloud Storage, Paid LLM, SMS/Email) hay không. Không tự kích hoạt API có tính phí.
- [ ] **1.3. Mô hình lưu trữ và phân quyền (Tenancy & Roles):** Đã chốt số lượng vai trò người dùng (Roles) và cơ chế lưu trữ (Single-tenant hay Multi-tenant).

### Phần 2: Kiểm Soát Tính Toàn Vẹn Của File Spec (AppSpec Schema Integrity)
- [ ] **2.1. Cấu trúc JSON chuẩn:** File `AppSpec.json` tuân thủ đúng 100% schema mẫu, không bị lỗi cú pháp JSON.
- [ ] **2.2. Khối Thực thể (Entities):** Mọi thực thể chính đều có đầy đủ trường, kiểu dữ liệu chuẩn (`string`, `number`, `boolean`, `enum`, `ref`) và khóa ngoại (`ref`) chỉ đến đúng thực thể tồn tại.
- [ ] **2.3. Khối Quy tắc nghiệp vụ (Rules):**
  - Mọi quy tắc tính toán (`kind: formula`) đều có chữ ký hàm (`signature`) rõ ràng.
  - Mỗi quy tắc đều có ít nhất 1 cặp ví dụ kiểm thử (`examples`: `input_json` và `expected_json`) để làm căn cứ viết unit test sau này.
  - Trạng thái quy tắc đã được chuyển thành `CONFIRMED`.
- [ ] **2.4. Khối Giao diện (Screens):** Mọi màn hình định nghĩa đều có `entity` hoặc `uses_entities` hợp lệ, không có màn hình "mồ côi" không liên kết dữ liệu.
- [ ] **2.5. Khối Tác vụ AI (AI Tasks - nếu có):**
  - Tách bạch rõ ràng: AI chỉ gợi ý nội dung/lời văn (`requires_approval: true`).
  - Không giao nhiệm vụ tính toán logic nghiệp vụ cho AI.

### Phần 3: Phê Duyệt Của Con Người & Lịch Sử Phỏng Vấn (HITL Sign-off & Audit Log)
- [ ] **3.1. Hoàn tất chu trình phỏng vấn xoay vòng (Interview Loop Complete):** Toàn bộ các câu hỏi làm rõ từ `01_inputs/INTAKE_QUESTIONNAIRE.md` đã được hỏi và người dùng đã trả lời đầy đủ qua các vòng lặp.
- [ ] **3.2. Đầy đủ hồ sơ kiểm toán phỏng vấn (Interview Session Log):** Có file nhật ký phỏng vấn lưu trữ đầy đủ thông tin: Mã câu hỏi, câu hỏi, câu trả lời của user, đánh giá tác động của AI (Feasibility, Cost, Risk) và trường Spec đã cập nhật.
- [ ] **3.3. Trình bày trực quan tóm tắt:** Tóm tắt giải pháp (Problem, Solution Model, Tech Stack Confirmed, Danh sách màn hình, Bảng Q&A Summary) đã được hiển thị rõ ràng cho người dùng xem xét.
- [ ] **3.4. Xác nhận chấp thuận chính thức (User Sign-off):** Người dùng đã đưa ra phản hồi đồng ý (bấm APPROVE / ký duyệt) trước khi hệ thống chuyển sang Giai đoạn 3 (Thiết kế chi tiết).

---

## 🛑 Xử Lý Khi Có Tiêu Chí FAILED
* Nếu có bất kỳ tiêu chí nào chưa đạt: **DỪNG LẠI NGAY LẬP TỨC**.
* Agent gửi thông báo liệt kê các mục chưa đạt và hướng dẫn người dùng bổ sung thông tin qua bộ câu hỏi `01_inputs/INTAKE_QUESTIONNAIRE.md`.
