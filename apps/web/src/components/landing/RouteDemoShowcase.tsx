"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

type TabMode = "fixed" | "interactive" | "multipoint" | "toHere";

const DemoRouteMap = dynamic(() => import("./DemoRouteMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        background: "#261A12",
        borderRadius: 16,
      }}
    />
  ),
});

interface Props {
  title: string;
  description: string;
  tabs: { id: TabMode; label: string }[];
  codeByTab: Record<TabMode, string>;
  hintLabel: string;
}

export function RouteDemoShowcase({
  title,
  description,
  tabs,
  codeByTab,
  hintLabel,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>("fixed");

  return (
    <section className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-2">
      <div className="flex flex-col">
        <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-elevated p-1 sm:flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-surface-dark text-on-dark shadow-sm"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-border shadow-sm flex-1">
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "clamp(300px, 50vw, 400px)",
            }}
          >
            <DemoRouteMap tab={activeTab} hintLabel={hintLabel} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-on-surface-muted sm:text-base">
          {description}
        </p>
        <div
          className="mt-4 overflow-x-auto rounded-xl border border-code-border bg-code-bg text-sm [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: codeByTab[activeTab] }}
        />
      </div>
    </section>
  );
}
