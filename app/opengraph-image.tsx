import { ImageResponse } from "next/og";

// generated at build
export const alt = "Bryson Reyes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// hex here because ImageResponse can't read CSS variables (values match globals.css)
const BG = "#1a1814";
const CARD = "#221f1a";
const CARD_BORDER = "#3a3530";
const ACCENT = "#a07840";
const ACCENT_DARK = "#7a5828";
const TEXT_PRIMARY = "#e8dcc8";
const TEXT_SECONDARY = "#6a6058";
const KEY_LIT_BG = "#5a3e1e";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: BG,
          padding: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: CARD,
            border: `2px solid ${CARD_BORDER}`,
            borderRadius: 24,
            padding: 64,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, color: TEXT_SECONDARY }}>Hey, I&apos;m</div>
            <div style={{ display: "flex", fontSize: 120, fontWeight: 700, color: TEXT_PRIMARY }}>
              Bryson Reyes<span style={{ color: ACCENT }}>|</span>
            </div>
            <div style={{ fontSize: 34, color: TEXT_SECONDARY, marginTop: 8 }}>
              I build things and collect keyboards.
            </div>
          </div>

          {/* same lit keys as the keyboard card */}
          <div style={{ display: "flex", gap: 14 }}>
            {["B", "R", "Y", "S", "O", "N"].map((key) => (
              <div
                key={key}
                style={{
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: KEY_LIT_BG,
                  border: `3px solid ${ACCENT}`,
                  borderRadius: 10,
                  color: ACCENT,
                  fontSize: 30,
                  fontFamily: "monospace",
                }}
              >
                {key}
              </div>
            ))}
            <div
              style={{
                marginLeft: "auto",
                alignSelf: "flex-end",
                fontSize: 28,
                color: ACCENT_DARK,
              }}
            >
              brysonreyes.dev
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
