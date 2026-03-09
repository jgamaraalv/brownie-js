import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import { type MapTheme, THEME_KEY_TO_CSS_VAR } from "./types";

export interface MapThemeProviderProps {
  theme: MapTheme;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MapThemeProvider({
  theme,
  children,
  className,
  style,
}: MapThemeProviderProps) {
  const cssVarStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const key of Object.keys(theme) as Array<keyof MapTheme>) {
      const value = theme[key];
      if (value !== undefined) {
        vars[THEME_KEY_TO_CSS_VAR[key]] = value;
      }
    }
    return { ...vars, ...style } as CSSProperties;
  }, [theme, style]);

  return (
    <div className={className} style={cssVarStyle}>
      {children}
    </div>
  );
}
