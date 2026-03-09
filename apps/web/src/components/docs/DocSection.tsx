import { RevealOnScroll } from "@/components/RevealOnScroll";
import type { ReactNode } from "react";

export function DocSection({
  children,
  last = false,
}: { children: ReactNode; last?: boolean }) {
  return (
    <div>
      <RevealOnScroll className="py-12">{children}</RevealOnScroll>
      {!last && (
        <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
    </div>
  );
}
