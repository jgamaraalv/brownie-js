import { GitHubIcon, LogoIcon, NpmIcon } from "@/icons";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className="bg-footer-bg text-on-dark">
      <div className="gradient-line" />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo */}
          <div
            className="relative flex items-center justify-center"
            style={{
              filter: "drop-shadow(0 0 18px rgba(212, 133, 12, 0.35))",
            }}
          >
            <LogoIcon aria-hidden="true" className="h-10 w-10" />
          </div>

          {/* Memorial text */}
          <p
            className="font-display text-lg italic leading-relaxed text-footer-text"
            style={{ letterSpacing: "-0.01em" }}
          >
            {t("footer.credit")}
          </p>

          {/* Divider */}
          <div
            className="h-px w-16 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #d4850c55, transparent)",
            }}
          />

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/jgamaraalv/brownie-js"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-footer-muted transition-colors hover:text-footer-text"
            >
              <GitHubIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t("footer.github")}
            </a>
            <a
              href="https://www.npmjs.com/package/@brownie-js/react"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-footer-muted transition-colors hover:text-footer-text"
            >
              <NpmIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {t("footer.npm")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
