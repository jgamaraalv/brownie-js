export interface MapTheme {
  markerColor?: string;
  popupBg?: string;
  popupColor?: string;
  popupShadow?: string;
  popupRadius?: string;
  tooltipBg?: string;
  tooltipColor?: string;
  tooltipBorder?: string;
  tooltipRadius?: string;
  tooltipShadow?: string;
  routeColor?: string;
  circleColor?: string;
  circleFill?: string;
  geolocationColor?: string;
  controlBg?: string;
  controlColor?: string;
  controlShadow?: string;
  focusRing?: string;
  attributionBg?: string;
  loaderBg?: string;
  loaderColor?: string;
}

export const THEME_KEY_TO_CSS_VAR: Record<keyof MapTheme, string> = {
  markerColor: "--bm-marker-color",
  popupBg: "--bm-popup-bg",
  popupColor: "--bm-popup-color",
  popupShadow: "--bm-popup-shadow",
  popupRadius: "--bm-popup-radius",
  tooltipBg: "--bm-tooltip-bg",
  tooltipColor: "--bm-tooltip-color",
  tooltipBorder: "--bm-tooltip-border",
  tooltipRadius: "--bm-tooltip-radius",
  tooltipShadow: "--bm-tooltip-shadow",
  routeColor: "--bm-route-color",
  circleColor: "--bm-circle-color",
  circleFill: "--bm-circle-fill",
  geolocationColor: "--bm-geolocation-color",
  controlBg: "--bm-control-bg",
  controlColor: "--bm-control-color",
  controlShadow: "--bm-control-shadow",
  focusRing: "--bm-focus-ring",
  attributionBg: "--bm-attribution-bg",
  loaderBg: "--bm-loader-bg",
  loaderColor: "--bm-loader-color",
};
