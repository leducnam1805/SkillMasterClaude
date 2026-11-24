# 🗄️ Checklist 02: Nghiệm Thu Thiết Kế Cơ Sở Dữ Liệu (Database Design Checklist)

> **Mục tiêu:** Kiểm tra chất lượng và độ hoàn thiện của thiết kế CSDL (`TEMPLATE_DATABASE_ER.md`) thuộc thư mục `02_database_design/`.

---

## 1. Biểu Đồ Quan Hệ Thực Thể (Mermaid ERD)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | Biểu đồ Mermaid ERD cú pháp hợp lệ, render trực quan không lỗi. | [ ] Đạt / [ ] Chưa |  |
| **1.2** | Thể hiện đầy đủ và chính xác các mối quan hệ (1-1 `\|\|--\|\|`, 1-N `\|\|--o{`, N-N `}o--o{`). | [ ] Đạt / [ ] Chưa |  |
| **1.3** | Mọi quan hệ 1-N đều có khóa ngoại (`FK`) được đặt tên rõ ràng tại bảng con. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | Không có bảng nào bị cô lập (mọi bảng đều kết nối logic với hệ thống). | [ ] Đạt / [ ] Chưa |  |

---

## 2. Từ Điển Dữ Liệu & Quy Chuẩn Cột (Data Dictionary & Columns)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | Tên bảng đặt theo chuẩn snake_case số nhiều (ví dụ: `students`, `orders`). | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Tất cả các bảng đều có khóa chính `id` (kiểu `UUID` hoặc `BIGSERIAL`). | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Các cột thời gian hệ thống `created_at` và `updated_at` đều dùng kiểu `TIMESTAMPTZ` có mặc định `CURRENT_TIMESTAMP`. | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Kiểu dữ liệu phù hợp với độ dài dự kiến (tránh dùng bừa `TEXT` cho các trường mã ngắn như `VARCHAR(50)`). | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Các cột trạng thái có ràng buộc `NOT NULL` và có giá trị mặc định rõ ràng. | [ ] Đạt / [ ] Chưa |  |

---

## 3. Chỉ Mục Hiệu Năng & Khóa Ngoại (Indexes & Performance)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **3.1** | 100% các cột Khóa ngoại (`parent_id`, `user_id`) đều được tạo B-Tree Index. | [ ] Đạt / [ ] Chưa |  |
| **3.2** | Các cột mã nghiệp vụ (như `code`, `email`, `sku`) có chỉ mục duy nhất (`UNIQUE INDEX`). | [ ] Đạt / [ ] Chưa |  |
| **3.3** | Các bảng có lượng truy vấn lọc lớn (theo trạng thái, ngày tạo) có `Composite Index`. | [ ] Đạt / [ ] Chưa |  |
| **3.4** | Tên Index đặt theo quy ước thống nhất: `idx_<table_name>_<column_name>`. | [ ] Đạt / [ ] Chưa |  |

---

## 4. Quản Lý Phiên Bản DDL & Migration

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **4.1** | Các script DDL được phân tách theo version lũy tiến (`V1__init.sql`, `V2__indexes.sql`). | [ ] Đạt / [ ] Chưa |  |
| **4.2** | Có định nghĩa cơ chế xóa mềm (`is_deleted` hoặc `status = 'DELETED'`) nếu nghiệp vụ yêu cầu lưu vết. | [ ] Đạt / [ ] Chưa |  |
| **4.3** | Ràng buộc toàn vẹn khóa ngoại có cấu hình hành động khi xóa (`ON DELETE CASCADE` hoặc `RESTRICT`). | [ ] Đạt / [ ] Chưa |  |
