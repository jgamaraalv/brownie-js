interface PropDef {
  name: string;
  type: string;
  default: string;
  description: string;
}

export function PropTable({
  props,
  componentId,
}: { props: PropDef[]; componentId?: string }) {
  const captionText = componentId ? `${componentId} props` : "Props";

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-left text-sm" aria-label={captionText}>
          <thead>
            <tr className="border-b border-code-border bg-surface-dark">
              <th className="text-on-dark py-3 pl-4 pr-4 text-xs font-semibold uppercase tracking-wider">
                Prop
              </th>
              <th className="text-on-dark py-3 pr-4 text-xs font-semibold uppercase tracking-wider">
                Type
              </th>
              <th className="text-on-dark py-3 pr-4 text-xs font-semibold uppercase tracking-wider">
                Default
              </th>
              <th className="text-on-dark py-3 pr-4 text-xs font-semibold uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, i) => (
              <tr
                key={prop.name}
                id={componentId ? `${componentId}-${prop.name}` : undefined}
                className={`border-b border-border/60 transition-colors hover:bg-accent-soft/30 ${i % 2 === 0 ? "bg-surface-elevated" : "bg-surface"}`}
              >
                <td className="py-2.5 pl-4 pr-4 font-mono text-sm font-medium text-on-surface">
                  {prop.name}
                </td>
                <td className="text-accent py-2.5 pr-4 font-mono text-xs">
                  {prop.type}
                </td>
                <td className="text-on-surface-muted py-2.5 pr-4 font-mono text-sm">
                  {prop.default}
                </td>
                <td className="text-on-surface-muted py-2.5 pr-4 text-sm">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {props.map((prop) => (
          <dl
            key={prop.name}
            id={componentId ? `${componentId}-${prop.name}` : undefined}
            className="bg-surface-elevated border border-border rounded-xl p-4 text-sm"
          >
            <dt className="font-mono text-sm font-medium">{prop.name}</dt>
            <dd className="text-accent mt-1 font-mono text-xs">{prop.type}</dd>
            {prop.default !== "-" && (
              <dd className="text-on-surface-muted mt-1 font-mono text-sm">
                Default: {prop.default}
              </dd>
            )}
            <dd className="text-on-surface-muted mt-2 text-sm">
              {prop.description}
            </dd>
          </dl>
        ))}
      </div>
    </>
  );
}
