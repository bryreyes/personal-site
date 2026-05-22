const tags = [
  "Open to Work",
  "Placeholder Tag",
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
          Bryson Reyes<span className="text-accent animate-pulse">|</span>
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          {/* Bio goes here */}
          CS grad based in San Diego. I build things and collect keyboards.
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