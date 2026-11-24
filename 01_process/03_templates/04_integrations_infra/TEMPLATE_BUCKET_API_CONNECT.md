# 🌐 Template Kết Nối Lưu Trữ (Bucket) & Tích Hợp API Ngoại Vi (External Integrations Template)

> **Mục đích:** Khung chuẩn hóa thông số cấu hình kết nối đám mây (Cloud Storage S3/GCS/MinIO), nhà cung cấp mô hình AI (OpenAI/Anthropic/Gemini) và các cổng dịch vụ bên thứ ba (SMS/Email/Payment). 

---

## 1. Cấu Hình Kho Lưu Trữ Tệp (Object Storage / Bucket Configuration)

Áp dụng khi hệ thống cần upload hình ảnh, file Excel, avatar học sinh, hợp đồng hoặc báo cáo PDF.

### Ma trận thông số kỹ thuật (Storage Matrix):
| Tên Biến Môi Trường (Env Key) | Ý Nghĩa / Mục Đích | Ví Dụ Mẫu (Ghi chú cấu hình) |
|---|---|---|
| `STORAGE_PROVIDER` | Loại nhà cung cấp | `s3` (AWS) \| `gcs` (Google Cloud) \| `minio` (Local) |
| `STORAGE_BUCKET_NAME` | Tên thùng chứa dữ liệu | `app-assets-production` \| `media-bucket` |
| `STORAGE_ENDPOINT` | Đường dẫn máy chủ MinIO/S3 | `https://s3.ap-southeast-1.amazonaws.com` |
| `STORAGE_ACCESS_KEY` | Khóa định danh truy cập | `<API_ACCESS_KEY_ID>` |
| `STORAGE_SECRET_KEY` | Khóa bí mật bảo mật | `<SECRET_ACCESS_KEY_VALUE>` |
| `STORAGE_PUBLIC_BASE_URL` | URL công khai đọc file ảnh/tài liệu | `https://cdn.example.com/assets` |
| `STORAGE_MAX_FILE_SIZE_MB`| Giới hạn dung lượng tệp | `10` (Tối đa 10MB mỗi file) |

---

## 2. Cấu Hình Tích Hợp Mô Hình Trí Tuệ Nhân Tạo (AI / LLM Providers)

| Tên Biến Môi Trường | Mô Tả & Nhiệm Vụ | Giá Trị Mẫu |
|---|---|---|
| `LLM_PROVIDER` | Nhà cung cấp chính | `anthropic` \| `openai` \| `google` \| `ollama` |
| `LLM_API_KEY` | Khóa API cấp phép | `sk-ant-api03-...` \| `sk-proj-...` |
| `LLM_PRIMARY_MODEL` | Mô hình suy luận chính (Tư duy/Code) | `claude-3-5-sonnet-20241022` \| `gpt-4o` |
| `LLM_FAST_MODEL` | Mô hình tốc độ cao (Trích xuất/Intake) | `claude-3-5-haiku` \| `gpt-4o-mini` |
| `LLM_TEMPERATURE` | Độ sáng tạo / Tất định | `0.2` (Phân tích chặt chẽ) đến `0.7` (Viết văn) |
| `LLM_TIMEOUT_SECONDS` | Thời gian chờ tối đa trước khi timeout | `60` (giây) |

---

## 3. Cấu Hình Cổng Dịch Vụ Thông Báo (Email / SMS / Webhook Gateway)

### A. Dịch vụ gửi Thư điện tử (Email SMTP / Resend / SendGrid)
| Biến Môi Trường | Mục Đích Sử Dụng |
|---|---|
| `MAIL_HOST` | Địa chỉ máy chủ SMTP (ví dụ: `smtp.sendgrid.net`, `smtp.gmail.com`) |
| `MAIL_PORT` | Cổng kết nối (ví dụ: `587` cho TLS, `465` cho SSL) |
| `MAIL_USERNAME` | Tên tài khoản hoặc API Key đăng nhập gửi thư |
| `MAIL_PASSWORD` | Mật khẩu ứng dụng hoặc Secret Key |
| `MAIL_FROM_ADDRESS` | Địa chỉ email người gửi hiển thị (ví dụ: `noreply@truonghoc.edu.vn`) |

### B. Webhook Tích Hợp Hệ Thống Bên Ngoài (Third-Party Webhooks)
| Trường Thiết Kế | Chi Tiết Đặc Tả |
|---|---|
| **Webhook Endpoint:** | `POST https://api.external-partner.com/v1/webhook` |
| **Authentication:** | `Bearer Token` hoặc chữ ký `X-Signature-SHA256` |
| **Retry Strategy:** | Tự động gửi lại tối đa 3 lần theo lũy thừa thời gian (`Exponential Backoff`: 5s, 15s, 60s) |
| **Payload Format:** | Chuẩn JSON đóng gói theo chuẩn `CloudEvents` |

---

## 4. Mẫu Định Nghĩa Khung Kết Nối Trong Mã Nguồn (Config Client Boilerplate)

```typescript
export interface AppIntegrationsConfig {
  storage: {
    provider: "s3" | "gcs" | "minio";
    bucketName: string;
    endpoint?: string;
    publicBaseUrl: string;
  };
  llm: {
    provider: "anthropic" | "openai" | "google";
    apiKey: string;
    model: string;
    temperature: number;
  };
  notifications?: {
    emailEnabled: boolean;
    smsGatewayUrl?: string;
  };
}
```
