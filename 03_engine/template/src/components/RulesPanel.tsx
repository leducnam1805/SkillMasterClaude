"use client";

import { useState } from "react";
import type { RuleDef } from "@/lib/spec";

export default function RulesPanel({ rules }: { rules: RuleDef[] }) {
  const [items, setItems] = useState(rules);

  async function setStatus(id: string, status: RuleDef["status"]) {
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) setItems((xs) => xs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const pending = items.filter((r) => r.status === "PENDING").length;
  return (
    <div>
      {pending > 0 && (
        <div className="card" style={{ borderColor: "var(--warn)" }}>
          Còn <strong>{pending}</strong> quy tắc <span className="badge warn">CHỜ XÁC NHẬN</span>. Hệ thống chỉ dùng chúng làm
          gợi ý cho tới khi thầy/cô xác nhận.
        </div>
      )}
      <table>
        <thead>
          <tr><th>Mã</th><th>Quy tắc</th><th>Mô tả</th><th>Trạng thái</th><th /></tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td><strong>{r.title}</strong></td>
              <td>{r.description}</td>
              <td>
                <span className={`badge ${r.status === "CONFIRMED" ? "good" : "warn"}`}>
                  {r.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xác nhận"}
                </span>
              </td>
              <td>
                {r.status === "PENDING"
                  ? <button className="good" onClick={() => setStatus(r.id, "CONFIRMED")}>Xác nhận</button>
                  : <button onClick={() => setStatus(r.id, "PENDING")}>Bỏ xác nhận</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
