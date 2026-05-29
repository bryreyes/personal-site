import { FiCamera } from "react-icons/fi";
import build from "@/data/builds.json";

const LIT_KEYS = new Set(["B", "R", "Y", "S", "O", "N"]);

// sizing
const KEY_UNIT = 30;

const KEY_GAP = KEY_UNIT * 0.18;

// main spacing
const SIDE_BEZEL = KEY_UNIT * 0.35;
const TOP_BEZEL = KEY_UNIT * 0.7;

// shared physical spacing
const CLUSTER_SPACING = SIDE_BEZEL;
const F_ROW_SPACING = SIDE_BEZEL;

// different F-row spacing
const F_ROW_GROUP_GAP = KEY_UNIT * 0.6;

// proportional scaling
const KEY_RADIUS = KEY_UNIT * 0.12;
const KEY_STROKE = KEY_UNIT * 0.04;
const LEGEND_SIZE = KEY_UNIT * 0.32;

// colors
const KB_BG = "#2a2218";
const KB_OUTLINE = "#4a3a28";
const KEY_BG = "#322820";
const KEY_BORDER = "#3e3020";
const KEY_TEXT = "#745a3e";
const LIT_BG = "#5a3e1e";
const LIT_BORDER = "#a07840";
const LIT_TEXT = "#a07840";

const WIDE_KEYS: Record<string, number> = {
  Backspace: 2,
  Tab: 1.5,
  Caps: 1.75,
  Enter: 2.25,
  Shift: 2.25,
  RShift: 2.75,
  "\\": 1.5,
  Space: 7,
  Ctrl: 1.5,
  RCtrl: 1.5,
  Win: 1,
  Alt: 1.5,
  RAlt: 1.5,
  Fn: 1,
};

const F_ROW_GROUPS = [
  ["Esc"],
  ["F1", "F2", "F3", "F4"],
  ["F5", "F6", "F7", "F8"],
  ["F9", "F10", "F11", "F12"],
];

const F_ROW_RIGHT = ["Print", "Scroll", "Pause"];

const MAIN_ROWS: string[][] = [
  [
    "`",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
  ],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "RShift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Ctrl"],
];

// right cluster rows (nav + arrows, aligned with main rows 1-4)
const RIGHT_ROWS: string[][] = [
  ["Ins", "Home", "PgUp"],
  ["Del", "End", "PgDn"],
];

const RIGHT_ROW_START = 0;

const ARROW_ROWS: string[][] = [["↑"], ["←", "↓", "→"]];

function rowWidth(row: string[]) {
  return row.reduce((total, key, index) => {
    return total + keyWidth(key) + (index < row.length - 1 ? KEY_GAP : 0);
  }, 0);
}

function keyWidth(key: string) {
  const units = WIDE_KEYS[key] ?? 1;
  return units * KEY_UNIT + (units - 1) * KEY_GAP;
}

function renderKey(key: string, x: number, y: number) {
  const width = keyWidth(key);
  const isLit = LIT_KEYS.has(key);

  return (
    <g key={`${key}-${x}-${y}`}>
      <rect
        x={x}
        y={y}
        width={width}
        height={KEY_UNIT}
        rx={KEY_RADIUS}
        fill={isLit ? LIT_BG : KEY_BG}
        stroke={isLit ? LIT_BORDER : KEY_BORDER}
        strokeWidth={KEY_STROKE}
      />

      <text
        x={x + width / 2}
        y={y + KEY_UNIT / 2}
        fontSize={LEGEND_SIZE}
        fontFamily="monospace"
        fill={isLit ? LIT_TEXT : KEY_TEXT}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ userSelect: "none" }}
      >
        {key.length > 5 ? key.slice(0, 4) : key}
      </text>
    </g>
  );
}

