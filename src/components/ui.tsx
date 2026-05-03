import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-borderline pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base leading-7 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("rounded-lg border border-borderline bg-panel p-5 shadow-glow", className)}>{children}</section>;
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="shadow-none">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </Card>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "danger" | "info" }) {
  const tones = {
    neutral: "border-borderline bg-white/5 text-muted",
    good: "border-green/30 bg-green/10 text-green",
    warn: "border-gold/30 bg-gold/10 text-gold",
    danger: "border-danger/30 bg-danger/10 text-danger",
    info: "border-blue/30 bg-blue/10 text-blue"
  };
  return <span className={clsx("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
};

export function Button({ className, variant = "primary", loading, children, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-blue text-ink hover:bg-white",
    secondary: "border border-borderline bg-white/5 text-white hover:border-blue hover:text-blue",
    danger: "bg-danger text-white hover:bg-danger/80",
    ghost: "text-muted hover:bg-white/5 hover:text-white"
  };
  return (
    <button
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx("focus-ring min-h-11 w-full rounded-md border border-borderline bg-ink px-3 py-2 text-white placeholder:text-muted", className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx("focus-ring min-h-28 w-full rounded-md border border-borderline bg-ink px-3 py-2 text-white placeholder:text-muted", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={clsx("focus-ring min-h-11 w-full rounded-md border border-borderline bg-ink px-3 py-2 text-white", className)} {...props}>
      {children}
    </select>
  );
});

export function Field({
  label,
  children,
  error,
  hint
}: {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs leading-5 text-muted">{hint}</span>}
      {error && <span className="mt-2 block text-xs leading-5 text-danger">{error}</span>}
    </label>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-borderline p-8 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
