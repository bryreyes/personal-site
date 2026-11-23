"use client";

import { useEffect } from "react";

let greeted = false;

export default function ConsoleHello() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      "%cHey, you opened devtools.%c\nThis site is built with Next.js and Tailwind. Tip: type \"bryson\" anywhere on the page.",
      "font-size: 14px; font-weight: bold; color: #a07840",
      "color: inherit",
    );
  }, []);

  return null;
}
