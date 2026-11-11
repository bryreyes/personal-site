import currentlyInto from "@/data/currently-into.json";
import builds from "@/data/builds.json";
import projects from "@/data/projects.json";
import hero from "@/data/hero.json";
import links from "@/data/links.json";
import quotes from "@/data/quotes.json";

// site content now edited live in Vercel Global Config
// each store item key matches a data file name below. json as fallback
const LOCAL = {
  "currently-into": currentlyInto,
  builds,
  projects,
  hero,
  links,
  quotes,
};

type SiteData = typeof LOCAL;
export type SiteDataKey = keyof SiteData;

// how often a page re-reads the store (sec)
const REVALIDATE = 60;

async function getRemoteItems(): Promise<Record<string, unknown> | null> {
  // set automatically when a Global Config store is connected to the project
  const connection = process.env.GLOBAL_CONFIG;
  if (!connection) return null;

  try {
    // connection string: https://global-config.vercel.com/<id>?token=<token>
    const url = new URL(connection);
    const token = url.searchParams.get("token");
    const res = await fetch(`${url.origin}${url.pathname}/items`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`global config read failed (${res.status})`);
    return await res.json();
  } catch (err) {
    // server-side log only; never includes the token
    console.error("site data:", err instanceof Error ? err.message : err);
    return null;
  }
}

// shallow shape check so a typo in the dashboard falls back instead of breaking a card
function matchesShape(remote: unknown, local: object): boolean {
  if (typeof remote !== "object" || remote === null) return false;
  return Object.entries(local).every(([key, value]) => {
    const remoteValue = (remote as Record<string, unknown>)[key];
    if (Array.isArray(value)) return Array.isArray(remoteValue);
    return typeof remoteValue === typeof value;
  });
}

export async function getSiteData<K extends SiteDataKey>(key: K): Promise<SiteData[K]> {
  const remote = (await getRemoteItems())?.[key];
  if (remote !== undefined && matchesShape(remote, LOCAL[key])) {
    return remote as SiteData[K];
  }
  if (remote !== undefined) console.error(`site data: "${key}" has the wrong shape, using local file`);
  return LOCAL[key];
}
