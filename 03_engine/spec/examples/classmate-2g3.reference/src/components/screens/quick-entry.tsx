"use client";

import { useEffect, useState } from "react";

type Row = Record<string, unknown> & { id: string };

/** Ghi nhận nhanh — chọn học sinh, bấm 1 chạm vào tiêu chí. */
export default function Screen() {
  const [students, setStudents] = useState<Row[]>([]);
  const [criteria, setCriteria] = useState<Row[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    void (async () => {
      const [s, c] = await Promise.all([
        fetch("/api/data/Student").then((r) => r.json() as Promise<{ data: Row[] }>),
        fetch("/api/data/Criterion").then((r) => r.json() as Promise<{ data: Row[] }>),
      ]);
      setStudents(s.data);
      setCriteria(c.data.filter((x) => x.active !== false));
    })();
  }, []);

  async function record(c: Row) {
    if (!studentId) return;
    const res = await fetch("/api/data/BehaviorEvent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        student: studentId,
        criterion: c.id,
        date: new Date().toISOString().slice(0, 10),
        status: "CONFIRMED",
      }),
    });
    const name = students.find((s) => s.id === studentId)?.displayName;
    if (res.ok) setMessage({ ok: true, text: `Đã ghi: ${String(name)} — ${String(c.label)} (${Number(c.points) > 0 ? "+" : ""}${String(c.points)})` });
    else setMessage({ ok: false, text: ((await res.json()) as { error?: string }).error ?? "Lỗi" });
  }

  const bonus = criteria.filter((c) => c.type === "BONUS");
  const penalty = criteria.filter((c) => c.type === "PENALTY");

  return (
    <div>
      <div className="card">
        <strong>1. Chọn học sinh</strong>
        <div className="chip-grid" style={{ marginTop: 10 }}>
          {students.map((s) => (
            <button key={s.id} className={`chip${s.id === studentId ? " selected" : ""}`} onClick={() => setStudentId(s.id)}>
              {String(s.displayName)}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <strong>2. Bấm vào hành vi</strong>
        <p className="muted">Điểm cộng</p>
        <div className="chip-grid">
          {bonus.map((c) => (
            <button key={c.id} className="chip" disabled={!studentId} onClick={() => record(c)}>
              {String(c.label)} <span className="badge good">+{String(c.points)}</span>
            </button>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 12 }}>Cần rèn luyện</p>
        <div className="chip-grid">
          {penalty.map((c) => (
            <button key={c.id} className="chip" disabled={!studentId} onClick={() => record(c)}>
              {String(c.label)} <span className="badge warn">{String(c.points)}</span>
            </button>
          ))}
        </div>
        {message && <p className={message.ok ? "muted" : "error"}>{message.text}</p>}
      </div>
    </div>
  );
}
