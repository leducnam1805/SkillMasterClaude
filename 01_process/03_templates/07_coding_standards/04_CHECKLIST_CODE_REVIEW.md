# 📝 Checklist Đánh Giá Mã Nguồn Lập Trình (Code Review & Coding Quality Checklist)

> **Mục tiêu:** Bảng kiểm tra dành cho Tech Lead / Senior Developer khi review Pull Request (PR) hoặc nghiệm thu code trước khi release.

---

## 1. Kiểm Tra Tính Đúng Đắn & Nghiệp Vụ (Functionality & Correctness)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **1.1** | Code giải quyết chính xác 100% yêu cầu trong tài liệu thiết kế (Spec/API/Screen). | [ ] Đạt / [ ] Chưa |  |
| **1.2** | Các điều kiện biên (Edge Cases: null, undefined, số âm, mảng rỗng) đều được xử lý an toàn. | [ ] Đạt / [ ] Chưa |  |
| **1.3** | Không có đoạn code chết (Dead code / Unreachable code) hoặc biến rác không sử dụng. | [ ] Đạt / [ ] Chưa |  |
| **1.4** | Đã xử lý bắt lỗi ngoại lệ (`try / catch`) tại các điểm gọi mạng hoặc I/O file, không làm sập app. | [ ] Đạt / [ ] Chưa |  |

---

## 2. Tiêu Chuẩn Naming & Clean Code (Code Style & Maintainability)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **2.1** | Đặt tên biến, hàm, lớp, bảng, cột tuân thủ đúng chuẩn trong `01_CODING_CONVENTIONS.md`. | [ ] Đạt / [ ] Chưa |  |
| **2.2** | Tuyệt đối không sử dụng kiểu `any` trong TypeScript (`@typescript-eslint/no-explicit-any`). | [ ] Đạt / [ ] Chưa |  |
| **2.3** | Không có hàm nào nhận quá 4 tham số (đã đóng gói thành DTO/Object). | [ ] Đạt / [ ] Chưa |  |
| **2.4** | Không có hàm nào có độ sâu lồng nhau (`Nesting Depth`) vượt quá 3 tầng (đã dùng Guard Clauses). | [ ] Đạt / [ ] Chưa |  |
| **2.5** | Mọi chuỗi thông báo, câu chữ giao diện hoặc mã lỗi đều được import từ file Constants/Messages tập trung. | [ ] Đạt / [ ] Chưa |  |

---

## 3. An Toàn Thông Tin & Bảo Mật (Security & Vulnerabilities)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **3.1** | Không hardcode bất kỳ API Key, mật khẩu DB, JWT Secret nào trong mã nguồn. | [ ] Đạt / [ ] Chưa |  |
| **3.2** | 100% câu truy vấn CSDL đều dùng tham số hóa (Parameterized Query) hoặc ORM, chống triệt để SQL Injection. | [ ] Đạt / [ ] Chưa |  |
| **3.3** | Không lạm dụng `dangerouslySetInnerHTML` trong React, ngăn chặn tấn công XSS. | [ ] Đạt / [ ] Chưa |  |
| **3.4** | Mật khẩu người dùng được băm bằng thuật toán an toàn (`bcrypt`), không lộ hash qua response API. | [ ] Đạt / [ ] Chưa |  |

---

## 4. Tự Động Hóa & Kiểm Thử (Tests & Automated Tools)

| STT | Tiêu Chí Kiểm Tra (Check Item) | Kết Quả | Bằng Chứng / Ghi Chú |
|:---:|---|:---:|---|
| **4.1** | Lệnh linter tự động (`npm run lint` hoặc `flake8`) chạy đạt kết quả: **`0 errors, 0 warnings`**. | [ ] Đạt / [ ] Chưa |  |
| **4.2** | Lệnh build (`npm run build` hoặc `tsc`) vượt qua thành công không phát sinh lỗi biên dịch. | [ ] Đạt / [ ] Chưa |  |
| **4.3** | 100% các hàm nghiệp vụ (Rules) có Unit Test và kết quả chạy `npm test` đều **`PASS`**. | [ ] Đạt / [ ] Chưa |  |
| **4.4** | Tỷ lệ mã trùng lặp (Duplicated code) dưới **`3%`** theo tiêu chuẩn SonarQube. | [ ] Đạt / [ ] Chưa |  |
