import { getSiteData } from "@/lib/site-data";
import ThemePicker from "@/components/ThemePicker";
import HeroName from "@/components/HeroName";

export default async function Name() {
  const data = await getSiteData("hero");

  return (
    <div className="bento-card rounded-xl border border-card-border bg-card p-6 flex flex-col sm:flex-row gap-6 lg:min-h-55">
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <p className="text-sm text-text-secondary mb-1">Hey, I&apos;m</p>
          <HeroName name={data.name} />
          <p className="text-text-secondary text-sm leading-relaxed">
            {data.bio}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-accent-bg text-accent border border-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ThemePicker />
    </div>
  );
}
