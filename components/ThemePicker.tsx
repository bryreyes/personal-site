"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { THEMES, getTheme, setTheme, subscribeTheme } from "@/lib/themes";

// small keycap in one theme's colors. data-theme on the span scopes those
// colors to just this element
function Keycap({
  themeId,
  size = "sm",
  children,
}: {
  themeId: string;
  size?: "sm" | "lg";
  children: React.ReactNode;
}) {
  const dimensions = size === "lg" ? "w-8 h-8 rounded-md" : "w-6 h-6 rounded-md";
  return (
    <span
      data-theme={themeId}
      className={`flex items-center justify-center shrink-0 border border-b-[3px] border-key-border bg-key-bg text-key-text text-[10px] font-semibold leading-none ${dimensions}`}
    >
      {children}
    </span>
  );
}

// panel + button that opens the list of sets
export default function ThemePicker() {
  // the saved theme is in localStorage
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "default");
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-2 sm:w-60 shrink-0 border-t border-card-border pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6"
    >
      <p className="text-[10px] text-text-dim tracking-widest">KEYCAP THEMES</p>
      <p className="text-sm text-text-secondary leading-snug">
        Recolor the site to match some of my favorite keycap sets.
      </p>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mt-1 flex items-center justify-between gap-3 rounded-lg border border-accent-dark bg-accent-bg pl-3 pr-1.5 py-1.5 text-left hover:border-accent transition-colors group"
      >
        <span className="text-sm text-text-primary truncate">{current.name}</span>
        <span className="transition-transform group-hover:-translate-y-0.5">
          <Keycap themeId={current.id} size="lg">
            {/* accent colored so the arrow still shows on dark keycaps */}
            <FiChevronDown
              size={16}
              className={`text-accent transition-transform ${open ? "rotate-180" : ""}`}
            />
          </Keycap>
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Keycap set"
          className="absolute left-0 sm:left-6 right-0 top-full mt-2 z-20 rounded-lg border border-card-border bg-card p-1 shadow-xl"
        >
          {THEMES.map((t) => (
            <li key={t.id}>
              <button
                role="option"
                aria-selected={t.id === current.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm text-text-secondary hover:bg-accent-bg hover:text-text-primary transition-colors"
              >
                <Keycap themeId={t.id}>{t.name.replace(/^(GMK|Osume) /, "")[0]}</Keycap>
                <span className={t.id === current.id ? "text-text-primary" : ""}>{t.name}</span>
                {t.id === current.id && <FiCheck size={14} className="ml-auto text-accent" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
