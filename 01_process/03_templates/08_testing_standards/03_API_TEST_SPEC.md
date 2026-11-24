# 🔌 Khung Kịch Bản Kiểm Thử Chi Tiết API (API Test Case Specification)

> **Mục tiêu:** Định dạng chuẩn hóa kịch bản kiểm thử API, phân tách chi tiết giữa Header/Body đầu vào và Status/Message/Body mong đợi so với thực tế, khớp 100% với file biểu mẫu Excel thực tế: [`api_testcases_template.xlsx`](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/api_testcases_template.xlsx).

---

## 1. Sheet "Overall" (Thông Tin Quản Lý API & Phương Thức)

| Khối Dữ Liệu | Thuộc Tính (Attribute) | Giá Trị Mẫu / Hướng Dẫn |
|---|---|---|
| **META DATA** | **Project Name:** | `<Tên Dự Án Phần Mềm>` |
| | **Start / End Date:** | `YYYY-MM-DD` |
| **METHOD LEGEND** | **Các phương thức:** | `GET` \| `POST` \| `PUT` \| `DELETE` \| `PATCH` \| `HEAD` \| `OPTIONS` |
| **STATUS LEGEND** | **Trạng thái thực thi:**| `PASSED` \| `FAILED` \| `UNEXECUTED` |
| **APIs OVERALL LIST** | **Danh sách endpoints:** | `No.` \| `Name` \| `Method` \| `API Route Path` |

---

## 2. Sheet Chi Tiết Kịch Bản Kiểm Thử API (Test Cases Sheet)

Cấu trúc chuẩn gồm **16 cột đối chiếu chặt chẽ (Input Request ➔ Expected Response ➔ Actual Response ➔ Status)**:

| STT Cột | Tên Cột Chuẩn (Column Name) | Ý Nghĩa Kỹ Thuật | Ví Dụ Mẫu Hợp Lệ |
|:---:|---|---|---|
| **A** | `ID` | Mã ca kiểm thử API | `API-TC-01`, `API-TC-02` |
| **B** | `NAME` | Mục tiêu kiểm thử của ca này | `Xác thực lấy danh sách thành công với token hợp lệ` |
| **C** | `PRE-CONDITION` | Tiền điều kiện môi trường / CSDL | `Đã có token truy cập hợp lệ; CSDL có sẵn dữ liệu mẫu` |
| **D** | `METHOD` | Phương thức HTTP | `GET` \| `POST` \| `PUT` \| `DELETE` \| `PATCH` |
| **E** | `API` | Đường dẫn endpoint URI | `/api/v1/students` hoặc `/api/v1/students/{id}` |
| **F** | `REQUEST_HEADERS` | Các headers gửi đi | `Authorization: Bearer <token>`<br/>`Content-Type: application/json` |
| **G** | `REQUEST_BODY` | Dữ liệu Payload gửi đi (JSON) | `{"code": "STD-01", "name": "Nguyễn Văn A"}` |
| **H** | `EXPECTED_STATUS` | HTTP Status Code mong đợi | `200` \| `201` \| `400` \| `401` \| `403` \| `404` \| `409` |
| **I** | `EXPECTED_MESSAGE` | Thông điệp phản hồi mong đợi | `"Thành công"` hoặc mã lỗi `"ERR_FIELD_REQUIRED"` |
| **J** | `EXPECTED_HEADERS` | Response Headers mong đợi | `Content-Type: application/json` |
| **K** | `EXPECTED_BODY` | Cấu trúc Body JSON mong đợi | `{"code": "SUCCESS", "data": {"id": "uuid-01", ...}}` |
| **L** | `ACTUAL_STATUS` | HTTP Status Code thực tế đo được | `200` (Nếu khớp với Expected) |
| **M** | `ACTUAL_MESSAGE` | Thông điệp thực tế nhận được | `"Thành công"` |
| **N** | `ACTUAL_HEADERS` | Response Headers thực tế | `Content-Type: application/json` |
| **O** | `ACTUAL_BODY` | Dữ liệu Body thực tế trả về | `{"code": "SUCCESS", "data": {...}}` |
| **P** | `STATUS` | Kết luận ca kiểm thử | `PASSED` \| `FAILED` |

---

## 3. Bảng Ma Trận Kịch Bản Kiểm Thử Mẫu (API Test Matrix)

| ID | NAME | METHOD | API | REQUEST_HEADERS | REQUEST_BODY | EXP_STATUS | EXP_MESSAGE | EXP_BODY | ACTUAL_STATUS | STATUS |
|---|---|:---:|---|---|---|:---:|---|---|:---:|:---:|
| `API-01` | Lấy danh sách thành công | `GET` | `/api/v1/items?page=1` | `Authorization: Bearer <tok>` | None | `200` | `SUCCESS` | `{"data": [...], "total": 20}` | `200` | `PASSED` |
| `API-02` | Tạo mới thiếu trường bắt buộc | `POST` | `/api/v1/items` | `Authorization: Bearer <tok>`<br/>`Content-Type: app/json` | `{"code": ""}` | `422` | `ERR_FIELD_REQUIRED` | `{"detail": "name is required"}` | `422` | `PASSED` |
| `API-03` | Tạo mới trùng mã đã có | `POST` | `/api/v1/items` | `Authorization: Bearer <tok>`<br/>`Content-Type: app/json` | `{"code": "DUPLICATE_01"}` | `409` | `ERR_DUPLICATE_CODE`| `{"detail": "Code already exists"}` | `409` | `PASSED` |
| `API-04` | Không truyền Header Token | `GET` | `/api/v1/items` | `None` | None | `401` | `AUTH_TOKEN_MISSING`| `{"detail": "Unauthorized"}` | `401` | `PASSED` |
| `API-05` | Role thấp gọi API xóa của Admin | `DELETE` | `/api/v1/items/123` | `Authorization: Bearer <viewer_tok>` | None | `403` | `AUTH_ACCESS_DENIED`| `{"detail": "Forbidden"}` | `403` | `PASSED` |
