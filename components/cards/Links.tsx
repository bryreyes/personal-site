import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";

const links = [
  { icon: FiGithub, label: "GitHub", href: "https://github.com/bryreyes" },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bryson-r-967a8127a/",
  },
  { icon: FiMail, label: "Email", href: "mailto:brysonreyes03@gmail.com" },
  { icon: FiFileText, label: "Resume", href: "/BrysonReyes Resume.pdf" },
];

const stack = [
  "Python",
  "Computer Vision",
  "GCP",
  "Kubernetes",
  "Docker",
  "React",
  "Next.js",
  "Tailwind CSS",
  "REST APIs",
];

export default function Links() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 flex flex-col gap-4 h-full">
      <span className="text-xs text-text-dim tracking-widest">
        CONNECT WITH ME
      </span>
      <div className="flex flex-wrap gap-2">
        {stack.map((tech) => (
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
        {links.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Icon size={20} className="text-accent shrink-0" />
            <span className="text-xl">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
