# 📚 Mục Lục & Cẩm Nang Sử Dụng Bộ Template Chuẩn Hóa

> Thư mục này chứa toàn bộ các khung mẫu (Boilerplate Templates) dùng chung cho mọi dự án phần mềm, được phân chia theo 4 tầng kiến trúc chuyên biệt:

---

## 📁 1. `01_solution_spec/` (Tầng Nghiệp Vụ & Đặc Tả Giải Pháp)
* [APP_SPEC_TEMPLATE.json](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/01_solution_spec/APP_SPEC_TEMPLATE.json): Khung JSON chuẩn hóa đầu vào giải pháp (Problem, Persona, Solution Model, Entities, Rules, Screens, AI Tasks).
* [SOLUTION_SPEC_GUIDE.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/01_solution_spec/SOLUTION_SPEC_GUIDE.md): Tài liệu hướng dẫn phân tích yêu cầu từ người dùng và điền vào template spec.

---

## 📁 2. `02_database_design/` (Tầng Dữ Liệu & Lưu Trữ)
* [TEMPLATE_DATABASE_ER.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/02_database_design/TEMPLATE_DATABASE_ER.md): Khung thiết kế biểu đồ thực thể Mermaid ERD, Từ điển dữ liệu (Data Dictionary), Quy chuẩn đánh chỉ mục (Index) và Quản lý phiên bản migration DDL.

---

## 📁 3. `03_standards_constants/` (Tầng Tiêu Chuẩn Mã Nguồn & Hằng Số)
* [TEMPLATE_ENUMS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/03_standards_constants/TEMPLATE_ENUMS.md): Chuẩn hóa trạng thái vòng đời (`ACTIVE`, `INACTIVE`), phân quyền Roles (`SYS_ADMIN`, `MANAGER`, `VIEWER`), trạng thái duyệt AI (`DRAFT`, `APPROVED`) và mức độ kiểm toán (`BLOCKING`, `WARNING`). Kèm code mẫu TypeScript/Python.
* [TEMPLATE_MESSAGES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/03_standards_constants/TEMPLATE_MESSAGES.md): Chuẩn hóa mã lỗi hệ thống (`ERR_...`), danh mục câu thông báo thành công và cảnh báo nghiệp vụ. Kèm code mẫu TypeScript/Python.

---

## 📁 4. `04_integrations_infra/` (Tầng Hạ Tầng & Tích Hợp Ngoại Vi)
* [TEMPLATE_BUCKET_API_CONNECT.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/04_integrations_infra/TEMPLATE_BUCKET_API_CONNECT.md): Khung cấu hình thông số kỹ thuật Object Storage (S3/GCS/MinIO Bucket), Khóa API kết nối mô hình LLM (Anthropic/OpenAI/Gemini), dịch vụ gửi Mail/SMS và Webhook bên thứ ba.

---

## 📁 5. `05_functional_design/` (Tầng Thiết Kế Chi Tiết Chức Năng - Detail Design)
* [TEMPLATE_DESIGN_API.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/05_functional_design/TEMPLATE_DESIGN_API.md): Khung thiết kế chi tiết từng Endpoint API (ID, Tên, Overview, Purpose, Sequence Flow, Headers/Body/Params, SQL thuần, Messages, History).
* [TEMPLATE_DESIGN_BATCH.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/05_functional_design/TEMPLATE_DESIGN_BATCH.md): Khung thiết kế chi tiết tiến trình định kỳ / chạy nền (ID, Tên, Overview, Schedule Cron, Flow biểu đồ, Chunking, SQL thuần, Logs, History).
* [TEMPLATE_DESIGN_SCREEN.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/05_functional_design/TEMPLATE_DESIGN_SCREEN.md): Khung thiết kế chi tiết giao diện màn hình (ID, Tên, Route, Layout Wireframe, State Diagram, Controls & Validations, SQL thuần ngầm, UI Messages/Toasts, History).

---

