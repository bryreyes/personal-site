import Link from "next/link";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { getSiteData } from "@/lib/site-data";
import StatusBadge from "@/components/StatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built: cloud, computer vision, and web projects.",
};

export default async function ProjectsPage() {
  const data = await getSiteData("projects");

  return (
    <main className="min-h-screen bg-bg text-text-primary px-6 py-16 max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-accent transition-colors mb-8">
        <FiArrowLeft size={14} />
        Back
      </Link>
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-xs text-text-dim tracking-widest">ALL PROJECTS</span>
        <h1 className="text-2xl font-medium text-text-primary">Things I&apos;ve built</h1>
      </div>
      <div className="flex flex-col gap-4">
        {data.projects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl border border-card-border bg-card p-6 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text-primary">{project.name}</span>
                <span className="text-xs text-text-dim">{project.date}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={project.status} />
                <Link 
                  href={project.github}
                  target={project.github.startsWith("http") ? "_blank" : undefined}
                  rel={project.github.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <FiGithub size={14} className="text-text-dim hover:text-accent transition-colors" />
                </Link>
                <Link
                  href={project.url}
                  target={project.live ? "_blank" : undefined}
                  rel={project.live ? "noopener noreferrer" : undefined}
                >
                  <FiExternalLink size={14} className="text-text-dim hover:text-accent transition-colors" />
                </Link>
              </div>
            </div>
            <p className="text-xs text-text-secondary">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.stack.map((tech) => (
                <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-text-secondary border border-card-border">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}