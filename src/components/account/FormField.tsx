'use client';

import { useId, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Primary CTA style shared by the account and auth pages (matches the navbar "Get Started" button). */
export const primaryButtonClass =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 font-semibold text-white shadow-lg shadow-orange-500/25 transition-[transform,filter,opacity] duration-200 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60';

interface FormFieldProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  /** Adds a show/hide toggle and switches the input type. */
  passwordToggle?: boolean;
  /** Optional element rendered at the right of the label row (e.g. "Optional"). */
  labelAside?: React.ReactNode;
}

/**
 * Large labelled input with a leading icon, inline error and optional password toggle.
 * Works with react-hook-form's `register()` spread (React 19 passes `ref` as a prop).
 */
export default function FormField({
  label,
  icon: Icon,
  error,
  hint,
  passwordToggle,
  labelAside,
  type = 'text',
  className,
  id,
  ...props
}: FormFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const [visible, setVisible] = useState(false);
  const inputType = passwordToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors',
            error ? 'text-rose-500' : 'text-stone-400'
          )}
        />
        <input
          id={inputId}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            'h-12 w-full rounded-xl border bg-white pl-12 text-[15px] text-stone-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-stone-400 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500',
            passwordToggle ? 'pr-12' : 'pr-4',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15'
              : 'border-stone-200 hover:border-stone-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15 dark:border-stone-700 dark:hover:border-stone-600'
          )}
          {...props}
        />
        {passwordToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={messageId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  loading,
  loadingLabel,
  children,
  className,
  disabled,
  ...props
}: React.ComponentProps<'button'> & { loading?: boolean; loadingLabel?: string }) {
  return (
    <button type="submit" {...props} disabled={loading || disabled} aria-busy={loading} className={cn(primaryButtonClass, className)}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
