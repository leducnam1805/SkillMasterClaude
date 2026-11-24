# 🧪 Bộ Tiêu Chuẩn & Kịch Bản Kiểm Thử Phần Mềm Toàn Diện (Testing Standards & Test Case Suites)

> Thư mục này định nghĩa toàn bộ Triết lý kiểm thử, Ma trận các Test Pattern bắt buộc và Khung Kịch bản kiểm thử chuẩn hóa cho cả 3 thành phần: **Giao diện màn hình (Screen)**, **API Endpoints** và **Tiến trình định kỳ (Batch)**. Bao gồm cả các file tài liệu hướng dẫn và **2 file biểu mẫu Excel thực tế** bạn đã cung cấp.

---

## 📂 Danh Mục Tài Liệu & Biểu Mẫu Kiểm Thử

| Thứ Tự | Tên Tài Liệu / Biểu Mẫu | Định Dạng | Trọng Tâm & Quy Chuẩn Áp Dụng |
|:---:|---|:---:|---|
| **01** | [01_TESTING_PHILOSOPHY_AND_PATTERNS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/01_TESTING_PHILOSOPHY_AND_PATTERNS.md) | Markdown | **Quan điểm kiểm thử & Ma trận 7 Test Patterns:**<br>• Triết lý Shift-Left & Kim tự tháp kiểm thử.<br>• Ma trận 7 Patterns: Happy Path, Giá trị biên (BVA), Phân vùng tương đương (EP), Null/Empty, Injection, Idempotency, Phân quyền Authorization. |
| **02** | [02_UI_FUNCTIONAL_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/02_UI_FUNCTIONAL_TEST_SPEC.md) | Markdown | **Kịch bản kiểm thử Giao diện Màn hình & Chức năng (UI/Functional):**<br>• Chuẩn hóa 14 cột chi tiết: ID, Name, Precondition, Steps, Test Data, Expected, Post-condition, Priority, Actual, Status, Designer, Executor.<br>• Tương ứng 1-1 với file Excel `testcase_template.xlsx`. |
| **03** | [03_API_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/03_API_TEST_SPEC.md) | Markdown | **Kịch bản kiểm thử API Endpoints:**<br>• Chuẩn hóa 16 cột đối chiếu: Method, URI, Request Headers, Request Body, Expected Status, Expected Headers/Body, Actual Status, Actual Body, Pass/Fail.<br>• Tương ứng 1-1 với file Excel `api_testcases_template.xlsx`. |
| **04** | [04_BATCH_TEST_SPEC.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/04_BATCH_TEST_SPEC.md) | Markdown | **Kịch bản kiểm thử Tiến trình định kỳ (Batch / Cron Jobs):**<br>• Kiểm tra phân khối (Chunk Size: 500 dòng), Chống chạy đè (Running Lock), Chịu lỗi từng phần (Fault Tolerance) và SQL State Verify. |
| **05** | [testcase_template.xlsx](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/testcase_template.xlsx) | Excel (.xlsx) | **File Excel Biểu Mẫu Thực Tế (Giao diện & Chức năng):**<br>• Sheet `Overall` (Project meta, Priority, Status, Timeline).<br>• Các Sheet chi tiết tính năng (`login_feature`, `search_feature`...). |
| **06** | [api_testcases_template.xlsx](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/api_testcases_template.xlsx) | Excel (.xlsx) | **File Excel Biểu Mẫu Thực Tế (API Tests):**<br>• Sheet `Overall` (Danh sách API, Method legend).<br>• Sheet `Test Cases` (16 cột Header/Body/Status/Actual Response). |

---

## 🎯 Tiêu Chuẩn Đạt Chuẩn Nghiệm Thu (Quality Gate)
1. 100% các ca kiểm thử thuộc độ ưu tiên `CRITICAL` và `HIGH` phải đạt trạng thái **`PASSED`**.
2. Kết quả kiểm thử thực tế (`ACTUAL_STATUS`, `ACTUAL_BODY`) phải khớp hoàn toàn với kết quả mong đợi (`EXPECTED_STATUS`, `EXPECTED_BODY`).
3. Mọi thao tác ghi/xóa dữ liệu phải có câu lệnh SQL thuần kiểm tra trạng thái CSDL (`DB State`).
