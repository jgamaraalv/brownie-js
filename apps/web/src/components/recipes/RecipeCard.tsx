"use client";
import { useId, useState } from "react";

interface RecipeCardProps {
  title: string;
  description: string;
  code: string;
  preview: React.ReactNode;
}

export function RecipeCard({
  title,
  description,
  code,
  preview,
}: RecipeCardProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const id = useId();

  const tabPreviewId = `${id}-tab-preview`;
  const tabCodeId = `${id}-tab-code`;
  const panelPreviewId = `${id}-panel-preview`;
  const panelCodeId = `${id}-panel-code`;
  const headingId = `${id}-heading`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setTab(tab === "preview" ? "code" : "preview");
    } else if (e.key === "ArrowLeft") {
      setTab(tab === "code" ? "preview" : "code");
    }
  };

  return (
    <article
      aria-labelledby={headingId}
      className="card-hover overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm shadow-on-surface/5"
    >
      <div className="space-y-2 p-6">
        <h3
          id={headingId}
          className="font-display text-xl font-semibold tracking-tight text-on-surface"
        >
          {title}
        </h3>
        <p className="text-sm text-on-surface-muted">{description}</p>
      </div>
      <div className="border-t border-border">
        <div className="flex items-center justify-between bg-surface-elevated px-4 py-2">
          <div role="tablist" aria-label={`${title} view`} className="flex gap-2">
            <button
              type="button"
              role="tab"
              id={tabPreviewId}
              aria-selected={tab === "preview"}
              aria-controls={panelPreviewId}
              onClick={() => setTab("preview")}
              onKeyDown={handleTabKeyDown}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                tab === "preview"
                  ? "bg-surface-dark text-on-dark"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              role="tab"
              id={tabCodeId}
              aria-selected={tab === "code"}
              aria-controls={panelCodeId}
              onClick={() => setTab("code")}
              onKeyDown={handleTabKeyDown}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                tab === "code"
                  ? "bg-surface-dark text-on-dark"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              Code
            </button>
          </div>
          <div className="flex items-center gap-2">
            {tab === "code" && (
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Code copied" : `Copy ${title} code`}
                className="rounded border border-border px-3 py-1 text-xs text-on-surface-muted transition-colors hover:text-on-surface"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            <span role="status" aria-live="polite" className="sr-only">
              {copied ? "Code copied to clipboard" : ""}
            </span>
          </div>
        </div>
        <div className="min-h-[350px]">
          {tab === "preview" ? (
            <div
              role="tabpanel"
              id={panelPreviewId}
              aria-labelledby={tabPreviewId}
              tabIndex={0}
              className="p-4"
            >
              {preview}
            </div>
          ) : (
            <div
              role="tabpanel"
              id={panelCodeId}
              aria-labelledby={tabCodeId}
              tabIndex={0}
            >
              <pre
                aria-label={`${title} code example`}
                className="overflow-x-auto border-t border-code-border bg-code-bg p-4 font-mono text-xs"
              >
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
