"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// shape returned by /api/spotify/recent
type Track = {
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  songUrl: string;
  playedAt: string;
};

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} days ago`;
}

// back of Spotify card last few songs as a stack of album covers
// hovering or tapping one lifts it out
export default function RecentTracks() {
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/spotify/recent")
      .then((res) => (res.ok ? res.json() : []))
      .then(setTracks)
      .catch(() => setTracks([]));
  }, []);

  const current = tracks?.[active];

  return (
    <div className="rounded-xl border border-card-border bg-card p-6 h-full flex flex-col gap-3">
      <p className="text-xs xl:text-sm text-text-secondary">Recently Played</p>

      {tracks === null ? (
        <p className="flex-1 flex items-center justify-center text-sm text-text-dim">Loading...</p>
      ) : !current ? (
        <p className="flex-1 flex items-center justify-center text-sm text-text-dim">Nothing to show</p>
      ) : (
        <>
          {/* covers overlap; the active one lifts out and straightens */}
          <div className="flex justify-center pt-3" onMouseLeave={() => setActive(0)}>
            {tracks.slice(0, 6).map((track, i, shown) => {
              const isActive = i === active;
              // explode outwards from the middle of the stack
              const tilt = (i - (shown.length - 1) / 2) * 3;
              return (
                <a
                  key={track.playedAt}
                  href={track.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onTouchStart={() => setActive(i)}
                  aria-label={`${track.title} by ${track.artist}`}
                  className="relative -ml-7 first:ml-0 shrink-0 transition-transform duration-300 ease-out"
                  style={{
                    zIndex: isActive ? shown.length + 1 : shown.length - i,
                    transform: isActive ? "translateY(-8px) scale(1.08)" : `rotate(${tilt}deg)`,
                  }}
                >
                  <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-md overflow-hidden bg-accent-bg border border-card-border shadow-lg shadow-black/40">
                    {track.albumArt && (
                      <Image src={track.albumArt} alt="" width={80} height={80} className="w-full h-full object-cover" />
                    )}
                  </div>
                </a>
              );
            })}
          </div>

          <div className="text-center min-w-0 mt-auto">
            <p className="text-text-primary font-semibold text-sm leading-tight truncate">{current.title}</p>
            <p className="text-text-secondary text-xs truncate">
              {current.artist} · {timeAgo(current.playedAt)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
