// Keycap sets the site can be recolored to. colors live in globals.css
// under [data-theme="..."]; "default" is the site's og palette

export const THEMES = [
  // word: typing it anywhere on the page switches to the set
  { id: "default", name: "Default (no keycap set)", word: "DEFAULT" },
  { id: "analog-dreams", name: "GMK Analog Dreams", word: "ANALOG" },
  { id: "norse", name: "GMK Norse", word: "NORSE" },
  { id: "dracula", name: "GMK Dracula", word: "DRACULA" },
  { id: "botanical", name: "GMK Botanical", word: "BOTANICAL" },
  { id: "frost-witch", name: "GMK Frost Witch", word: "FROST" },
  { id: "tsukimi", name: "Osume Tsukimi", word: "TSUKIMI" },
  { id: "minimal", name: "GMK Minimal", word: "MINIMAL" },
];

const STORAGE_KEY = "theme";

// the theme is an attribute on <html> (set early by the script in
// app/layout.tsx), so read it from there and re-render when it changes
export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export function getTheme() {
  return document.documentElement.dataset.theme ?? "default";
}

export function setTheme(id: string) {
  const root = document.documentElement;
  try {
    if (id === "default") {
      delete root.dataset.theme;
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.dataset.theme = id;
      localStorage.setItem(STORAGE_KEY, id);
    }
  } catch {
    // storage can be blocked (private windows); the theme still applies for this visit
  }
}
