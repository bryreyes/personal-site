import data from "@/data/projects.json";
import Link from "next/link";
import { FiExternalLink, FiArrowLeft } from "react-icons/fi";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-bg text-text-primary px-6 py-16 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-base text-text-dim hover:text-accent transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back
      </Link>
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-xs text-text-dim tracking-widest">
          ALL PROJECTS
        </span>
        <h1 className="text-2xl font-medium text-text-primary">
          Things I&apos;ve built
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {data.projects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl border border-card-border bg-card p-6 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm font-medium text-text-primary">
                {project.name}
              </span>
              <div className="flex items-center gap-2 shrink-0">
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
      </div>
    </main>
  );
}
