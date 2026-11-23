"use client";

import { useState } from "react";
import { FiRotateCw } from "react-icons/fi";

// card with a back side, only renders after the first flip
export default function FlipCard({
  front,
  back,
  frontLabel,
  backLabel,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  // button text on each side: what flipping will show
  frontLabel: string;
  backLabel: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [backMounted, setBackMounted] = useState(false);

  function flip() {
    setBackMounted(true);
    setFlipped((f) => !f);
  }

  return (
    <div className="relative h-full perspective-distant">
      <div
        className={`relative h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none [transform-style:preserve-3d] ${
          flipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        {/* the hidden side is inert so it can't be clicked or tabbed into */}
        <div
          className={`h-full backface-hidden ${flipped ? "pointer-events-none" : ""}`}
          inert={flipped}
        >
          {front}
        </div>
        <div
          className={`absolute inset-0 backface-hidden transform-[rotateY(180deg)] ${
            flipped ? "" : "pointer-events-none"
          }`}
          inert={!flipped}
        >
          {backMounted && back}
        </div>
      </div>

      <button
        onClick={flip}
        aria-pressed={flipped}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-card-border bg-card/80 px-2.5 py-1 text-[10px] tracking-widest text-text-dim hover:text-accent hover:border-accent-dark transition-colors"
      >
        <FiRotateCw size={11} className={`transition-transform duration-700 ${flipped ? "rotate-180" : ""}`} />
        {flipped ? backLabel : frontLabel}
      </button>
    </div>
  );
}
