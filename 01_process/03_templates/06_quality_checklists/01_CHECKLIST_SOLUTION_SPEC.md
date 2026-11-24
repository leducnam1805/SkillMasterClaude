# ✅ Checklist 01: Nghiệm Thu Bản Đặc Tả Giải Pháp (Solution Spec Checklist)

> **Mục tiêu:** Thẩm định tính đầy đủ, chính xác và nhất quán của tài liệu đặc tả giải pháp (`AppSpec.json` và tài liệu phân tích) thuộc thư mục `01_solution_spec/` trước khi chuyển giao.

---

## 1. Thông Tin Nhận Diện & Bài Toán Nghiệp Vụ (Meta & Problem)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | `name` chứa tên đầy đủ của ứng dụng; `slug` viết thường không dấu dạng kebab-case (ví dụ: `task-flow-app`). | [ ] Đạt / [ ] Chưa |  |
| **1.2** | `summary` mô tả ngắn gọn (1-2 câu) mục tiêu và giá trị cốt lõi giải quyết bài toán. | [ ] Đạt / [ ] Chưa |  |
| **1.3** | `persona` xác định rõ ràng đối tượng sử dụng chính của hệ thống. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | `goal` thể hiện rõ mục đích tối thượng mà người dùng cần đạt được. | [ ] Đạt / [ ] Chưa |  |
| **1.5** | `pain_points` liệt kê tối thiểu từ 2-3 điểm đau/khó khăn thực tế cần giải quyết. | [ ] Đạt / [ ] Chưa |  |
| **1.6** | `solution_model` nêu rõ tên mô hình giải pháp và lý do lựa chọn (`rationale`). | [ ] Đạt / [ ] Chưa |  |
| **1.7** | `loop` mô tả vòng lặp nghiệp vụ đầy đủ: Kích hoạt ➔ Xử lý ➔ Hỗ trợ ➔ Nghiệm thu. | [ ] Đạt / [ ] Chưa |  |

---

## 2. Mô Hình Thực Thể & Phân Quyền (Entities & Users)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | `users` định nghĩa đầy đủ các vai trò cần thiết kèm mô tả quyền hạn cụ thể. | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Tên Entity đặt theo quy ước PascalCase (`Student`, `Item`), không bị trùng lặp. | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Tên trường (`name`) đặt theo camelCase (`itemCode`, `createdDate`). | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Tất cả các trường dữ liệu đều có nhãn tiếng Việt rõ nghĩa (`label`). | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Kiểu dữ liệu (`type`) thuộc danh mục hợp lệ: `string, text, int, number, boolean, date, enum, ref`. | [ ] Đạt / [ ] Chưa |  |
| **2.6** | Nếu `type = enum`, mảng `enum_values` bắt buộc phải có giá trị cụ thể. | [ ] Đạt / [ ] Chưa |  |
| **2.7** | Nếu `type = ref`, trường `ref` phải trỏ đúng tên Entity đã được định nghĩa trong Spec. | [ ] Đạt / [ ] Chưa |  |
| **2.8** | Cờ `required` được thiết lập chính xác (tránh bắt buộc ô có thể null). | [ ] Đạt / [ ] Chưa |  |

---

## 3. Quy Tắc Nghiệp Vụ & Kiểm Thử Tự Động (Rules & Test Cases)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **3.1** | ID quy tắc có định dạng duy nhất (`R-001`, `R-002`...). | [ ] Đạt / [ ] Chưa |  |
| **3.2** | Phân loại `kind` chính xác: `formula` (có hàm tính), `constraint` (ràng buộc), `policy` (chính sách ứng xử). | [ ] Đạt / [ ] Chưa |  |
| **3.3** | Với `formula/constraint`: Có đầy đủ `function_name` camelCase và `signature` TypeScript hợp lệ. | [ ] Đạt / [ ] Chưa |  |
| **3.4** | Với `policy`: `function_name` và `signature` bắt buộc để `null`. | [ ] Đạt / [ ] Chưa |  |
| **3.5** | Trạng thái `status` phân định rõ: `CONFIRMED` (đã chốt) hoặc `PENDING` (chờ duyệt). | [ ] Đạt / [ ] Chưa |  |
| **3.6** | Các rule `CONFIRMED` có tối thiểu 2-3 `examples` (gồm cả test case chuẩn và edge cases). | [ ] Đạt / [ ] Chưa |  |
| **3.7** | `input_json` và `expected_json` trong `examples` là chuỗi JSON hợp lệ. | [ ] Đạt / [ ] Chưa |  |

---

## 4. Màn Hình, Tác Vụ AI & Kiểm Tra Bằng Máy (Screens, AI Tasks & Lint)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **4.1** | Mỗi màn hình có `id` kebab-case, `title` và `purpose` rõ ràng. | [ ] Đạt / [ ] Chưa |  |
| **4.2** | Màn hình `kind = entity_list` bắt buộc trỏ tới một Entity hợp lệ. | [ ] Đạt / [ ] Chưa |  |
| **4.3** | Các mảng `uses_entities`, `uses_rules`, `uses_ai_tasks` tham chiếu đúng ID đã khai báo. | [ ] Đạt / [ ] Chưa |  |
| **4.4** | Tác vụ AI (`ai_tasks`) đánh giá con người bắt buộc có `requires_approval = true`. | [ ] Đạt / [ ] Chưa |  |
| **4.5** | Dữ liệu `seed` trỏ đúng tên Entity và mỗi dòng bắt buộc có trường `"id"`. | [ ] Đạt / [ ] Chưa |  |
| **4.6** | Chạy công cụ `Spec Linter` đạt kết quả: **`✓ 0 lỗi, 0 cảnh báo`**. | [ ] Đạt / [ ] Chưa |  |
