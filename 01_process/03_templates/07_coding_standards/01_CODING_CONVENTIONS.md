# 📐 Quy Chuẩn Đặt Tên & Định Dạng Mã Nguồn (Naming Conventions & Style Guide)

> **Mục tiêu:** Thống nhất phong cách viết mã nguồn cho toàn bộ dự án (TypeScript, Python, SQL) để đảm bảo tính đồng bộ, dễ đọc và dễ bảo trì.

---

## 1. Quy Ước Đặt Tên (Naming Matrix)

| Thành Phần (Element) | Quy Ước (Case Convention) | Ví Dụ Mẫu Hợp Lệ | Ví Dụ Vi Phạm (Cấm Dùng) |
|---|---|---|---|
| **Biến / Thuộc tính / Hàm** | `camelCase` | `studentList`, `bonusPoints`, `calculateTotal()` | `student_list`, `BonusPoints` |
| **Lớp (Class) / Interface / Type** | `PascalCase` | `StudentModel`, `AuthResponseDto`, `UserRole` | `studentModel`, `auth_dto` |
| **Hằng số / Giá trị Enum** | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`, `ACTIVE` | `MaxRetry`, `defaultPageSize` |
| **Tên File TypeScript/React** | `kebab-case` hoặc `PascalCase` | `auth-service.ts`, `student-controller.ts`, `Button.tsx`| `auth_service.ts`, `Student_View.tsx` |
| **Tên Thư Mục (Directories)** | `kebab-case` hoặc `snake_case` | `components/ui/`, `auth-service/`, `01_process/` | `MyComponents/`, `User Service/` |
| **Bảng Database (Tables)** | `snake_case` số nhiều | `students`, `behavior_events`, `refresh_tokens` | `Student`, `tbl_student`, `Students` |
| **Cột Database (Columns)** | `snake_case` | `student_code`, `total_score`, `created_at` | `studentCode`, `TotalScore` |
| **Chỉ Mục DB (Indexes)** | `idx_<table>_<column>` | `idx_students_code`, `idx_users_email` | `index1`, `student_idx` |
| **Endpoint RESTful API** | `kebab-case` số nhiều | `/api/v1/students`, `/api/v1/auth/refresh-token` | `/api/v1/getStudents`, `/get_all` |

---

## 2. Quy Chuẩn Cấu Trúc File & Định Dạng (Formatting Rules)

* **Thụt lề (Indentation):** Chuẩn `2 spaces` cho TypeScript/JavaScript/JSON/YAML; `4 spaces` cho Python. Tuyệt đối không dùng Tab.
* **Độ dài dòng (Line Length):** Tối đa `100 - 120 ký tự/dòng`. Nếu dài hơn phải chủ động xuống dòng.
* **Dấu chấm phẩy (Semicolons):** Bắt buộc có dấu chấm phẩy `;` ở cuối dòng trong TypeScript/JavaScript.
* **Dấu nháy (Quotes):** Ưu tiên nháy kép `"` hoặc nháy đơn `'` đồng bộ theo cấu hình ESLint/Prettier của dự án.
* **Thứ tự Imports (Import Order):**
  1. *Thư viện bên thứ ba (Node/React/Next.js/FastAPI):* `import React from 'react';`
  2. *Modules nội bộ hệ thống (Absolute/Alias `@/`):* `import { settings } from '@/core/config';`
  3. *Components / Services cục bộ (Relative `../`):* `import { Header } from '../components/Header';`
  4. *Types / Interfaces:* `import type { StudentDto } from '@/types/student';`
  5. *Styles:* `import './styles.css';`
