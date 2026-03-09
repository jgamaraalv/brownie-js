import { useCallback } from "react";

type RefCallback<T> = (node: T | null) => void;
type MutableRef<T> = { current: T | null };

/**
 * Merges multiple refs (callback refs or mutable ref objects) into a single callback ref.
 */
export function useMergedRef<T>(
  ...refs: Array<RefCallback<T> | MutableRef<T>>
): RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs is a rest parameter spread as deps
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  }, refs);
}
