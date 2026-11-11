import { getAccessToken } from "@/lib/spotify";

const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export async function GET() {
  try {
    return await getTrack();
  } catch (err) {
    // server-side log only; the card keeps its last track or shows its empty state
    console.error("spotify:", err instanceof Error ? err.message : err);
    return Response.json(null, { status: 502 });
  }
}

async function getTrack() {
  const access_token = await getAccessToken();

  const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
    next: { revalidate: 30 },
  });

  // 204 means Spotify returned nothing (no active session)
  if (nowPlayingRes.status === 204) {
    return await getRecentlyPlayed(access_token);
  }

  if (!nowPlayingRes.ok) throw new Error(`now playing failed (${nowPlayingRes.status})`);

  const data = await nowPlayingRes.json();

  if (!data?.item) {
    return await getRecentlyPlayed(access_token);
  }

  return Response.json({
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    album: data.item.album.name,
    albumArt: data.item.album.images[0]?.url,
    songUrl: data.item.external_urls.spotify,
  });
}

async function getRecentlyPlayed(access_token: string) {
  const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${access_token}` },
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error(`recently played failed (${res.status})`);

  const data = await res.json();
  const track = data.items?.[0]?.track;

  if (!track) {
    return Response.json(null);
  }

  return Response.json({
    isPlaying: false,
    title: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  });
}