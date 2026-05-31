import data from "@/data/currently-into.json";

export default function CurrentlyInto() {
  return (
    <div className="rounded-xl border border-card-border bg-card p-16 h-full flex flex-col justify-between">
      <div className="grid grid-cols-4 gap-6 h-full">
        {data.items.map((item) => (
          <div key={item.label} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <span className="text-base text-text-dim tracking-widest">
                {item.label}
              </span>
            </div>
            <p className="text-lg text-text-primary font-medium leading-snug -mt-3">
              {item.title}
            </p>
            <p className="text-base text-text-secondary -mt-4">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
