import { highlightCode } from "@/lib/shiki";

export async function CodeBlock({
  code,
  lang = "tsx",
}: { code: string; lang?: string }) {
  const html = await highlightCode(code, lang);

  return (
    <div
      className="code-block-hover overflow-x-auto rounded-xl border border-code-border bg-code-bg text-sm [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