## 📁 6. `06_quality_checklists/` (Bộ Checklist Đảm Bảo Chất Lượng Riêng Biệt Từng Phần)
* [01_CHECKLIST_SOLUTION_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/06_quality_checklists/01_CHECKLIST_SOLUTION_SPEC.md): Checklist nghiệm thu riêng cho phần **01. Solution Spec** (Meta, Problem, Entities, Rules, Examples, Linter).
* [02_CHECKLIST_DATABASE_DESIGN.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/06_quality_checklists/02_CHECKLIST_DATABASE_DESIGN.md): Checklist nghiệm thu riêng cho phần **02. Database Design** (Mermaid ERD, Data Dictionary, Index, Migration DDL).
* [03_CHECKLIST_STANDARDS_CONSTANTS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/06_quality_checklists/03_CHECKLIST_STANDARDS_CONSTANTS.md): Checklist nghiệm thu riêng cho phần **03. Standards & Constants** (String Enums, Roles, Mã lỗi tập trung, Message).
* [04_CHECKLIST_INTEGRATIONS_INFRA.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/06_quality_checklists/04_CHECKLIST_INTEGRATIONS_INFRA.md): Checklist nghiệm thu riêng cho phần **04. Integrations & Infra** (S3/MinIO Bucket, AI Provider API, SMTP Mail, Webhooks).
* [05_CHECKLIST_FUNCTIONAL_DESIGN.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/06_quality_checklists/05_CHECKLIST_FUNCTIONAL_DESIGN.md): Checklist nghiệm thu riêng cho phần **05. Functional Design** (Chi tiết từng API, Tiến trình Batch và Giao diện Screen).

---

## 📁 7. `07_coding_standards/` (Bộ Tiêu Chuẩn Lập Trình & Chất Lượng Mã Nguồn SonarQube)
* [01_CODING_CONVENTIONS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/01_CODING_CONVENTIONS.md): Ma trận quy ước đặt tên (Naming matrix), thụt lề 2 spaces/4 spaces, giới hạn dòng và thứ tự import chuẩn.
* [02_SONARQUBE_QUALITY_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/02_SONARQUBE_QUALITY_RULES.md): Tiêu chuẩn cổng chất lượng SonarQube (0 Vulnerabilities, 0 Blocker bugs, Duplicate < 3%, độ phức tạp chu trình ≤ 15, độ sâu lồng nhau ≤ 3 tầng, hàm ≤ 4 tham số).
* [03_CHECKSTYLE_CONFIGS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/03_CHECKSTYLE_CONFIGS.md): File cấu hình tự động `.eslintrc.json` (cấm `any`), `.prettierrc`, cấu hình Flake8/Black và Git Pre-commit Hook.
* [04_CHECKLIST_CODE_REVIEW.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/04_CHECKLIST_CODE_REVIEW.md): Bảng kiểm tra nghiệm thu mã nguồn (Code Review Checklist) khi duyệt Pull Request.

---

## 📁 8. `08_testing_standards/` (Quy Trình Kiểm Thử, Quan Điểm Patterns & Biểu Mẫu Excel Test Case)
* [01_TESTING_PHILOSOPHY_AND_PATTERNS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/01_TESTING_PHILOSOPHY_AND_PATTERNS.md): Triết lý kiểm thử Shift-Left, Kim tự tháp kiểm thử và Ma trận 7 Test Patterns (Happy Path, Boundary BVA, Equivalence EP, Null/Empty, Security Injection, Idempotency, Authorization).
* [02_UI_FUNCTIONAL_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/02_UI_FUNCTIONAL_TEST_SPEC.md): Kịch bản kiểm thử Giao diện & Chức năng chuẩn hóa 14 cột, khớp với file Excel `testcase_template.xlsx`.
* [03_API_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/03_API_TEST_SPEC.md): Kịch bản kiểm thử API chi tiết 16 cột đối chiếu Header/Body/Status/Actual, khớp với file Excel `api_testcases_template.xlsx`.
* [04_BATCH_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/04_BATCH_TEST_SPEC.md): Kịch bản kiểm thử Tiến trình Batch (phân khối 500 dòng, chống chạy đè, chịu lỗi).
* [testcase_template.xlsx](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/testcase_template.xlsx): File Excel mẫu thực tế cho kiểm thử Giao diện/Chức năng.
* [api_testcases_template.xlsx](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/api_testcases_template.xlsx): File Excel mẫu thực tế cho kiểm thử API Endpoints.






