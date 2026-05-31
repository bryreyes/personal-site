"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Track = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
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

export default function Spotify() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // fetch track
        const res = await fetch("/api/spotify");
        const data = await res.json();
        setTrack(data);
      } catch {
        // (lazy) cointinue loading on failure
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="rounded-xl border border-card-border bg-card p-6 flex flex-col justify-between"
      style={{ minHeight: "220px" }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-text-dim text-sm">Loading...</p>
        </div>
      ) : !track ? (
        <div className="flex items-center justify-center h-full">
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
            <Image
              src={track.albumArt}
              alt={track.album}
              width={170}
              height={170}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="scale-115 origin-left">
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-xs text-text-secondary">
                {track.isPlaying ? "Now Playing" : "Last Played"}
              </p>
              <p className="text-text-primary font-semibold text-sm leading-tight truncate">
                {track.title}
              </p>
              <p className="text-text-secondary text-xs truncate">
                {track.artist}
              </p>
              <p className="text-text-dim text-xs truncate">{track.album}</p>
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
}
