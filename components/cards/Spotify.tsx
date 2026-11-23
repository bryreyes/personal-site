"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FlipCard from "@/components/FlipCard";
import RecentTracks from "@/components/RecentTracks";

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  songUrl: string;
};

function EqualizerBars() {
  return (
    <div className="flex items-end gap-0.75 h-4">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.75 bg-accent rounded-sm animate-bounce"
          style={{
            height: `${8 + i * 3}px`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
}

// main color in the album art as "r g b", or null if it can't be read.
// next/image gives the art from origin (/_next/image)
function vividColor(img: HTMLImageElement): string | null {
  try {
    const size = 24;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    // group similar colors, score each by how common and how saturated it is
    const buckets = new Map<string, { r: number; g: number; b: number; score: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      // skip near-black and near-white pixels
      if (max < 40 || min > 225) continue;
      const saturation = (max - min) / max;
      const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
      const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, score: 0 };
      const weight = 0.15 + saturation;
      bucket.r += r * weight;
      bucket.g += g * weight;
      bucket.b += b * weight;
      bucket.score += weight;
      buckets.set(key, bucket);
    }

    let best: { r: number; g: number; b: number; score: number } | undefined;
    for (const bucket of buckets.values()) {
      if (!best || bucket.score > best.score) best = bucket;
    }
    if (!best) return null;
    return [best.r, best.g, best.b].map((c) => Math.round(c / best.score)).join(" ");
  } catch {
    return null;
  }
}

export default function Spotify() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [glow, setGlow] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // fetch track
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = await res.json();
        setTrack(data);
      } catch {
        // failed poll: keep showing the last track
      } finally {
        setLoading(false);
      }
    }

    // skip polls while the tab is hidden, catch up as soon as it's visible again
    function poll() {
      if (!document.hidden) load();
    }

    load();
    const interval = setInterval(poll, 30_000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", poll);
    };
  }, []);

  // border tinted by the album art; soft glow only while something is playing
  const tint = track?.albumArt ? glow : null;

  const front = (
    <div
      // tint applied by .album-tint / .album-glow in globals.css
      className={`bento-card rounded-xl border border-card-border bg-card p-6 h-full flex flex-col justify-between lg:min-h-55 ${
        tint ? "album-tint" : ""
      } ${tint && track?.isPlaying ? "album-glow" : ""}`}
      style={tint ? ({ "--tint": tint } as React.CSSProperties) : undefined}
    >
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-text-dim text-sm">Loading...</p>
        </div>
      ) : !track ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-text-dim text-sm">Nothing to show</p>
        </div>
      ) : (
        <a
          href={track.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-4 items-center group"
        >
          <div className="relative shrink-0">
            {track.albumArt && (
              <Image
                src={track.albumArt}
                alt={track.album}
                width={170}
                height={170}
                className="rounded-lg object-cover w-32 h-32 xl:w-42.5 xl:h-42.5"
                onLoad={(e) => setGlow(vividColor(e.currentTarget))}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-xs xl:text-sm text-text-secondary">
                {track.isPlaying ? "Now Playing" : "Last Played"}
              </p>
              <p className="text-text-primary font-semibold text-sm xl:text-base leading-tight truncate">
                {track.title}
              </p>
              <p className="text-text-secondary text-xs xl:text-sm truncate">
                {track.artist}
              </p>
              <p className="text-text-dim text-xs xl:text-sm truncate">{track.album}</p>
              {track.isPlaying && (
                <div className="mt-1">
                  <EqualizerBars />
                </div>
              )}
            </div>
          </div>
        </a>
      )}
    </div>
  );

  // flips over to recent songs (components/RecentTracks.tsx)
  return <FlipCard front={front} back={<RecentTracks />} frontLabel="RECENT" backLabel="NOW" />;
}
