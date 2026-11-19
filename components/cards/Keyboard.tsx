import { getSiteData } from "@/lib/site-data";
import KeyboardLights from "@/components/KeyboardLights";
import KeyboardCard from "@/components/KeyboardCard";

const LIT_KEYS = new Set(["B", "R", "Y", "S", "O", "N"]);

// GMK-style color roles. Any key not in MOD_KEYS or ACCENT_KEYS is an alpha.
// To change a key's role, move it between these sets; the colors themselves
// are per theme in globals.css
const MOD_KEYS = new Set([
  "Tab", "Caps", "Shift", "RShift", "Ctrl", "Win", "Alt", "Fn", "Backspace",
  "F5", "F6", "F7", "F8", "Print", "Scroll", "Pause",
  "Ins", "Home", "PgUp", "Del", "End", "PgDn", "↑", "←", "↓", "→",
]);

// a lot of sets give Esc and Enter their own color
const ACCENT_KEYS = new Set(["Esc", "Enter"]);

// sizing
const KEY_UNIT = 30;

const KEY_GAP = KEY_UNIT * 0.18;

// main spacing
const SIDE_BEZEL = KEY_UNIT * 0.25;
const TOP_BEZEL = KEY_UNIT * 0.5;

// shared physical spacing
const CLUSTER_SPACING = SIDE_BEZEL;
const F_ROW_SPACING = SIDE_BEZEL;

// different F-row spacing
const F_ROW_GROUP_GAP = KEY_UNIT * 0.6;

// proportional scaling
const KEY_RADIUS = KEY_UNIT * 0.12;
const KEY_STROKE = KEY_UNIT * 0.04;
const LEGEND_SIZE = KEY_UNIT * 0.3;

// colors (change these per theme in globals.css, not here)
const KB_BG = "var(--color-kb-body)";
const KB_OUTLINE = "var(--color-kb-outline)";
const KEY_BG = "var(--color-key-bg)";
const KEY_BORDER = "var(--color-key-border)";
const KEY_TEXT = "var(--color-key-text)";
const LIT_BG = "var(--color-key-lit-bg)";
const LIT_BORDER = "var(--color-accent)";
const LIT_TEXT = "var(--color-key-lit-text)";
const MOD_BG = "var(--color-mod-bg)";
const MOD_BORDER = "var(--color-mod-border)";
const MOD_TEXT = "var(--color-mod-text)";
const ACCENT_KEY_BG = "var(--color-accent-key-bg)";
const ACCENT_KEY_BORDER = "var(--color-accent-key-border)";
const ACCENT_KEY_TEXT = "var(--color-accent-key-text)";

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
  Win: 1,
  Alt: 1.5,
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

// legend -> the browser's name for the key, so a real key press can light it.
// letters, numbers and F-keys are handled in keyCode(); any other new key needs an entry
const KEY_CODES: Record<string, string> = {
  "`": "Backquote",
  "-": "Minus",
  "=": "Equal",
  Backspace: "Backspace",
  Tab: "Tab",
  "[": "BracketLeft",
  "]": "BracketRight",
  "\\": "Backslash",
  Caps: "CapsLock",
  ";": "Semicolon",
  "'": "Quote",
  Enter: "Enter",
  Shift: "ShiftLeft",
  RShift: "ShiftRight",
  ",": "Comma",
  ".": "Period",
  "/": "Slash",
  Ctrl: "ControlLeft",
  Win: "MetaLeft",
  Alt: "AltLeft",
  Space: "Space",
  Esc: "Escape",
  Print: "PrintScreen",
  Scroll: "ScrollLock",
  Pause: "Pause",
  Ins: "Insert",
  Home: "Home",
  PgUp: "PageUp",
  Del: "Delete",
  End: "End",
  PgDn: "PageDown",
  "↑": "ArrowUp",
  "←": "ArrowLeft",
  "↓": "ArrowDown",
  "→": "ArrowRight",
};

function keyCode(key: string, rightSide: boolean) {
  if (/^[A-Z]$/.test(key)) return `Key${key}`;
  if (/^[0-9]$/.test(key)) return `Digit${key}`;
  if (/^F\d+$/.test(key)) return key;
  const code = KEY_CODES[key];
  return rightSide && code ? code.replace("Left", "Right") : code;
}

function rowWidth(row: string[]) {
  return row.reduce((total, key, index) => {
    return total + keyWidth(key) + (index < row.length - 1 ? KEY_GAP : 0);
  }, 0);
}

