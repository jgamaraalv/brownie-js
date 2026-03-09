import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapThemeProvider } from "../theme/MapThemeProvider";

describe("MapThemeProvider", () => {
  it("sets CSS custom properties from theme object", () => {
    const theme = {
      markerColor: "#FF6B00",
      popupBg: "#1a1a1a",
      popupColor: "#eee",
    };

    const { container } = render(
      <MapThemeProvider theme={theme}>
        <div>Hello</div>
      </MapThemeProvider>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue("--bm-marker-color")).toBe("#FF6B00");
    expect(wrapper.style.getPropertyValue("--bm-popup-bg")).toBe("#1a1a1a");
    expect(wrapper.style.getPropertyValue("--bm-popup-color")).toBe("#eee");
  });

  it("does not set undefined theme values", () => {
    const theme = { markerColor: "#FF6B00" };

    const { container } = render(
      <MapThemeProvider theme={theme}>
        <div>Hello</div>
      </MapThemeProvider>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue("--bm-marker-color")).toBe("#FF6B00");
    expect(wrapper.style.getPropertyValue("--bm-popup-bg")).toBe("");
  });

  it("renders children", () => {
    const { getByText } = render(
      <MapThemeProvider theme={{}}>
        <div>Child content</div>
      </MapThemeProvider>,
    );
    expect(getByText("Child content")).toBeDefined();
  });

  it("accepts className and style props", () => {
    const { container } = render(
      <MapThemeProvider
        theme={{ popupBg: "#000" }}
        className="my-theme"
        style={{ padding: 10 }}
      >
        <div>Hello</div>
      </MapThemeProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("my-theme");
    expect(wrapper.style.padding).toBe("10px");
    expect(wrapper.style.getPropertyValue("--bm-popup-bg")).toBe("#000");
  });
});
