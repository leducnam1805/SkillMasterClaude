# 📦 Tiêu Chuẩn Sản Phẩm Nghiệm Thu Bàn Giao (Deliverable Standards)

> **Mục tiêu:** Định nghĩa bộ tiêu chuẩn đầu ra bắt buộc cho một sản phẩm phần mềm sau khi hoàn tất chu trình sinh tự động của Agent.

---

## 1. Ứng Dụng Độc Lập Chạy Được Ngay (Standalone Executable Application)
* **Khởi chạy độc lập:** Mã nguồn ứng dụng độc lập nằm trong thư mục bàn giao (`runs/<timestamp>/`).
* **Sẵn sàng vận hành (Zero Heavy Setup):** Không bắt buộc cài đặt các dịch vụ cơ sở hạ tầng quá nặng nề để chạy thử; có sẵn cơ chế Mock/Local Store và dữ liệu mồi (`Seed Data`) để người dùng có thể trải nghiệm ngay lập tức:
  ```bash
  npm install
  npm run dev
  ```
* **Vượt qua 100% Cổng kiểm thử tự động:**
  - `npm test`: 100% các hàm quy tắc nghiệp vụ (`Rules`) vượt qua Unit Test từ các ca kiểm thử mẫu (`examples`).
  - `npm run lint`: Không còn lỗi vi phạm cú pháp và quy chuẩn CheckStyle.
  - `npm run build`: Bản build Production hoàn thành thành công không lỗi biên dịch.

---

## 2. Tài Liệu Hướng Dẫn Vận Hành Bàn Giao (USER_GUIDE.md)
Mỗi sản phẩm sinh ra bắt buộc đi kèm tài liệu hướng dẫn vận hành ngắn gọn dành cho người dùng cuối:
1. Hướng dẫn khởi chạy ứng dụng trên máy tính cá nhân hoặc môi trường máy chủ.
2. Danh mục các quy tắc nghiệp vụ đang áp dụng và công thức tính toán.
3. Hướng dẫn sử dụng các tính năng Trợ lý AI và quy trình phê duyệt của con người (`Human-in-the-loop`).
4. Danh sách các quy tắc hoặc giả định còn ở trạng thái chờ duyệt (`PENDING`) cần người dùng xác nhận trên giao diện quản trị.

---

## 3. Báo Cáo Đo Lường Chi Phí & Lịch Sử Thực Thi (execution_summary.json)
* Minh bạch toàn bộ chi phí tài nguyên và Token AI đã tiêu thụ qua từng giai đoạn (Intake, Design, Spec, Codegen).
* Ghi lại số vòng tự động sửa lỗi (`Repair Rounds`) mà hệ thống đã thực hiện trước khi đạt trạng thái hoàn thiện.
