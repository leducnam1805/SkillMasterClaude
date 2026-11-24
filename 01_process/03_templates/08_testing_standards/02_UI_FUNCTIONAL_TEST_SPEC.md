# 📊 Khung Kịch Bản Kiểm Thử Giao Diện & Chức Năng (UI / Functional Test Case Specification)

> **Mục tiêu:** Định dạng chuẩn hóa kịch bản kiểm thử giao diện màn hình (Screen) và chức năng nghiệp vụ, khớp 100% với file biểu mẫu Excel thực tế: [`testcase_template.xlsx`](file:///d:/project/AgenticAI/SkillMaster/01_process/03_templates/08_testing_standards/testcase_template.xlsx).

---

## 1. Sheet "Overall" (Thông Tin Quản Lý Dự Án & Timeline)

| Khối Dữ Liệu | Thuộc Tính (Attribute) | Giá Trị Mẫu / Hướng Dẫn |
|---|---|---|
| **META DATA** | **Project Name:** | `<Tên Dự Án Phần Mềm>` |
| | **Start Date:** | `YYYY-MM-DD` |
| | **End Date:** | `YYYY-MM-DD` |
| **LEGEND: PRIORITY** | **Mức độ ưu tiên:** | `CRITICAL` \| `HIGH` \| `NORMAL` \| `LOW` |
| **LEGEND: STATUS** | **Trạng thái thực thi:**| `PASSED` \| `FAILED` \| `UNEXECUTED` \| `BLOCKED` |
| **TIMELINE / RELEASE**| **Các mốc Release:** | `R1`, `R2`, `R3`... kèm ngày và trọng số (Weight) |

---

## 2. Sheet Chi Tiết Kịch Bản Chức Năng / Màn Hình (Feature Sheets)

Cấu trúc chuẩn gồm **14 cột thuộc tính** phản ánh chi tiết toàn bộ chu trình kiểm thử:

| STT Cột | Tên Cột Chuẩn (Column Name) | Ý Nghĩa Nghiệp Vụ | Ví Dụ Mẫu Hợp Lệ |
|:---:|---|---|---|
| **A** | `ID` | Mã định danh ca kiểm thử | `SCR-LG-01`, `SCR-STD-02` |
| **B** | `NAME` | Tên tóm tắt mục tiêu kiểm thử | `Xác thực đăng nhập thành công với tài khoản hợp lệ` |
| **C** | `PRECONDITION` | Tiền điều kiện trước khi thực hiện | `Tài khoản đã tồn tại trong CSDL và đang ACTIVE` |
| **D** | `TEST_STEP` | Các bước thao tác tuần tự của người dùng | `1 - Truy cập URL trang đăng nhập`<br/>`2 - Nhập username hợp lệ`<br/>`3 - Nhập mật khẩu hợp lệ`<br/>`4 - Bấm nút 'Đăng nhập'` |
| **E** | `TEST_DATA` | Dữ liệu đầu vào điền vào form | `username: "admin@edu.vn" / password: "Secret@2026"` |
| **F** | `EXPECTED_RESULT` | Kết quả mong đợi trên giao diện | `Đăng nhập thành công, chuyển hướng vào trang Dashboard` |
| **G** | `POST_CONDITION` | Trạng thái hệ thống sau khi test | `Người dùng ở trang chủ, Token được lưu vào LocalStorage` |
| **H** | `PRIORITY` | Mức độ ưu tiên | `CRITICAL` \| `HIGH` \| `NORMAL` \| `LOW` |
| **I** | `ACTUAL_RESULT` | Kết quả thực tế khi chạy test | `Đăng nhập thành công, màn hình điều hướng đúng` |
| **J** | `STATUS` | Trạng thái kết quả | `PASSED` \| `FAILED` \| `UNEXECUTED` |
| **K** | `DESIGN_BY` | Người thiết kế kịch bản test | `<Tên Tester / QA Lead>` |
| **L** | `DESIGN_DATE` | Ngày tạo kịch bản | `YYYY-MM-DD` |
| **M** | `EXECUTE_BY` | Người thực hiện test thực tế | `<Tên Tester>` |
| **N** | `EXECUTE_DATE` | Ngày thực hiện test | `YYYY-MM-DD` |

---

## 3. Bảng Kịch Bản Mẫu Áp Dụng (Sample Execution Table)

| ID | NAME | PRECONDITION | TEST_STEP | TEST_DATA | EXPECTED_RESULT | POST_CONDITION | PRIORITY | STATUS |
|---|---|---|---|---|---|---|:---:|:---:|
| `SCR-01` | Mở màn hình hiển thị đủ dữ liệu | Người dùng đã đăng nhập; DB có 20 bản ghi | 1. Mở màn hình<br/>2. Quan sát giao diện | N/A | Khung Skeleton loading xuất hiện; sau đó hiển thị bảng 20 dòng | Ở trang 1/5 | `HIGH` | `PASSED` |
| `SCR-02` | Bỏ trống ô bắt buộc khi thêm mới | Mở modal thêm mới | 1. Bỏ trống ô Tên<br/>2. Bấm nút Lưu | `name: ""` | Bị chặn lại; Dưới ô nhập hiển thị lỗi đỏ: "Không được để trống" | Modal vẫn mở | `CRITICAL` | `PASSED` |
| `SCR-03` | Lọc tìm kiếm theo từ khóa | Đang ở màn hình danh sách | 1. Gõ từ khóa vào ô tìm kiếm | `keyword: "An"` | Sau 300ms (debounce), bảng tự động lọc lại kết quả khớp | Danh sách chỉ còn các dòng có chứa từ "An" | `NORMAL` | `PASSED` |
| `SCR-04` | Xóa bản ghi có xác nhận | Có ít nhất 1 bản ghi | 1. Bấm nút Xóa<br/>2. Bấm "Hủy" trên Modal | ID bản ghi | Modal xác nhận đóng lại; Bản ghi vẫn còn nguyên vẹn | Không thay đổi CSDL | `NORMAL` | `PASSED` |
