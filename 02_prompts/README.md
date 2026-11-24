# 🎭 Bộ Agent Prompts Độc Lập (Multi-Agent System Prompts Kit)

> Thư mục này chứa hệ thống Prompts phân chia theo **4 vai trò chuyên trách** và **5 stage thực thi tự động** trong toàn bộ vòng đời phát triển phần mềm của Agent.
> Đảm bảo tính liên kết 1-1 giữa tài liệu quy trình (`01_process/`), các Agent Prompts (`02_prompts/`) và các Stage của Engine (`03_engine/`).

---

## 👥 Ma Trận Liên Kết 1-1: Vai Trò Agent ⇄ Engine Stage ⇄ Prompt File

| STT | Vai Trò (Persona) | File Prompt Độc Lập | Engine Stage (03_engine) | File Stage Tương Ứng | Nhiệm Vụ Trọng Tâm |
|:---:|---|---|---|---|---|
| **00** | **Hiến Pháp Quy Tắc Cứng** | [_core_rules.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/_core_rules.md) | Mọi Stage (Tự động nạp kèm) | `_core_rules.md` | Bộ 5 quy tắc cứng: Zero-Assumption, Đạo đức, HITL, Code thuần tính toán. |
| **01** | **Senior Business Analyst** | [01_AGENT_INTAKE_BA.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/01_AGENT_INTAKE_BA.md) | `intake` | [intake.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/intake.md) | Vòng lặp phỏng vấn xoay vòng, câu hỏi trắc nghiệm A/B/C/D có khuyến nghị, chặn suy đoán. |
| **02** | **Principal Solution Architect** | [02_AGENT_SOLUTION_ARCHITECT.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/02_AGENT_SOLUTION_ARCHITECT.md) | `designer` & `spec` | [designer.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/designer.md)<br>[spec.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/spec.md) | Đề xuất mô hình giải pháp từ Knowledge Base, lập sơ đồ ERD, API RESTful và xuất file `AppSpec.json`. |
| **03** | **Senior Fullstack Developer** | [03_AGENT_CODEGEN.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/03_AGENT_CODEGEN.md) | `codegen` | [codegen.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/codegen.md) | Sinh mã nguồn ứng dụng Next.js 16/Fullstack, chuẩn SonarQube, viết pure function cho Rules. |
| **04** | **Lead QA & Gatekeeper** | [04_AGENT_QA_TESTER.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/04_AGENT_QA_TESTER.md) | `verifier` | [verifier.md](file:///d:/project/AgenticAI/SkillMaster/02_prompts/verifier.md) | Bộ Test Cases 14 cột (Screen) & 16 cột (API), kiểm thử tự động `npm test/build`, gác cổng Quality Gate. |

---

## 🚀 Cách Sử Dụng Bộ Prompt Này

### Cách 1: Sử dụng trong cuộc trò chuyện (Chat Interaction)
* Khi bạn muốn AI bắt đầu lấy yêu cầu: Copy nội dung file `01_AGENT_INTAKE_BA.md` dán vào chat để AI kích hoạt chế độ BA phỏng vấn.
* Khi đã có Spec và muốn thiết kế kỹ thuật: Copy `02_AGENT_SOLUTION_ARCHITECT.md` dán vào chat để AI thiết kế CSDL và API.
* Khi muốn sinh test cases chuẩn doanh nghiệp: Copy `04_AGENT_QA_TESTER.md` dán vào chat để AI xuất file Excel test case.

### Cách 2: Tích hợp vào cỗ máy tự động (`03_engine`)
* Cỗ máy `03_engine` nạp trực tiếp các file markdown này từ `02_prompts/` làm System Prompt cho từng stage trong `src/stages/`.
* Hàm `loadPrompt()` trong `03_engine/src/llm.ts` tự động ánh xạ 1-1 giữa tên stage (`intake`, `designer`, `spec`, `codegen`, `verifier`) và ghép nối với `_core_rules.md`.
