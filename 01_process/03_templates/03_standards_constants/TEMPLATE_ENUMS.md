# 🏷️ Template Định Nghĩa Kiểu Liệt Kê & Hằng Số (Enums & Constants Template)

> **Mục đích:** Khung chuẩn hóa toàn bộ các trạng thái vòng đời (Lifecycle States), phân quyền (Roles), loại hình dữ liệu (Types) dưới dạng Enums. Đảm bảo dữ liệu nhất quán giữa CSDL, Backend và Frontend.

---

## 1. Nguyên Tắc Thiết Kế Enums
1. **Quy ước đặt tên:** Chữ hoa ngăn cách bởi dấu gạch dưới (`UPPER_SNAKE_CASE`).
2. **Giá trị chuỗi (String Enums):** Luôn gán giá trị chuỗi rõ nghĩa, không dùng số nguyên tự tăng (Integer Enums) để tránh lỗi khi đọc log hoặc truy vấn DB trực tiếp.
3. **Đầy đủ 3 trạng thái tối thiểu:** Mỗi quy trình nghiệp vụ cần xác định rõ trạng thái bắt đầu (Khởi tạo/Chờ duyệt) ➔ Trạng thái xử lý (Hoạt động/Đang chạy) ➔ Trạng thái kết thúc (Hoàn tất/Bị hủy).

---

## 2. Bảng Danh Mục Enums Nghiệp Vụ Chuẩn (Universal Enums Registry)

### Enum 1: Trạng Thái Bản Ghi (Record Status)
* **Ý nghĩa:** Quản lý vòng đời dữ liệu từ lúc tạo đến lúc lưu trữ/xóa mềm.

| Khóa (Key) | Giá Trị Lưu Trữ (Value) | Nhãn Hiển Thị (Display Label) | Màu Sắc / Badge UI | Ghi Chú |
|---|---|---|---|---|
| `ACTIVE` | `"ACTIVE"` | Đang hoạt động | Xanh lá (Green) | Bản ghi sử dụng bình thường |
| `INACTIVE` | `"INACTIVE"` | Vô hiệu hóa | Xám (Gray) | Tạm khóa hoặc ngừng dùng |
| `ARCHIVED` | `"ARCHIVED"` | Đã lưu trữ | Vàng (Yellow) | Đóng băng dữ liệu lịch sử |
| `DELETED` | `"DELETED"` | Đã xóa mềm | Đỏ (Red) | Đánh dấu xóa, ẩn khỏi UI |

---

### Enum 2: Phân Quyền Người Dùng (User Roles)
* **Ý nghĩa:** Định danh các cấp bậc truy cập hệ thống theo mô hình RBAC.

| Khóa (Key) | Giá Trị (Value) | Nhãn Hiển Thị | Cấp Độ Quyền (Hierarchy Level) | Mô Tả Quyền Hạn |
|---|---|---|---|---|
| `SYS_ADMIN` | `"SYS_ADMIN"` | Quản trị tối cao | Level 1 (Cao nhất) | Toàn quyền cấu hình hệ thống, DDL, logs |
| `MANAGER` | `"MANAGER"` | Quản lý / Điều hành | Level 2 | Tạo tài khoản con, duyệt báo cáo |
| `STAFF` | `"STAFF"` | Nhân viên / Giáo viên | Level 3 | Nhập liệu, chỉnh sửa nghiệp vụ hàng ngày |
| `VIEWER` | `"VIEWER"` | Khách / Người xem | Level 4 | Chỉ đọc (Read-only), không chỉnh sửa |

---

### Enum 3: Trạng Thái Phê Duyệt Tác Vụ AI (AI Approval Status)
* **Ý nghĩa:** Bắt buộc áp dụng cho cơ chế **Human-in-the-loop**.

| Khóa (Key) | Giá Trị (Value) | Nhãn Hiển Thị | Hành Động Kế Tiếp Cho Phép |
|---|---|---|---|
| `DRAFT` | `"DRAFT"` | Bản nháp AI | Cho phép sửa lời, bấm nút Duyệt hoặc Sinh lại |
| `APPROVED` | `"APPROVED"` | Đã duyệt chính thức | Lưu vào hồ sơ chính thức, gửi đi |
| `REJECTED` | `"REJECTED"` | Đã từ chối | Không lưu, yêu cầu AI đổi góc nhìn khác |

---

### Enum 4: Mức Độ Cảnh Báo Kiểm Toán (Audit Severity)

| Khóa (Key) | Giá Trị (Value) | Ý Nghĩa Kỹ Thuật | Hành Vi Ứng Dụng |
|---|---|---|---|
| `BLOCKING` | `"BLOCKING"` | Sai phạm nghiêm trọng (lỗi logic, tính sai) | Khóa nút Lưu / Báo lỗi đỏ không cho submit |
| `WARNING` | `"WARNING"` | Lệch chuẩn, nghi ngờ bất thường | Bật cảnh báo vàng, yêu cầu xác nhận lại |
| `INFO` | `"INFO"` | Gợi ý cải tiến | Hiển thị gợi ý xanh nhẹ nhàng |

---

## 3. Khung Khởi Tạo Mã Nguồn Mẫu (Code Snippet Boilerplate)

### TypeScript:
```typescript
export enum RecordStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED"
}

export enum UserRole {
  SYS_ADMIN = "SYS_ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  VIEWER = "VIEWER"
}
```

### Python:
```python
from enum import Enum

class RecordStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"

class UserRole(str, Enum):
    SYS_ADMIN = "SYS_ADMIN"
    MANAGER = "MANAGER"
    STAFF = "STAFF"
    VIEWER = "VIEWER"
```
