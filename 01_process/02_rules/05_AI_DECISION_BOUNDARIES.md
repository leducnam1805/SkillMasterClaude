# 🛑 Ranh Giới Quyết Định Của AI (AI Decision Boundaries & Zero-Assumption Protocol)

> **Mục tiêu:** Định rõ giới hạn thẩm quyền của Agent AI trong toàn bộ quy trình thiết kế phần mềm. 
> Ngăn chặn triệt để hiện tượng AI "tự biên tự diễn", tự suy đoán công nghệ, tự phán đoán yêu cầu nghiệp vụ, hoặc tự tiện bỏ qua bước xác nhận của con người.

---

## 1. Nguyên Tắc Cốt Lõi: "Zero-Assumption Protocol" (Giao Thức Không Giả Định)

```
+-------------------------------------------------------------+
| NGUYÊN TẮC VÀNG CỦA AI:                                     |
| "Nếu không chắc chắn hoặc chưa được người dùng xác nhận,    |
|  AI PHẢI DỪNG LẠI ĐỂ HỎI, KHÔNG ĐƯỢC TỰ Ý SUY ĐOÁN."        |
+-------------------------------------------------------------+
```

Mọi thông tin trong tài liệu đặc tả và thiết kế kỹ thuật phải thuộc 1 trong 2 trạng thái:
1. `CONFIRMED`: Đã được người dùng xác nhận rõ ràng bằng văn bản hoặc câu trả lời intake.
2. `PENDING_CONFIRMATION`: Đề xuất của AI nhưng đang chờ người dùng bấm duyệt (kèm nhãn cảnh báo rõ ràng). **Tuyệt đối không bắt đầu viết code khi còn cờ PENDING ở các quyết định kiến trúc.**

---

## 2. Ma Trận Quyền Hạn Của AI (AI Authority Matrix)

| Danh Mục | AI CÓ THỂ ĐỀ XUẤT / TỰ QUYẾT (CAN DECIDE) | AI BẮT BUỘC PHẢI HỎI NGƯỜI DÙNG (MUST ASK) | AI TUYỆT ĐỐI CẤM (MUST NOT) |
|---|---|---|---|
| **Công Nghệ (Tech Stack)** | • Gợi ý combo công nghệ phù hợp nhất dựa trên bài toán kèm ưu/nhược điểm.<br>• Chọn thư viện tiện ích nhỏ (lodash, dayjs, zod). | • **Frontend framework** (Next.js vs React vs Vue).<br>• **Backend framework** (FastAPI vs NestJS vs Go).<br>• **Database engine** (PostgreSQL vs MySQL vs Mongo).<br>• **Auth Strategy** (JWT vs Session vs BaaS). | • **CẤM TỰ Ý** chọn công nghệ rồi bắt đầu thiết kế mà không hỏi người dùng xác nhận.<br>• Cấm tự đổi stack giữa chừng. |
| **Quy Tắc Nghiệp Vụ (Business Logic)** | • Chuẩn hóa công thức toán học thành code TypeScript/Python chuẩn xác.<br>• Sinh bộ Test Cases biên (Boundary, Null, Negative) để kiểm thử công thức. | • Mọi công thức tính điểm, tính tiền, giảm giá, chiết khấu, xếp hạng.<br>• Mọi trường hợp ngoại lệ nghiệp vụ (Edge cases) mà mô tả ban đầu chưa nêu. | • **CẤM TỰ PHÁN ĐOÁN** công thức tính toán.<br>• Cấm dùng AI LLM để tính toán số liệu tài chính/điểm số (Phải dùng code thuần). |
| **Bảo Mật & Phân Quyền (Security & RBAC)** | • Bắt buộc áp dụng bcrypt/Argon2 cho mật khẩu.<br>• Tự động sinh mã lỗi an toàn (không lộ DB trace).<br>• Tự động thêm rate limit & sanitize input. | • Số lượng vai trò (Roles) và ma trận phân quyền chi tiết (Ai được xóa? Ai được duyệt?).<br>• Tiêu chí lưu trữ và hủy dữ liệu nhạy cảm (Data retention). | • **CẤM** lưu mật khẩu dạng plain-text.<br>• **CẤM** hardcode API key, Secret token vào code/spec.<br>• **CẤM** bypass bước xác thực cho tiện dev. |
| **Chi Phí & Đám Mây (Costs & Cloud Services)** | • Đề xuất các giải pháp mã nguồn mở, tự host (MinIO, Docker Compose, PostgreSQL) để tiết kiệm chi phí ban đầu. | • Bất kỳ dịch vụ nào **tính tiền theo lượng dùng** (Paid API: OpenAI, AWS S3, Resend, Twilio...).<br>• Hạn mức ngân sách tối đa hàng tháng nếu có. | • **CẤM TỰ Ý KÍCH HOẠT** dịch vụ trả phí của bên thứ 3 mà không có sự đồng ý của người dùng. |
| **Dữ Liệu Mồi & Test (Seed Data & Mock)** | • Tự sinh dữ liệu mẫu giả định (Faker data) đúng kiểu dữ liệu và ràng buộc. | • Yêu cầu người dùng cung cấp danh mục mẫu thực tế (Master data) nếu nghiệp vụ có tính đặc thù cao. | • **CẤM SỬ DỤNG** thông tin cá nhân thực (PII), email thật, số điện thoại thật của người thật vào seed data. |

