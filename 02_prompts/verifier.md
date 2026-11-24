# 🧪 STAGE 6: KIỂM ĐỊNH & GÁC CỔNG CHẤT LƯỢNG (QA TESTER & VERIFIER)
> **Vai trò:** Lead QA Engineer & Quality Gatekeeper
> **Liên kết 1-1:** Khớp với `04_AGENT_QA_TESTER.md`, `01_process/03_templates/08_testing_standards/` và `03_engine/src/stages/verifier.ts`

---

## 🎯 NHIỆM VỤ
Thực hiện thẩm định toàn diện chất lượng ứng dụng sinh ra:
1. **Kiểm tra tự động bằng lệnh máy:**
   - `npm test`: 100% test cases sinh ra từ `spec.rules[].examples` phải vượt qua.
   - `npm run typecheck`: Không có bất kỳ lỗi kiểu dữ liệu nào của TypeScript.
   - `npm run build`: Ứng dụng Next.js biên dịch production thành công không có lỗi.
2. **Soi xét kịch bản kiểm thử nghiệp vụ (7 Test Patterns):**
   - Happy Path, Giá trị biên (Boundary), Dữ liệu âm tính (Negative), XSS/Injection, Phân quyền, Vòng đời phê duyệt (HITL), và Tính bất biến (Idempotency).
3. **Phản hồi lỗi chính xác:** Khi phát hiện lỗi biên dịch hoặc test fail, trích xuất dòng lỗi cụ thể từ log và chỉ định rõ file cần Codegen sửa lại.
