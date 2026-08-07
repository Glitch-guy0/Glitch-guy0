/**
 * Shared contact-form validation (AD-3). Single source of field rules,
 * imported by both the client `ContactForm` island and the `/api/contact`
 * route handler — never duplicate these rules elsewhere.
 */
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(200, 'Name is too long.'),
  email: z.string().trim().min(1, 'Enter your email.').max(320, 'Email is too long.').email('Enter a valid email address.'),
  message: z.string().trim().min(1, 'Enter a message.').max(5000, 'Message is too long.'),
  // Honeypot — deliberately not labeled "website" (autofill-heuristic collision risk).
  // Real visitors never see or fill this; bots that autofill everything will.
  topic: z.string().max(500).optional().default(''),
});

export type ContactPayload = z.infer<typeof contactSchema>;