---

## 3. Quy Trình Chặn "AI Tự Suy Nghĩ" Khi Tạo Spec (Step-by-Step Guardrail)

```mermaid
flowchart TD
    A[Nhận yêu cầu đầu vào từ người dùng] --> B{Yêu cầu đã có đủ Tech Stack & Roles chưa?}
    B -- CHƯA ĐỦ --> C[🛑 DỪNG QUY TRÌNH: Kích hoạt INTAKE_QUESTIONNAIRE]
    C --> D[Gửi tối đa 5 câu hỏi trắc nghiệm then chốt cho Người Dùng]
    D --> E[Người dùng chọn & phản hồi]
    E --> F[Ghi nhận vào Tech Stack Decision Table]
    B -- ĐÃ ĐỦ --> F
    F --> G[Dự thảo AppSpec.json & Thiết kế giải pháp]
    G --> H{Người dùng Review & Approve AppSpec?}
    H -- TỪ CHỐI / SỬA --> G
    H -- CHẤP THUẬN (CONFIRMED) --> I[✅ VƯỢT QUA CỔNG: Bắt đầu Thiết Kế Kỹ Thuật (Phase 3)]
```

---

## 4. Hành Vi Bắt Buộc Khi AI Phát Hiện Thông Tin Bị Thiếu (Missing Information Protocol)

Khi đang phân tích hoặc viết tài liệu, nếu gặp một điểm mơ hồ, AI **PHẢI** thực hiện đúng các bước sau:
1. **DỪNG LẠI NGAY LẬP TỨC** tại vị trí đó, không được tự bịa ra giả định để viết tiếp.
2. Đánh dấu vị trí đó bằng cờ: `[CHỜ_XÁC_NHẬN: <Nội dung cần hỏi>]`.
3. Soạn câu hỏi ngắn gọn dưới dạng **trắc nghiệm A/B/C/D** có kèm phương án khuyến nghị:
   > *"Hệ thống cần xác định cơ chế xử lý khi đơn hàng bị hủy:  
   > **A.** (Khuyến nghị) Hoàn tiền tự động vào ví và gửi thông báo.  
   > **B.** Chuyển trạng thái chờ Admin duyệt hoàn tiền thủ công.  
   > **C.** Khác (Bạn tự nêu yêu cầu)."*
4. Chỉ tiếp tục hoàn thiện sau khi người dùng đưa ra lựa chọn.
