"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EntityDef, FieldDef } from "@/lib/spec";

type Row = Record<string, unknown> & { id: string };
type Options = Record<string, { id: string; label: string }[]>;

function display(f: FieldDef, v: unknown, refOptions: Options): string {
  if (v === null || v === undefined || v === "") return "—"; // ô trống ≠ 0
  if (f.type === "boolean") return v ? "Có" : "Không";
  if (f.type === "ref") return refOptions[f.name]?.find((o) => o.id === v)?.label ?? String(v);
  return String(v);
}

function FieldInput({ f, value, onChange, refOptions }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; refOptions: Options }) {
  const v = value ?? "";
  if (f.type === "enum")
    return (
      <select value={String(v)} onChange={(e) => onChange(e.target.value)}>
        <option value="">— chọn —</option>
        {f.enum_values.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    );
  if (f.type === "ref")
    return (
      <select value={String(v)} onChange={(e) => onChange(e.target.value)}>
        <option value="">— chọn —</option>
        {(refOptions[f.name] ?? []).map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    );
  if (f.type === "boolean") return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} style={{ width: "auto" }} />;
  if (f.type === "text") return <textarea value={String(v)} onChange={(e) => onChange(e.target.value)} style={{ minHeight: 40 }} />;
  const type = f.type === "date" ? "date" : f.type === "int" || f.type === "number" ? "number" : "text";
  return <input type={type} value={String(v)} onChange={(e) => onChange(e.target.value)} />;
}

export default function EntityTable({ entity, rows, refOptions }: { entity: EntityDef; rows: Row[]; refOptions: Options }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    const url = editing ? `/api/data/${entity.name}/${editing}` : `/api/data/${entity.name}`;
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setBusy(false);
    if (!res.ok) {
      setError(((await res.json()) as { error?: string }).error ?? "Lỗi");
      return;
    }
    setDraft({});
    setEditing(null);
    router.refresh();
  }

  async function del(id: string) {
    if (!confirm("Xóa bản ghi này?")) return;
    const res = await fetch(`/api/data/${entity.name}/${id}`, { method: "DELETE" });
    if (!res.ok) setError(((await res.json()) as { error?: string }).error ?? "Lỗi");
    router.refresh();
  }

  return (
    <div>
      <div className="card">
        <strong>{editing ? `Sửa ${entity.label.toLowerCase()}` : `Thêm ${entity.label.toLowerCase()}`}</strong>
        <div className="form-grid" style={{ marginTop: 10 }}>
          {entity.fields.map((f) => (
            <label key={f.name}>
              {f.label}{f.required ? " *" : ""}
              <FieldInput f={f} value={draft[f.name]} refOptions={refOptions} onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))} />
            </label>
          ))}
          <div className="row">
            <button className="primary" disabled={busy} onClick={submit}>{editing ? "Lưu" : "Thêm"}</button>
            {editing && <button onClick={() => { setEditing(null); setDraft({}); }}>Hủy</button>}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
      <table>
        <thead>
          <tr>
            {entity.fields.map((f) => <th key={f.name}>{f.label}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {entity.fields.map((f) => <td key={f.name}>{display(f, r[f.name], refOptions)}</td>)}
              <td className="row" style={{ justifyContent: "flex-end" }}>
                <button onClick={() => { setEditing(r.id); setDraft(Object.fromEntries(entity.fields.map((f) => [f.name, r[f.name]]))); }}>Sửa</button>
                <button className="danger" onClick={() => del(r.id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={entity.fields.length + 1} className="muted">Chưa có dữ liệu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
