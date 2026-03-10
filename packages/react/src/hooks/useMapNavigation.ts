import {
  createWebMercator,
  easeOutCubic as defaultEasing,
  lonLatToWorld,
  worldToLonLat,
} from "@brownie-js/core";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { FlyToOptions, GeoMapHandle, MapState } from "../types";

// ─── Constants ───────────────────────────────────────────────────

const FRICTION = 0.95;
const MIN_VELOCITY = 0.5;
const DRAG_THRESHOLD = 3;
const DEFAULT_FLY_DURATION = 300;

// ─── Pure helper functions (exported for testing) ────────────────

export function clampZoom(zoom: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, zoom));
}

export function applyZoomDelta(params: {
  center: [number, number];
  zoom: number;
  cursorX: number;
  cursorY: number;
  width: number;
  height: number;
  delta: number;
  minZoom: number;
  maxZoom: number;
}): MapState {
  const {
    center,
    zoom: oldZoom,
    cursorX,
    cursorY,
    width,
    height,
    delta,
    minZoom,
    maxZoom,
  } = params;

  const newZoom = clampZoom(oldZoom + delta, minZoom, maxZoom);

  if (newZoom === oldZoom) {
    return { center, zoom: oldZoom };
  }

  // 1. World coordinates of the center at old zoom
  const [centerWx, centerWy] = lonLatToWorld(center[0], center[1], oldZoom);

  // 2. Pixel offset of cursor from viewport center
  const offsetX = cursorX - width / 2;
  const offsetY = cursorY - height / 2;

  // 3. World coordinates of the cursor at old zoom
  const cursorWx = centerWx + offsetX;
  const cursorWy = centerWy + offsetY;

  // 4. Scale cursor world coords to new zoom
  const scaleFactor = 2 ** (newZoom - oldZoom);
  const newCursorWx = cursorWx * scaleFactor;
  const newCursorWy = cursorWy * scaleFactor;

  // 5. Center world coords at new zoom (before offset)
  const newCenterWx = centerWx * scaleFactor;
  const newCenterWy = centerWy * scaleFactor;

  // 6. Offset center so cursor maps back to the same pixel
  // At new zoom, cursor pixel = newCursorW - newCenterW + width/2
  // We want cursor pixel = cursorX
  // So: cursorX = newCursorWx - adjustedCenterWx + width/2
  // adjustedCenterWx = newCursorWx - cursorX + width/2
  // = newCursorWx - offsetX - width/2 + width/2   -- wait, let me redo this
  // The cursor should stay at the same pixel position:
  // cursorX = adjustedCursorW - adjustedCenterW + width/2  (but adjustedCursorW = newCursorWx, fixed)
  // We need: adjustedCenterW such that newCursorWx - adjustedCenterWx + width/2 = cursorX
  // adjustedCenterWx = newCursorWx - cursorX + width/2
  const adjustedCenterWx = newCursorWx - offsetX;
  const adjustedCenterWy = newCursorWy - offsetY;

  // 7. Convert back to lon/lat
  const newCenter = worldToLonLat(adjustedCenterWx, adjustedCenterWy, newZoom);

  return { center: newCenter, zoom: newZoom };
}

// ─── Hook interface ──────────────────────────────────────────────

export interface UseMapNavigationOptions {
  initialCenter: [number, number];
  initialZoom: number;
  minZoom: number;
  maxZoom: number;
  bounds?: { sw: [number, number]; ne: [number, number] };
  onZoomChange?: (zoom: number) => void;
  onMoveEnd?: (state: {
    center: [number, number];
    zoom: number;
    bounds: { sw: [number, number]; ne: [number, number] };
  }) => void;
  interactiveZoom?: boolean;
}

