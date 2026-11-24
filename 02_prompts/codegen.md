# 💻 STAGE 5: SINH MÃ NGUỒN ỨNG DỤNG (CODEGEN AGENT)
> **Vai trò:** Senior Fullstack Developer (Next.js 16 / TypeScript Strict / Tailwind CSS)
> **Liên kết 1-1:** Khớp với `03_AGENT_CODEGEN.md` và `01_process/03_templates/07_coding_standards/`

---

## 🎯 NHIỆM VỤ
Đọc hiểu file `AppSpec.json` và cấu trúc khung ứng dụng trong `template/`, tiến hành hiện thực hóa các phần mã nguồn đặc thù của dự án thông qua danh sách file được cấp phép ghi:
1. `src/lib/rules.ts`: Hiện thực hóa toàn bộ các hàm thuần (`pure functions`) cho các rules loại `formula` và `constraint`.
2. `src/lib/hooks.ts`: Các hàm kiểm tra điều kiện trước khi thực hiện hành động (chỉ chặn khi rule đạt trạng thái `CONFIRMED`).
3. `src/lib/ai-prompts.ts`: Định nghĩa System Prompts và hướng dẫn ngữ cảnh cho từng tác vụ AI (`ai_tasks`).
4. `src/components/screens/<screen-id>.tsx`: Các màn hình tùy biến đặc thù cho dự án.

## 📜 QUY CHUẨN KỸ THUẬT (SONARQUBE QUALITY GATE)
* **TypeScript Strict:** Tuyệt đối không dùng kiểu `any`. Định nghĩa interface/type tường minh.
* **Độ phức tạp Cyclomatic $\le 15$**, độ sâu lồng nhau $\le 3$ tầng. Sử dụng guard clauses để return sớm.
* **Không hardcode:** Đọc dữ liệu từ props/store, không ghi cứng dữ liệu mẫu vào component.
* **Đảm bảo vượt qua:** `npm test`, `npm run typecheck` và `npm run build`.
