import data from "@/data/currently-into.json";

export default function CurrentlyInto() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 h-full flex flex-col justify-center">
      <div className="grid grid-cols-4 gap-6">
        {data.items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-base text-text-dim tracking-widest">
                {item.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg text-text-primary font-medium leading-snug">
                {item.title}
              </p>
              <p className="text-base text-text-secondary">{item.subtitle}</p>
            </div>
            <div className="w-full border-t border-card-border" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-dim tracking-widest">FAVORITE</p>
              <p className="text-base text-text-primary font-medium leading-snug">
                {item.favorite}
              </p>
              <p className="text-sm text-text-secondary">
                {item.favoriteSub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}