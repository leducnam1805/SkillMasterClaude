# 📜 Hiến Pháp Quy Tắc Hệ Thống (System Rules Governance)

> Thư mục này định nghĩa toàn bộ các **Quy tắc cốt lõi (Rules)** chi phối hành vi của hệ thống AI Agent, quy chuẩn viết code của lập trình viên và chuẩn mực đạo đức đối với người dùng.

---

## 📂 Danh Mục Các Bộ Quy Tắc Chuyên Biệt

| Thứ Tự | Tên File Quy Tắc | Phạm Vi Trách Nhiệm & Trọng Tâm |
|:---:|---|---|
| **01** | [01_BUSINESS_CORE_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/02_rules/01_BUSINESS_CORE_RULES.md) | **Đạo đức nghiệp vụ & Bảo vệ người dùng:**<br>• Không bêu tên, không công khai điểm âm (hiển thị `N/A`).<br>• Khích lệ tiến bộ cá nhân, tuân thủ Thông tư 27/2020/TT-BGDĐT.<br>• Minh bạch minh chứng cho mọi số liệu đánh giá. |
| **02** | [02_AI_ETHICS_AND_HITL_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/02_rules/02_AI_ETHICS_AND_HITL_RULES.md) | **Ứng xử AI & Kiểm duyệt con người (Human-in-the-loop):**<br>• AI chỉ sinh bản nháp (`DRAFT`), bắt buộc người dùng bấm `APPROVE`.<br>• **Tách biệt tuyệt đối:** Code thuần làm toán, AI chỉ viết lời văn.<br>• Đa dạng hóa góc nhìn sư phạm và cấm ngôn từ xúc phạm. |
| **03** | [03_TECHNICAL_CODING_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/02_rules/03_TECHNICAL_CODING_RULES.md) | **Kỹ thuật lập trình & Kiến trúc phần mềm:**<br>• Quy tắc `PENDING` (chỉ cảnh báo) vs `CONFIRMED` (được chặn lỗi).<br>• Bắt buộc 100% hàm tính toán phải có Test Cases mẫu (`examples`).<br>• Không dùng `any` trong TypeScript; không hardcode chuỗi thông báo. |
| **04** | [04_DATA_SECURITY_AND_PRIVACY_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/02_rules/04_DATA_SECURITY_AND_PRIVACY_RULES.md) | **An toàn thông tin & Bảo mật dữ liệu:**<br>• Bảo vệ thông tin nhạy cảm của người dùng.<br>• Mật khẩu mã hóa `bcrypt`, không lộ `password_hash` qua API.<br>• Cơ chế xoay vòng Refresh Token (RTR) chống đánh cắp phiên.<br>• Cấm tuyệt đối commit API Key và Secrets lên kho Git. |
| **05** | [05_AI_DECISION_BOUNDARIES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/02_rules/05_AI_DECISION_BOUNDARIES.md) | **Ranh giới quyết định & Chặn AI tự suy đoán (Zero-Assumption):**<br>• Phân định rõ những gì AI ĐƯỢC đề xuất vs BẮT BUỘC HỎI con người.<br>• Bắt buộc hỏi Tech Stack, Chi phí Cloud, Phân quyền RBAC.<br>• Cấm tự ý code khi chưa qua cổng duyệt của người dùng. |

---

## ⚖️ Thứ Tự Ưu Tiên Áp Dụng Khi Có Xung Đột
1. **Mức 1 (Cao nhất):** `01_BUSINESS_CORE_RULES` & `04_DATA_SECURITY_AND_PRIVACY_RULES` (Bảo vệ con người và bảo mật an toàn dữ liệu luôn là tối thượng).
2. **Mức 2:** `02_AI_ETHICS_AND_HITL_RULES` (Con người luôn có quyền kiểm duyệt cao nhất trước AI).
3. **Mức 3:** `03_TECHNICAL_CODING_RULES` (Tối ưu hóa kỹ thuật và kiến trúc code).
