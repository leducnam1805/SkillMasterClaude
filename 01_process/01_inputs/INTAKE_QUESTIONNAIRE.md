# 📋 Bộ Câu Hỏi Tiếp Nhận Đầu Vào & Quyết Định Kỹ Thuật (Structured Intake Questionnaire)

> **Mục tiêu tối thượng:** Ngăn chặn AI tự suy đoán (Hallucination/Assumptions) về công nghệ, kiến trúc, phân quyền và lưu trữ. 
> Bắt buộc Agent phải phỏng vấn người dùng và nhận câu trả lời trước khi kết xuất file `AppSpec.json` và bước vào giai đoạn thiết kế kỹ thuật.

---

## 🎯 Nguyên Tắc Vận Hành Của Bộ Câu Hỏi (Zero-Assumption Protocol)
1. **AI Không Được Tự Quyết Định Công Nghệ:** AI không bao giờ được tự ý chọn framework, database, hoặc auth provider nếu chưa nhận được câu trả lời từ người dùng.
2. **Cơ Chế Khuyến Nghị (Recommendation Guard):** AI được phép gợi ý lựa chọn tối ưu theo quy mô dự án (ví dụ: `(Khuyến nghị) Next.js 16 + FastAPI`), nhưng **bắt buộc người dùng phải xác nhận**.
3. **Phân Nhánh Intake Theo Đối Tượng:**
   - Nếu đầu vào là **Loại 1 (Mô tả tự do)**: AI dùng toàn bộ bộ câu hỏi này để phỏng vấn.
   - Nếu đầu vào là **Loại 2 (Spec JSON)**: Kiểm tra nếu thiếu khối `tech_stack` thì dừng lại và hỏi ngay các câu hỏi Phần B & C.

---

## PHẦN A: Khảo Sát Nghiệp Vụ & Bài Toán Cốt Lõi (Business Core)

### A1. Chân dung người dùng & Đối tượng hưởng lợi
* **Câu hỏi:** Ứng dụng này phục vụ chính cho ai? Ai là người trực tiếp thao tác hàng ngày và ai là người xem báo cáo?
* **Lựa chọn gợi ý:**
  - `[ ]` Nội bộ doanh nghiệp (Nhân viên, Quản lý, Giám đốc)
  - `[ ]` Khách hàng đại chúng B2C (Người dùng cá nhân)
  - `[ ]` Khách hàng doanh nghiệp B2B (Mô hình nhiều tổ chức/Tenant)
  - `[ ]` Giáo dục / Trường học (Giáo viên, Học sinh, Phụ huynh)

### A2. Luồng nghiệp vụ then chốt (Core Workflow)
* **Câu hỏi:** Hành động cốt lõi quan trọng nhất mà hệ thống phải xử lý trơn tru từ đầu đến cuối là gì? (Ví dụ: Đăng ký -> Duyệt -> Thanh toán -> Xuất hóa đơn).

---

## PHẦN B: Lựa Chọn Công Nghệ Bắt Buộc (Tech Stack Questionnaire)
> ⚠️ **ĐÂY LÀ PHẦN AI TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ SUY NGHĨ.**

### B1. Ngôn ngữ & Nền tảng Frontend
* **Câu hỏi:** Bạn muốn xây dựng giao diện ứng dụng (Frontend) trên nền tảng/framework nào?
* **Các tùy chọn chuẩn:**
  1. `(Khuyến nghị)` **Next.js 15+ / React 19** (TypeScript strict, App Router, Tailwind CSS, Shadcn UI)
  2. **Vite + React SPA** (TypeScript, Tailwind CSS)
  3. **Nuxt 3 / Vue 3** (TypeScript, Tailwind CSS)
  4. **Flutter / React Native** (Mobile App đa nền tảng)
  5. *Khác (Người dùng tự điền)*: `_________________`

### B2. Nền tảng & Framework Backend
* **Câu hỏi:** Backend xử lý nghiệp vụ, API và logic tính toán sẽ sử dụng công nghệ nào?
* **Các tùy chọn chuẩn:**
  1. `(Khuyến nghị)` **FastAPI (Python 3.11+)** (Thích hợp xử lý dữ liệu, AI agents, logic toán học, Pydantic v2)
  2. **NestJS (Node.js/TypeScript)** (Kiến trúc Enterprise module hóa, TypeORM/Prisma)
  3. **Express / Fastify (Node.js/TypeScript)** (Gọn nhẹ, microservices)
  4. **Spring Boot (Java 17/21)** (Hệ thống tài chính, ngân hàng, enterprise quy mô lớn)
  5. **Go (Gin/Fiber)** (Hiệu năng cực cao, xử lý throughput lớn)
  6. **Next.js Server Actions / API Routes** (Fullstack tích hợp trong 1 repo)

### B3. Hệ Quản Trị Cơ Sở Dữ Liệu (Database Engine)
* **Câu hỏi:** Dữ liệu chính của ứng dụng được lưu trữ ở đâu?
* **Các tùy chọn chuẩn:**
  1. `(Khuyến nghị)` **PostgreSQL 16+** (Chuẩn ACID, hỗ trợ JSONB, mở rộng tốt, tương thích Supabase/RDS)
  2. **MySQL 8.0+ / MariaDB** (Phổ biến, quan hệ chuẩn)
  3. **MongoDB** (Dữ liệu tài liệu phi cấu trúc, schema linh hoạt)
  4. **SQLite** (Gọn nhẹ, nhúng cục bộ, prototyping nhanh hoặc ứng dụng desktop/edge)

