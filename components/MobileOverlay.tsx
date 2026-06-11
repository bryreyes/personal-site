"use client";

import { useState } from "react";

export default function MobileOverlay() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm md:hidden">
      <div className="rounded-xl border border-card-border bg-card p-8 mx-6 flex flex-col gap-4 max-w-sm">
        <span className="text-xs text-text-dim tracking-widest">HEADS UP</span>
        <p className="text-sm text-text-primary font-medium">This site is designed for a larger screen (desktop).</p>
        <p className="text-xs text-text-secondary">The mobile experience is a work in progress. You&apos;re welcome to look around, but things might look off.</p>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-accent hover:text-text-primary transition-colors text-left"
        >
          Got it, continue anyway
        </button>
      </div>
    </div>
  );
}