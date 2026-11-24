# 🏷️ Checklist 03: Nghiệm Thu Tiêu Chuẩn Mã Nguồn & Hằng Số (Standards & Constants Checklist)

> **Mục tiêu:** Rà soát tính nhất quán của hệ thống Enums, Phân quyền Roles và Danh mục Mã lỗi/Thông điệp thuộc thư mục `03_standards_constants/`.

---

## 1. Thiết Kế Enums & Trạng Thái (Enums Registry)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | Tên Enum và Khóa (Key) đặt theo chuẩn `UPPER_SNAKE_CASE` (ví dụ: `ACTIVE`, `SYS_ADMIN`). | [ ] Đạt / [ ] Chưa |  |
| **1.2** | Sử dụng String Enums (chuỗi có nghĩa), tuyệt đối không dùng Integer Enums số nguyên. | [ ] Đạt / [ ] Chưa |  |
| **1.3** | Trạng thái bản ghi (`RecordStatus`) có đủ 4 trạng thái vòng đời: `ACTIVE`, `INACTIVE`, `ARCHIVED`, `DELETED`. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | Phân quyền vai trò (`UserRoles`) định nghĩa rõ cấp bậc thứ bậc (`Hierarchy Level`). | [ ] Đạt / [ ] Chưa |  |
| **1.5** | Trạng thái duyệt AI (`AIApprovalStatus`) có đủ 3 bước: `DRAFT`, `APPROVED`, `REJECTED`. | [ ] Đạt / [ ] Chưa |  |
| **1.6** | Mức độ cảnh báo kiểm toán (`AuditSeverity`) có đủ 3 mức: `BLOCKING`, `WARNING`, `INFO`. | [ ] Đạt / [ ] Chưa |  |
| **1.7** | Mọi giá trị Enum đều có Nhãn hiển thị tiếng Việt (`Label`) và Màu sắc UI (`Badge Color`). | [ ] Đạt / [ ] Chưa |  |

---

## 2. Hệ Thống Mã Lỗi & Thông Điệp (Messages & Error Codes)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | Mã lỗi tuân thủ quy ước chuẩn: `<MODULE>_<HTTP_STATUS>_<SPECIFIC_CODE>`. | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Có danh mục thông báo thành công chuẩn (`SUCCESS_CREATE`, `SUCCESS_UPDATE`, `SUCCESS_DELETE`). | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Các lỗi validation (422) nêu rõ trường bị lỗi và hướng dẫn khắc phục cụ thể cho người dùng. | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Câu chữ thông báo mang tính chuyên nghiệp, tích cực, không gây hoang mang cho người dùng. | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Có file mẫu định nghĩa tập trung (Boilerplate) cho TypeScript hoặc Python, không hardcode chuỗi rải rác. | [ ] Đạt / [ ] Chưa |  |
