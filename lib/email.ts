/**
 * lib/email-template.ts
 *
 * Branded HTML email templates for contact form submissions.
 * All user input is HTML-escaped before insertion — no XSS risk.
 */

import type { ContactFormData } from "./validations";

interface TemplateOptions extends ContactFormData {
  receivedAt: string;
  ipAddress:  string;
  siteUrl:    string;
}

// ─── HTML escape — prevents XSS in email clients ──────────────────────────────
// Must be applied to EVERY piece of user-supplied data before inserting into HTML.
function esc(str: string): string {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;")
    .replace(/\n/g, "<br/>");
}

// ─── Notification email (sent to you) ────────────────────────────────────────
export function buildNotificationHtml(opts: TemplateOptions): string {
  const { name, email, message, receivedAt, ipAddress } = opts;

  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Contact Form Message</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0c;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0c;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
        style="background:#141416;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a1c,#111113);padding:28px 32px;border-bottom:2px solid #ff9f0a;">
            <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:11px;color:#ff9f0a;letter-spacing:0.12em;">
              RT.DEV / PORTFOLIO
            </p>
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#f2f2f7;letter-spacing:-0.02em;">
              New Contact Form Message
            </h1>
            <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.3);">
              Received ${esc(receivedAt)}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <!-- From -->
            <p style="margin:0 0 5px;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,159,10,0.7);letter-spacing:0.1em;text-transform:uppercase;">From</p>
            <p style="margin:0 0 4px;font-size:17px;font-weight:600;color:#f2f2f7;">${esc(name)}</p>
            <a href="mailto:${esc(email)}" style="font-size:13px;color:#ff9f0a;text-decoration:none;font-family:'Courier New',monospace;">
              ${esc(email)}
            </a>

            <div style="height:1px;background:linear-gradient(to right,rgba(255,159,10,0.3),transparent);margin:24px 0;"></div>

            <!-- Message -->
            <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,159,10,0.7);letter-spacing:0.1em;text-transform:uppercase;">Message</p>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:18px 20px;">
              <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.75;">
                ${esc(message)}
              </p>
            </div>

            <!-- Reply CTA -->
            <div style="margin-top:24px;text-align:center;">
              <a href="mailto:${esc(email)}?subject=Re:%20Your%20message%20on%20rishabhdev.com"
                style="display:inline-block;padding:11px 26px;background:#ff9f0a;color:#0a0a0a;font-weight:700;font-size:13px;border-radius:8px;text-decoration:none;">
                ↩ Reply to ${esc(name)}
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.2);">
              rishabhdev.com contact form &middot; IP: ${esc(ipAddress)}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export function buildNotificationText(opts: TemplateOptions): string {
  const { name, email, message, receivedAt, ipAddress } = opts;
  return `
NEW MESSAGE — rishabhdev.com
=============================
From:     ${name}
Email:    ${email}
Received: ${receivedAt}

${message}

--
IP: ${ipAddress}`.trim();
}

// ─── Auto-reply email (sent to the person who contacted you) ──────────────────
export function buildAutoReplyHtml(opts: TemplateOptions): string {
  const { name, message, siteUrl } = opts;

  return /* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:40px 0;background:#0a0a0c;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#141416;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

        <tr>
          <td style="padding:24px 28px;border-bottom:2px solid #ff9f0a;">
            <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:10px;color:#ff9f0a;letter-spacing:0.1em;">RT.DEV</p>
            <h2 style="margin:0;font-size:20px;color:#f2f2f7;font-weight:700;">Got your message!</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 28px;">
            <p style="margin:0 0 14px;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;">
              Hey ${esc(name)},
            </p>
            <p style="margin:0 0 14px;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;">
              Thanks for reaching out! I've received your message and will reply within
              <strong style="color:#ff9f0a;">24 hours</strong>.
            </p>
            <div style="background:rgba(255,255,255,0.03);border-left:3px solid #ff9f0a;border-radius:0 8px 8px 0;padding:14px 18px;margin:18px 0;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.65;">
                ${esc(message)}
              </p>
            </div>
            <p style="margin:18px 0 0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.7;">
              Best,<br/>
              <strong style="color:#f2f2f7;">Rishabh Tiwari</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 28px;background:rgba(0,0,0,0.25);border-top:1px solid rgba(255,255,255,0.05);">
            <a href="${siteUrl}" style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,159,10,0.5);text-decoration:none;">
              ${siteUrl}
            </a>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export function buildAutoReplyText(opts: TemplateOptions): string {
  const { name, message, siteUrl } = opts;
  return `
Hey ${name},

Thanks for reaching out! I'll get back to you within 24 hours.

Your message:
---
${message}
---

Best,
Rishabh Tiwari
${siteUrl}`.trim();
}