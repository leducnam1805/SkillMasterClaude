import { notFound } from "next/navigation";
import { entityDef, rowLabel, screenDef, spec } from "@/lib/spec";
import { list, listDrafts, ruleStatuses } from "@/lib/store";
import EntityTable from "@/components/EntityTable";
import AiAssistant from "@/components/AiAssistant";
import RulesPanel from "@/components/RulesPanel";
import { customScreens } from "@/components/screens/registry";

export const dynamic = "force-dynamic";

export default async function ScreenPage(props: PageProps<"/s/[id]">) {
  const { id } = await props.params;
  const screen = screenDef(id);
  if (!screen) notFound();

  let body: React.ReactNode;
  if (screen.kind === "entity_list" && screen.entity) {
    const entity = entityDef(screen.entity);
    const refOptions: Record<string, { id: string; label: string }[]> = {};
    for (const f of entity.fields.filter((x) => x.type === "ref" && x.ref)) {
      const target = entityDef(f.ref!);
      refOptions[f.name] = list(target.name).map((r) => ({ id: r.id, label: rowLabel(target, r) }));
    }
    body = <EntityTable entity={entity} rows={list(entity.name)} refOptions={refOptions} />;
  } else if (screen.kind === "ai_assistant") {
    const tasks = spec.ai_tasks.filter((t) => screen.uses_ai_tasks.length === 0 || screen.uses_ai_tasks.includes(t.id));
    const subjects: Record<string, { id: string; label: string }[]> = {};
    for (const t of tasks) {
      const def = entityDef(t.subject_entity);
      subjects[t.subject_entity] = list(def.name).map((r) => ({ id: r.id, label: rowLabel(def, r) }));
    }
    body = <AiAssistant tasks={tasks} subjects={subjects} initialDrafts={listDrafts()} />;
  } else if (screen.kind === "rules_settings") {
    const status = ruleStatuses();
    body = <RulesPanel rules={spec.rules.map((r) => ({ ...r, status: status[r.id] }))} />;
  } else {
    const Custom = customScreens[screen.id];
    body = Custom ? <Custom /> : <p className="muted">Màn hình chưa được triển khai.</p>;
  }

  return (
    <section>
      <header className="page-head">
        <h1>{screen.title}</h1>
        <p className="muted">{screen.purpose}</p>
      </header>
      {body}
    </section>
  );
}
