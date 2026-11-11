import {
  Name,
  Links,
  CurrentlyInto,
  Projects,
  Keyboard,
  Spotify,
} from "@/components/cards";

export default function Home() {
  return (
    // single column below lg; 3 columns from lg up (rows: Name + Spotify,
    // Links + Keyboard, Currently Into + Projects)
    <main className="grid gap-2.5 grid-cols-1 lg:grid-cols-[0.55fr_1.2fr_0.8fr]">
      <div className="lg:col-span-2">
        <Name />
      </div>
      <div>
        <Spotify />
      </div>
      <div>
        <Links />
      </div>
      <div className="lg:col-span-2">
        <Keyboard />
      </div>
      <div className="lg:col-span-2">
        <CurrentlyInto />
      </div>
      <div>
        <Projects />
      </div>
    </main>
  );
}
