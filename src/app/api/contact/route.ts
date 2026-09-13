import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { escapeHtml } from "@/lib/html";
import { site } from "@/data/site";

function brandedEmail({
  heading,
  body,
}: {
  heading: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:Inter,Arial,sans-serif;color:#F0F0F0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 12px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;color:#E8441A;text-transform:uppercase;">${escapeHtml(site.name)}</p>
                <h1 style="margin:8px 0 0;font-size:22px;color:#F0F0F0;">${heading}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;color:#888888;font-size:13px;line-height:1.6;">
                Best,<br/>${escapeHtml(site.name)}<br/>
                <span style="color:#E8441A;">${escapeHtml(site.role)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid form data." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const inbox = process.env.CONTACT_EMAIL;

    if (!apiKey || !inbox) {
      return Response.json(
        { error: "Email delivery is not configured yet." },
        { status: 500 },
      );
    }

    const { name, email, message } = parsed.data;
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";

    const inboxHtml = brandedEmail({
      heading: "New portfolio message",
      body: `
        <p style="margin:0 0 16px;color:#888888;font-size:14px;">Someone reached out from the site.</p>
        <p style="margin:0 0 8px;"><strong style="color:#FF6B35;">Name</strong><br/>${escapeHtml(name)}</p>
        <p style="margin:0 0 8px;"><strong style="color:#FF6B35;">Email</strong><br/><a href="mailto:${escapeHtml(email)}" style="color:#F0F0F0;">${escapeHtml(email)}</a></p>
        <p style="margin:16px 0 0;"><strong style="color:#FF6B35;">Message</strong></p>
        <p style="margin:8px 0 0;padding:16px;background:#0a0a0a;border-radius:12px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
      `,
    });

    const replyHtml = brandedEmail({
      heading: "Thanks for writing",
      body: `
        <p style="margin:0 0 16px;line-height:1.7;">Hi ${escapeHtml(name)},</p>
        <p style="margin:0 0 16px;line-height:1.7;">I received your message and will get back to you soon. Here is a copy of what you sent:</p>
        <p style="margin:0;padding:16px;background:#0a0a0a;border-radius:12px;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
      `,
    });

    const [inboxResult, replyResult] = await Promise.all([
      resend.emails.send({
        from,
        to: inbox,
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        html: inboxHtml,
      }),
      resend.emails.send({
        from,
        to: email,
        subject: `I got your note — ${site.name}`,
        html: replyHtml,
      }),
    ]);

    if (inboxResult.error || replyResult.error) {
      return Response.json(
        { error: inboxResult.error?.message ?? replyResult.error?.message ?? "Failed to send email." },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}
