import Link from "next/link";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import { getSiteData } from "@/lib/site-data";
import StatusBadge from "@/components/StatusBadge";

export default async function Projects() {
  const data = await getSiteData("projects");

  return (
    <div className="bento-card rounded-xl border border-card-border bg-card p-6 flex flex-col gap-4">
      <span className="text-xs text-text-dim tracking-widest">MY PROJECTS</span>
      {data.projects.slice(0, 3).map((project) => (
        <div key={project.name} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {project.name}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={project.status} />
              <Link
                href={project.url}
                target={project.live ? "_blank" : undefined}
                rel={project.live ? "noopener noreferrer" : undefined}
              >
                <FiExternalLink
                  size={14}
                  className="text-text-dim hover:text-accent transition-colors"
                />
              </Link>
            </div>
          </div>
          <p className="text-xs text-text-secondary">{project.description}</p>
        </div>
      ))}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-accent transition-colors mt-auto"
      >
        See all projects
        <FiArrowRight size={14} />
      </Link>
    </div>
  );
}
