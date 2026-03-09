import { render } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
  it("renders HTML div with content at specified position", () => {
    const { container } = render(
      <Tooltip x={100} y={200} content="Hello World" />,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div).toBeTruthy();
    expect(div.tagName).toBe("DIV");
    expect(div.textContent).toBe("Hello World");
    expect(div.style.left).toBe("100px");
    expect(div.style.top).toBe("200px");
  });

  it("has default styles (padding, fontSize remain hardcoded)", () => {
    const { container } = render(<Tooltip x={0} y={0} content="test" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.padding).toBe("6px 10px");
    expect(div.style.fontSize).toBe("14px");
  });

  it("accepts className override", () => {
    const { container } = render(
      <Tooltip x={0} y={0} content="test" className="my-tooltip" />,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toBe("my-tooltip");
  });

  it("accepts style overrides", () => {
    const { container } = render(
      <Tooltip x={0} y={0} content="test" style={{ background: "red" }} />,
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.background).toBe("red");
  });

  it("has pointerEvents: none to not interfere with map", () => {
    const { container } = render(<Tooltip x={0} y={0} content="test" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.pointerEvents).toBe("none");
  });

  it("renders ReactNode content (not just strings)", () => {
    const { container } = render(
      <Tooltip
        x={0}
        y={0}
        content={<span data-testid="custom">Custom</span>}
      />,
    );
    const span = container.querySelector('[data-testid="custom"]');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe("Custom");
  });

  it("is positioned absolutely with transform to center above point", () => {
    const { container } = render(<Tooltip x={100} y={200} content="test" />);
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.position).toBe("absolute");
    expect(div.style.transform).toBe("translate(-50%, calc(-100% - 8px))");
  });
});

describe("Tooltip CSS custom properties", () => {
  it("uses CSS custom properties with defaults for tooltip styles", () => {
    const html = renderToStaticMarkup(
      <Tooltip x={50} y={100} content="test" />,
    );
    expect(html).toContain("var(--bm-tooltip-bg, #1a0f0a)");
    expect(html).toContain("var(--bm-tooltip-color, #f5f0eb)");
    expect(html).toContain("var(--bm-tooltip-border, 1px solid #362a20)");
    expect(html).toContain("var(--bm-tooltip-radius, 6px)");
    expect(html).toContain(
      "var(--bm-tooltip-shadow, 0 4px 12px rgba(26,15,10,0.2))",
    );
  });
});
