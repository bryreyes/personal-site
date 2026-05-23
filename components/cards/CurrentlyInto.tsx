import data from "@/data/currently-into.json";

export default function CurrentlyInto() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6">
      <div className="grid grid-cols-4 gap-4">
        {data.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-xs text-text-dim tracking-widest">{item.label}</span>
            </div>
            <p className="text-sm text-text-primary font-medium leading-snug">{item.title}</p>
            <p className="text-xs text-text-secondary">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}