### B4. Chiến Lược Xác Thực & Phân Quyền (Authentication & Authorization)
* **Câu hỏi:** Hệ thống quản lý tài khoản và phiên đăng nhập theo cơ chế nào?
* **Các tùy chọn chuẩn:**
  1. `(Khuyến nghị)` **JWT (Access Token 15m + Refresh Token xoay vòng 7 ngày)** + HttpOnly Cookie
  2. **NextAuth.js / Auth.js** (Tích hợp Social Login Google, GitHub, OAuth2)
  3. **Supabase Auth / Firebase Auth** (BaaS quản lý trọn gói)
  4. **Session-based (Redis Session Store)** (Stateful truyền thống)

---

## PHẦN C: Kiến Trúc Phân Quyền & Quy Mô (Scale & Architecture)

### C1. Mô hình lưu trữ dữ liệu người dùng (Tenancy Model)
* **Câu hỏi:** Ứng dụng là Single-tenant hay Multi-tenant?
* **Các tùy chọn:**
  1. `(Khuyến nghị)` **Single-tenant** (Dữ liệu dùng chung cho 1 công ty/đơn vị, phân quyền qua `role`)
  2. **Multi-tenant (Shared DB, Tenant ID Column)** (Nhiều công ty/khách hàng dùng chung DB, cô lập qua `tenant_id`)
  3. **Multi-tenant (Separate DB / Schema)** (Mỗi khách hàng 1 schema/DB riêng biệt)

### C2. Số lượng vai trò người dùng (User Roles)
* **Câu hỏi:** Liệt kê các vai trò tham gia hệ thống và phạm vi thao tác của họ?
* **Mẫu:**
  - `ADMIN`: Toàn quyền cấu hình, quản trị người dùng, xem log.
  - `MANAGER`: Quản lý nghiệp vụ, duyệt báo cáo, gán nhiệm vụ.
  - `USER`: Thực hiện nghiệp vụ cá nhân, nhập dữ liệu.
  - `VIEWER`: Chỉ xem thông tin, không sửa/xóa.

---

## PHẦN D: Tích Hợp Ngoại Vi & Đám Mây (Integrations & Services)

### D1. Lưu trữ tệp tin & Đa phương tiện (Object Storage)
* **Câu hỏi:** Ứng dụng có cần lưu file tải lên (ảnh, PDF, video, tài liệu) không? Nơi lưu trữ?
* **Tùy chọn:**
  1. `(Khuyến nghị)` **MinIO / Local Storage** (Giai đoạn DEV/On-premise, chuẩn S3 compatible)
  2. **AWS S3 / Cloudflare R2 / Google Cloud Storage** (Production Cloud)
  3. **Không dùng file upload**

### D2. Dịch Vụ AI & Mô Hình Ngôn Ngữ Lớn (LLM Providers)
* **Câu hỏi:** Nếu có tính năng AI, bạn muốn kết nối với nhà cung cấp nào?
* **Tùy chọn:**
  1. `(Khuyến nghị)` **Google Gemini API** (Gemini 2.5/3.0 Flash, chi phí tối ưu, context dài)
  2. **OpenAI API** (GPT-4o, GPT-4o-mini)
  3. **Anthropic Claude API** (Claude 3.5 Sonnet)
  4. **Ollama / Local LLM** (Chạy offline, tự host trên máy chủ riêng)
  5. **Không sử dụng tính năng AI**

### D3. Kênh Thông Báo Ngoại Vi (Notification Channels)
* **Câu hỏi:** Hệ thống có cần gửi thông báo ra bên ngoài không?
* **Tùy chọn:** Email (SMTP/Resend/SendGrid) | Telegram Bot | Zalo ZNS | Webhook | Không cần

---

## PHẦN E: Môi Trường Triển Khai & Kiểm Soát Mã Nguồn (Deployment & DevOps)

### E1. Môi trường chạy ứng dụng (Deployment Target)
* **Câu hỏi:** Ứng dụng sẽ được chạy thử nghiệm và triển khai chính thức trên nền tảng nào?
* **Tùy chọn:**
  1. `(Khuyến nghị)` **Docker Compose** (Dễ đóng gói, chạy đồng nhất mọi môi trường Windows/Linux/Mac)
  2. **Vercel (Frontend) + Render/Railway (Backend & DB)**
  3. **Máy chủ Linux riêng (Bare-metal / VPS) chạy systemd + NGINX reverse proxy**
  4. **Kubernetes (K8s)** (Cụm container quy mô lớn)

---

## 📌 Bảng Tóm Tắt Quyết Định Kỹ Thuật (Tech Stack Decision Output)
Sau khi người dùng trả lời, Agent **bắt buộc phải điền đầy đủ** vào bảng sau và chèn vào file `AppSpec.json` trước khi bắt tay vào thiết kế:

| Hạng mục kỹ thuật | Lựa chọn đã chốt (Confirmed Choice) | Người phê duyệt | Ngày chốt |
|---|---|---|---|
| **Frontend Framework** | `<Ví dụ: Next.js 15 App Router + Tailwind>` | Người dùng | YYYY-MM-DD |
| **Backend Framework** | `<Ví dụ: FastAPI Python 3.11>` | Người dùng | YYYY-MM-DD |
| **Database Engine** | `<Ví dụ: PostgreSQL 16>` | Người dùng | YYYY-MM-DD |
| **Auth Strategy** | `<Ví dụ: JWT Cookie-based + RBAC>` | Người dùng | YYYY-MM-DD |
| **Object Storage** | `<Ví dụ: MinIO (Dev) / Cloudflare R2 (Prod)>`| Người dùng | YYYY-MM-DD |
| **AI Provider** | `<Ví dụ: Google Gemini 2.5 Flash>` | Người dùng | YYYY-MM-DD |
| **Deployment Mode** | `<Ví dụ: Docker Compose>` | Người dùng | YYYY-MM-DD |
