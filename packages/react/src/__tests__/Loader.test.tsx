import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Loader } from "../Loader";

afterEach(cleanup);

describe("Loader", () => {
  it("renders with role=status", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("has default aria-label 'Loading map'", () => {
    render(<Loader />);
    expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
      "Loading map",
    );
  });

  it("accepts custom ariaLabel", () => {
    render(<Loader ariaLabel="Fetching markers..." />);
    expect(
      screen.getByRole("status").getAttribute("aria-label"),
    ).toBe("Fetching markers...");
  });

  it("accepts className and style", () => {
    const { container } = render(
      <Loader className="my-loader" style={{ border: "1px solid red" }} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe("my-loader");
    expect(el.style.border).toBe("1px solid red");
  });

  it("fills 100% width and height of container", () => {
    const { container } = render(<Loader />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("100%");
  });

  it("uses --bm-loader-bg CSS variable for background", () => {
    const html = renderToStaticMarkup(<Loader />);
    expect(html).toContain("--bm-loader-bg");
  });

  it("uses --bm-loader-color CSS variable for icon/spinner color", () => {
    const html = renderToStaticMarkup(<Loader />);
    expect(html).toContain("--bm-loader-color");
  });

  it("renders a spinner SVG with aria-hidden", () => {
    const { container } = render(<Loader />);
    const svgs = container.querySelectorAll("svg");
    const hiddenSvgs = Array.from(svgs).filter(
      (s) => s.getAttribute("aria-hidden") === "true",
    );
    expect(hiddenSvgs.length).toBeGreaterThan(0);
  });

  it("spinner has no inline animation style (animation is CSS-class-driven)", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".bm-loader-spinner") as SVGElement;
    expect(spinner).toBeDefined();
    expect(spinner.style.animation).toBe("");
  });

  it("sets will-change on spinner for GPU compositing", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector(".bm-loader-spinner") as SVGElement;
    expect(spinner.style.willChange).toBe("transform");
  });
});
