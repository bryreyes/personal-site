import { Name, Links } from "@/components/cards";

export default function Home() {
  return (
    <main
      className="grid gap-2.5"
      style={{
        gridTemplateColumns: "0.55fr 1.2fr 0.8fr",
        gridTemplateRows: "auto auto auto",
      }}
    >
      <div style={{ gridColumn: "1 / 3", gridRow: "1" }}>
        <Name />
      </div>
      <div style={{ gridColumn: "3", gridRow: "1" }} className="rounded-xl border border-card-border bg-card p-4">Spotify</div>
      <div style={{ gridColumn: "1", gridRow: "2" }}>
        <Links />
      </div>
      <div style={{ gridColumn: "2 / 4", gridRow: "2" }} className="rounded-xl border border-card-border bg-card p-4">Keyboard</div>
      <div style={{ gridColumn: "1 / 3", gridRow: "3" }} className="rounded-xl border border-card-border bg-card p-4">Currently Into</div>
      <div style={{ gridColumn: "3", gridRow: "3" }} className="rounded-xl border border-card-border bg-card p-4">Projects</div>
    </main>
  );
}