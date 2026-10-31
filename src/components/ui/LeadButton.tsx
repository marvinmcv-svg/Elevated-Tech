"use client";

import { useLeadForm } from "@/components/lead/LeadFormProvider";
import { ArrowRight } from "./Icons";
import { Magnetic } from "./Magnetic";
import { buttonClasses, cn } from "@/lib/ui";

/** Primary CTA: opens the lead form dialog (which ends in WhatsApp). */
export function LeadButton({
  children,
  location,
  need,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  arrow = true,
  onClick,
}: {
  children: React.ReactNode;
  location: string;
  need?: string;
  variant?: "primary" | "dark" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  magnetic?: boolean;
  arrow?: boolean;
  onClick?: () => void;
}) {
  const { open } = useLeadForm();
  const btn = (
    <button type="button" className={cn(buttonClasses(variant, size), className)} onClick={() => {
        onClick?.();
        open({ location, need });
      }}>
      <span>{children}</span>
      {arrow && <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />}
    </button>
  );
  return magnetic ? <Magnetic>{btn}</Magnetic> : btn;
}
