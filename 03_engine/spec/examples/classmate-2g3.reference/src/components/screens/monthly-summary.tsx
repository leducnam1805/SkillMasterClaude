import { latestMonth, monthlySummary } from "@/lib/derived";

/** Tổng kết tháng — điểm âm hiển thị là "Mục tiêu rèn luyện", không hiện con số âm (R-005). */
export default async function Screen() {
  const month = latestMonth();
  const rows = monthlySummary(month);
  return (
    <div>
      <p className="muted">Tháng {month} · chỉ tính sự việc đã xác nhận</p>
      <table>
        <thead>
          <tr><th>Học sinh</th><th>Tổ</th><th>Điểm cộng</th><th>Tổng điểm</th><th>Số quà</th><th>Điểm dư</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.studentId}>
              <td>{r.name}</td>
              <td>{r.group ?? "—"}</td>
              <td>+{r.bonus}</td>
              <td>{r.total >= 0 ? r.total : <span className="badge warn">Mục tiêu rèn luyện</span>}</td>
              <td>{r.gifts > 0 ? <span className="badge good">{r.gifts} 🎁</span> : "0"}</td>
              <td>{r.total >= 0 ? r.remainder : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
