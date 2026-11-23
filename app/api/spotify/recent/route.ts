import { getAccessToken } from "@/lib/spotify";

// last few distinct tracks, for the back of the Spotify card (RecentTracks)
const RECENT_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=20";
const MAX_TRACKS = 8;

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(RECENT_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`recently played failed (${res.status})`);

    const data = await res.json();
    const seen = new Set<string>();
    const tracks = [];
    // the same song played twice in a row shows up twice; keep the first
    for (const item of (data.items ?? []) as { track: SpotifyTrack; played_at: string }[]) {
      if (seen.has(item.track.id)) continue;
      seen.add(item.track.id);
      tracks.push({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        album: item.track.album.name,
        albumArt: item.track.album.images[0]?.url,
        songUrl: item.track.external_urls.spotify,
        playedAt: item.played_at,
      });
      if (tracks.length === MAX_TRACKS) break;
    }
    return Response.json(tracks);
  } catch (err) {
    // server-side log only; the card shows its empty state
    console.error("spotify recent:", err instanceof Error ? err.message : err);
    return Response.json([], { status: 502 });
  }
}
