# 📖 Hướng Dẫn Sử Dụng Bộ Quy Trình Thiết Kế Phần Mềm (Process User Manual)

> Tài liệu này hướng dẫn chi tiết: **Cách sử dụng**, **Input nằm ở đâu**, **Output nằm ở đâu** và **Output bao gồm những thành phần cụ thể nào**.

---

## 🚀 1. Cách Sử Dụng Quy Trình (Step-by-Step Workflow)

Toàn bộ quy trình diễn ra theo 4 bước khép kín giữa Người dùng và AI Agent:

```
[BƯỚC 1: ĐƯA INPUT] ➔ [BƯỚC 2: VÒNG LẶP PHỎNG VẤN Q&A] ➔ [BƯỚC 3: DUYỆT SPEC] ➔ [BƯỚC 4: THIẾT KẾ & XUẤT OUTPUT]
```

### Bước 1: Người dùng đưa yêu cầu đầu vào (Input)
* Bạn cung cấp yêu cầu bài toán (bằng lời nói/văn bản chat, hoặc đặt file vào thư mục Input).

### Bước 2: Vòng lặp phỏng vấn xoay vòng (Iterative Intake Loop)
* AI đọc Checklist câu hỏi tại `01_inputs/INTAKE_QUESTIONNAIRE.md`.
* AI phát hiện các thông tin chưa rõ (Tech Stack, DB, Auth, Roles, Quy tắc tính toán).
* AI gửi cho bạn **1 - 3 câu hỏi trắc nghiệm** mỗi lượt (kèm phương án khuyến nghị).
* Bạn chọn phương án ➔ AI đánh giá (Feasibility, Cost, Risk) ➔ Cập nhật Spec ➔ Ghi vào Nhật ký phỏng vấn (`interview_session_log.json`).
* Quá trình lặp lại cho đến khi đầy đủ 100% thông tin.

### Bước 3: Người dùng ký duyệt Đặc tả (Spec Sign-off)
* AI xuất trình file tóm tắt `AppSpec.json` và bảng tổng hợp Q&A.
* Bạn kiểm tra và gõ `Duyệt` / `Approve`.

### Bước 4: AI tự động thiết kế chi tiết và xuất bộ Output
* AI áp dụng các Template tại `03_templates/` để tạo ra toàn bộ bản thiết kế chi tiết: CSDL (ERD), API, Màn hình, Quy tắc, Chuẩn Code, và Bộ Test Cases.

---

## 📥 2. Input Nằm Ở Đâu? (Input Locations & Formats)

Người dùng có thể đưa Input theo 1 trong 3 cách sau:

| Loại Input | Vị Trí Đặt File / Cách Nhập | Định Dạng Tiếp Nhận |
|---|---|---|
| **Cách 1: Nhập trực tiếp qua Chat** *(Phổ biến nhất)* | Nhập trực tiếp vào khung chat với AI | Một đoạn văn bản mô tả bài toán (~100 - 200 từ). Ví dụ: *"Tôi cần làm web quản lý kho và cảnh báo tồn..."* |
| **Cách 2: Đặt file văn bản / Spec có sẵn** | `04_workspace/inputs/` *(hoặc gửi kèm file)* | File `.json`, `.yaml`, hoặc file Markdown `.md` mô tả chức năng. |
| **Cách 3: Đặt bảng tính nghiệp vụ có sẵn** | `04_workspace/inputs/` | File Excel `.xlsx`, `.csv` chứa danh sách cột thực thể, công thức tính và dữ liệu mẫu thực tế. |

> 💡 **Khung mẫu chuẩn để điền input:** Xem tại [INPUT_SPECIFICATIONS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/01_inputs/INPUT_SPECIFICATIONS.md).

---

## 📤 3. Output Nằm Ở Đâu? (Output Locations)

Toàn bộ kết quả đầu ra thực tế của mỗi dự án/phiên làm việc sẽ được xuất xưởng tập trung vào thư mục **Workspace**:

```
D:\project\AgenticAI\SkillMaster\04_workspace\outputs\<project_slug>\
```
*(Trong đó `<project_slug>` là tên viết thường không dấu của dự án, ví dụ: `taskflow-pro`, `inventory-manager`).*

> 📌 **Lưu ý phân biệt:**
> - `01_process/05_outputs/`: Chỉ chứa tài liệu quy chuẩn `DELIVERABLE_SPEC.md` định nghĩa tiêu chuẩn nghiệm thu (Checklist nghiệm thu - SOP).
> - `04_workspace/outputs/`: Mới là nơi chứa các file sản phẩm thực tế sinh ra (Code, ERD, API, Test Cases...).

