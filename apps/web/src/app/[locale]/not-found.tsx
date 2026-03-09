import { PawIcon } from "@/icons";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <PawIcon className="h-16 w-16 text-accent/40" />
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-on-surface">
        {t("notFound.title")}
      </h2>
      <p className="mt-4 max-w-md text-on-surface-muted">
        {t("notFound.description")}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        {t("notFound.backHome")}
      </Link>
    </div>
  );
}
