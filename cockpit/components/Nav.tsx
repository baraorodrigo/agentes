"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/hoje", label: "Hoje" },
  { href: "/semana", label: "Semana" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/estrutura", label: "Estrutura" },
  { href: "/cabine", label: "Cabine" },
  { href: "/logs", label: "Logs" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">El Coyote Corp</span>
          <nav className="flex gap-1 rounded-md bg-[var(--color-bg)] p-1">
            {items.map((it) => {
              const active = path === it.href || (path === "/" && it.href === "/estrutura");
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={
                    "rounded px-3 py-1 text-[12px] transition-colors " +
                    (active
                      ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]")
                  }
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <span className="text-[11px] text-[var(--color-text-dim)]">cockpit local · 127.0.0.1</span>
      </div>
    </header>
  );
}
