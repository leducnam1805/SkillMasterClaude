# 🔄 Quy Trình Phỏng Vấn Xoay Vòng & Tích Lũy Đặc Tả (Iterative Intake Loop SOP)

> **Mục tiêu:** Chuẩn hóa quy trình hội thoại tương tác đa vòng (Multi-turn Iterative Loop) giữa AI và Người dùng. 
> Mỗi vòng hỏi đáp: AI tra cứu Checklist/Questionnaire ➔ Đặt câu hỏi trắc nghiệm/làm rõ ➔ Người dùng trả lời ➔ AI đánh giá tác động ➔ Cập nhật file Spec ➔ Lưu lịch sử đánh giá ➔ Lặp lại cho đến khi đạt 100% tiêu chí để người dùng bấm APPROVE.

---

## 1. Bản Đồ Vòng Lặp Xoay Vòng (Iterative Loop Workflow)

```mermaid
flowchart TD
    Start([Người dùng đưa Input ban đầu]) --> InitDraft[AI khởi tạo Bản nháp Spec v0.1 & Khởi tạo Interview Log]
    
    InitDraft --> ScanGate[AI đối soát với Spec Completion Gate & Intake Questionnaire]
    
    ScanGate --> Eval{Còn mục PENDING hoặc thiếu sót không?}
    
    Eval -- CÒN THIẾU --> PickQuestion[AI chọn 1-3 câu hỏi then chốt nhất tiếp theo]
    PickQuestion --> AskUser[AI hỏi Người dùng kèm Gợi ý Khuyến nghị A/B/C/D]
    
    AskUser --> UserAnswer([Người dùng phản hồi / lựa chọn])
    
    UserAnswer --> AnalyzeAns[AI Phân Tích & Đánh Giá Tác Động: Impact, Feasibility, Cost, Risk]
    AnalyzeAns --> UpdateLog[Ghi nhận vào Interview Session Log: Câu hỏi, Trả lời, Đánh giá, Trạng thái]
    UpdateLog --> UpdateSpec[Cập nhật Spec v0.(N+1): Điền Tech Stack / Entities / Rules / Roles]
    
    UpdateSpec --> ScanGate
    
    Eval -- ĐÃ ĐẦY ĐỦ 100% --> FinalReview[AI xuất trình Tóm Tắt Toàn Diện Spec & Lịch Sử Phỏng Vấn]
    FinalReview --> UserDecision{Người dùng Chấp Thuận / Ký Duyệt?}
    
    UserDecision -- YÊU CẦU ĐIỀU CHỈNH --> AskUser
    UserDecision -- ĐỒNG Ý APPROVE --> GatePassed([✅ SPEC CONFIRMED - Bàn giao sang Thiết kế Kỹ thuật Phase 3])
```

---

## 2. Quy Tắc Vận Hành Vòng Lặp (Loop Protocol Rules)

### 2.1. Quy tắc Số lượng câu hỏi mỗi lượt (Batching Limit)
* **Tối đa 1 đến 3 câu hỏi cho mỗi lượt hỏi:** Không bao giờ "dội bom" người dùng một bảng 20 câu hỏi cùng lúc. Hỏi theo thứ tự ưu tiên:
  1. *Vòng 1:* Tech Stack cốt lõi (Frontend, Backend, DB, Auth).
  2. *Vòng 2:* Kiến trúc lưu trữ, Vai trò người dùng (Roles) & Đơn vị sử dụng (Tenancy).
  3. *Vòng 3:* Quy tắc nghiệp vụ tính toán trọng yếu & Dịch vụ ngoại vi (Storage, LLM, Email).
  4. *Vòng 4:* Màn hình chính & Dữ liệu mồi / Biên kiểm thử.

### 2.2. Định dạng câu hỏi chuẩn (Structured Question Format)
Mỗi câu hỏi AI đưa ra **bắt buộc** gồm 4 phần:
1. **Lý do hỏi (Context):** Tại sao hệ thống cần thông tin này.
2. **Câu hỏi cụ thể (Question).**
3. **Các lựa chọn có khuyến nghị (Options with Recommendation):** Luôn đưa lựa chọn `(Khuyến nghị)` kèm lý do ngắn.
4. **Tác động kỹ thuật (Technical Impact):** Nếu chọn A thì hệ thống thế nào, nếu chọn B thì thế nào.

### 2.3. Quy trình Đánh giá sau mỗi câu trả lời (Post-Answer Evaluation)
Khi nhận câu trả lời từ người dùng, AI **không chỉ ghi nhận** mà phải thực hiện đánh giá 4 khía cạnh:
* **Tính khả thi (Feasibility):** Công nghệ/yêu cầu này có tương thích với các thành phần đã chọn trước đó không?
* **Chi phí & Rủi ro (Cost & Risk):** Có phát sinh chi phí Cloud hoặc rủi ro bảo mật không?
* **Tác động thiết kế (Architecture Impact):** Quyết định này thay đổi bảng CSDL nào, API nào hoặc hàm tính toán nào?
* **Trạng thái (Status):** Chuyển từ `PENDING` sang `CONFIRMED`.

---

## 3. Quản Lý Phiên Bản Spec Qua Các Vòng (Spec Version Progression)

* **v0.1:** Khởi tạo từ Input ban đầu (nhiều trường còn để `PENDING_CONFIRMATION`).
* **v0.2 ➔ v0.9:** Cập nhật từng bước sau mỗi câu trả lời phỏng vấn.
* **v1.0 (Final Approved Spec):** Tất cả các mục đạt `CONFIRMED`, người dùng bấm `APPROVE`, file log phỏng vấn được đính kèm trọn vẹn.
