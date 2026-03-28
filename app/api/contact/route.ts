import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  buildNotificationHtml,
  buildNotificationText,
  buildAutoReplyHtml,
  buildAutoReplyText,
} from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY!);

const RESEND_FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const CONTACT_TO  = process.env.CONTACT_TO  ?? "rishabhtiwari1521@gmail.com";
const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rishabhdev.com";

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function errRes(message: string, status: number, errors?: Record<string, string>) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status }
  );
}

export async function POST(req: NextRequest) {

  // 1. Parse JSON
  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return errRes("Invalid request body", 400);
  }

  // 2. Honeypot — return fake success so bots don't retry
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  // 3. Rate limit
  const ip    = getIp(req);
  const limit = await checkRateLimit(ip);

  if (!limit.success) {
    const retryAfterSec = Math.ceil((limit.reset - Date.now()) / 1000);
    return NextResponse.json(
      { success: false, message: `Too many requests. Please wait ${Math.ceil(retryAfterSec / 60)} minutes.` },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 4. Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
      const field = issue.path[0];
      if (typeof field === "string") acc[field] = issue.message;
      return acc;
    }, {});
    return errRes("Validation failed", 422, fieldErrors);
  }

  const { name, email, message } = parsed.data;

  const receivedAt = new Date().toLocaleString("en-IN", {
    timeZone:  "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  const templateOpts = { name, email, message, receivedAt, ipAddress: ip, siteUrl: SITE_URL };

  // 5. Send emails
  try {
    const [notifyResult, replyResult] = await Promise.all([
      resend.emails.send({
        from:    RESEND_FROM,
        to:      [CONTACT_TO],
        replyTo: email,
        subject: `[Portfolio] New message from ${name}`,
        html:    buildNotificationHtml(templateOpts),
        text:    buildNotificationText(templateOpts),
      }),
      resend.emails.send({
        from:    RESEND_FROM,
        to:      [email],
        subject: "Thanks for reaching out! I'll reply within 24 hours.",
        html:    buildAutoReplyHtml(templateOpts),
        text:    buildAutoReplyText(templateOpts),
      }),
    ]);

    if (notifyResult.error) {
      console.error("[contact] Notification failed:", notifyResult.error);
      throw new Error(notifyResult.error.message);
    }
    if (replyResult.error) {
      console.warn("[contact] Auto-reply failed:", replyResult.error.message);
    }

    return NextResponse.json(
      { success: true, message: "Message sent! I'll get back to you within 24 hours." },
      { status: 200 }
    );

  } catch (error) {
    console.error("[contact] Email send failed:", error);
    return errRes("Failed to send your message. Please try emailing me directly.", 500);
  }
}

export async function GET()    { return errRes("Method not allowed", 405); }
export async function PUT()    { return errRes("Method not allowed", 405); }
export async function DELETE() { return errRes("Method not allowed", 405); }
export async function PATCH()  { return errRes("Method not allowed", 405); }