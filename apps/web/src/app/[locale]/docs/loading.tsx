export default function DocsLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row">
      {/* Sidebar skeleton */}
      <div className="hidden w-56 shrink-0 md:block">
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-border/60"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="min-w-0 flex-1 space-y-8">
        <div className="h-9 w-48 rounded bg-border/60" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-64 rounded bg-border/60" />
            <div className="h-4 w-full rounded bg-border/40" />
            <div className="h-4 w-3/4 rounded bg-border/40" />
            <div className="h-32 w-full rounded-lg bg-border/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
