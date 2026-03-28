/**
 * lib/validations.ts
 *
 * Single source of truth for contact form validation.
 * Used by BOTH the API route (server-side) and the Contact component
 * (client-side) — keeps rules in sync automatically.
 *
 * Install: npm install zod
 */

import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2,  { message: "Name must be at least 2 characters" })
    .max(60, { message: "Name must be under 60 characters" })
    .regex(/^[a-zA-Z\s\-'.]+$/, { message: "Name contains invalid characters" }),

  email: z
    .string()
    .email({ message: "Enter a valid email address" })
    .max(254, { message: "Email is too long" }), // RFC 5321 max

  message: z
    .string()
    .min(10,   { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be under 2000 characters" }),
});

// TypeScript type inferred from the schema — use this in your components
export type ContactFormData = z.infer<typeof contactSchema>;