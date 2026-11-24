# 📥 Quy Cách Chuẩn Hóa Tiếp Nhận Đầu Vào (Input Specifications)

> **Mục tiêu:** Định nghĩa các phương thức tiếp nhận yêu cầu từ nhiều đối tượng người dùng khác nhau (Người dùng nghiệp vụ, Kỹ sư phần mềm, Chuyên viên phân tích BA).

---

## 1. Loại 1: Mô Tả Tự Do (Freeform Problem Prompt)
* **Đối tượng:** Khách hàng, chuyên gia nghiệp vụ, người dùng cuối không có kiến thức kỹ thuật.
* **Hình thức đầu vào:** Một đoạn văn bản ngắn (~100 - 200 từ) mô tả bài toán, khó khăn thực tế và mong muốn giải quyết.
* **Cấu trúc mẫu:**
  ```text
  Tôi là [Vai trò người dùng]. Hiện tại tôi đang gặp khó khăn trong việc [Mô tả điểm đau / Vấn đề thực tế].
  Tôi cần một giải pháp phần mềm giúp tôi [Mục tiêu cần đạt được] với các tiêu chí [Ràng buộc / Yêu cầu đặc thù].
  ```
* **Quy trình xử lý:**
  1. Chuyển qua giai đoạn **Intake** (Hỏi làm rõ tối đa 5 câu trắc nghiệm).
  2. Chuyển qua **Designer** đề xuất 2-3 mô hình giải pháp.
  3. Xuất xưởng file đặc tả `AppSpec.json` gửi người dùng duyệt.

---

## 2. Loại 2: Tệp Đặc Tả Cấu Trúc (Structured Spec File - JSON/YAML)
* **Đối tượng:** Kỹ sư phần mềm, Solution Architect, Chuyên viên BA.
* **Hình thức đầu vào:** Một file đặc tả `AppSpec.json` tuân thủ đầy đủ schema hệ thống (theo mẫu `01_solution_spec/APP_SPEC_TEMPLATE.json`).
* **Quy trình xử lý:**
  1. Chạy qua bộ kiểm tra chéo (`Spec Linter`) để đảm bảo không lỗi cú pháp và quan hệ.
  2. Bỏ qua bước Intake / Designer.
  3. Đi thẳng vào giai đoạn sinh mã nguồn (Generator & Codegen).

---

## 3. Loại 3: Dữ Liệu Bảng Tính / Tài Liệu Nghiệp Vụ Có Sẵn (Tabular / Document Input)
* **Đối tượng:** Khách hàng đã có sẵn dữ liệu quản lý trên bảng tính (Excel/CSV/Google Sheets) hoặc tài liệu mô tả quy trình Word/PDF.
* **Hình thức đầu vào:** Bảng tính chứa danh sách các cột thực thể, bảng tiêu chí tính toán và dữ liệu mẫu thực tế.
* **Quy trình xử lý:**
  1. Trích xuất cấu trúc cột thành danh sách Thực thể (`Entities & Fields`).
  2. Trích xuất các công thức tính toán thành Quy tắc nghiệp vụ (`Rules & Signatures`).
  3. Trích xuất các dòng dữ liệu thành dữ liệu mồi (`Seed Data`).
