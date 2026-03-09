import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMapSubscription } from "./useMapSubscription";

// ── Types ──────────────────────────────────────────────────────

export interface UsePopupOptions {
  /** Geographic position [lon, lat]. When undefined the popup is hidden. */
  coordinates?: [number, number];
  /** Pixel offset from the projected point. Default: [0, -10] */
  offset?: [number, number];
  /** Close the popup on outside pointer-down. Default: true */
  closeOnClick?: boolean;
  /** Callback invoked when the popup should close. */
  onClose?: () => void;
}

export interface UsePopupReturn {
  /** Positioning style (position, left, top, transform). No visual styles. */
  style: CSSProperties;
  /** `true` when `coordinates` are provided. */
  isVisible: boolean;
  /** `true` when the popup flips below the anchor (near top viewport edge). */
  isFlipped: boolean;
  /** Triggers the `onClose` callback. */
  close: () => void;
  /** Accessibility attributes to spread on the popup container. */
  props: { role: string };
  /** Ref to attach to the popup container element (needed for height measurement and outside-click detection). */
  popupRef: React.RefObject<HTMLDivElement>;
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts popup positioning, flip logic,
 * close-on-outside-click behaviour, and accessibility attributes.
 *
 * Returns only layout/positioning styles — no visual styles
 * (background, border, shadow, etc.).
 */
export function usePopup({
  coordinates,
  offset = [0, -10],
  closeOnClick = true,
  onClose,
}: UsePopupOptions = {}): UsePopupReturn {
  const { project } = useMapSubscription();
  const popupRef = useRef<HTMLDivElement>(null);

  // Keep a stable ref to avoid re-running effects on every render
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [measuredHeight, setMeasuredHeight] = useState(150);

  // Measure actual popup height so the flip threshold is accurate.
  // Only re-measure when visibility changes (coordinates appear/disappear).
  const isVisible = coordinates != null;
  useLayoutEffect(() => {
    if (popupRef.current) {
      setMeasuredHeight(popupRef.current.offsetHeight);
    }
  }, [isVisible]);

  // Close on outside pointer-down
  useEffect(() => {
    if (!closeOnClick || !onCloseRef.current) return;
    const mountTime = performance.now();
    const handler = (e: Event) => {
      // Ignore the event that opened the popup (same frame)
      if (performance.now() - mountTime < 16) return;
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onCloseRef.current?.();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, [closeOnClick]);

  const close = useCallback(() => {
    onCloseRef.current?.();
  }, []);

  // ── Derived state ──────────────────────────────────────────

  if (!isVisible) {
    return {
      style: { position: "absolute" } as CSSProperties,
      isVisible: false,
      isFlipped: false,
      close,
      props: { role: "dialog" },
      popupRef,
    };
  }

  const [px, py] = project(coordinates[0], coordinates[1]);

  // Flip when the popup would overflow above the viewport
  const isFlipped = py + offset[1] - measuredHeight < 0;

  const tx = px + offset[0];
  const ty = isFlipped ? py - offset[1] + 10 : py + offset[1];

  const style: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    transform: isFlipped
      ? `translate3d(${tx}px, ${ty}px, 0) translate(-50%, 0)`
      : `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -100%)`,
  };

  return {
    style,
    isVisible: true,
    isFlipped,
    close,
    props: { role: "dialog" },
    popupRef,
  };
}
