import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiFileText,
} from "react-icons/fi";
import { getSiteData } from "@/lib/site-data";

// "icon" keys in links.json
const ICONS: Record<string, IconType> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
  resume: FiFileText,
};

export default async function Links() {
  const data = await getSiteData("links");
  const commitDate = process.env.LAST_COMMIT_DATE;
  const lastUpdated = commitDate
    ? new Date(commitDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      })
    : null;

  return (
    <div className="bento-card rounded-xl border border-card-border bg-card p-6 flex flex-col gap-4 h-full">
      <span className="text-xs text-text-dim tracking-widest">
        CONNECT WITH ME
      </span>
      <div className="flex flex-wrap gap-2">
        {data.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-text-secondary border border-card-border"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="border-t border-card-border" />
      <div className="flex flex-col gap-2.5">
        {data.links.map(({ icon, label, href }) => {
          const Icon = ICONS[icon] ?? FiFileText;
          // mailto: opens the mail app, so a new tab would just be left empty
          const newTab = !href.startsWith("mailto:");
          return (
            <a
              key={label}
              href={href}
              target={newTab ? "_blank" : undefined}
              rel={newTab ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 text-text-secondary hover:text-accent transition-colors"
            >
              <Icon size={20} className="text-accent shrink-0" />
              <span className="text-xl transition-transform group-hover:translate-x-1">
                {label}
              </span>
              <FiArrowUpRight
                size={16}
                aria-hidden="true"
                className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
              />
            </a>
          );
        })}
      </div>

      {lastUpdated && (
        <p className="mt-auto text-[10px] text-text-dim tracking-wide leading-snug">
          UPDATED {lastUpdated.toUpperCase()}
          {process.env.LAST_COMMIT_MESSAGE && (
            <span className="block normal-case tracking-normal text-xs mt-0.5 truncate">
              {process.env.LAST_COMMIT_MESSAGE}
            </span>
          )}
        </p>
      )}
    </div>
  );
}
