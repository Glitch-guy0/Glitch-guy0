import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact/schema';

/**
 * POST /api/contact (FR-19–FR-23). The only module that reads
 * `EMAIL_OCTOPUS_API_KEY` / `EMAIL_OCTOPUS_LIST_ID` — never expose these to
 * the client bundle. Wire contract: `{ ok: boolean, error?: string }`; the
 * client decides outcome from `body.ok`, never from HTTP status alone.
 */

const EMAIL_OCTOPUS_TIMEOUT_MS = 6000;

interface EmailOctopusErrorDetail {
  status: number;
  code?: string;
  message?: string;
}

/** Read a Response body exactly once (as text), then best-effort JSON.parse. */
async function readEmailOctopusError(response: Response): Promise<EmailOctopusErrorDetail> {
  const raw = await response.text();
  let code: string | undefined;
  let message: string | undefined;
  try {
    const parsed = JSON.parse(raw) as { error?: { code?: string; message?: string } };
    code = parsed?.error?.code;
    message = parsed?.error?.message;
  } catch {
    // Body wasn't valid JSON — leave code/message undefined; never log raw body.
  }
  return { status: response.status, code, message };
}

/** Never log the raw response body verbatim — it may echo the submitter's email. */
function logEmailOctopusFailure(context: string, detail: EmailOctopusErrorDetail) {
  console.error(`[contact] EmailOctopus ${context} failed`, {
    status: detail.status,
    code: detail.code,
    message: detail.message,
  });
}

/** `AbortSignal.timeout` rejections are `DOMException`, which isn't guaranteed
 * to be `instanceof Error` in every runtime — check both so timeout failures
 * still get a diagnosable name/message logged instead of `undefined`. */
function describeThrown(thrown: unknown): { code?: string; message?: string } {
  if (thrown instanceof Error || thrown instanceof DOMException) {
    return { code: thrown.name, message: thrown.message };
  }
  return {};
}

export async function POST(request: Request) {
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY?.trim();
  const listId = process.env.EMAIL_OCTOPUS_LIST_ID?.trim();

  if (!apiKey || !listId) {
    console.error('[contact] Server misconfigured: missing EmailOctopus env vars');
    return NextResponse.json({ ok: false, error: 'Server misconfigured.' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid input.' }, { status: 400 });
  }

  const { name, email, message, topic } = parsed.data;

  // Honeypot: trim before checking truthiness so stray whitespace autofill
  // isn't mistaken for spam. Never reveal detection to the client.
  if (topic.trim()) {
    return NextResponse.json({ ok: true });
  }

  const fields = { FirstName: name, Message: message };

  try {
    const createResponse = await fetch(`https://api.emailoctopus.com/lists/${listId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        fields,
        status: 'SUBSCRIBED',
        tags: ['source:contact-form'],
      }),
      signal: AbortSignal.timeout(EMAIL_OCTOPUS_TIMEOUT_MS),
    });

    if (createResponse.ok) {
      return NextResponse.json({ ok: true });
    }

    if (createResponse.status >= 400 && createResponse.status < 500) {
      const detail = await readEmailOctopusError(createResponse);

      if (detail.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
        const contactId = createHash('md5').update(email.trim().toLowerCase()).digest('hex');

        try {
          const updateResponse = await fetch(
            `https://api.emailoctopus.com/lists/${listId}/contacts/${contactId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({ fields, status: 'SUBSCRIBED', tags: ['source:contact-form'] }),
              signal: AbortSignal.timeout(EMAIL_OCTOPUS_TIMEOUT_MS),
            },
          );

          if (updateResponse.ok) {
            return NextResponse.json({ ok: true });
          }

          const updateDetail = await readEmailOctopusError(updateResponse);
          logEmailOctopusFailure('update', updateDetail);
          return NextResponse.json({ ok: false, error: 'Could not deliver message.' }, { status: 502 });
        } catch (updateError) {
          logEmailOctopusFailure('update', { status: 0, ...describeThrown(updateError) });
          return NextResponse.json({ ok: false, error: 'Could not deliver message.' }, { status: 502 });
        }
      }

      logEmailOctopusFailure('create', detail);
      return NextResponse.json({ ok: false, error: 'Could not deliver message.' }, { status: 502 });
    }

    // 5xx / unexpected status — still parse and log the detail, never the raw body.
    const detail = await readEmailOctopusError(createResponse);
    logEmailOctopusFailure('create', detail);
    return NextResponse.json({ ok: false, error: 'Could not deliver message.' }, { status: 502 });
  } catch (error) {
    logEmailOctopusFailure('create', { status: 0, ...describeThrown(error) });
    return NextResponse.json({ ok: false, error: 'Could not deliver message.' }, { status: 502 });
  }
}
