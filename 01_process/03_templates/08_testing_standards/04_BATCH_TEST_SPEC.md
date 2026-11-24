# ⚙️ Khung Kịch Bản Kiểm Thử Tiến Trình Định Kỳ (Batch / Cron Job Test Specification)

> **Mục tiêu:** Định dạng chuẩn hóa kịch bản kiểm thử cho các tác vụ chạy nền, xử lý dữ liệu lớn (Batch Jobs / Scheduled Workers), kế thừa cấu trúc chuẩn của bộ kiểm thử chức năng và API.

---

## 1. Thông Tin Quản Lý Tiến Trình (Batch Metadata)

| Khối Dữ Liệu | Thuộc Tính Đặc Tả | Giá Trị Mẫu / Hướng Dẫn |
|---|---|---|
| **BATCH META** | **Batch Job ID:** | `<BAT-MOD-001: Ví dụ: BAT-AUDIT-001, BAT-CLEAN-002>` |
| | **Tên Tiến Trình:** | `<Tên tiến trình: Quét kiểm toán / Đồng bộ dữ liệu / Dọn dẹp token>` |
| | **Lịch Chạy (Schedule):** | `Cron: 0 0 * * * (Hàng ngày lúc 00:00)` |
| | **Chunk Size Chuẩn:** | `500 bản ghi / transaction` |

---

## 2. Bảng Ma Trận Kịch Bản Kiểm Thử Batch (Batch Test Execution Matrix)

| Test Case ID | Mục Tiêu Kiểm Thử | Dữ Liệu Nguồn (Input Source State) | Lệnh Kích Hoạt (Trigger Command) | Kết Quả Mong Đợi (Expected Outcome) | Kiểm Tra Câu Lệnh SQL Thuần (DB State Verify) | Kết Quả Thực Tế | Trạng Thái (Pass/Fail) |
|---|---|---|---|---|---|---|:---:|
| `BAT-01` | Chạy thành công phân khối lớn | 1.200 bản ghi `status = 'PENDING'` | `run_batch(BAT-01)` | Chạy đúng 3 chunks (500, 500, 200 dòng). Không tràn RAM | `SELECT COUNT(*) FROM table WHERE status = 'PROCESSED'` trả về đúng `1200` | Đúng 3 chunks, hoàn tất trong 1.5s | **PASSED** |
| `BAT-02` | Chống chạy đè (Running Lock) | Job đang chạy ở chunk 1 | Kích hoạt thêm lần 2 trong khi Job 1 chưa xong | Lần 2 bị từ chối ngay lập tức; Bật log: "Job is already running" | Không tạo bản ghi khóa thứ hai trong bảng `batch_locks` | Lần 2 bị bỏ qua êm thấm | **PASSED** |
| `BAT-03` | Chịu lỗi từng phần (Fault Tolerance) | Cố tình tạo bản ghi số 501 có dữ liệu sai | `run_batch(BAT-01)` | 1.199 bản ghi thành công; Bản ghi 501 bị bỏ qua và ghi log lỗi | `SELECT COUNT(*) FROM batch_error_logs WHERE batch_id = 'BAT-01'` trả về `1` | Bản ghi lỗi được cách ly an toàn | **PASSED** |
| `BAT-04` | Xử lý khi nguồn dữ liệu rỗng | Bảng nguồn không có bản ghi nào | `run_batch(BAT-01)` | Tiến trình kết thúc ngay; Không báo lỗi; Ghi log `total_processed = 0` | Không có bản ghi nào bị cập nhật sai | Hoàn thành trong 50ms, log 0 records | **PASSED** |
