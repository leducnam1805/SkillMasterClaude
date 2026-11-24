# 💬 Template Quản Lý Thông Điệp & Mã Lỗi Tập Trung (Message & Error Code Template)

> **Mục đích:** Khung chuẩn hóa toàn bộ câu thông báo thành công, cảnh báo nghiệp vụ và mã lỗi hệ thống (Error Codes). Tránh việc hardcode chuỗi text rải rác trong code.

---

## 1. Cấu Trúc Mã Lỗi Chuẩn (Error Code Architecture)

Định dạng quy ước mã lỗi: `<MODULE>_<HTTP_STATUS>_<SPECIFIC_CODE>`
* **Mã bắt đầu bằng:**
  * `AUTH_`: Module xác thực & phân quyền
  * `VALIDATION_`: Lỗi dữ liệu đầu vào không hợp lệ (400 / 422)
  * `NOT_FOUND_`: Không tìm thấy tài nguyên (404)
  * `CONFLICT_`: Xung đột dữ liệu, trùng mã (409)
  * `SYS_`: Lỗi nội bộ hệ thống hoặc timeout (500 / 503)

---

## 2. Bảng Danh Mục Thông Điệp Hệ Thống (Message Registry)

### Nhóm 1: Thông báo Thành công (Success Messages)

| Mã Thông Điệp (Key) | Tiêu Đề Hiển Thị | Nội Dung Thông Điệp (Hỗ trợ tham số `{param}`) | Phạm Vi Sử Dụng |
|---|---|---|---|
| `SUCCESS_CREATE` | Thành công | "Đã tạo mới bản ghi `{entity_name}` thành công." | Tạo mới dữ liệu (201) |
| `SUCCESS_UPDATE` | Cập nhật | "Cập nhật thông tin `{entity_name}` thành công." | Sửa dữ liệu (200) |
| `SUCCESS_DELETE` | Đã xóa | "Bản ghi đã được xóa khỏi hệ thống." | Xóa dữ liệu (200 / 204) |
| `SUCCESS_APPROVED` | Đã phê duyệt | "Nội dung do AI đề xuất đã được kiểm duyệt và áp dụng." | Quy trình duyệt AI |

---

### Nhóm 2: Lỗi Nghiệp Vụ & Dữ Liệu (Business & Validation Errors)

| Mã Lỗi (Code) | HTTP Status | Thông Điệp Cho Người Dùng (User Message) | Hướng Dẫn Khắc Phục (Action/Suggestion) |
|---|---|---|---|
| `ERR_FIELD_REQUIRED` | 422 | "Trường `{field_name}` là bắt buộc, không được để trống." | Vui lòng điền đầy đủ thông tin. |
| `ERR_RECORD_NOT_FOUND` | 404 | "Không tìm thấy dữ liệu `{entity_name}` với định danh `{id}`." | Kiểm tra lại đường dẫn hoặc ID truyền vào. |
| `ERR_DUPLICATE_CODE` | 409 | "Mã `{code}` đã tồn tại trên hệ thống." | Vui lòng sử dụng một mã định danh khác. |
| `ERR_RULE_VIOLATION` | 400 | "Dữ liệu vi phạm quy tắc nghiệp vụ: `{rule_description}`." | Kiểm tra lại điều kiện nghiệp vụ trước khi lưu. |

---

### Nhóm 3: Cảnh Báo Kiểm Toán Dữ Liệu (Audit & Warning Messages)

| Mã Cảnh Báo | Mức Độ (Severity) | Tiêu Đề Cảnh Báo | Nội Dung Diễn Giải |
|---|---|---|---|
| `WARN_DATA_ANOMALY` | `WARNING` | Phát hiện bất thường | "Giá trị `{field}` lệch chuẩn so với giá trị trung bình." |
| `BLOCK_NEGATIVE_TOTAL`| `BLOCKING` | Chặn dữ liệu âm | "Tổng điểm tính toán bị âm, hệ thống tạm thời chặn lưu chính thức." |

---

## 3. Khung Khởi Tạo Mã Nguồn Mẫu (Code Snippet Boilerplate)

### TypeScript:
```typescript
export const SystemMessages = {
  SUCCESS: {
    CREATED: (entity: string) => `Đã tạo ${entity} thành công.`,
    UPDATED: (entity: string) => `Đã cập nhật ${entity} thành công.`,
  },
  ERROR: {
    NOT_FOUND: (entity: string, id: string | number) => `Không tìm thấy ${entity} với mã: ${id}`,
    PERMISSION_DENIED: "Bạn không có quyền thực hiện thao tác này.",
  }
} as const;
```

### Python:
```python
class ErrorCodes:
    NOT_FOUND = "RECORD_NOT_FOUND"
    INVALID_PAYLOAD = "VALIDATION_FAILED"
    UNAUTHORIZED = "AUTH_UNAUTHORIZED"

class ErrorMessages:
    RECORD_NOT_FOUND = "Không tìm thấy dữ liệu yêu cầu."
    UNAUTHORIZED = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
```
