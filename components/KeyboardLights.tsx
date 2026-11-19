"use client";

import { useEffect, useRef } from "react";
import { THEMES, setTheme } from "@/lib/themes";

const SECRET = "BRYSON";
const WAVE_MS = 1800;
// long enough to catch the longest set name
const BUFFER = Math.max(SECRET.length, ...THEMES.map((t) => t.word.length));

// Lights up keys on the SVG as you type on a real keyboard (the colors are in
// globals.css). Also runs the wave, set-name theme switching, and the mouse glow.
export default function KeyboardLights({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let typed = "";
    let waveTimer: ReturnType<typeof setTimeout> | undefined;

    function setPressed(code: string, pressed: boolean) {
      if (!code) return;
      root!
        .querySelectorAll(`[data-key="${code}"]`)
        .forEach((el) => el.toggleAttribute("data-pressed", pressed));
    }

    function startWave() {
      root!.removeAttribute("data-wave");
      // force a reflow so the animation restarts if it's already running
      void root!.offsetWidth;
      root!.setAttribute("data-wave", "");
      clearTimeout(waveTimer);
      waveTimer = setTimeout(() => root!.removeAttribute("data-wave"), WAVE_MS);
    }

    function onKeyDown(e: KeyboardEvent) {
      setPressed(e.code, true);
      if (e.key.length !== 1) return;

      typed = (typed + e.key.toUpperCase()).slice(-BUFFER);
      if (typed.endsWith(SECRET)) {
        startWave();
        return;
      }
      // set names only count outside text boxes, so a quote in the typing
      // test that happens to contain "frost" doesn't change the theme
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      const theme = THEMES.find((t) => typed.endsWith(t.word));
      if (theme) {
        setTheme(theme.id);
        startWave();
        typed = "";
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      setPressed(e.code, false);
    }

    // keyup never fires if focus leaves the page mid-press
    function clearAll() {
      root!
        .querySelectorAll("[data-pressed]")
        .forEach((el) => el.removeAttribute("data-pressed"));
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearAll);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearAll);
      clearTimeout(waveTimer);
    };
  }, []);

  // move the glow to the cursor. it needs SVG coordinates, not page pixels
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const svg = e.currentTarget.querySelector("svg");
    const gradient = svg?.querySelector("#kb-spot");
    const matrix = svg?.getScreenCTM();
    if (!gradient || !matrix) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    gradient.setAttribute("cx", String(point.x));
    gradient.setAttribute("cy", String(point.y));
  }

  return (
    <div ref={ref} className={`kb-board ${className ?? ""}`} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
