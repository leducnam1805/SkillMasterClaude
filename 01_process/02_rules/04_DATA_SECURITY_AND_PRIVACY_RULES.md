# 🔒 Quy Tắc 04: An Toàn Thông Tin & Bảo Mật Dữ Liệu (Security & Privacy Rules)

> **Phạm vi áp dụng:** Áp dụng cho Cơ sở dữ liệu, API Authentication, Quản lý tài khoản và Lưu trữ đám mây.

---

## 1. Bảo Vệ Dữ Liệu Riêng Tư (Data Privacy & Confidentiality)
1. **Dữ liệu đối tượng nhạy cảm:**
   - Thông tin cá nhân của học sinh, phụ huynh, nhân sự (họ tên, ngày sinh, số điện thoại, kết quả đánh giá) phải được bảo mật, không phát tán ra bên ngoài khi chưa được mã hóa hoặc ẩn danh.
2. **Quyền sở hữu dữ liệu:**
   - Ưu tiên lưu trữ dữ liệu tại máy chủ nội bộ hoặc cơ sở dữ liệu chuyên biệt của tổ chức (Local Store / Dedicated PostgreSQL), tránh phụ thuộc dịch vụ công cộng.

---

## 2. Tiêu Chuẩn Xác Thực & Phân Quyền (Auth & RBAC Standards)
1. **Mã hóa mật khẩu bằng `bcrypt`:**
   - Tuyệt đối không lưu mật khẩu dạng văn bản thô (Plain-text). Mọi mật khẩu phải được băm bằng thuật toán `bcrypt` có Salt tự động.
2. **Không làm lộ mã băm (No Hash Leakage):**
   - Mọi DTO/Response trả về từ API Backend cho Client **tuyệt đối không chứa trường `password_hash`**.
3. **Cơ chế xoay vòng Refresh Token (Refresh Token Rotation - RTR):**
   - Áp dụng cơ chế xoay vòng token khi gia hạn phiên làm việc. Nếu phát hiện một Refresh Token cũ đã bị thu hồi mà vẫn được gửi lên ➔ Ngay lập tức thu hồi toàn bộ các phiên đăng nhập của người dùng đó (Phát hiện tấn công Replay Attack).

---

## 3. Quản Lý Khóa Bí Mật & Môi Trường (Secrets Management)
1. **Không commit thông tin nhạy cảm lên Git:**
   - Tất cả các khóa API (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`), mật khẩu kết nối Database, `SECRET_KEY` tạo JWT phải nằm trong file `.env` và được khai báo trong `.gitignore`.
2. **File `.env.example` chuẩn:**
   - Dự án chỉ cung cấp file `.env.example` chứa tên biến và giá trị mẫu an toàn để người triển khai tự điền.
