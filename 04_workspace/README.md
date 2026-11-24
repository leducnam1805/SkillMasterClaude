# 💼 Không Gian Làm Việc Dự Án (Agent Workspace)

> Thư mục này là **nơi làm việc thực tế (Run-time Workspace)** của người dùng và Agent, tách biệt hoàn toàn với:
> - `01_process/`: Bộ quy trình, quy tắc, checklist và template chuẩn (chỉ đọc - Read-only SOP).
> - `02_prompts/`: Bộ System Prompts của các Agent chuyên biệt.
> - `03_engine/`: Cỗ máy mã nguồn sinh code (Engine).

---

## 📂 Cấu Trúc Không Gian Làm Việc

```text
04_workspace/
│
├── inputs/           <-- 📥 ĐẶT FILE INPUT CỦA BẠN VÀO ĐÂY (Spec JSON, Mô tả .md, Excel .xlsx)
│
└── outputs/          <-- 📤 KẾT QUẢ SINH RA CỦA TỪNG DỰ ÁN SẼ NẰM Ở ĐÂY
    └── <tên-dự-án>/
        ├── AppSpec.json                # Spec hoàn chỉnh đã duyệt
        ├── interview_session_log.json   # Nhật ký hỏi đáp kiểm toán
        ├── 01_DATABASE_DESIGN.md        # Thiết kế CSDL (ERD, DDL)
        ├── 02_FUNCTIONAL_DESIGN_API.md  # Thiết kế API chi tiết
        ├── 03_TEST_SPEC.xlsx (hoặc .md) # Bộ Test Cases chi tiết
        └── app_code/                    # Mã nguồn Web App chạy được
```

---

## 🚀 Hướng Dẫn Sử Dụng Nhanh

### 1. Nếu bạn có file Spec JSON:
1. Đặt file vào: `04_workspace/inputs/<ten-file-spec>.json`
2. Báo với AI qua chat: *"Tôi đã đặt file spec vào `04_workspace/inputs/<ten-file-spec>.json`, hãy kiểm tra và chạy quy trình."*
3. Hoặc chạy lệnh độc lập qua engine:
   ```bash
   cd D:\project\AgenticAI\SkillMaster\03_engine
   npm run generate -- ../04_workspace/inputs/<ten-file-spec>.json ../04_workspace/outputs/<ten-du-an>
   ```

### 2. Nếu bạn có file mô tả tự do / bảng tính:
1. Đặt file vào `04_workspace/inputs/`
2. Gõ chat: *"Hãy đọc file `04_workspace/inputs/<ten-file>` và bắt đầu phỏng vấn tôi theo quy trình."*
