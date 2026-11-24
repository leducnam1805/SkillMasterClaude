"use client";

import { useState } from "react";
import type { AiTaskDef } from "@/lib/spec";
import type { Draft } from "@/lib/store";

type Option = { id: string; label: string };

const STATUS_LABEL: Record<Draft["status"], { text: string; cls: string }> = {
  DRAFT: { text: "Bản nháp — chờ duyệt", cls: "warn" },
  APPROVED: { text: "Đã duyệt", cls: "good" },
  REJECTED: { text: "Đã loại", cls: "info" },
};

export default function AiAssistant({ tasks, subjects, initialDrafts }: { tasks: AiTaskDef[]; subjects: Record<string, Option[]>; initialDrafts: Draft[] }) {
  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const task = tasks.find((t) => t.id === taskId);
  const options = task ? subjects[task.subject_entity] ?? [] : [];
  const [subjectId, setSubjectId] = useState(options[0]?.id ?? "");
  const [tone, setTone] = useState(task?.tones[0] ?? "");
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labelOf = (d: Draft) => {
    const t = tasks.find((x) => x.id === d.taskId);
    return (t ? subjects[t.subject_entity] ?? [] : []).find((o) => o.id === d.subjectId)?.label ?? d.subjectId;
  };

  async function generate() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ taskId, subjectId, tone }),
    });
    const json = (await res.json()) as { data?: Draft; error?: string };
    setBusy(false);
    if (!res.ok || !json.data) return setError(json.error ?? "Lỗi");
    setDrafts((d) => [json.data!, ...d]);
  }

  async function patch(id: string, body: { text?: string; status?: Draft["status"] }) {
    const res = await fetch(`/api/ai/drafts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { data?: Draft; error?: string };
    if (json.data) setDrafts((ds) => ds.map((d) => (d.id === id ? json.data! : d)));
    else setError(json.error ?? "Lỗi");
  }

  return (
    <div>
      <div className="card">
        <div className="form-grid">
          <label>Tác vụ
            <select value={taskId} onChange={(e) => { const t = tasks.find((x) => x.id === e.target.value); setTaskId(e.target.value); setTone(t?.tones[0] ?? ""); setSubjectId((t ? subjects[t.subject_entity] ?? [] : [])[0]?.id ?? ""); }}>
              {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </label>
          <label>Đối tượng
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
          <label>Giọng văn
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              {(task?.tones ?? []).map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
          <button className="primary" disabled={busy || !subjectId} onClick={generate}>{busy ? "Đang soạn..." : "Soạn bản nháp"}</button>
        </div>
        {task && <p className="muted" style={{ marginTop: 10 }}>{task.purpose}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {drafts.map((d) => (
        <div className="card" key={d.id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{tasks.find((t) => t.id === d.taskId)?.title ?? d.taskId} — {labelOf(d)}</strong>
            <span className={`badge ${STATUS_LABEL[d.status].cls}`}>{STATUS_LABEL[d.status].text}</span>
          </div>
          <textarea
            style={{ marginTop: 10 }}
            defaultValue={d.text}
            readOnly={d.status === "APPROVED"}
            onBlur={(e) => e.target.value !== d.text && patch(d.id, { text: e.target.value })}
          />
          {d.status === "DRAFT" && (
            <div className="row" style={{ marginTop: 8 }}>
              <button className="good" onClick={() => patch(d.id, { status: "APPROVED" })}>Duyệt</button>
              <button onClick={() => patch(d.id, { status: "REJECTED" })}>Loại</button>
              <span className="muted">Giáo viên có thể sửa nội dung trước khi duyệt.</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