---

## 📦 4. Output Gồm Những Gì? (Detailed Deliverables)

Bộ Output hoàn chỉnh bàn giao bao gồm **4 nhóm tài liệu & sản phẩm cốt lõi**:

### 📂 NHÓM 1: Hồ Sơ Đặc Tả Đã Ký Duyệt & Lịch Sử Phỏng Vấn (Spec & Audit Trail)
1. **`AppSpec.json`**: File đặc tả cấu trúc hoàn chỉnh đã được người dùng bấm duyệt (`CONFIRMED`), chứa:
   - Bài toán, chân dung người dùng, mô hình giải pháp (`solution_model`).
   - Công nghệ đã chốt (`tech_stack`): Frontend, Backend, Database, Auth, Deployment.
   - Danh sách Thực thể (`entities`), Quy tắc nghiệp vụ (`rules`), Màn hình (`screens`), Tác vụ AI (`ai_tasks`).
2. **`interview_session_log.json`**: Bằng chứng kiểm toán lưu trọn vẹn: Toàn bộ câu hỏi AI đã hỏi, câu trả lời của bạn, đánh giá tác động 4 chiều (Khả thi, Chi phí, Rủi ro, Kỹ thuật) và ai là người ký duyệt thời điểm nào.

### 📂 NHÓM 2: Hồ Sơ Thiết Kế Kỹ Thuật Chi Tiết (Technical Design Package)
Được sinh ra theo chuẩn mẫu từ `03_templates/`:
1. **`01_DATABASE_DESIGN.md`**: Sơ đồ Mermaid ERD, từ điển dữ liệu (Data Dictionary), script khởi tạo bảng DDL (PostgreSQL/MySQL), Indexing tối ưu.
2. **`02_STANDARDS_AND_CONSTANTS.md`**:
   - `enums.ts` / `enums.py`: Toàn bộ String Enum (Roles, Trạng thái, AuditSeverity).
   - `messages.json`: Bảng mã lỗi tập trung chuẩn `ERR_<MODULE>_<CODE>` và thông điệp hiển thị an toàn.
3. **`03_INTEGRATIONS_AND_INFRA.md`**: Thiết lập kết nối Object Storage (MinIO/S3), cấu hình Provider AI, biến môi trường `.env.example`.
4. **`04_FUNCTIONAL_DESIGN_API.md`**: Thiết kế chi tiết từng Endpoint: URL, Method, Request/Response Schema, Mã lỗi, Logic xử lý Controller/Service/Repo.
5. **`05_FUNCTIONAL_DESIGN_SCREENS.md`**: Wireframe bố cục từng màn hình (Dashboard, Form, Table, AI Dialog), danh sách Component, State và API liên kết.
6. **`06_FUNCTIONAL_DESIGN_BATCH.md`** *(nếu có)*: Thiết kế tác vụ nền: xử lý chunking, distributed lock, chống chạy trùng lặp.

### 📂 NHÓM 3: Bộ Kịch Bản & File Kiểm Thử Toàn Diện (Testing Package)
Khớp 100% với mẫu chuẩn kiểm thử doanh nghiệp:
1. **`UI_FUNCTIONAL_TEST_SPEC.xlsx`** (hoặc `.md`): Bộ Test Cases màn hình 14 cột (Precondition, Step, Test Data, Expected, Priority...).
2. **`API_TEST_SPEC.xlsx`** (hoặc `.md`): Bộ Test Cases API 16 cột (Method, URL, Headers, Body, Expected Status, Expected Body...).
3. **`UNIT_TEST_SPEC.md`**: Bộ Unit Test cho 100% hàm tính toán (`formula`) với các ca kiểm thử biên (Boundary/Null/Negative).

### 📂 NHÓM 4: Báo Cáo Nghiệm Thu & Hướng Dẫn Vận Hành (Sign-off & Guidelines)
1. **`00_QUALITY_GATE_REPORT.md`**: Biên bản nghiệm thu đạt 100% các tiêu chí từ bộ 6 Quality Checklists (Spec Gate, DB, API, Standards, Infra, Coding).
2. **`USER_GUIDE.md`**: Hướng dẫn vận hành hệ thống, lệnh cài đặt, hướng dẫn các tính năng AI và phê duyệt HITL.
3. **`execution_summary.json`**: Thống kê tài nguyên, thời gian xử lý, số vòng lặp sửa lỗi và chi phí.
