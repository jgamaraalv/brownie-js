import type { CSSProperties } from "react";
import { memo } from "react";
import { usePopup } from "./hooks/usePopup";
import type { PopupProps } from "./types";

const popupBaseStyle: CSSProperties = {
  backgroundColor: "var(--bm-popup-bg, #fafaf8)",
  color: "var(--bm-popup-color, inherit)",
  borderRadius: "var(--bm-popup-radius, 12px)",
  boxShadow: "var(--bm-popup-shadow, 0 4px 16px rgba(26,15,10,0.12), 0 1px 4px rgba(26,15,10,0.06))",
  padding: 0,
  overflow: "hidden",
  minWidth: 120,
  zIndex: 10,
  pointerEvents: "auto",
};

const popupContentStyle: CSSProperties = {
  padding: "12px 16px",
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  color: "var(--bm-popup-color, inherit)",
};

/**
 * Positioned popup overlay that renders at geographic coordinates.
 *
 * Features auto-flip when near the top of the viewport, a close button,
 * and automatic repositioning on zoom/pan via onStateChange subscription.
 *
 * Internally delegates positioning and close-on-click logic to the
 * {@link usePopup} headless hook.
 */
export const Popup = memo(function Popup({
  coordinates,
  offset = [0, -10],
  closeOnClick = true,
  onClose,
  image,
  className,
  style,
  children,
}: PopupProps) {
  const {
    style: positionStyle,
    isVisible,
    popupRef,
    props: popupA11yProps,
  } = usePopup({
    coordinates,
    offset,
    closeOnClick,
    onClose,
  });

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className={className}
      style={{
        ...popupBaseStyle,
        ...positionStyle,
        ...style,
      }}
      onClick={(e) => e.stopPropagation()}
      aria-label="Map popup"
      {...popupA11yProps}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          style={closeButtonStyle}
        >
          {"\u00d7"}
        </button>
      )}
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          style={{
            width: "100%",
            height: image.height ?? 120,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <div style={popupContentStyle}>{children}</div>
    </div>
  );
});
