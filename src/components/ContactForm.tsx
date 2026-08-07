'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { FormField } from '@/components/ui/FormField';
import { contactSchema } from '@/lib/contact/schema';
import { siteContent } from '@/content';

type FieldName = 'name' | 'email' | 'message';
type ValueField = FieldName | 'topic';

interface FormValues {
  name: string;
  email: string;
  message: string;
  /** Honeypot — deliberately not named/labeled "website"; real visitors never see it. */
  topic: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialValues: FormValues = { name: '', email: '', message: '', topic: '' };

/** Validate the full form against the shared schema; returns field-keyed errors. */
function validate(values: FormValues): Record<string, string> {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

/**
 * Client island (AD-3): controlled Name/Email/Message fields via `FormField`,
 * a honeypot input real visitors never perceive, blur+submit validation
 * against the shared schema, and a submit/success/error state machine.
 * Never receives `data-reveal` / `data-glitch-burst` / `data-burst-on-load`.
 */
export function ContactForm() {
  const { contact } = siteContent;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [announcement, setAnnouncement] = useState('');
  /** Synchronous lock against re-entrant submits — React state updates alone
   * can't close the race between two rapid triggers before a render commits. */
  const isSubmittingRef = useRef(false);

  function handleChange(field: ValueField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: FieldName) {
    const fieldErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] ?? '' }));
  }

  async function submit() {
    if (isSubmittingRef.current) return;

    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    const firstError = (['name', 'email', 'message'] as FieldName[])
      .map((field) => fieldErrors[field])
      .find(Boolean);

    if (firstError) {
      setAnnouncement(firstError);
      return;
    }

    isSubmittingRef.current = true;
    setStatus('submitting');
    setAnnouncement('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const body = (await response.json().catch(() => ({ ok: false }))) as {
        ok: boolean;
        error?: string;
      };

      if (body.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setAnnouncement(body.error ?? contact.errorMessage);
      }
    } catch {
      setStatus('error');
      setAnnouncement(contact.errorMessage);
    } finally {
      isSubmittingRef.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  function handleRetry() {
    void submit();
  }

  if (status === 'success') {
    return (
      <div data-component="ContactForm" className="flex max-w-xl flex-col gap-2 py-4">
        <p role="status" className="font-mono text-body text-ink-primary">
          {contact.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div data-component="ContactForm" className="flex max-w-xl flex-col gap-6">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormField
          id="contact-name"
          label={contact.nameLabel}
          value={values.name}
          error={errors.name}
          onChange={(event) => handleChange('name', event.target.value)}
          onBlur={() => handleBlur('name')}
          autoComplete="name"
        />
        <FormField
          id="contact-email"
          label={contact.emailLabel}
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => handleChange('email', event.target.value)}
          onBlur={() => handleBlur('email')}
          autoComplete="email"
        />
        <FormField
          id="contact-message"
          label={contact.messageLabel}
          multiline
          value={values.message}
          error={errors.message}
          onChange={(event) => handleChange('message', event.target.value)}
          onBlur={() => handleBlur('message')}
        />

        {/* Honeypot — visually hidden (not display:none), unlabeled, bot-only. */}
        <div className="sr-only" aria-hidden="true">
          <input
            id="contact-topic"
            name="topic"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={500}
            value={values.topic}
            onChange={(event) => handleChange('topic', event.target.value)}
          />
        </div>

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>

        {status === 'error' ? (
          <div className="flex flex-col gap-3 rounded-md border border-ink-primary p-4">
            <p className="font-mono text-mono-meta text-ink-primary">
              {announcement || contact.errorMessage}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="btn-fringe inline-flex w-fit items-center justify-center gap-2 rounded-md border border-ink-primary bg-transparent px-6 py-3.5 font-mono text-mono-label text-ink-primary transition-colors duration-100 hover:bg-ink-primary hover:text-surface-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary"
            >
              {contact.retryLabel}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-fringe inline-flex w-fit items-center justify-center gap-2 rounded-md bg-ink-primary px-6 py-3.5 font-mono text-mono-label text-surface-base transition-colors duration-100 hover:bg-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary disabled:pointer-events-none disabled:bg-ink-disabled disabled:text-ink-primary"
          >
            {status === 'submitting' ? contact.submittingLabel : contact.submitLabel}
          </button>
        )}
      </form>
    </div>
  );
}
