import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapControl } from "../MapControl";
import type { ControlPosition } from "../MapControl";

describe("MapControl", () => {
  it("renders children", () => {
    const { container } = render(
      <MapControl position="top-left">
        <button type="button">Zoom in</button>
      </MapControl>,
    );
    const button = container.querySelector("button");
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe("Zoom in");
  });

  it("positions at top-left", () => {
    const { container } = render(
      <MapControl position="top-left">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.position).toBe("absolute");
    expect(div.style.top).toBe("10px");
    expect(div.style.left).toBe("10px");
  });

  it("positions at top-right", () => {
    const { container } = render(
      <MapControl position="top-right">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.top).toBe("10px");
    expect(div.style.right).toBe("10px");
  });

  it("positions at bottom-left", () => {
    const { container } = render(
      <MapControl position="bottom-left">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.bottom).toBe("10px");
    expect(div.style.left).toBe("10px");
  });

  it("positions at bottom-right", () => {
    const { container } = render(
      <MapControl position="bottom-right">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.bottom).toBe("10px");
    expect(div.style.right).toBe("10px");
  });

  it("applies className", () => {
    const { container } = render(
      <MapControl position="top-left" className="my-controls">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe("my-controls");
  });

  it("merges custom style", () => {
    const { container } = render(
      <MapControl position="top-left" style={{ padding: 20 }}>
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.padding).toBe("20px");
    // base styles still present
    expect(div.style.position).toBe("absolute");
    expect(div.style.zIndex).toBe("5");
  });

  it("has flex column layout with gap", () => {
    const { container } = render(
      <MapControl position="top-left">
        <span>A</span>
        <span>B</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.display).toBe("flex");
    expect(div.style.flexDirection).toBe("column");
    expect(div.style.gap).toBe("8px");
  });

  it("has pointerEvents auto so controls are clickable", () => {
    const { container } = render(
      <MapControl position="top-left">
        <span>Control</span>
      </MapControl>,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.pointerEvents).toBe("auto");
  });

  it("renders multiple children", () => {
    const { container } = render(
      <MapControl position="top-right">
        <button type="button">A</button>
        <button type="button">B</button>
        <button type="button">C</button>
      </MapControl>,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(3);
  });
});
