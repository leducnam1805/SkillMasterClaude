# 🧭 Hướng Dẫn Vận Hành Quy Trình Thiết Kế Phần Mềm Chuẩn Hóa (Standard Software Design Process)

> Thư mục **`01_process/`** là bộ quy trình làm việc chuẩn (Standard Operating Procedure - SOP) độc lập, trung lập với mọi công nghệ, dùng để chuyển hóa yêu cầu của người dùng thành thiết kế phần mềm hoàn chỉnh và bàn giao sang khâu lập trình.

---

## 🗺️ Bản Đồ Luồng Làm Việc (End-to-End Workflow Map)

```mermaid
flowchart TD
    %% GIAI ĐOẠN 1: TIẾP NHẬN & PHỎNG VẤN INTAKE
    subgraph Phase1 [Giai đoạn 1: Tiếp nhận & Vòng lặp phỏng vấn xoay vòng]
        In1[Văn bản mô tả thô] --> InCheck{Phân loại Input}
        In2[File Spec JSON/YAML] --> InCheck
        In3[Bảng tính Excel/Tài liệu] --> InCheck
        InCheck --> InputDoc[01_inputs/INPUT_SPECIFICATIONS.md]
        InputDoc --> IntakeLoop[01_inputs/ITERATIVE_INTAKE_LOOP.md<br>🔄 Vòng lặp Hỏi - Đáp - Đánh giá - Cập nhật]
        IntakeLoop <--> IntakeQ[01_inputs/INTAKE_QUESTIONNAIRE.md<br>Checklist câu hỏi Tech & Biz]
        IntakeLoop --> AuditLog[01_inputs/TEMPLATE_INTERVIEW_SESSION_LOG.json<br>📜 Lưu vết Q&A, Đánh giá, Kết quả]
    end

    %% GIAI ĐOẠN 2: PHÂN TÍCH & ĐẶC TẢ GIẢI PHÁP
    subgraph Phase2 [Giai đoạn 2: Lập đặc tả giải pháp & Chặn AI tự suy đoán]
        AuditLog --> BoundaryCheck[02_rules/05_AI_DECISION_BOUNDARIES.md<br>Ranh giới Zero-Assumption]
        BoundaryCheck --> KnowDoc[04_knowledge/SOLUTION_MODELS_KNOWLEDGE.md]
        KnowDoc --> RuleGov[02_rules/ - Bộ 5 Quy tắc cốt lõi]
        RuleGov --> BuildSpec[03_templates/01_solution_spec/APP_SPEC_TEMPLATE.json<br>Có tech_stack & interview_session]
        BuildSpec --> GateSpec{CỔNG DUYỆT 0:<br>06_quality_checklists/00_CHECKLIST_SPEC_COMPLETION_GATE.md<br>& Người dùng APPROVE}
    end

    %% GIAI ĐOẠN 3: THIẾT KẾ KỸ THUẬT CHI TIẾT
    subgraph Phase3 [Giai đoạn 3: Thiết kế kỹ thuật chi tiết]
        GateSpec -- ĐẠT 100% --> DBDesign[03_templates/02_database_design/]
        GateSpec -- ĐẠT 100% --> ConstDesign[03_templates/03_standards_constants/]
        GateSpec -- ĐẠT 100% --> InfraDesign[03_templates/04_integrations_infra/]
        GateSpec -- ĐẠT 100% --> FuncDesign[03_templates/05_functional_design/ - API, Batch, Screen]
    end

    %% GIAI ĐOẠN 4: NGHIỆM THU CHẤT LƯỢNG
    subgraph Phase4 [Giai đoạn 4: Nghiệm thu QA & Chuẩn Coding]
        DBDesign --> QAGate[06_quality_checklists/ - Bộ 5 Checklist riêng biệt]
        ConstDesign --> QAGate
        InfraDesign --> QAGate
        FuncDesign --> QAGate
        QAGate --> CodeStd[03_templates/07_coding_standards/ - SonarQube & CheckStyle]
    end

    %% GIAI ĐOẠN 5: BÀN GIAO LẬP TRÌNH
    subgraph Phase5 [Giai đoạn 5: Bàn giao sản phẩm]
        CodeStd --> OutSpec[05_outputs/DELIVERABLE_SPEC.md]
        OutSpec --> DevEngine([Bàn giao sang 03_engine để sinh mã nguồn])
    end
```

---

## 📂 Danh Mục Cấu Trúc Thư Mục 01_process

| Thư mục / Thành phần | Chức năng trong quy trình |
|---|---|
| **`01_inputs/`** | Tiếp nhận và chuẩn hóa 3 dạng đầu vào: Mô tả tự do, File Spec có sẵn, Dữ liệu bảng tính. |
| **`02_rules/`** | Bộ 4 quy tắc cốt lõi: Đạo đức nghiệp vụ, AI & HITL, Kỹ thuật lập trình, An toàn bảo mật. |
| **`03_templates/`** | Hệ thống khung mẫu phân tầng: Solution Spec, Database ERD, Enums/Messages, Infra, Functional Design (API/Batch/Screen), 5 Checklist QA, Coding Standards. |
| **`04_knowledge/`** | Cơ sở tri thức mô hình giải pháp: Token economy, Game hóa, Đội nhóm, Mục tiêu cá nhân. |
| **`05_outputs/`** | Tiêu chuẩn nghiệm thu sản phẩm đầu ra khi bàn giao (Ứng dụng chạy được, Hướng dẫn, Báo cáo). |
