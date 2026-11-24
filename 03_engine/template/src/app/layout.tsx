import type { Metadata } from "next";
import Link from "next/link";
import { spec } from "@/lib/spec";
import "./globals.css";

export const metadata: Metadata = {
  title: spec.meta.name,
  description: spec.meta.summary,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <div className="shell">
          <nav className="sidebar">
            <div className="brand">{spec.meta.name}</div>
            {spec.screens.map((s) => (
              <Link key={s.id} href={`/s/${s.id}`} className="nav-link">
                {s.title}
              </Link>
            ))}
          </nav>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
