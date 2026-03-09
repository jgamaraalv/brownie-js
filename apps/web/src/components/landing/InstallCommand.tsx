"use client";

import { useState } from "react";

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function InstallCommand({
  command,
  variant = "light",
}: { command: string; variant?: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = variant === "dark";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-mono text-sm ${
        isDark
          ? "border border-border-dark bg-code-bg text-on-dark"
          : "border border-border bg-surface-elevated text-on-surface"
      }`}
    >
      <span
        className={
          isDark ? "text-accent select-none" : "text-accent select-none"
        }
      >
        $
      </span>
      <code className="flex-1 truncate">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className={`cursor-pointer transition ${isDark ? "text-on-dark-muted hover:text-accent" : "text-on-surface-muted hover:text-accent"}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}
