import { redirect } from "next/navigation";
import { spec } from "@/lib/spec";

export default function Home() {
  redirect(`/s/${spec.screens[0]?.id ?? ""}`);
}
