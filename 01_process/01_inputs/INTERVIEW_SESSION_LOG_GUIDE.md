# 📜 Nhật Ký Phỏng Vấn Thu Thập Đặc Tả (Interview Session Audit Log Guide)

> **Mục tiêu:** Lưu trữ bằng chứng kiểm toán (Audit Trail) cho toàn bộ quyết định kỹ thuật và nghiệp vụ được hình thành qua các vòng phỏng vấn xoay vòng giữa AI và Người dùng. 
> Đảm bảo mọi dòng code, cấu trúc CSDL và công nghệ được chọn đều có căn cứ rõ ràng: **Ai hỏi? Hỏi gì? Trả lời gì? AI đánh giá thế nào? Cập nhật vào đâu trong Spec?**

---

## 1. Cấu Trúc Hồ Sơ Một Lượt Phỏng Vấn (Audit Log Structure)

Mỗi lần AI trao đổi với người dùng, một bản ghi chuẩn hóa được sinh ra:

```markdown
### Vòng Phỏng Vấn [Số vòng] - Chủ đề: [Tech Stack / Nghiệp vụ / Phân quyền...]
* **Thời gian:** YYYY-MM-DD HH:mm:ss
* **Mục tiêu vòng:** Làm rõ các trường [tên_trường_spec] đang ở trạng thái PENDING.

#### Câu hỏi [Mã Q-xxx]: [Tiêu đề câu hỏi]
* **Căn cứ từ Checklist:** `[Đường dẫn file checklist & mục]`
* **Bối cảnh & Lý do hỏi:** `[Tại sao hệ thống cần thông tin này?]`
* **Nội dung câu hỏi gửi người dùng:** `[Nguyên văn câu hỏi và các phương án A, B, C, D]`
* **Câu trả lời của người dùng:** `[Lựa chọn của người dùng hoặc văn bản làm rõ]`

#### Đánh giá tác động của AI (AI Evaluation Matrix):
1. **Tính tương thích & Khả thi (Feasibility):** Phân tích sự ăn khớp với các quyết định trước đó.
2. **Chi phí & Rủi ro (Cost & Risk):** Đánh giá việc phát sinh chi phí Cloud hoặc lỗ hổng bảo mật.
3. **Tác động kiến trúc (Technical Impact):** Ảnh hưởng đến bảng CSDL, API endpoint, hoặc logic hàm nào.
4. **Kết quả ghi nhận vào Spec:** Cập nhật trường `[spec.path]` với giá trị `[value]` và đổi trạng thái sang `CONFIRMED`.
```

---

## 2. Bảng Tổng Hợp Quyết Định Kỹ Thuật Cuối Kỳ (Final Decision Summary Table)
Khi hoàn tất toàn bộ các vòng phỏng vấn, AI kết xuất bảng tổng kết này vào phần đầu của tài liệu bàn giao:

| STT | Mã Q&A | Hạng Mục Quyết Định | Lựa Chọn Đã Chốt | Căn Cứ Đánh Giá Của AI | Trạng Thái |
|:---:|:---:|---|---|---|:---:|
| 1 | Q-001 | Frontend Framework | Next.js 15+ App Router | Tối ưu SEO, SSR, bảo mật cookie HttpOnly | `CONFIRMED` |
| 2 | Q-002 | Backend Framework | FastAPI (Python 3.11+) | Xử lý dữ liệu mạnh, chuẩn Pydantic v2 | `CONFIRMED` |
| 3 | Q-003 | Database Engine | PostgreSQL 16+ | ACID toàn vẹn, mở rộng JSONB tốt | `CONFIRMED` |
| 4 | Q-004 | Authentication | JWT Access/Refresh Cookie | Chuẩn bảo mật RTR chống đánh cắp token | `CONFIRMED` |
| 5 | Q-005 | Object Storage | MinIO (Dev) / Cloudflare R2 | Chuẩn S3, không phát sinh chi phí ban đầu | `CONFIRMED` |
