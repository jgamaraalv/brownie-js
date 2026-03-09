import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function StorySection() {
  const t = await getTranslations("home");

  return (
    <section>
      <div className="bg-surface-dark bg-gradient-mesh bg-noise py-16 sm:py-28 lg:py-36">
        <RevealOnScroll>
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex flex-col items-center gap-8 sm:gap-10 lg:grid lg:grid-cols-[auto_1fr] lg:gap-12 lg:items-center">
              <div className="h-36 w-36 shrink-0 overflow-hidden rounded-xl rotate-[-2deg] shadow-xl sm:h-48 sm:w-48">
                <Image
                  src="/brownie.jpeg"
                  alt="Brownie, a brown Shih Tzu"
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl font-bold tracking-tight text-on-dark sm:text-3xl lg:text-4xl">
                  {t("story.title")}
                </h2>
                <p className="mt-6 font-display text-lg italic leading-relaxed text-on-dark-muted">
                  {t("story.text")}
                </p>
                <div aria-hidden="true" className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto lg:mx-0" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
