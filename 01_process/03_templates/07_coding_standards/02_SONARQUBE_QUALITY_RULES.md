# 🛡️ Tiêu Chuẩn Phân Tích Mã Tĩnh SonarQube & Chất Lượng Phần Mềm (SonarQube Quality Gate)

> **Mục tiêu:** Áp dụng bộ quy tắc kiểm soát nợ kỹ thuật (Technical Debt), phát hiện lỗ hổng bảo mật (Vulnerabilities), mã bốc mùi (Code Smells) theo tiêu chuẩn quốc tế của SonarQube/SonarCloud.

---

## 1. Tiêu Chuẩn Cổng Chất Lượng Tối Thiểu (Quality Gate Thresholds)

Bất kỳ pull request (PR) hoặc bản build nào vi phạm các chỉ số dưới đây đều bị **Chặn (Block Build)** không cho phép merge lên nhánh chính:

| Tiêu Chí (Metric) | Mức Cho Phép Tối Đa / Tối Thiểu | Hành Động Khi Vi Phạm |
|---|---|---|
| **Lỗ hổng bảo mật (Vulnerabilities):** | **`0`** (Không chấp nhận bất kỳ lỗi nào) | 🔴 Block Build / Khóa deploy |
| **Lỗi nghiêm trọng (Bugs - Blocker/Critical):** | **`0`** | 🔴 Block Build |
| **Điểm nóng bảo mật (Security Hotspots):** | **100%** phải được rà soát thủ công | 🟡 Yêu cầu Security Lead review |
| **Mã trùng lặp (Duplicated Lines Density):** | Dưới **`3.0%`** tổng số dòng code | 🔴 Block Build nếu vượt 3% |
| **Độ phủ kiểm thử (Test Coverage):** | Tối thiểu **`80.0%`** trên mã nguồn mới | 🔴 Block Build nếu dưới 80% |
| **Mã bốc mùi (Code Smells - Maintainability):** | Xếp hạng **`A`** (Dưới 5% Debt Ratio) | 🟡 Yêu cầu Refactor |

---

## 2. Các Quy Tắc SonarQube Bắt Buộc Tuân Thủ (Critical Sonar Rules)

### A. Nhóm Lỗi & Lỗ Hổng Bảo Mật (Vulnerabilities & Bugs)
1. **Chống SQL Injection (Sonar Rule: `typescript:S2077` / `python:S3649`):**
   - ❌ **Cấm:** Nối chuỗi câu lệnh SQL `db.execute("SELECT * FROM users WHERE id = '" + id + "'")`.
   - ✅ **Đúng:** Luôn dùng câu lệnh tham số hóa (Parameterized Query) hoặc ORM: `query.filter(User.id == id)` hoặc `:id`.
2. **Không làm rò rỉ thông tin nhạy cảm (Sonar Rule: `typescript:S6437`):**
   - Tuyệt đối cấm hardcode API Keys, Passwords, Token Secrets trực tiếp trong mã nguồn.
3. **Chống tấn công XSS trong React (Sonar Rule: `typescript:S5147`):**
   - Cấm lạm dụng `dangerouslySetInnerHTML`. Bắt buộc dùng thư viện sanitize như `DOMPurify` nếu cần render HTML an toàn.

### B. Nhóm Độ Phức Tạp & Khả Năng Duy Trì (Maintainability & Complexity)
1. **Độ phức tạp chu trình (Cyclomatic Complexity - Rule: `typescript:S1541`):**
   - Một hàm không được có độ phức tạp vượt quá **`15`** (quá nhiều nhánh `if/else`, `switch/case` lồng nhau). Nếu vượt quá phải tách nhỏ thành các hàm con.
2. **Độ sâu lồng nhau (Cognitive Complexity / Nesting Depth):**
   - Không được lồng quá **`3 tầng`** vòng lặp hoặc điều kiện:
     ```typescript
     // ❌ Vi phạm (Lồng 4 tầng)
     if (a) {
       for (const x of list) {
         if (x.active) {
           if (x.score > 0) { ... }
         }
       }
     }
     
     // ✅ Đúng (Dùng Guard Clauses return sớm để làm phẳng code)
     if (!a) return;
     const activeItems = list.filter(x => x.active && x.score > 0);
     ```
3. **Số lượng tham số truyền vào hàm (Function Parameters):**
   - Một hàm không nhận quá **`4 tham số`**. Nếu cần truyền nhiều hơn, bắt buộc gom thành một Object / DTO:
     ```typescript
     // ❌ Cấm: function createStudent(name, age, gender, address, phone, email)
     // ✅ Đúng: function createStudent(payload: CreateStudentDto)
     ```
