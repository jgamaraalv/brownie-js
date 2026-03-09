import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createKeyboardClickHandler } from "../utils";
import { useMapSubscription } from "./useMapSubscription";

// ── Types ──────────────────────────────────────────────────────

export interface UseMarkerOptions {
  /** Geographic coordinates [lon, lat]. */
  coordinates: [number, number];
  /** How the marker is anchored to the point. Default: "bottom" */
  anchor?: "center" | "bottom";
  /** Whether the marker can be dragged. Default: false */
  draggable?: boolean;
  /** Marker opacity. Default: 1 */
  opacity?: number;
  /** Enable GPU-accelerated enter animation. Default: false */
  animated?: boolean;
  /** Viewport culling padding in pixels. Default: 64 */
  cullPadding?: number;
  /** Arbitrary data passed to event callbacks. */
  data?: Record<string, unknown>;
  /** Click handler. */
  onClick?: (event: MouseEvent, data?: Record<string, unknown>) => void;
  /** Called after a drag ends with the new coordinates. */
  onDragEnd?: (
    coordinates: [number, number],
    data?: Record<string, unknown>,
  ) => void;
  /** Mouse enter handler. */
  onMouseEnter?: (event: MouseEvent) => void;
  /** Mouse leave handler. */
  onMouseLeave?: (event: MouseEvent) => void;
  /** Accessible label for the marker. */
  ariaLabel?: string;
}

export interface UseMarkerReturn {
  /** Positioning + animation styles (position, left, top, transform, opacity, cursor, etc.). No visual styles. */
  style: CSSProperties;
  /** `true` when the marker is outside the visible viewport. */
  isOutOfView: boolean;
  /** `true` when the marker is currently being dragged. */
  isDragging: boolean;
  /** Event handlers to spread on the marker container element. */
  // biome-ignore lint/suspicious/noExplicitAny: handlers accept heterogeneous React event types
  handlers: Record<string, (e: any) => void>;
  /** Accessibility attributes to spread on the marker container element. */
  props: {
    role?: string;
    tabIndex?: number;
    "aria-label"?: string;
  };
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Headless hook that extracts marker positioning, viewport culling,
 * drag handling, GPU-accelerated enter animation, and accessibility.
 *
 * Returns only layout/positioning styles — no visual styles.
 */
export function useMarker({
  coordinates,
  anchor = "bottom",
  draggable = false,
  opacity = 1,
  animated = false,
  cullPadding = 64,
  data,
  onClick,
  onDragEnd,
  onMouseEnter,
  onMouseLeave,
  ariaLabel,
}: UseMarkerOptions): UseMarkerReturn {
  const { project, invert, width, height } = useMapSubscription();
  const dragRef = useRef<{
    startX: number;
    startY: number;
    dragging: boolean;
  } | null>(null);
  const dragOffsetRef = useRef<[number, number] | null>(null);
  const [, forceRender] = useState(0);
  const [mounted, setMounted] = useState(!animated);

  useEffect(() => {
    if (!animated) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  // ── Drag handlers (must be before any early return) ──────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return;
      e.stopPropagation();
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        dragging: false,
      };
    },
    [draggable],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      e.stopPropagation();

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      // Mark as dragging after any movement
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragRef.current.dragging = true;
      }

      const [basePx, basePy] = project(coordinates[0], coordinates[1]);
      dragOffsetRef.current = [basePx + dx, basePy + dy];

      // Direct DOM update instead of React re-render for 60fps drag
      const el = e.currentTarget as HTMLElement;
      const anchorTx =
        anchor === "bottom"
          ? "translate(-50%, -100%)"
          : "translate(-50%, -50%)";
      el.style.transform = `translate3d(${basePx + dx}px, ${basePy + dy}px, 0) ${anchorTx}`;
    },
    [coordinates, project, anchor],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already be released
      }

      const wasDragging = dragRef.current.dragging;
      const offset = dragOffsetRef.current;
      dragRef.current = null;

      if (wasDragging && offset) {
        const [lon, lat] = invert(offset[0], offset[1]);
        dragOffsetRef.current = null;
        forceRender((n) => n + 1);
        onDragEnd?.([lon, lat], data);
      } else {
        dragOffsetRef.current = null;
        forceRender((n) => n + 1);
      }
    },
    [invert, onDragEnd, data],
  );

  // Project geographic coordinates to pixel position
  const [px, py] = project(coordinates[0], coordinates[1]);

  // Viewport culling with padding
  const pad = cullPadding;
  const isOutOfView =
    px < -pad || px > width + pad || py < -pad || py > height + pad;

  const finalX = dragOffsetRef.current ? dragOffsetRef.current[0] : px;
  const finalY = dragOffsetRef.current ? dragOffsetRef.current[1] : py;

  const anchorTransform =
    anchor === "bottom" ? "translate(-50%, -100%)" : "translate(-50%, -50%)";

  // ── Click handler ─────────────────────────────────────────
  const handleClick = (e: React.MouseEvent) => {
    if (dragRef.current?.dragging) return;
    onClick?.(e.nativeEvent, data);
  };

  // ── Mouse enter/leave handlers ─────────────────────────────
  const handleMouseEnter = (e: React.MouseEvent) => {
    onMouseEnter?.(e.nativeEvent);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    onMouseLeave?.(e.nativeEvent);
  };

  // ── Keyboard handler ──────────────────────────────────────
  const handleKeyDown = onClick
    ? createKeyboardClickHandler((event: MouseEvent | KeyboardEvent) =>
        onClick(event as MouseEvent, data),
      )
    : undefined;

  // ── Build style ───────────────────────────────────────────
  const style: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    transform: animated
      ? mounted
        ? `translate3d(${finalX}px, ${finalY}px, 0) ${anchorTransform}`
        : `translate3d(${finalX}px, ${finalY}px, 0) ${anchorTransform} translate3d(0, -10px, 0)`
      : `translate3d(${finalX}px, ${finalY}px, 0) ${anchorTransform}`,
    opacity: animated && !mounted ? 0 : opacity,
    cursor: draggable ? "grab" : onClick ? "pointer" : "default",
    zIndex: 1,
    pointerEvents: "auto",
    transition: animated
      ? "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
      : "",
    willChange: animated && !mounted ? "transform, opacity" : "",
  };

  // ── Build handlers ────────────────────────────────────────
  // biome-ignore lint/suspicious/noExplicitAny: handlers accept heterogeneous React event types
  const handlers: Record<string, (e: any) => void> = {};
  if (onClick) handlers.onClick = handleClick;
  if (handleKeyDown) handlers.onKeyDown = handleKeyDown;
  if (onMouseEnter) handlers.onMouseEnter = handleMouseEnter;
  if (onMouseLeave) handlers.onMouseLeave = handleMouseLeave;
  if (draggable) {
    handlers.onPointerDown = handlePointerDown;
    handlers.onPointerMove = handlePointerMove;
    handlers.onPointerUp = handlePointerUp;
  }

  // ── Build a11y props ──────────────────────────────────────
  const props: UseMarkerReturn["props"] = {};
  if (onClick) {
    props.role = "button";
    props.tabIndex = 0;
    props["aria-label"] = ariaLabel ?? "Map marker";
  } else if (ariaLabel) {
    props["aria-label"] = ariaLabel;
  }

  return {
    style,
    isOutOfView,
    isDragging: dragRef.current?.dragging ?? false,
    handlers,
    props,
  };
}