export default function Keyboard() {
  const specs = [
    build.current.layout,
    build.current.switch,
    build.current.plate,
    build.current.sound,
  ];
  const elements: React.ReactNode[] = [];

  // width calculation
  const MAIN_BLOCK_WIDTH = rowWidth(MAIN_ROWS[0]);

  // f row
  let fx = SIDE_BEZEL;
  const fy = TOP_BEZEL;

  F_ROW_GROUPS.forEach((group, gi) => {
    // larger gap between Esc and F1 cluster
    if (gi === 1) {
      fx += KEY_UNIT + KEY_GAP;
    } else if (gi > 1) {
      fx += F_ROW_GROUP_GAP;
    }

    group.forEach((key) => {
      elements.push(renderKey(key, fx, fy));
      fx += keyWidth(key) + KEY_GAP;
    });
  });

  // gap for nav cluster / arrows
  const RIGHT_CLUSTER_X = SIDE_BEZEL + MAIN_BLOCK_WIDTH + CLUSTER_SPACING;

  // right cluster of F-row
  let frx = RIGHT_CLUSTER_X;

  F_ROW_RIGHT.forEach((key) => {
    elements.push(renderKey(key, frx, fy));
    frx += keyWidth(key) + KEY_GAP;
  });

  // full board width
  const VB_WIDTH = frx - KEY_GAP + SIDE_BEZEL;

  MAIN_ROWS.forEach((row, ri) => {
    let x = SIDE_BEZEL;

    const y =
      TOP_BEZEL +
      (KEY_UNIT + KEY_GAP) +
      F_ROW_SPACING +
      ri * (KEY_UNIT + KEY_GAP);

    row.forEach((key) => {
      elements.push(renderKey(key, x, y));
      x += keyWidth(key) + KEY_GAP;
    });
  });

  // right cluster
  RIGHT_ROWS.forEach((row, ri) => {
    let x = RIGHT_CLUSTER_X;

    const y =
      TOP_BEZEL +
      (KEY_UNIT + KEY_GAP) +
      F_ROW_SPACING +
      (RIGHT_ROW_START + ri) * (KEY_UNIT + KEY_GAP);

    row.forEach((key) => {
      elements.push(renderKey(key, x, y));
      x += keyWidth(key) + KEY_GAP;
    });
  });

  ARROW_ROWS.forEach((row, ri) => {
    let x = RIGHT_CLUSTER_X;

    // center top arrow over down arrow
    if (ri === 0) {
      x += KEY_UNIT + KEY_GAP;
    }

    const y =
      TOP_BEZEL +
      (KEY_UNIT + KEY_GAP) +
      F_ROW_SPACING +
      (3 + ri) * (KEY_UNIT + KEY_GAP);

    row.forEach((key) => {
      elements.push(renderKey(key, x, y));
      x += keyWidth(key) + KEY_GAP;
    });
  });

  const VB_HEIGHT =
    TOP_BEZEL * 2 +
    (KEY_UNIT + KEY_GAP) +
    F_ROW_SPACING +
    MAIN_ROWS.length * (KEY_UNIT + KEY_GAP) -
    KEY_GAP;
  return (
    <div className="rounded-xl border-2 border-accent bg-card p-6 flex flex-col gap-4">
      {/* board-aligned content */}
      <div className="w-[44%] min-w-fit flex flex-col gap-3">
        {/* title + specs */}
        <div className="flex items-start justify-between">
          <h2 className="text-text-primary font-semibold whitespace-nowrap">
            {build.current.name}
          </h2>

          <div className="flex gap-2 flex-wrap justify-end ml-4">
            {specs.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-accent border border-accent-dark"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* keyboard */}
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          className="w-full h-auto block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x={0}
            y={0}
            width={VB_WIDTH}
            height={VB_HEIGHT}
            rx={6}
            fill={KB_BG}
            stroke={KB_OUTLINE}
            strokeWidth={KEY_STROKE * 1.5}
          />

          {elements}
        </svg>

        {/* footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-dim">
            Click any key to hear this board | try the typing test: 
          </p>

          {build.current.photos.length > 0 ? (
            <div className="flex gap-2">
              {build.current.photos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <FiCamera
                    size={14}
                    className="text-text-dim hover:text-accent transition-colors"
                  />
                </a>
              ))}
            </div>
          ) : (
            <FiCamera size={14} className="text-text-dim" />
          )}
        </div>
      </div>
    </div>
  );
}
