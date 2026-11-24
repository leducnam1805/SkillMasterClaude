# 📜 HIẾN PHÁP QUY TẮC CỐT LÕI (CORE RULES CONSTITUTION)
> Bộ quy tắc cứng bắt buộc tuân thủ 100% trong mọi giai đoạn (Intake, Designer, Spec Builder, Codegen, QA & Verifier).
> Được đồng bộ trực tiếp 1-1 từ: `01_process/02_rules/`

---

## 1. Nguyên Tắc Đạo Đức & Bảo Vệ Người Dùng (Business Core Rules)
* **Không bêu tên, không công khai số liệu tiêu cực:** Điểm phạt/điểm trừ nội bộ chỉ để cảnh báo người quản trị, trên giao diện báo cáo chung hoặc gửi người liên quan phải hiển thị `N/A` hoặc chuyển thành *"Mục tiêu cần rèn luyện"*. Tuyệt đối không tạo bảng xếp hạng từ dưới lên (Wall of Shame).
* **Khích lệ tiến bộ cá nhân:** Tập trung so sánh sự cải thiện của từng cá nhân so với chính họ ở kỳ trước thay vì so sánh ganh đua tiêu cực.
* **Minh chứng rõ ràng (Proof & Evidence):** Mọi điểm số, trạng thái đều phải truy vết được về sự kiện hành vi cụ thể (thời gian, người tạo, căn cứ).

## 2. Ứng Xử AI & Kiểm Duyệt Con Người (AI Ethics & HITL Rules)
* **Code thuần làm toán, AI chỉ viết lời văn:** Mọi công thức tính toán, điểm thưởng, phạt, điều kiện ràng buộc PHẢI được viết bằng hàm thuần (pure functions) tất định trong mã nguồn. Tuyệt đối không để AI tự tính toán số liệu.
* **Human-in-the-loop (Bắt buộc duyệt):** Mọi nội dung do AI sinh ra (nhận xét, gợi ý, bản nháp) đều mang trạng thái `DRAFT` và `requires_approval: true`. Chỉ khi con người bấm `APPROVE` thì mới được lưu vào hồ sơ chính thức.

## 3. Kỹ Thuật Lập Trình & Ràng Buộc Nghiệp Vụ (Technical Rules)
* **Quy tắc PENDING vs CONFIRMED:**
  * `PENDING`: Quy tắc do AI gợi ý hoặc chưa được người dùng xác nhận rõ ràng ➔ Chỉ hiển thị cảnh báo/nhắc nhở, không được chặn hành động của người dùng.
  * `CONFIRMED`: Quy tắc đã được người dùng chốt bằng văn bản ➔ Được phép chặn lỗi (validation blocking) và bắt buộc có bộ kiểm thử mẫu (`examples`).
* **TypeScript Strict Mode:** Tuyệt đối không dùng kiểu `any`. Mọi props, state, dữ liệu đều phải có interface/type tường minh.
* **Không hardcode:** Không hardcode chuỗi thông báo, mã lỗi hay tham số hệ thống.

## 4. An Toàn Thông Tin & Bảo Mật Dữ Liệu (Security & Privacy Rules)
* **Bảo vệ dữ liệu nhạy cảm:** Chỉ lưu thông tin cần thiết tối thiểu (Minimal Data Principle).
* **Mật khẩu & Mã hóa:** Mật khẩu phải mã hóa `bcrypt` (cost $\ge 12$). Không trả về trường nhạy cảm (`password_hash`, tokens) qua API.
* **Không lưu Secret vào Git:** Tuyệt đối không commit API Key, Secret Token vào kho lưu trữ. Tất cả cấu hình qua biến môi trường `.env`.

## 5. Ranh Giới Quyết Định & Chặn Tự Suy Đoán (Zero-Assumption Protocol)
* **Cấm tự ý suy đoán:** Những gì người dùng chưa nói rõ (Tech Stack, Cơ sở dữ liệu, Công thức tính toán, Phân quyền), AI CẤM TỰ ĐOÁN.
* **Hỏi trắc nghiệm có định hướng:** Khi hỏi làm rõ, chỉ hỏi từ 1 đến 3 câu then chốt nhất mỗi lượt, định dạng trắc nghiệm 2-4 phương án cụ thể (A, B, C, D) với phương án `(Khuyến nghị)` đứng đầu kèm lý do ngắn gọn.
