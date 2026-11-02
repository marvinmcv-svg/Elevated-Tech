"use client";

import { buttonClasses } from "@/lib/ui";
import { Play } from "@/components/ui/Icons";
import { usePreview } from "./PreviewProvider";

/** Opens the live site in the full-screen preview window (desktop / phone sizes). */
export function PreviewButton({ projectKey, label }: { projectKey: string; label: string }) {
  const { openPreview } = usePreview();
  return (
    <button type="button" onClick={() => openPreview(projectKey, "case-study")} className={buttonClasses("primary", "lg")}>
      <Play className="size-4" />
      {label}
    </button>
  );
}
