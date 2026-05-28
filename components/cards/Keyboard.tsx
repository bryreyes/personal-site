import { FiCamera } from "react-icons/fi";
import build from "@/data/builds.json";

const LIT_KEYS = new Set(["B", "R", "Y", "S", "O", "N"]);

const BASE = 30; // px per key unit
const GAP = 3;

const ROWS: string[][] = [
  ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Print", "Scroll", "Pause"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace", "Ins", "Home", "PgUp"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Del", "End", "PgDn"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "RShift", "↑"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Ctrl", "←", "↓", "→"],
];

const WIDE_KEYS: Record<string, number> = {
  Backspace: 2,
  Tab: 1.5,
  Caps: 1.75,
  Enter: 2.25,
  Shift: 2.25,
  RShift: 2.75,
  "\\": 1.5,
  Space: 7,
  Ctrl: 1.25,
  RCtrl: 1.25,
  Win: 1.25,
  Alt: 1.25,
  RAlt: 1.25,
};

const VB_WIDTH = 880;
const VB_HEIGHT = ROWS.length * (BASE + GAP) - GAP;

export default function Keyboard() {
  const specs = [build.current.layout, build.current.switch, build.current.plate, build.current.sound];

  return (
    <div className="rounded-xl border-2 border-accent bg-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-text-primary font-semibold">{build.current.name}</h2>
        <div className="flex gap-2 flex-wrap justify-end">
          {specs.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-accent-dark">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-3 overflow-x-auto" style={{ backgroundColor: "var(--kb-body)" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          width="100%"
          style={{ display: "block" }}
        >
          {ROWS.map((row, rowIndex) => {
            let x = 0;
            return row.map((key) => {
              const units = WIDE_KEYS[key] ?? 1;
              const width = units * BASE + (units - 1) * GAP;
              const y = rowIndex * (BASE + GAP);
              const isLit = LIT_KEYS.has(key);
              const el = (
                <g key={`${rowIndex}-${key}-${x}`}>
                  <rect
                    x={x} y={y}
                    width={width} height={BASE}
                    rx={3}
                    fill={isLit ? "#2a2520" : "#322820"}
                    stroke={isLit ? "#7a5828" : "#3e3020"}
                    strokeWidth={1}
                  />
                  <text
                    x={x + width / 2}
                    y={y + BASE / 2}
                    fontSize={7}
                    fontFamily="monospace"
                    fill={isLit ? "#a07840" : "#5a5248"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {key.length > 5 ? key.slice(0, 4) : key}
                  </text>
                </g>
              );
              x += width + GAP;
              return el;
            });
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-dim">
          {/* Hook for typing game tp implement later */}
          Click any key to hear this board · try the typing test →
        </p>
        {build.current.photos.length > 0 ? (
          <div className="flex gap-2">
            {build.current.photos.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                <FiCamera size={14} className="text-text-dim hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        ) : (
          <FiCamera size={14} className="text-text-dim" />
        )}
      </div>
    </div>
  );
}