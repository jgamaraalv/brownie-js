"use client";

import { useTranslations } from "next-intl";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-display text-3xl font-bold tracking-tight text-on-surface">
        {t("error.title")}
      </h2>
      <p className="mt-4 max-w-md text-on-surface-muted">
        {t("error.description")}
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-sm text-on-surface-muted">
          {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        {t("error.retry")}
      </button>
    </div>
  );
}
