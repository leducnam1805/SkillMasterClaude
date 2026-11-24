# 🤖 Hệ Thống Tự Động Thiết Kế & Sinh Ứng Dụng (AI Software Agent)

Hệ thống Agentic tự động hóa toàn bộ vòng đời phát triển phần mềm: Nhận yêu cầu bài toán ➔ Phỏng vấn xoay vòng làm rõ ➔ Thiết kế kiến trúc & CSDL ➔ Tự động sinh mã nguồn Web App Next.js 16 hoàn chỉnh.

Kiến trúc thư mục được phân tách **độc lập, sạch sẽ theo 4 phân hệ chuẩn mực**:

```text
SkillMaster/
│
├── 01_process/      --> 📖 QUY TRÌNH CHUẨN HÓA (SOP: Luật lệ, Templates, Checklists QA)
│
├── 02_prompts/      --> 🎭 BỘ PROMPTS CHUYÊN GIA (4 Agent Prompts & Stage Prompts ánh xạ 1-1)
│
├── 03_engine/       --> ⚙️ CỖ MÁY THỰC THI (TypeScript Engine: Orchestrator, Generator, Verifier)
│
└── 04_workspace/    --> 💼 KHÔNG GIAN DỰ ÁN (Thư mục làm việc: inputs/ và outputs/)
```

---

## 🏛️ Trách Nhiệm Chi Tiết Của Từng Phân Hệ

| Phân Hệ | Bản Chất | Trách Nhiệm Cốt Lõi |
|---|---|---|
| **`01_process/`** | 📖 **Quy Trình Chuẩn (SOP)** | Bộ quy chuẩn nghiệp vụ, ranh giới quyết định (Zero-Assumption Protocol), bộ câu hỏi Intake, các mẫu thiết kế (Database ERD, REST API, Screens, Batch), tiêu chuẩn SonarQube & CheckStyle, và bộ mẫu Test Cases (14-16 cột). **Chỉ đọc (Read-only), không chứa code chạy.** |
| **`02_prompts/`** | 🎭 **Agent Prompts Kit** | Bộ 4 System Prompts chuyên biệt hóa theo vai trò: `01_AGENT_INTAKE_BA` (hỏi trắc nghiệm), `02_AGENT_SOLUTION_ARCHITECT` (thiết kế CSDL/API), `03_AGENT_CODEGEN` (viết code Next.js), `04_AGENT_QA_TESTER` (soi lỗi, lập test plan). Có đầy đủ YAML Frontmatter (`name`, `description`, `tools`). |
| **`03_engine/`** | ⚙️ **Cỗ Máy Sinh Mã Nguồn** | Mã nguồn TypeScript thuần túy. Chịu trách nhiệm nạp Prompt từ `02_prompts`, đọc `AppSpec.json`, nhân bản Template Next.js 16, viết Pure Functions cho Rules và chạy `npm test / build`. |
| **`04_workspace/`** | 💼 **Không Gian Làm Việc** | • `inputs/`: Nơi bạn ném file Spec JSON, file mô tả hoặc bảng tính Excel.<br>• `outputs/`: Nơi hệ thống xuất xưởng hồ sơ thiết kế và mã nguồn Web App hoàn chỉnh cho từng dự án. |

---

## 🚀 Hướng Dẫn Vận Hành Thực Tế

### 🟢 Cách 1: Tương tác qua Trợ lý Chat (Khuyên Dùng - Kiểm soát tốt nhất)
1. Bạn đặt file yêu cầu vào: `04_workspace/inputs/<tên-file>`.
2. Báo với AI qua chat: *"Tôi đã để file tại `04_workspace/inputs/<tên-file>`, hãy kích hoạt Agent BA phỏng vấn."*
3. AI kích hoạt `02_prompts/01_AGENT_INTAKE_BA.md`, hỏi bạn 1-3 câu trắc nghiệm mỗi lượt để chốt Tech Stack & Nghiệp vụ.
4. AI kích hoạt `02_prompts/02_AGENT_SOLUTION_ARCHITECT.md` để xuất hồ sơ thiết kế chi tiết vào `04_workspace/outputs/<tên-dự-án>/`.
5. Bàn giao cho `03_engine` sinh code tự động ra thư mục output.

### ⚡ Cách 2: Chạy dòng lệnh độc lập với Engine
```bash
cd 03_engine
npm install

# Sinh Web App trực tiếp từ file Spec có sẵn trong workspace:
npm run generate -- ../04_workspace/inputs/my-spec.json ../04_workspace/outputs/my-app
```
Sau đó chỉ việc chạy thử ứng dụng vừa sinh ra:
```bash
cd ../04_workspace/outputs/my-app
npm run dev
```
