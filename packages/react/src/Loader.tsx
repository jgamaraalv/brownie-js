import { memo, useEffect } from "react";
import type { CSSProperties } from "react";

export interface LoaderProps {
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

let styleInjected = false;

function injectLoaderStyle() {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    @media (prefers-reduced-motion: no-preference) {
      .bm-loader-spinner { animation: bm-spin 1.2s linear infinite; }
    }
    @keyframes bm-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export const Loader = memo(function Loader({
  ariaLabel = "Loading map",
  className,
  style,
}: LoaderProps) {
  useEffect(() => {
    injectLoaderStyle();
  }, []);

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: "var(--bm-loader-bg, #f0ede8)",
        ...style,
      }}
    >
      {/* Map pin icon */}
      <svg
        aria-hidden="true"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill="var(--bm-loader-color, #a89585)"
        />
      </svg>

      {/* Circular spinner */}
      <svg
        aria-hidden="true"
        className="bm-loader-spinner"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ willChange: "transform" }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="var(--bm-loader-color, #a89585)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 3 A9 9 0 0 1 21 12"
          stroke="var(--bm-loader-color, #a89585)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});
