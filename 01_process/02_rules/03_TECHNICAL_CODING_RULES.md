# 💻 Quy Tắc 03: Kỹ Thuật Lập Trình & Kiến Trúc Mã Nguồn (Technical & Coding Rules)

> **Phạm vi áp dụng:** Áp dụng cho Engine sinh code tự động, các hàm nghiệp vụ, API, màn hình và bài kiểm thử.

---

## 1. Phân Định Trạng Thái Quy Tắc (`CONFIRMED` vs `PENDING`)
1. **Quy tắc `PENDING` (Chờ người dùng xác nhận):**
   - Khi một quy tắc chưa được giáo viên/quản lý xác nhận chính thức trên hệ thống: Hệ thống **chỉ được phép hiển thị Cảnh báo vàng (Warning)**.
   - Tuyệt đối không được kích hoạt logic chặn lưu (Blocking) khi quy tắc còn ở trạng thái `PENDING`.
2. **Quy tắc `CONFIRMED` (Đã xác nhận):**
   - Chỉ khi quy tắc đã được chuyển sang `CONFIRMED` thì các ràng buộc chặn lỗi nghiêm trọng mới được phép thực thi.

---

## 2. Tiêu Chuẩn Kiểm Thử Tự Động Bắt Buộc (Unit Test Mandate)
1. **100% Hàm nghiệp vụ phải có Test Cases:**
   - Mọi hàm tính toán (`formula`) hoặc hàm kiểm tra ràng buộc (`constraint`) bắt buộc phải có tối thiểu **2-3 `examples` mẫu trong Spec** để Engine tự động sinh Unit Test.
2. **Bao phủ cả trường hợp biên (Edge Cases):**
   - Bộ ví dụ kiểm thử phải bao gồm: Trường hợp bình thường, trường hợp bằng 0, trường hợp số âm, trường hợp ô trống/null.

---

## 3. Quy Chuẩn Chất Lượng Code (Clean Code & TypeScript Strictness)
1. **Tuyệt đối không dùng kiểu `any` trong TypeScript:**
   - Mọi DTO, Props, Entity, State đều phải định nghĩa interface hoặc type chặt chẽ.
2. **Không hardcode chuỗi thông báo:**
   - Mọi chuỗi thông báo thành công, tiêu đề hoặc mã lỗi phải import từ file quản lý tập trung (`constants/messages`).
3. **Kiến trúc phân tầng rõ ràng:**
   - Tách bạch: `Controllers` (nhận request) ➔ `Services` (xử lý logic) ➔ `Repositories` (thao tác DB) ➔ `Models/Schemas`.