function keyWidth(key: string) {
  const units = WIDE_KEYS[key] ?? 1;
  return units * KEY_UNIT + (units - 1) * KEY_GAP;
}

function renderKey(key: string, x: number, y: number, rightSide = false) {
  const width = keyWidth(key);
  const isLit = LIT_KEYS.has(key);
  const isMod = MOD_KEYS.has(key);
  const isAccent = ACCENT_KEYS.has(key);
  const bg = isLit ? LIT_BG : isAccent ? ACCENT_KEY_BG : isMod ? MOD_BG : KEY_BG;
  const border = isLit ? LIT_BORDER : isAccent ? ACCENT_KEY_BORDER : isMod ? MOD_BORDER : KEY_BORDER;
  const text = isLit ? LIT_TEXT : isAccent ? ACCENT_KEY_TEXT : isMod ? MOD_TEXT : KEY_TEXT;

  return (
    <g
      key={`${key}-${x}-${y}`}
      className="kb-key"
      data-key={keyCode(key, rightSide)}
      // lets a keycap theme color one legend (e.g. Dracula's pink Tab)
      data-legend={key}
      // used to stagger the BRYSON wave
      style={{ "--x": x } as React.CSSProperties}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={KEY_UNIT}
        rx={KEY_RADIUS}
        fill={bg}
        stroke={border}
        strokeWidth={KEY_STROKE}
      />

      <text
        x={x + width / 2}
        y={y + KEY_UNIT / 2}
        fontSize={LEGEND_SIZE}
        fontFamily="monospace"
        fill={text}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ userSelect: "none" }}
      >
        {key}
      </text>
    </g>
  );
}

export default async function Keyboard() {
  const build = await getSiteData("builds");
  const quotes = await getSiteData("quotes");

  const elements: React.ReactNode[] = [];

  const MAIN_BLOCK_WIDTH = rowWidth(MAIN_ROWS[0]);
  const RIGHT_CLUSTER_X = SIDE_BEZEL + MAIN_BLOCK_WIDTH + CLUSTER_SPACING;

  let fx = SIDE_BEZEL;
  const fy = TOP_BEZEL;

  F_ROW_GROUPS.forEach((group, gi) => {
    if (gi === 1) fx += KEY_UNIT + KEY_GAP;
    else if (gi > 1) fx += F_ROW_GROUP_GAP;
    group.forEach((key) => {
      elements.push(renderKey(key, fx, fy));
      fx += keyWidth(key) + KEY_GAP;
    });
  });

  let frx = RIGHT_CLUSTER_X;
  F_ROW_RIGHT.forEach((key) => {
    elements.push(renderKey(key, frx, fy));
    frx += keyWidth(key) + KEY_GAP;
  });

  const VB_WIDTH = frx - KEY_GAP + SIDE_BEZEL;

  MAIN_ROWS.forEach((row, ri) => {
    let x = SIDE_BEZEL;
    const y =
      TOP_BEZEL +
      (KEY_UNIT + KEY_GAP) +
      F_ROW_SPACING +
      ri * (KEY_UNIT + KEY_GAP);
    row.forEach((key, ki) => {
      // the bottom row repeats Ctrl / Alt: the second one is the right-hand key
      elements.push(renderKey(key, x, y, row.indexOf(key) < ki));
      x += keyWidth(key) + KEY_GAP;
    });
  });

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
    if (ri === 0) x += KEY_UNIT + KEY_GAP;
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
    // the SVG is built here on the server; KeyboardCard handles everything interactive
    <KeyboardCard builds={[build.current, ...build.past]} quotes={quotes}>
      <KeyboardLights className="shrink-0 w-full md:w-[55%]">
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          className="w-full h-full block"
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
          {/* mouse glow, drawn under the keys so it only shows through the gaps.
              KeyboardLights moves it */}
          <defs>
            <radialGradient id="kb-spot" gradientUnits="userSpaceOnUse" cx={0} cy={0} r={KEY_UNIT * 3}>
              <stop offset="0" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.7 }} />
              <stop offset="0.5" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.2 }} />
              <stop offset="1" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          <rect
            className="kb-spotlight"
            x={0}
            y={0}
            width={VB_WIDTH}
            height={VB_HEIGHT}
            rx={6}
            fill="url(#kb-spot)"
            pointerEvents="none"
          />
          {elements}
        </svg>
      </KeyboardLights>
    </KeyboardCard>
  );
}
