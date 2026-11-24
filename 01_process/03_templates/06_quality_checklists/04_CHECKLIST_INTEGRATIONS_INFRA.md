# 🌐 Checklist 04: Nghiệm Thu Hạ Tầng & Tích Hợp Ngoại Vi (Integrations & Infra Checklist)

> **Mục tiêu:** Rà soát tính đầy đủ và an toàn của các thông số cấu hình kết nối đám mây, kho lưu trữ (Bucket) và các API bên thứ ba thuộc thư mục `04_integrations_infra/`.

---

## 1. Kho Lưu Trữ Tệp (Object Storage / Bucket Configuration)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | Xác định rõ nhà cung cấp dịch vụ lưu trữ: S3 (AWS), GCS (Google) hoặc MinIO (Self-hosted/Local). | [ ] Đạt / [ ] Chưa |  |
| **1.2** | Tên Bucket đặt đúng quy ước (`app-assets-production`, không chứa ký tự đặc biệt). | [ ] Đạt / [ ] Chưa |  |
| **1.3** | Các khóa bảo mật (`STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`) được lưu trong biến môi trường `.env`, tuyệt đối không commit lên Git. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | Có quy định giới hạn dung lượng upload tối đa (`STORAGE_MAX_FILE_SIZE_MB`). | [ ] Đạt / [ ] Chưa |  |
| **1.5** | Có cấu hình `STORAGE_PUBLIC_BASE_URL` hoặc CDN Endpoint để người dùng truy cập file tĩnh. | [ ] Đạt / [ ] Chưa |  |

---

## 2. Kết Nối Mô Hình Trí Tuệ Nhân Tạo (AI / LLM Providers)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | Khai báo nhà cung cấp LLM chính xác (`anthropic`, `openai`, `google`, `ollama`). | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Khóa API (`LLM_API_KEY`) được quản lý qua Secret Manager / Env, không hardcode. | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Phân tách rõ: Model suy luận sâu (`PRIMARY_MODEL`) và Model tốc độ cao (`FAST_MODEL`). | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Thiết lập thông số sáng tạo `TEMPERATURE` phù hợp (0.2 cho dữ liệu chính xác, 0.7 cho viết văn). | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Có cấu hình `LLM_TIMEOUT_SECONDS` (tránh treo tiến trình khi API bên ngoài bị nghẽn). | [ ] Đạt / [ ] Chưa |  |

---

## 3. Cổng Dịch Vụ Thông Báo & Webhook (Mail/SMS & Webhooks)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **3.1** | Đầy đủ thông số máy chủ gửi thư SMTP: Host, Port, Username, Password, From Address. | [ ] Đạt / [ ] Chưa |  |
| **3.2** | Webhook gửi đối tác có phương thức bảo mật xác thực (`Bearer Token` hoặc `HMAC-SHA256`). | [ ] Đạt / [ ] Chưa |  |
| **3.3** | Webhook có chiến lược gửi lại tự động khi đối tác lỗi mạng (`Retry Strategy: 3 lần, Exponential Backoff`). | [ ] Đạt / [ ] Chưa |  |
| **3.4** | Dữ liệu Webhook đóng gói đúng chuẩn JSON tiêu chuẩn quốc tế (CloudEvents). | [ ] Đạt / [ ] Chưa |  |
