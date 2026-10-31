import { Fragment } from "react";

/**
 * Server-rendered word split for scroll-triggered heading reveals.
 * The full text stays in the HTML (SEO + screen readers read the aria-label).
 */
export function SplitText({ text, as: Tag = "h2", className }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  const words = text.split(" ");
  return (
    <Tag className={className} data-split aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
