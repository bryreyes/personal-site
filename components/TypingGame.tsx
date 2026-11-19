"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

// one entry of data/quotes.json "items"
export type QuoteSet = {
  type: string;
  title: string;
  quotes: string[];
};

type Round = { title: string; text: string };

// how many extra letters a word takes before the rest are ignored
const MAX_EXTRA = 8;

function pickRound(items: QuoteSet[], previous?: string): Round {
  const pool = items.flatMap((item) =>
    item.quotes.map((text) => ({ title: item.title, text })),
  );
  const options = pool.length > 1 ? pool.filter((r) => r.text !== previous) : pool;
  return options[Math.floor(Math.random() * options.length)];
}

// The input is hidden but real, so phones still open their keyboard
export default function TypingGame({
  items,
  personalBestWpm,
  initial,
  onExit,
}: {
  items: QuoteSet[];
  personalBestWpm: number;
  // lets the card start on the quote its preview was showing
  initial?: Round;
  onExit: () => void;
}) {
  const [round, setRound] = useState(() => initial ?? pickRound(items));
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [keystrokes, setKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  // caret only blinks once you stop typing, like an editor
  const [idle, setIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, [round]);

  // layout effect runs before paint, so the caret never flashes in its old spot
  useLayoutEffect(() => {
    function place() {
      const target = textRef.current?.querySelector<HTMLElement>("[data-caret]");
      const caret = caretRef.current;
      if (!target || !caret) return;
      caret.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
      caret.style.height = `${target.offsetHeight}px`;
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [typed, round, finishedAt]);

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  function markTyping() {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 800);
  }

  const words = round.text.split(" ");
  const typedWords = typed.split(" ");
  const currentWord = typedWords.length - 1;

  // same rules as monkeytype: extra letters show up red, and space always
  // jumps to the next word
  function handleChange(value: string) {
    if (finishedAt) return;
    markTyping();

    // backspace (or a phone keyboard replacing text): take it as-is
    if (!value.startsWith(typed)) {
      setTyped(value);
      return;
    }

    let next = typed;
    let strokes = 0;
    let wrong = 0;
    let done = false;
    for (const char of value.slice(typed.length)) {
      const nextWords = next.split(" ");
      const index = nextWords.length - 1;
      const word = nextWords[index];
      const target = words[index];

      if (char === " ") {
        // no empty words, so a space at the start of a word is ignored
        if (word === "") continue;
        strokes++;
        if (word.length !== target.length) wrong++;
        // space after the last word ends the round
        if (index === words.length - 1) {
          done = true;
          break;
        }
        next += " ";
      } else {
        if (word.length >= target.length + MAX_EXTRA) continue;
        strokes++;
        if (char !== target[word.length]) wrong++;
        next += char;
        // the last letter of the last word ends the round, right or wrong
        if (index === words.length - 1 && word.length + 1 === target.length) {
          done = true;
          break;
        }
      }
    }
    if (!strokes) return;

    // accuracy counts every wrong character typed, even if fixed later
    setKeystrokes((k) => k + strokes);
    setMistakes((m) => m + wrong);

    const now = Date.now();
    if (!startedAt) setStartedAt(now);
    setTyped(next);
    if (done || next === round.text) setFinishedAt(now);
  }

  function nextRound() {
    setRound(pickRound(items, round.text));
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    setKeystrokes(0);
    setMistakes(0);
  }

  const finished = finishedAt !== null && startedAt !== null;
  const minutes = finished ? Math.max(finishedAt - startedAt, 1000) / 60_000 : 0;
  // standard WPM (5 characters = 1 word), only counting words typed correctly
  const correctChars = words.reduce(
    (sum, word, w) =>
      typedWords[w] === word ? sum + word.length + (w < words.length - 1 ? 1 : 0) : sum,
    0,
  );
  const wpm = finished ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy = keystrokes ? Math.round(((keystrokes - mistakes) / keystrokes) * 100) : 100;

  return (
    <div
      className="relative flex flex-col justify-center gap-3 flex-1 min-w-0"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-text-dim tracking-widest truncate">
          {round.title.toUpperCase()}
        </p>
        <button
          onClick={onExit}
          className="text-xs text-text-dim hover:text-accent transition-colors shrink-0"
        >
          esc
        </button>
      </div>

      <p ref={textRef} className="relative font-mono text-sm leading-relaxed select-none">
        {!finished && (
          <span
            ref={caretRef}
            aria-hidden="true"
            className={`absolute left-0 top-0 w-0.5 rounded-full bg-accent pointer-events-none transition-transform duration-100 ease-out ${
              idle ? "caret-blink" : ""
            }`}
          />
        )}
        {words.map((word, w) => {
          const typedWord = typedWords[w] ?? "";
          const extra = typedWord.slice(word.length);
          const missed = w < currentWord && typedWord !== word;
          const cursorAt = w === currentWord && !finished ? typedWord.length : -1;
          const cursor = (i: number) => (i === cursorAt ? { "data-caret": "" } : {});

          return (
            <Fragment key={w}>
              <span className="whitespace-nowrap">
                <span className={missed ? "underline decoration-error underline-offset-4" : ""}>
                  {word.split("").map((char, i) => {
                    const typedChar = typedWord[i];
                    const color =
                      typedChar === undefined
                        ? "text-text-dim"
                        : typedChar === char
                          ? "text-text-primary"
                          : "text-error bg-error/15";
                    return (
                      <span key={i} className={color} {...cursor(i)}>
                        {char}
                      </span>
                    );
                  })}
                  {extra.split("").map((char, i) => (
                    <span key={`extra-${i}`} className="text-error/60 bg-error/15" {...cursor(word.length + i)}>
                      {char}
                    </span>
                  ))}
                </span>
                {/* non-breaking so the cursor can sit on it; wbr below is where lines wrap */}
                <span {...cursor(Math.max(word.length, typedWord.length))}>
                  {" "}
                </span>
              </span>
              <wbr />
            </Fragment>
          );
        })}
      </p>

      {finished ? (
        <div className="flex flex-col gap-1">
          <p className="text-text-primary font-semibold">
            {wpm} wpm · {accuracy}% accuracy
          </p>
          {personalBestWpm > 0 && (
            <p className="text-xs text-text-secondary">
              {wpm > personalBestWpm
                ? `You beat my best (${personalBestWpm} wpm). Nice.`
                : `My best: ${personalBestWpm} wpm. Beat it?`}
            </p>
          )}
          <div className="flex gap-4 text-xs mt-1">
            <button
              onClick={nextRound}
              className="text-accent hover:text-text-primary transition-colors"
            >
              another quote (enter)
            </button>
            <button
              onClick={onExit}
              className="text-text-dim hover:text-accent transition-colors"
            >
              back to specs
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-text-dim tracking-widest">
          {typed.length ? `${currentWord}/${words.length} WORDS` : "START TYPING"}
        </p>
      )}

      <input
        ref={inputRef}
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onExit();
          if (e.key === "Enter" && finished) nextRound();
        }}
        aria-label="Type the quote"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        className="absolute w-px h-px opacity-0 pointer-events-none"
      />
    </div>
  );
}
