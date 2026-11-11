// shared by the Projects card and /projects so the two can't drift
const STATUS_STYLES: Record<string, string> = {
  Live: "bg-accent-bg text-accent border border-accent-dark",
  Completed: "bg-green-950 text-green-400 border border-green-800",
  "In Progress": "bg-card border border-card-border text-text-secondary",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
        STATUS_STYLES[status] ?? STATUS_STYLES["In Progress"]
      }`}
    >
      {status}
    </span>
  );
}
