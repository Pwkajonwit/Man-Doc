import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SpinnerIcon } from "@/components/archive-icons";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "muted";
  size?: "sm" | "md" | "icon";
};

export function ActionButton({
  children,
  icon,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: ActionButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border-[#375466] bg-[#3c5c6e] text-white hover:bg-[#344f5f]",
    muted: "border-[var(--line)] bg-[var(--surface-muted)] text-slate-800 hover:bg-[#e8edf2]",
  };
  const sizes = {
    sm: "h-9 px-3",
    md: "h-10 px-4",
    icon: "h-10 w-10",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
    >
      {loading ? <SpinnerIcon /> : icon}
      {children}
    </button>
  );
}
