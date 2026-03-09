import { highlightCode } from "@/lib/shiki";

type Props = {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
};

export async function DemoShowcase({
  title,
  description,
  code,
  children,
}: Props) {
  const highlighted = await highlightCode(code);

  return (
    <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
      <div
        className="overflow-hidden rounded-2xl border border-border shadow-sm [&>div]:h-full"
        style={{ height: "clamp(300px, 50vw, 500px)" }}
      >
        {children}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-on-surface-muted sm:text-base">
          {description}
        </p>
        <div
          className="code-block-hover mt-4 overflow-auto rounded-xl border border-code-border bg-code-bg text-sm [&_pre]:p-4"
          style={{ maxHeight: 420 }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </section>
  );
}
