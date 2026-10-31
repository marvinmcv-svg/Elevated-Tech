export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "dark" | "ghost" | "light";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-300 ease-out select-none disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-ink shadow-[0_8px_30px_-8px_rgb(25_227_107/0.7)] hover:shadow-[0_12px_40px_-8px_rgb(25_227_107/0.9)] hover:bg-[#2df07a]",
  dark: "bg-ink text-white hover:bg-[#1a231e]",
  ghost: "text-ink ring-1 ring-inset ring-line hover:ring-ink/30 bg-white/60 backdrop-blur",
  light: "bg-white text-ink hover:bg-brand-50",
};

export function buttonClasses(variant: Variant = "primary", size: "md" | "lg" | "sm" = "md") {
  const sizes = { sm: "h-10 px-4 text-sm", md: "h-12 px-6 text-[15px]", lg: "h-14 px-7 text-base" };
  return cn(base, variants[variant], sizes[size]);
}
