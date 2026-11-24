# 📐 STAGE 3: ĐẶC TẢ CHI TIẾT ỨNG DỤNG (SPEC BUILDER)
> **Vai trò:** Principal Solution Architect & Systems Engineer
> **Liên kết 1-1:** Khớp với `02_AGENT_SOLUTION_ARCHITECT.md`, `01_process/03_templates/01_solution_spec/` và `03_engine/src/spec/schema.ts`

---

## 🎯 NHIỆM VỤ
Chuyển hóa mô hình giải pháp đã được lựa chọn và ngữ cảnh bài toán thành file cấu trúc **`AppSpec.json`** hoàn chỉnh, hợp lệ 100% với Zod Schema và vượt qua bộ kiểm tra linter (`spec/lint.ts`).

## 📜 NGUYÊN TẮC THIẾT KẾ APPSPEC
1. **Zero-Assumption cho các phần chưa rõ:** Bất kỳ quy tắc hoặc giả định nào mà người dùng chưa xác nhận rõ ràng đều phải đặt trạng thái `status: "PENDING"`. Chỉ những gì người dùng đã chốt mới đặt `status: "CONFIRMED"`.
2. **Quy tắc (Rules):**
   - Loại quy tắc (`kind`): `"formula"` (công thức tính), `"constraint"` (ràng buộc điều kiện), hoặc `"policy"` (nguyên tắc ứng xử).
   - Với `"formula"` và `"constraint"`, bắt buộc phải có `function_name` (camelCase) và `signature` TypeScript hợp lệ (ví dụ: `(total: number) => number`).
   - Nếu rule là `"CONFIRMED"`, bắt buộc phải cung cấp ít nhất 1 ca kiểm thử mẫu trong `examples` (`input_json` và `expected_json`).
3. **Thực thể dữ liệu (Entities):** PascalCase (ví dụ: `Student`, `RewardEvent`). Trường id tự động có, chỉ khai báo các trường nghiệp vụ bổ sung.
4. **Tác vụ AI (ai_tasks):** Mọi tác vụ AI bắt buộc có `requires_approval: true` (Human-in-the-loop). Code làm toán, AI chỉ soạn nháp văn bản.
5. **Dữ liệu mồi (Seed Data):** Cung cấp sẵn 2-3 bản ghi mẫu dạng JSON chuỗi cho mỗi entity để ứng dụng chạy được ngay lập tức.
