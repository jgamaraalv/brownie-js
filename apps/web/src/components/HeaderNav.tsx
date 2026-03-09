"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { GitHubIcon, MenuIcon, XIcon } from "@/icons";
import { usePathname } from "next/navigation";
import { useState } from "react";

type HeaderNavProps = {
  homeLabel: string;
  docsLabel: string;
  whyLabel: string;
  recipesLabel: string;
  languageLabel: string;
};

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`link-underline relative text-sm font-medium transition-colors ${
        active ? "text-on-surface" : "text-on-surface/60 hover:text-on-surface"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
        />
      )}
    </Link>
  );
}

export function HeaderNav({
  homeLabel,
  docsLabel,
  whyLabel,
  recipesLabel,
  languageLabel,
}: HeaderNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  // Strip locale prefix for matching (e.g. "/en/docs" → "/docs")
  const path = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 md:flex">
        <NavLink href="/" active={path === "/"}>
          {homeLabel}
        </NavLink>
        <NavLink href="/docs" active={path === "/docs"}>
          {docsLabel}
        </NavLink>
        <NavLink href="/why" active={path === "/why"}>
          {whyLabel}
        </NavLink>
        <NavLink href="/recipes" active={path.startsWith("/recipes")}>
          {recipesLabel}
        </NavLink>
      </nav>

      {/* Desktop utility actions */}
      <div className="hidden items-center gap-2 md:flex">
        <LanguageSwitcher label={languageLabel} />
        <a
          href="https://github.com/jgamaraalv/brownie-js"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="rounded-lg p-2 transition-colors hover:bg-on-surface/5 hover:text-accent"
        >
          <GitHubIcon className="h-5 w-5" />
        </a>
      </div>

      {/* Mobile hamburger button */}
      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-on-surface/5 md:hidden"
      >
        {menuOpen ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </button>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute left-0 top-16 w-full border-b border-border/60 bg-surface/95 p-4 shadow-xl backdrop-blur-lg md:hidden"
        >
          <nav className="flex flex-col gap-4">
            <NavLink href="/" active={path === "/"} onClick={closeMenu}>
              {homeLabel}
            </NavLink>
            <NavLink href="/docs" active={path === "/docs"} onClick={closeMenu}>
              {docsLabel}
            </NavLink>
            <NavLink href="/why" active={path === "/why"} onClick={closeMenu}>
              {whyLabel}
            </NavLink>
            <NavLink
              href="/recipes"
              active={path.startsWith("/recipes")}
              onClick={closeMenu}
            >
              {recipesLabel}
            </NavLink>
          </nav>
          <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
            <LanguageSwitcher label={languageLabel} />
            <a
              href="https://github.com/jgamaraalv/brownie-js"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-lg p-2 transition-colors hover:bg-on-surface/5 hover:text-accent"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
