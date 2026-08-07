import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import data from "@/data/projects.json";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default async function ProjectWriteup({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = data.projects.find((p) => p.projectId === projectId);

  if (!project) notFound();

  const filePath = path.join(
    process.cwd(),
    "content/project-writeups",
    `${projectId}.md`,
  );
  const hasWriteup = fs.existsSync(filePath);
  const writeupContent = hasWriteup
    ? matter(fs.readFileSync(filePath, "utf-8")).content
    : null;

  return (
    <main className="min-h-screen bg-bg text-text-primary px-6 py-16 max-w-2xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-accent transition-colors mb-8"
      >
        <FiArrowLeft size={14} />
        Back
      </Link>

      <div className="flex flex-col gap-2 mb-4">
        {!project.live && (
          <span className="text-xs text-text-dim tracking-widest">
            NOT LIVE YET
          </span>
        )}
        <h1 className="text-2xl font-medium text-text-primary">
          {project.name}
        </h1>
        <span className="text-xs text-text-dim">{project.date}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded-full bg-accent-bg text-text-secondary border border-card-border"
          >
            {tech}
          </span>
        ))}
      </div>

      {writeupContent ? (
        <div className="prose prose-invert prose-sm max-w-none text-text-secondary prose-strong:text-accent prose-strong:font-medium prose-code:text-accent prose-code:bg-transparent prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown>{writeupContent}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">
          No demo up for this one yet. Reach out if you want to know more.
        </p>
      )}
    </main>
  );
}
