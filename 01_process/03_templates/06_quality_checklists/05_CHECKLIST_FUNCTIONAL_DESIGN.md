# 🛠️ Checklist 05: Nghiệm Thu Thiết Kế Chi Tiết Chức Năng (Functional Design Checklist)

> **Mục tiêu:** Thẩm định tính đầy đủ và tính khả thi của 3 bản thiết kế chi tiết: **API**, **Tiến trình ngầm (Batch)** và **Giao diện màn hình (Screen)** thuộc thư mục `05_functional_design/`.

---

## 1. Kiểm Tra Thiết Kế API (`TEMPLATE_DESIGN_API.md`)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | Có đầy đủ ID (`API-MOD-001`), tên chức năng, Method HTTP và URI Endpoint chuẩn RESTful. | [ ] Đạt / [ ] Chưa |  |
| **1.2** | Có sơ đồ tuần tự `Sequence Diagram` thể hiện luồng từ Client ➔ Service ➔ DB. | [ ] Đạt / [ ] Chưa |  |
| **1.3** | Quy định rõ ràng phân quyền vai trò (Role-Based Access Control) cho endpoint. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | Đặc tả chi tiết Request Body / Query Params (kiểu dữ liệu, bắt buộc/không). | [ ] Đạt / [ ] Chưa |  |
| **1.5** | Response mẫu định dạng JSON chuẩn mực, không trả về dữ liệu nhạy cảm (như password hash). | [ ] Đạt / [ ] Chưa |  |
| **1.6** | Có câu lệnh **SQL thuần (Raw SQL)** tương ứng phục vụ việc lập trình Repository. | [ ] Đạt / [ ] Chưa |  |
| **1.7** | Liệt kê đầy đủ mã lỗi HTTP (`400`, `401`, `403`, `404`, `409`, `500`) và Message tương ứng. | [ ] Đạt / [ ] Chưa |  |
| **1.8** | Có bảng lịch sử phiên bản (`Revision History`). | [ ] Đạt / [ ] Chưa |  |

---

## 2. Kiểm Tra Thiết Kế Tiến Trình Ngầm (`TEMPLATE_DESIGN_BATCH.md`)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | Có ID Batch (`BAT-MOD-001`), biểu thức lịch chạy Cron (`0 0 * * *`) hoặc cơ chế trigger. | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Có lưu đồ thuật toán `Flowchart` xử lý phân luồng. | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Có cơ chế chống chạy trùng lặp (`Running Lock / Idempotency`). | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Thiết lập kích thước khối xử lý (`Chunk Size`, ví dụ: 500 bản ghi/lần) chống tràn RAM. | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Chiến lược chịu lỗi (`Fault Tolerance`): Gặp lỗi 1 bản ghi không làm đứt gánh cả lô. | [ ] Đạt / [ ] Chưa |  |
| **2.6** | Có câu lệnh SQL đọc phân trang và câu lệnh ghi log kết quả tiến trình (`batch_logs`). | [ ] Đạt / [ ] Chưa |  |
| **2.7** | Định dạng log chuẩn (`[INFO]`, `[WARN]`, `[ERROR]`, `duration_ms`) phục vụ giám sát. | [ ] Đạt / [ ] Chưa |  |

---

## 3. Kiểm Tra Thiết Kế Màn Hình (`TEMPLATE_DESIGN_SCREEN.md`)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **3.1** | Có ID màn hình (`SCR-MOD-001`), tên màn hình và Route URL rõ ràng. | [ ] Đạt / [ ] Chưa |  |
| **3.2** | Có sơ đồ bố cục Wireframe mô tả vị trí các thành phần (Header, Sidebar, Table, Buttons). | [ ] Đạt / [ ] Chưa |  |
| **3.3** | Có biểu đồ trạng thái tương tác `State Diagram` (Load ➔ Validate ➔ Submit ➔ Feedback). | [ ] Đạt / [ ] Chưa |  |
| **3.4** | Bảng chi tiết thành phần ghi rõ luật kiểm tra hợp lệ (Validation Rules) cho từng ô nhập. | [ ] Đạt / [ ] Chưa |  |
| **3.5** | Đã thiết kế đủ 3 trạng thái đặc biệt: `Loading Skeleton`, `Empty State` và `Error State`. | [ ] Đạt / [ ] Chưa |  |
| **3.6** | Khớp nối chính xác với API Backend và có câu SQL thuần chạy ngầm minh họa. | [ ] Đạt / [ ] Chưa |  |
| **3.7** | Toàn bộ câu chữ thông báo, cảnh báo (Toast, Modal, Inline Error) được định nghĩa sẵn. | [ ] Đạt / [ ] Chưa |  |

---

## 4. Tính Nhất Quán Giữa Các Chức Năng (Cross-Functional Consistency)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **4.1** | Mọi API đều có Màn hình hoặc Batch sử dụng (không có API mồ côi). | [ ] Đạt / [ ] Chưa |  |
| **4.2** | Dữ liệu hiển thị trên Màn hình khớp 100% với DTO trả về từ API. | [ ] Đạt / [ ] Chưa |  |
| **4.3** | Tên trường thống nhất: camelCase trên Screen/API, snake_case trong câu lệnh SQL thuần. | [ ] Đạt / [ ] Chưa |  |
