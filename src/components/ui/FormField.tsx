import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface FormFieldBase {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Render a multiline <textarea> instead of an <input> (Contact Message field, Epic 3). */
  multiline?: boolean;
}

export interface FormFieldInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>,
    FormFieldBase {
  multiline?: false;
}

export interface FormFieldTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>,
    FormFieldBase {
  multiline: true;
}

export type FormFieldProps = FormFieldInputProps | FormFieldTextareaProps;

/**
 * Form field — underline-only (bottom hairline), transparent fill. Focus:
 * 2px white underline + glow. Error: white underline + inline mono message,
 * always visible. Token-driven only; the Contact form island (Epic 3) owns
 * validation state and aria-live announcements.
 */
export function FormField({
  id,
  label,
  error,
  hint,
  multiline = false,
  className = '',
  ...rest
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-mono-label uppercase text-ink-secondary">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          rows={4}
          className={`form-field focus-self w-full py-2.5 text-body text-ink-primary placeholder:text-ink-secondary ${className}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`form-field focus-self w-full py-2.5 text-body text-ink-primary placeholder:text-ink-secondary ${className}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="font-mono text-mono-meta text-ink-primary">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="font-mono text-mono-meta text-ink-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
