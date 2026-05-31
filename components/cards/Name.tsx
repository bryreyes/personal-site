const tags = [
  "CS Grad",
  "Placeholder, I dont like having empty space here but its hard to put something here the site doesnt already show",
  "Placeholder Tag 2",
];

export default function Name() {
  return (
    <div
      className="rounded-xl border border-card-border bg-card p-6 flex flex-col justify-between"
      style={{ minHeight: "220px" }}
    >
      <div>
        <p className="text-sm text-text-secondary mb-1">Hey, I&apos;m</p>
        <h1 className="text-4xl font-bold text-text-primary mb-3">
          Bryson<span className="text-accent animate-pulse">|</span>
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          I build things and collect keyboards. This site is meant to show off a
          bit about me and my work; feel free to explore!
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-3 py-1 rounded-full bg-accent-bg text-accent border border-accent-dark"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
