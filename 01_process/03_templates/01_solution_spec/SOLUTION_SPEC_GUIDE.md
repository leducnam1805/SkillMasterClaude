# 📋 Hướng Dẫn & Mẫu Đặc Tả Giải Pháp (Solution Spec Template Guide)

> **Mục tiêu:** Hướng dẫn phân tích yêu cầu từ người dùng để điền vào file mẫu chuẩn `APP_SPEC_TEMPLATE.json`, phục vụ việc sinh mã nguồn tự động ở các phase tiếp theo.

---

## 1. Quy Trình Chuyển Đổi Từ Input Người Dùng ➔ AppSpec.json

```
[INPUT NGƯỜI DÙNG]
(Mô tả tự do / Bảng tính Excel / Tài liệu SRS)
       │
       ▼
[PHÂN TÍCH 6 KHỐI CỐT LÕI]
  ├── 1. Bài toán & Mục tiêu      → meta, problem (Ai dùng? Điểm đau là gì?)
  ├── 2. Mô hình giải pháp        → solution_model (Vòng lặp giải quyết vấn đề)
  ├── 3. Dữ liệu cần quản lý      → entities (Các bảng, trường, kiểu dữ liệu)
  ├── 4. Công thức & Quy tắc cứng → rules (Hàm tính toán, điều kiện kiểm tra kèm test cases)
  ├── 5. Các màn hình nghiệp vụ   → screens (Dashboard, Danh sách CRUD, Trợ lý AI, Cài đặt)
  └── 6. Tác vụ AI hỗ trợ         → ai_tasks (Soạn văn bản, tóm tắt - bắt buộc có duyệt)
       │
       ▼
[XUẤT XƯỞNG FILE SPECS CHUẨN]
(AppSpec.json - Tuân thủ cấu trúc tại file APP_SPEC_TEMPLATE.json)
       │
       ▼
[CHUYỂN TIẾP CHO PHASE LẬP TRÌNH]
(Engine tự động nhân bản Template và sinh toàn bộ Code Web App)
```

---

## 2. Giải Thích Chi Tiết Các Trường Trong `APP_SPEC_TEMPLATE.json`

### Khối 1: `meta` & `problem`
* `name`: Tên chính thức của ứng dụng (ví dụ: `TaskFlow Pro`, `AI ClassMate`).
* `slug`: Tên viết thường không dấu nối gạch ngang (ví dụ: `taskflow-pro`). Dùng làm tên thư mục và route.
* `summary`: 1-2 câu súc tích tóm tắt giải pháp.
* `persona`: Chân dung người dùng mục tiêu.
* `pain_points`: Danh sách 2-3 khó khăn thực tế mà giải pháp này sẽ triệt tiêu.

### Khối 2: `tech_stack` (Công nghệ - BẮT BUỘC NGƯỜI DÙNG XÁC NHẬN)
> 🛑 **Lưu ý ranh giới AI:** AI tuyệt đối không được tự ý chọn các giá trị này. Phải phỏng vấn người dùng theo `01_inputs/INTAKE_QUESTIONNAIRE.md`.
* `frontend`: Nền tảng giao diện (ví dụ: `Next.js 15+ App Router`, `React 19 + Vite`).
* `backend`: Nền tảng máy chủ & API (ví dụ: `FastAPI (Python 3.11+)`, `NestJS`).
* `database`: Hệ quản trị CSDL (ví dụ: `PostgreSQL 16+`, `MySQL 8.0`).
* `auth`: Cơ chế xác thực & phiên (ví dụ: `JWT Access/Refresh + HttpOnly Cookie`).
* `deployment`: Môi trường triển khai (ví dụ: `Docker Compose`).
* `external_services`: Các dịch vụ ngoại vi bên thứ ba (lưu trữ tệp, email, LLM).
* `status`: Bắt buộc đạt `CONFIRMED` trước khi sang Phase 3.

### Khối 3: `solution_model`
* `name`: Tên mô hình giải pháp (ví dụ: `Token Economy`, `Kanban Board`, `Gamification`).
* `rationale`: Lý do chọn mô hình này.
* `loop`: Các bước của chu trình lặp nghiệp vụ (Kích hoạt ➔ Xử lý ➔ Hỗ trợ ➔ Nghiệm thu).

### Khối 3: `entities`
* Định nghĩa các thực thể dữ liệu dạng PascalCase.
* Các kiểu dữ liệu (`type`):
  - `string`: Chuỗi ngắn (dưới 255 ký tự).
  - `text`: Đoạn văn bản dài.
  - `int` / `number`: Số nguyên hoặc số thập phân.
  - `boolean`: Đúng / Sai (`true` / `false`).
  - `date`: Ngày tháng.
  - `enum`: Kiểu liệt kê (bắt buộc điền các giá trị vào `enum_values`).
  - `ref`: Khóa ngoại tham chiếu đến Entity khác (điền tên Entity vào `ref`).

### Khối 4: `rules` (Quy tắc & Kiểm thử)
* `id`: Mã quy tắc (`R-001`, `R-002`...).
* `kind`:
  - `formula`: Có hàm tính toán (bắt buộc có `function_name` và `signature`).
  - `constraint`: Có hàm kiểm tra tính hợp lệ (trả về boolean).
  - `policy`: Chính sách ứng xử con người (không có hàm, `function_name = null`).
* `status`: `CONFIRMED` (đã chốt) hoặc `PENDING` (chờ xác nhận).
* `examples`: Mảng các test cases mẫu (`input_json` và `expected_json`) để Engine tự động sinh Unit Test.

### Khối 5: `screens`
* Các loại màn hình (`kind`):
  - `dashboard`: Màn hình tổng quan, thẻ chỉ số KPI.
  - `entity_list`: Màn hình bảng dữ liệu CRUD (bắt buộc có trường `entity`).
  - `ai_assistant`: Màn hình Trợ lý AI duyệt nội dung.
  - `rules_settings`: Màn hình cấu hình và xác nhận các quy tắc nghiệp vụ.

### Khối 6: `ai_tasks`
* Tác vụ AI hỗ trợ con người.
* **Lưu ý quy tắc cứng:** Bắt buộc phải có `requires_approval: true` đối với mọi tác vụ đánh giá hoặc gửi thông tin ra ngoài.

---

## 3. Lệnh Kiểm Tra Tính Hợp Lệ Của Spec Sau Khi Phân Tích

Sau khi tạo xong file Spec, chạy lệnh sau để kiểm tra tự động trước khi sinh code:
```bash
npm run lint-spec -- path/to/your-app-spec.json
```