export function useMapNavigation(options: UseMapNavigationOptions): {
  stateRef: React.MutableRefObject<MapState>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onStateChange: (callback: () => void) => () => void;
  imperativeHandle: GeoMapHandle;
} {
  const {
    initialCenter,
    initialZoom,
    minZoom,
    maxZoom,
    onZoomChange,
    onMoveEnd,
    interactiveZoom = true,
  } = options;

  const stateRef = useRef<MapState>({
    center: initialCenter,
    zoom: clampZoom(initialZoom, minZoom, maxZoom),
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const subscribers = useRef(new Set<() => void>());
  const rafId = useRef<number>(0);
  const wheelDebounceId = useRef<number | null>(null);
  const willChangeTimerId = useRef<number | null>(null);

  // Drag state (mutable refs)
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);
  const pendingPointerId = useRef<number | null>(null);

  // Touch pinch state
  const isPinching = useRef(false);
  const initialTouchDist = useRef(0);
  const initialTouchMid = useRef({ x: 0, y: 0 });
  const initialTouchState = useRef<MapState>({ center: [0, 0], zoom: 1 });

  // Store callbacks in refs for stable closures
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;
  const onMoveEndRef = useRef(onMoveEnd);
  onMoveEndRef.current = onMoveEnd;

  // ─── Subscriber pattern ──────────────────────────────────────

  const notifySubscribers = useCallback(() => {
    for (const cb of subscribers.current) cb();
  }, []);

  const onStateChange = useCallback((callback: () => void): (() => void) => {
    subscribers.current.add(callback);
    return () => {
      subscribers.current.delete(callback);
    };
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────

  const cancelAnimation = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
  }, []);

  // Activate will-change during interaction, clear after 200ms idle
  const activateWillChange = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.willChange = "transform";
    if (willChangeTimerId.current) {
      clearTimeout(willChangeTimerId.current);
    }
    willChangeTimerId.current = window.setTimeout(() => {
      el.style.willChange = "auto";
      willChangeTimerId.current = null;
    }, 200);
  }, []);

  const getContainerSize = useCallback((): {
    width: number;
    height: number;
  } => {
    const el = containerRef.current;
    if (!el) return { width: 800, height: 600 };
    return { width: el.clientWidth, height: el.clientHeight };
  }, []);

  const fireMoveEnd = useCallback(() => {
    const cb = onMoveEndRef.current;
    if (!cb) return;
    const { center, zoom } = stateRef.current;
    const { width, height } = getContainerSize();
    if (width === 0 || height === 0) return;
    const proj = createWebMercator({ center, zoom, width, height });
    const bounds = proj.getBounds();
    cb({ center, zoom, bounds });
  }, [getContainerSize]);

  // ─── Imperative handle ───────────────────────────────────────

  const flyTo = useCallback(
    (firstArg: FlyToOptions | [number, number], secondArg?: number) => {
      // Support both overloads: flyTo(options) and flyTo(center, zoom?)
      const isOptions = !Array.isArray(firstArg);
      const targetCenter: [number, number] = isOptions
        ? firstArg.center
        : firstArg;
      const targetZoom: number | undefined = isOptions
        ? firstArg.zoom
        : secondArg;
      const duration: number = isOptions
        ? (firstArg.duration ?? DEFAULT_FLY_DURATION)
        : DEFAULT_FLY_DURATION;
      const easing = isOptions
        ? (firstArg.easing ?? defaultEasing)
        : defaultEasing;

      cancelAnimation();

      const start = { ...stateRef.current };
      const endZoom = clampZoom(targetZoom ?? start.zoom, minZoom, maxZoom);
      const endCenter: [number, number] = [targetCenter[0], targetCenter[1]];

      // Respect prefers-reduced-motion: jump to end state instantly
      if (
        typeof matchMedia !== "undefined" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        stateRef.current = { center: endCenter, zoom: endZoom };
        notifySubscribers();
        onZoomChangeRef.current?.(endZoom);
        fireMoveEnd();
        return;
      }

      const startTime = performance.now();

      const frame = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const ease = easing(t);

        stateRef.current = {
          center: [
            start.center[0] + (endCenter[0] - start.center[0]) * ease,
            start.center[1] + (endCenter[1] - start.center[1]) * ease,
          ],
          zoom: start.zoom + (endZoom - start.zoom) * ease,
        };
        notifySubscribers();

        if (t < 1) {
          rafId.current = requestAnimationFrame(frame);
        } else {
          rafId.current = 0;
          stateRef.current = { center: endCenter, zoom: endZoom };
          notifySubscribers();
          onZoomChangeRef.current?.(endZoom);
          fireMoveEnd();
        }
      };

      rafId.current = requestAnimationFrame(frame);
    },
    [cancelAnimation, minZoom, maxZoom, fireMoveEnd, notifySubscribers],
  );

  const fitBounds = useCallback(
    (bounds: { sw: [number, number]; ne: [number, number] }, padding = 50) => {
      const { width, height } = getContainerSize();
      if (width === 0 || height === 0) return;

      const effectiveWidth = width - padding * 2;
      const effectiveHeight = height - padding * 2;
      if (effectiveWidth <= 0 || effectiveHeight <= 0) return;

      // Calculate center of bounds
      const centerLon = (bounds.sw[0] + bounds.ne[0]) / 2;
      const centerLat = (bounds.sw[1] + bounds.ne[1]) / 2;

      // Binary search for zoom level that fits
      let lo = minZoom;
      let hi = maxZoom;
      let bestZoom = minZoom;

      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        const [swX, swY] = lonLatToWorld(bounds.sw[0], bounds.sw[1], mid);
        const [neX, neY] = lonLatToWorld(bounds.ne[0], bounds.ne[1], mid);
        const spanX = Math.abs(neX - swX);
        const spanY = Math.abs(neY - swY);

        if (spanX <= effectiveWidth && spanY <= effectiveHeight) {
          bestZoom = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }

      bestZoom = clampZoom(Math.floor(bestZoom * 100) / 100, minZoom, maxZoom);
      flyTo([centerLon, centerLat], bestZoom);
    },
    [getContainerSize, minZoom, maxZoom, flyTo],
  );

  const getZoom = useCallback((): number => stateRef.current.zoom, []);

  const getCenter = useCallback(
    (): [number, number] => [...stateRef.current.center],
    [],
  );

  const getBounds = useCallback((): {
    sw: [number, number];
    ne: [number, number];
  } => {
    const { center, zoom } = stateRef.current;
    const { width, height } = getContainerSize();
    if (width === 0 || height === 0) {
      return { sw: [0, 0], ne: [0, 0] };
    }
    const proj = createWebMercator({ center, zoom, width, height });
    return proj.getBounds();
  }, [getContainerSize]);

  const imperativeHandle = useMemo<GeoMapHandle>(
    () => ({
      flyTo,
      fitBounds,
      getZoom,
      getCenter,
      getBounds,
    }),
    [flyTo, fitBounds, getZoom, getCenter, getBounds],
  );

  // ─── Event handling ──────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Wheel zoom ───────────────────────────────────────────

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (!interactiveZoom) return;
      cancelAnimation();
      activateWillChange();

      const rect = container?.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // Normalize deltaY across devices:
      // - Mouse wheel (deltaMode 0): typically ±100-150, clamp to ±1
      // - Trackpad (deltaMode 0): typically ±1-10, naturally smaller
      // Multiply by 0.005 so mouse ≈ ±0.5, trackpad ≈ ±0.01-0.05
      let normalizedDelta: number;
      if (e.deltaMode === 1) {
        // DOM_DELTA_LINE
        normalizedDelta = -e.deltaY * 0.1;
      } else {
        // DOM_DELTA_PIXEL (default)
        normalizedDelta = -e.deltaY * 0.005;
      }
      // Clamp to avoid extreme jumps
      const delta = Math.max(-0.5, Math.min(0.5, normalizedDelta));

      stateRef.current = applyZoomDelta({
        center: stateRef.current.center,
        zoom: stateRef.current.zoom,
        cursorX,
        cursorY,
        width: rect.width,
        height: rect.height,
        delta,
        minZoom,
        maxZoom,
      });

      notifySubscribers();
      onZoomChangeRef.current?.(stateRef.current.zoom);

      // Debounce fireMoveEnd during rapid zoom
      if (wheelDebounceId.current) {
        clearTimeout(wheelDebounceId.current);
      }
      wheelDebounceId.current = window.setTimeout(() => {
        wheelDebounceId.current = null;
        fireMoveEnd();
      }, 150);
    }

    // ── Pointer drag (pan) ───────────────────────────────────

    function handlePointerDown(e: PointerEvent) {
      // Don't start map pan if the event originated from a draggable marker
      if ((e.target as HTMLElement).closest?.("[data-draggable-marker]")) {
        return;
      }
      cancelAnimation();
      activateWillChange();
      isDragging.current = true;
      dragDistance.current = 0;
      lastPointer.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
      };
      velocity.current = { x: 0, y: 0 };
      pendingPointerId.current = e.pointerId;
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDragging.current || isPinching.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      const now = performance.now();
      const dt = now - lastPointer.current.time;

      dragDistance.current += Math.abs(dx) + Math.abs(dy);

      // Capture pointer after drag threshold
      if (
        pendingPointerId.current !== null &&
        dragDistance.current >= DRAG_THRESHOLD
      ) {
        try {
          container?.setPointerCapture(pendingPointerId.current);
        } catch {
          /* may already be released */
        }
        pendingPointerId.current = null;
      }

      if (dt > 0) {
        velocity.current.x = (dx / dt) * 16;
        velocity.current.y = (dy / dt) * 16;
      }

      // Convert pixel delta to geographic delta
      const { center, zoom } = stateRef.current;
      const [centerWx, centerWy] = lonLatToWorld(center[0], center[1], zoom);
      const newCenter = worldToLonLat(centerWx - dx, centerWy - dy, zoom);

      stateRef.current = { center: newCenter, zoom };
      notifySubscribers();

      lastPointer.current = { x: e.clientX, y: e.clientY, time: now };
    }

    function handlePointerUp(e: PointerEvent) {
      if (!isDragging.current) return;
      isDragging.current = false;
      pendingPointerId.current = null;

      try {
        container?.releasePointerCapture(e.pointerId);
      } catch {
        /* may already be released */
      }

      const vx = velocity.current.x;
      const vy = velocity.current.y;

      if (Math.abs(vx) > MIN_VELOCITY || Math.abs(vy) > MIN_VELOCITY) {
        animateInertia(vx, vy);
      } else {
        fireMoveEnd();
      }
    }

    // ── Inertia animation ────────────────────────────────────

    function animateInertia(vx: number, vy: number) {
      let currentVx = vx;
      let currentVy = vy;

      const frame = () => {
        currentVx *= FRICTION;
        currentVy *= FRICTION;

        const { center, zoom } = stateRef.current;
        const [centerWx, centerWy] = lonLatToWorld(center[0], center[1], zoom);
        const newCenter = worldToLonLat(
          centerWx - currentVx,
          centerWy - currentVy,
          zoom,
        );
        stateRef.current = { center: newCenter, zoom };
        notifySubscribers();

        if (
          Math.abs(currentVx) > MIN_VELOCITY ||
          Math.abs(currentVy) > MIN_VELOCITY
        ) {
          rafId.current = requestAnimationFrame(frame);
        } else {
          rafId.current = 0;
          fireMoveEnd();
        }
      };

      cancelAnimation();
      rafId.current = requestAnimationFrame(frame);
    }

    // ── Touch pinch zoom ─────────────────────────────────────

    function handleTouchStart(e: TouchEvent) {
      const touches = e.touches;

      if (touches.length === 2) {
        e.preventDefault();
        // Cancel any ongoing single-finger drag
        isDragging.current = false;
        isPinching.current = true;
        if (!interactiveZoom) return;
        cancelAnimation();
        activateWillChange();

        const t0 = touches[0];
        const t1 = touches[1];
        initialTouchDist.current = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
        const rect = container?.getBoundingClientRect();
        initialTouchMid.current = {
          x: (t0.clientX + t1.clientX) / 2 - rect.left,
          y: (t0.clientY + t1.clientY) / 2 - rect.top,
        };
        initialTouchState.current = { ...stateRef.current };
      }
    }

    function handleTouchMove(e: TouchEvent) {
      const touches = e.touches;
      if (touches.length !== 2) return;
      e.preventDefault();
      if (!interactiveZoom) return;

      const t0 = touches[0];
      const t1 = touches[1];
      const newDist = Math.hypot(
        t1.clientX - t0.clientX,
        t1.clientY - t0.clientY,
      );

      const rect = container?.getBoundingClientRect();
      const newMid = {
        x: (t0.clientX + t1.clientX) / 2 - rect.left,
        y: (t0.clientY + t1.clientY) / 2 - rect.top,
      };

      // Zoom delta from distance ratio
      const ratio = newDist / initialTouchDist.current;
      const zoomDelta = Math.log2(ratio);
      const newZoom = clampZoom(
        initialTouchState.current.zoom + zoomDelta,
        minZoom,
        maxZoom,
      );

      // Apply zoom centered on initial midpoint
      const result = applyZoomDelta({
        center: initialTouchState.current.center,
        zoom: initialTouchState.current.zoom,
        cursorX: initialTouchMid.current.x,
        cursorY: initialTouchMid.current.y,
        width: rect.width,
        height: rect.height,
        delta: newZoom - initialTouchState.current.zoom,
        minZoom,
        maxZoom,
      });

      // Add pan from midpoint movement
      const [centerWx, centerWy] = lonLatToWorld(
        result.center[0],
        result.center[1],
        result.zoom,
      );
      const midDx = newMid.x - initialTouchMid.current.x;
      const midDy = newMid.y - initialTouchMid.current.y;
      const pannedCenter = worldToLonLat(
        centerWx - midDx,
        centerWy - midDy,
        result.zoom,
      );

      stateRef.current = { center: pannedCenter, zoom: result.zoom };
      notifySubscribers();
      onZoomChangeRef.current?.(result.zoom);
    }

    function handleTouchEnd(e: TouchEvent) {
      if (e.touches.length < 2) {
        isPinching.current = false;
      }
      if (e.touches.length === 0) {
        fireMoveEnd();
      }
    }

    // ── Double click/tap ─────────────────────────────────────

    function handleDblClick(e: MouseEvent) {
      if (!interactiveZoom) return;
      e.preventDefault();
      cancelAnimation();

      const rect = container?.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      stateRef.current = applyZoomDelta({
        center: stateRef.current.center,
        zoom: stateRef.current.zoom,
        cursorX,
        cursorY,
        width: rect.width,
        height: rect.height,
        delta: 1,
        minZoom,
        maxZoom,
      });

      notifySubscribers();
      onZoomChangeRef.current?.(stateRef.current.zoom);
      fireMoveEnd();
    }

    // ── Attach listeners ─────────────────────────────────────

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("dblclick", handleDblClick);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("dblclick", handleDblClick);
      cancelAnimation();
      if (wheelDebounceId.current) {
        clearTimeout(wheelDebounceId.current);
        wheelDebounceId.current = null;
      }
      if (willChangeTimerId.current) {
        clearTimeout(willChangeTimerId.current);
        willChangeTimerId.current = null;
      }
    };
  }, [
    minZoom,
    maxZoom,
    cancelAnimation,
    activateWillChange,
    fireMoveEnd,
    notifySubscribers,
    interactiveZoom,
  ]);

  return { stateRef, containerRef, onStateChange, imperativeHandle };
}
