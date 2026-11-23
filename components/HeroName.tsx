"use client";

import { useEffect, useRef, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// replay a couple of seconds after load, then every 30-45s
const FIRST_DELAY = 2500;
const nextDelay = () => 30_000 + Math.random() * 15_000;

// fake a key press on the keyboard card so it lights up like a real one
function pressKey(code: string, ms: number) {
  const keys = document.querySelectorAll(`.kb-key[data-key="${code}"]`);
  keys.forEach((key) => key.setAttribute("data-pressed", ""));
  setTimeout(() => keys.forEach((key) => key.removeAttribute("data-pressed")), ms);
}

// every so often the name deletes and retypes itself, pressing the matching
// keys on the keyboard card as it goes
export default function HeroName({ name }: { name: string }) {
  const [shown, setShown] = useState(name);
  const [typing, setTyping] = useState(false);
  const lastVisitorKey = useRef(0);

  // visitor typing keeps the cursor solid
  useEffect(() => {
    function onKeyDown() {
      lastVisitorKey.current = Date.now();
      setTyping(true);
    }
    function onKeyUp() {
      setTimeout(() => {
        if (Date.now() - lastVisitorKey.current >= 500) setTyping(false);
      }, 500);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    // skip a turn if the tab is hidden, the visitor is typing,
    function busy() {
      const active = document.activeElement;
      return (
        document.hidden ||
        Date.now() - lastVisitorKey.current < 3000 ||
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      );
    }

    async function replay() {
      if (!busy()) {
        setTyping(true);
        for (let i = name.length - 1; i >= 0 && !cancelled; i--) {
          pressKey("Backspace", 60);
          setShown(name.slice(0, i));
          await sleep(70);
        }
        await sleep(450);
        for (let i = 0; i < name.length && !cancelled; i++) {
          const char = name[i];
          if (/[a-z]/i.test(char)) {
            if (char !== char.toLowerCase()) pressKey("ShiftLeft", 160);
            pressKey(`Key${char.toUpperCase()}`, 110);
          } else if (char === " ") {
            pressKey("Space", 110);
          }
          setShown(name.slice(0, i + 1));
          // a little uneven, like a person typing
          await sleep(110 + Math.random() * 90);
        }
        setTyping(false);
      }
      if (!cancelled) timer = setTimeout(replay, nextDelay());
    }

    timer = setTimeout(replay, FIRST_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      setShown(name);
    };
  }, [name]);

  return (
    <h1 className="text-4xl font-bold text-text-primary mb-3" aria-label={name}>
      <span aria-hidden="true">{shown}</span>
      <span
        aria-hidden="true"
        className={`inline-block w-0.75 h-[0.85em] ml-1 mb-[-0.05em] bg-accent ${
          typing ? "" : "caret-blink"
        }`}
      />
    </h1>
  );
}
