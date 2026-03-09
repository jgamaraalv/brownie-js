import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  AccessibilityIcon,
  FeatherIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@/icons/index";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export async function FeatureCards({ locale }: Props) {
  const t = await getTranslations("home");

  const features = [
    {
      icon: PackageIcon,
      title: t("features.zeroDep.title"),
      description: t("features.zeroDep.description"),
    },
    {
      icon: FeatherIcon,
      title: t("features.bundleSize.title"),
      description: t("features.bundleSize.description"),
    },
    {
      icon: ShieldCheckIcon,
      title: t("features.tested.title"),
      description: t("features.tested.description"),
    },
    {
      icon: AccessibilityIcon,
      title: t("features.accessible.title"),
      description: t("features.accessible.description"),
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <div className="mb-8 sm:mb-12">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {t("features.title")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <RevealOnScroll key={feature.title} className={`stagger-${i + 1}`}>
            <div className="card-hover group rounded-2xl border border-border bg-surface-elevated p-6">
              <span aria-hidden="true" className="text-4xl font-bold text-accent/10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div aria-hidden="true" className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                {feature.description}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
