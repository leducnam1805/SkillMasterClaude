# 🗄️ Template Thiết Kế Cơ Sở Dữ Liệu & Thực Thể (Database & ER Design Template)

> **Mục đích:** Khung thiết kế kiến trúc lưu trữ dữ liệu (SQL Schema, ER Model, Indexes, Constraints). Sử dụng cho mọi dự án phần mềm Backend/Fullstack.

---

## 1. Biểu Đồ Quan Hệ Thực Thể (Entity Relationship Diagram - Mermaid)

```mermaid
erDiagram
    %% KHUNG QUAN HỆ MẪU:
    %% 1-N (Một - Nhiều): ||--o{
    %% 1-1 (Một - Một): ||--||
    %% N-N (Nhiều - Nhiều): }o--o{

    <PARENT_ENTITY> ||--o{ <CHILD_ENTITY> : "chứa/thuộc về (1-N)"
    <USER_ENTITY> ||--o{ <AUDIT_LOG_ENTITY> : "thực hiện hành động"
    
    <PARENT_ENTITY> {
        uuid id PK "Khóa chính"
        string code UK "Mã duy nhất"
        string name "Tên/Tiêu đề"
        string status "Trạng thái (Enum)"
        timestamp created_at "Thời gian tạo"
    }

    <CHILD_ENTITY> {
        uuid id PK "Khóa chính"
        uuid parent_id FK "Khóa ngoại tham chiếu"
        int quantity "Số lượng / Điểm"
        text note "Ghi chú mô tả"
        boolean is_active "Cờ kích hoạt"
    }
```

---

## 2. Khung Định Nghĩa Bảng Chi Tiết (Data Dictionary / Schema Table)

### Bảng: `<table_name_1>` (Tên bảng dạng snake_case số nhiều, ví dụ: `users`, `orders`)
* **Mục đích lưu trữ:** `<Mô tả bảng này chứa dữ liệu nghiệp vụ gì>`
* **Cơ chế khóa & Ràng buộc:**

| Tên Cột (Column) | Kiểu Dữ Liệu | Ràng Buộc (Constraints) | Giá Trị Mặc Định | Ghi Chú Ý Nghĩa Nghiệp Vụ |
|---|---|---|---|---|
| `id` | `UUID / BIGSERIAL` | `PRIMARY KEY` | `gen_random_uuid()` | Định danh duy nhất của bản ghi |
| `code` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | None | Mã nghiệp vụ (ví dụ: SKU-01, USR-001) |
| `name` | `VARCHAR(150)` | `NOT NULL` | None | Tên hoặc tiêu đề chính |
| `status` | `VARCHAR(30)` | `NOT NULL` | `'ACTIVE'` | Tham chiếu ENUM trạng thái |
| `metadata` | `JSONB` | `NULLABLE` | `'{}'` | Dữ liệu linh hoạt không cố định schema |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `CURRENT_TIMESTAMP` | Thời điểm tạo |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `CURRENT_TIMESTAMP` | Thời điểm cập nhật cuối |

---

## 3. Khung Tối Ưu Hóa Truy Vấn & Đánh Chỉ Mục (Index Design)

* **Chỉ mục tìm kiếm nhanh (B-Tree Index):**
  ```sql
  -- Tối ưu tìm kiếm theo mã hoặc email
  CREATE UNIQUE INDEX idx_<table_name>_code ON <table_name>(code);
  
  -- Tối ưu lọc danh sách theo trạng thái và thời gian
  CREATE INDEX idx_<table_name>_status_created ON <table_name>(status, created_at DESC);
  ```
* **Chỉ mục khóa ngoại (Foreign Key Index):**
  ```sql
  -- Chống khóa bảng và tăng tốc phép JOIN
  CREATE INDEX idx_<child_table>_parent_id ON <child_table>(parent_id);
  ```

---

## 4. Quản Lý Phiên Bản DDL (Database Migration Versioning)
Mọi thay đổi bảng phải được viết theo từng version lũy tiến:
* `V1__init_schema.sql`: Khởi tạo bảng, khóa chính, khóa ngoại.
* `V2__add_indexes.sql`: Thêm chỉ mục hiệu năng sau khi có dữ liệu.
* `V3__audit_and_triggers.sql`: Thêm trigger cập nhật `updated_at` tự động.
