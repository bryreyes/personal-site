import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";

const links = [
  { icon: FiGithub, label: "github.com/bryreyes", href: "https://github.com/bryreyes" },
  { icon: FiLinkedin, label: "linkedin.com/in/bryson-r-967a8127a/", href: "https://www.linkedin.com/in/bryson-r-967a8127a/" },
  { icon: FiMail, label: "brysonreyes03@gmail.com", href: "mailto:brysonreyes03@gmail.com" },
  { icon: FiFileText, label: "Resume", href: "/resume.pdf" },
];

export default function Links() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 flex flex-col justify-center gap-4 h-full">
      {links.map(({ icon: Icon, label, href }) => (
        
        <a 
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group"
        >
            <Icon size={16} className="text-accent shrink-0" />
            <span className="text-sm">{label}</span>
        </a>
      ))}
    </div>
  );
}