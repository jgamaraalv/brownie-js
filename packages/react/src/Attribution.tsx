import type { CSSProperties, MutableRefObject } from "react";
import { memo, useEffect, useState } from "react";

const OSM_PATTERN = "openstreetmap.org";
const CARTO_PATTERN = "cartocdn.com";

const attributionStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  right: 0,
  padding: "2px 6px",
  fontSize: "11px",
  lineHeight: "16px",
  color: "rgba(0, 0, 0, 0.65)",
  backgroundColor: "var(--bm-attribution-bg, rgba(250,250,248,0.85))",
  zIndex: 1000,
  pointerEvents: "auto",
};

interface AttributionProps {
  tileUrlsRef: MutableRefObject<Set<string>>;
  tileUrlSubscribers: MutableRefObject<Set<() => void>>;
}

export const Attribution = memo(function Attribution({
  tileUrlsRef,
  tileUrlSubscribers,
}: AttributionProps) {
  const [tileUrls, setTileUrls] = useState<string[]>(() =>
    Array.from(tileUrlsRef.current),
  );

  useEffect(() => {
    const update = () => setTileUrls(Array.from(tileUrlsRef.current));
    tileUrlSubscribers.current.add(update);
    // Sync state in case URLs were registered before this effect ran
    update();
    return () => {
      tileUrlSubscribers.current.delete(update);
    };
  }, [tileUrlsRef, tileUrlSubscribers]);

  const hasOsm = tileUrls.some((url) => url.includes(OSM_PATTERN));
  const hasCarto = tileUrls.some((url) => url.includes(CARTO_PATTERN));
  // CartoCDN tiles are derived from OSM data, so both attributions are required
  const showOsm = hasOsm || hasCarto;

  return (
    <div style={attributionStyle}>
      {hasCarto && (
        <>
          <a
            href="https://carto.com/attributions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            © CARTO
          </a>
          {" | "}
        </>
      )}
      {showOsm && (
        <>
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            © OpenStreetMap
          </a>
          {" | "}
        </>
      )}
      <a
        href="https://www.browniejs.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        powered by BrownieJS
      </a>
    </div>
  );
});
