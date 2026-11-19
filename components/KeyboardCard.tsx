"use client";

import { useEffect, useState } from "react";
import { FiArrowRight, FiCamera, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TypingGame, { type QuoteSet } from "@/components/TypingGame";

// one entry of data/builds.json ("current" or an item in "past")
export type Build = {
  name: string;
  color: string;
  plate: string;
  layout: string;
  stabs: string;
  keycaps: string;
  switches: string;
  springs: string;
  mods: string;
  sound: string;
  date: string;
  photos: string[];
};

// client component so the switcher and typing test work; the SVG comes in as children
export default function KeyboardCard({
  builds,
  quotes,
  children,
}: {
  builds: Build[];
  quotes: { personalBestWpm: number; items: QuoteSet[] };
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const hasQuotes = quotes.items.some((item) => item.quotes.length > 0);
  const build = builds[index];

  // start on the first quote (not a random one) so the server and browser
  // render the same thing, otherwise React throws a hydration error
  const allQuotes = quotes.items.flatMap((item) =>
    item.quotes.map((text) => ({ title: item.title, text })),
  );
  const [previewIndex, setPreviewIndex] = useState(0);
  const preview = allQuotes[previewIndex % allQuotes.length] ?? null;

  useEffect(() => {
    if (playing || allQuotes.length < 2) return;
    const timer = setInterval(
      () => setPreviewIndex((i) => (i + 1 + Math.floor(Math.random() * (allQuotes.length - 1))) % allQuotes.length),
      7000,
    );
    return () => clearInterval(timer);
  }, [playing, allQuotes.length]);

  const tags = [build.layout, build.plate, build.color, build.date];

  const rightFields = [
    { label: "STABS", value: build.stabs },
    { label: "KEYCAPS", value: build.keycaps },
    { label: "SWITCHES", value: build.switches },
    { label: "SPRINGS", value: build.springs },
    { label: "MODS", value: build.mods },
    { label: "SOUND", value: build.sound },
  ];

  function step(by: number) {
    setIndex((i) => (i + by + builds.length) % builds.length);
  }

  return (
    <div className="bento-card kb-card rounded-xl border-2 border-accent bg-card p-6 flex flex-col gap-3 h-full">
      {/* top row: name + tags left, typing test right */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-text-dim tracking-widest leading-none">
              {index === 0 ? "CURRENT KEYBOARD" : "PREVIOUS BUILD"}
              <span className="hidden md:inline"> · TRY TYPING SOMETHING</span>
            </p>
            {builds.length > 1 && (
              <div className="flex items-center gap-1 text-[10px] text-text-dim leading-none">
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous build"
                  className="hover:text-accent transition-colors"
                >
                  <FiChevronLeft size={12} />
                </button>
                <span className="tabular-nums">
                  {index + 1}/{builds.length}
                </span>
                <button
                  onClick={() => step(1)}
                  aria-label="Next build"
                  className="hover:text-accent transition-colors"
                >
                  <FiChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-text-primary font-semibold leading-tight">
              {build.name}
            </h2>
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-accent-dark whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* on xl the preview panel starts the test, so there this button only
            shows while playing, as the way back */}
        {hasQuotes && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className={`rounded-lg px-3 py-2 flex flex-col gap-1 shrink-0 bg-accent-bg border border-accent-dark hover:border-accent transition-colors text-left group ${
              playing ? "" : "xl:hidden"
            }`}
          >
            <p className="text-xs text-text-dim tracking-widest">TYPING TEST</p>
            <p className="text-xs text-text-secondary group-hover:text-accent transition-colors">
              {playing ? "back to specs" : "try a quote from my media"}
            </p>
          </button>
        )}
      </div>

      {/* keyboard + details as a single aligned row (stacked on mobile) */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {children}

        {/* the game sits on top of the specs in the same grid cell, so the card
            doesn't jump in height when it opens */}
        <div className="grid flex-1 min-w-0">
          <div
            className={`col-start-1 row-start-1 flex gap-6 min-w-0 ${playing ? "invisible" : ""}`}
          >
            {/* details centered to SVG on same row (2-column grid on mobile) */}
            <div className="grid grid-cols-2 md:flex md:flex-col md:justify-center flex-1 min-w-0 gap-3">
              {rightFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-text-dim tracking-widest mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-text-secondary leading-snug">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* fills the space right of the specs on wide screens */}
            {hasQuotes && preview && (
              <button
                onClick={() => setPlaying(true)}
                className="hidden xl:flex flex-col gap-3 self-center w-52 shrink-0 rounded-lg border border-accent-dark bg-accent-bg p-4 text-left hover:border-accent transition-colors group"
              >
                <p className="text-[10px] text-text-dim tracking-widest">TYPING TEST</p>
                <p className="font-mono text-xs text-text-secondary leading-relaxed line-clamp-4">
                  &ldquo;{preview.text}&rdquo;
                </p>
                <p className="text-[10px] text-text-dim tracking-widest truncate">
                  {preview.title.toUpperCase()}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-accent group-hover:text-text-primary transition-colors">
                  {quotes.personalBestWpm > 0
                    ? `My best: ${quotes.personalBestWpm} wpm. Beat it`
                    : "Type this quote"}
                  <FiArrowRight size={12} />
                </p>
              </button>
            )}
          </div>

          {playing && (
            <div className="col-start-1 row-start-1 flex min-w-0">
              <TypingGame
                items={quotes.items}
                personalBestWpm={quotes.personalBestWpm}
                initial={preview ?? undefined}
                onExit={() => setPlaying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {build.photos.length > 0 && (
        <div className="flex gap-2">
          {build.photos.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <FiCamera
                size={14}
                className="text-text-dim hover:text-accent transition-colors"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
