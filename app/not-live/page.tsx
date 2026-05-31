import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotLive() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-6">
      <div className="rounded-xl border border-card-border bg-card p-10 max-w-md flex flex-col gap-4">
        <span className="text-xs text-text-dim tracking-widest">
          NOT LIVE YET
        </span>
        <p className="text-sm text-text-secondary">
          This one isn&apos;t public yet. Check back soon for a demo, or reach
          out if you want to know more.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-text-dim hover:text-accent transition-colors mt-2"
        >
          <FiArrowLeft size={14} />
          Back
        </Link>
      </div>
    </main>
  );
}
