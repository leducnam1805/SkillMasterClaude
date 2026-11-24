import { list } from "@/lib/store";
import { latestMonth, monthlySummary } from "@/lib/derived";

/** Bảng điều hành lớp — tổng quan tháng gần nhất. */
export default async function Screen() {
  const month = latestMonth();
  const rows = monthlySummary(month);
  const totalGifts = rows.reduce((s, r) => s + r.gifts, 0);
  const pendingEvents = list("BehaviorEvent").filter((e) => e.status === "PENDING").length;
  const positive = [...rows].sort((a, b) => b.bonus - a.bonus).filter((r) => r.bonus > 0).slice(0, 5);
  const needSupport = rows.filter((r) => r.total < 0 || r.penalty <= -3);

  return (
    <div>
      <p className="muted">Tháng {month}</p>
      <div className="grid">
        <div className="card"><div className="muted">Sĩ số</div><div className="stat">{rows.length}</div></div>
        <div className="card"><div className="muted">Quà dự kiến</div><div className="stat">{totalGifts}</div></div>
        <div className="card"><div className="muted">Sự việc chờ xác nhận</div><div className="stat">{pendingEvents}</div></div>
        <div className="card"><div className="muted">Cần hỗ trợ</div><div className="stat">{needSupport.length}</div></div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <div className="card">
          <strong>Nhiều biểu hiện tích cực</strong>
          {positive.length === 0 && <p className="muted">Chưa có ghi nhận.</p>}
          <ul>{positive.map((r) => <li key={r.studentId}>{r.name} — {r.bonus} lần được khen</li>)}</ul>
        </div>
        <div className="card">
          <strong>Cần quan tâm, hỗ trợ</strong>
          {needSupport.length === 0 && <p className="muted">Không có học sinh nào.</p>}
          <ul>{needSupport.map((r) => <li key={r.studentId}>{r.name} <span className="badge warn">mục tiêu rèn luyện</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
