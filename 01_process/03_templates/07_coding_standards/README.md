# 💻 Tiêu Chuẩn Kỹ Thuật Lập Trình & Chất Lượng Mã Nguồn (Coding Standards & SonarQube Quality)

> Thư mục này định nghĩa toàn diện bộ khung tiêu chuẩn lập trình (Coding Conventions, Quy tắc SonarQube, Cấu hình CheckStyle tự động và Checklist Code Review) áp dụng cho mọi dự án phần mềm.

---

## 📂 Danh Mục Tài Liệu Tiêu Chuẩn Kỹ Thuật

| Thứ Tự | Tên Tài Liệu | Trọng Tâm & Quy Chuẩn Áp Dụng |
|:---:|---|---|
| **01** | [01_CODING_CONVENTIONS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/01_CODING_CONVENTIONS.md) | **Quy ước đặt tên & Phong cách mã nguồn:**<br>• Ma trận Naming: camelCase (biến/hàm), PascalCase (Class/Type), UPPER_SNAKE_CASE (hằng số), kebab-case (file/route), snake_case (bảng/cột DB).<br>• Quy chuẩn thụt lề (2 spaces cho TS/JS/JSON, 4 spaces cho Python), giới hạn 100-120 ký tự/dòng, thứ tự import chuẩn. |
| **02** | [02_SONARQUBE_QUALITY_RULES.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/02_SONARQUBE_QUALITY_RULES.md) | **Tiêu chuẩn SonarQube Quality Gate:**<br>• **0 Vulnerabilities, 0 Bugs nghiêm trọng**, độ trùng lặp code < 3%, độ phủ test > 80%.<br>• Chống triệt để SQL Injection (Parameterized Query), chống XSS.<br>• Giới hạn độ phức tạp chu trình (Cyclomatic Complexity ≤ 15), độ sâu lồng nhau (Nesting Depth ≤ 3 tầng, dùng Guard Clauses), hàm không quá 4 tham số. |
| **03** | [03_CHECKSTYLE_CONFIGS.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/03_CHECKSTYLE_CONFIGS.md) | **Cấu hình Linter & CheckStyle tự động:**<br>• File mẫu `.eslintrc.json` nghiêm ngặt (cấm `any`, kiểm tra hooks).<br>• File mẫu `.prettierrc` định dạng code tự động.<br>• Cấu hình Flake8 / Black / isort cho Python.<br>• Mẫu Git Pre-commit Hook tự động chặn commit code bẩn. |
| **04** | [04_CHECKLIST_CODE_REVIEW.md](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/07_coding_standards/04_CHECKLIST_CODE_REVIEW.md) | **Bảng Checklist nghiệm thu mã nguồn (Code Review):**<br>• Rà soát tính đúng đắn nghiệp vụ, kiểm soát lỗi ngoại lệ try/catch.<br>• Kiểm tra Clean code, cấm `any`, import hằng số tập trung.<br>• Kiểm tra an ninh bảo mật, chạy `npm run lint` đạt 0 error/0 warning, `npm test` 100% Pass. |
