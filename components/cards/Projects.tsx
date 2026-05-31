import { FiExternalLink } from "react-icons/fi";
import data from "@/data/projects.json";

export default function Projects() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 flex flex-col gap-4">
      <span className="text-xs text-text-dim tracking-widest">MY PROJECTS</span>
      {data.projects.slice(0, 3).map((project) => (
        <div key={project.name} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {project.name}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  project.status === "Live"
                    ? "bg-accent-bg text-accent border border-accent-dark"
                    : project.status === "Completed"
                    ? "bg-green-950 text-green-400 border border-green-800"
                    : "bg-card border border-card-border text-text-secondary"
                }`}
              >
                {project.status}
              </span>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <FiExternalLink
                  size={14}
                  className="text-text-dim hover:text-accent transition-colors"
                />
              </a>
            </div>
          </div>
          <p className="text-xs text-text-secondary">{project.description}</p>
        </div>
      ))}
      <a
        href="/projects"
        className="text-xs text-text-dim hover:text-accent transition-colors mt-auto"
      >
        See all projects
      </a>
    </div>
  );
}
