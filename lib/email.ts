import nodemailer from 'nodemailer';

/**
 * Create the nodemailer transporter using environment SMTP config.
 * Update your .env file with real SMTP credentials before using this.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Gracefully handle missing credentials in dev
    ...((!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') && {
      jsonTransport: true, // outputs to console instead of sending
    }),
  });
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email (or log it to console in development if SMTP is not configured).
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || 'EduPulse Platform <noreply@edupulse.edu>';

  try {
    const info = await transporter.sendMail({
      from,
      to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text || payload.html.replace(/<[^>]*>/g, ''),
    });

    // jsonTransport logs the email object — useful for development
    if ('message' in info) {
      console.log('📧 [DEV EMAIL - not actually sent]:', JSON.parse(info.message as string).subject, '→', payload.to);
    } else {
      console.log('📧 Email sent:', info.messageId);
    }
  } catch (err) {
    console.error('Email send error:', err);
    // Don't throw — email failures should not crash the API
  }
}

/**
 * Build the HTML template for campaign broadcast emails.
 */
export function buildCampaignEmail(campaign: {
  title: string;
  message: string;
  sentDate: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${campaign.title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#1e40af);padding:32px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px;">EduPulse</h1>
            <p style="color:#bfdbfe;margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">University Academic Portal</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#0f172a;font-size:20px;font-weight:800;margin:0 0 16px;">${campaign.title}</h2>
            <div style="background:#f1f5f9;border-left:4px solid #1e40af;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
              <p style="color:#334155;margin:0;font-size:14px;line-height:1.7;">${campaign.message}</p>
            </div>
            <p style="color:#64748b;font-size:12px;margin:0;">
              This announcement was sent on <strong>${campaign.sentDate}</strong> by the EduPulse Administration.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
            <p style="color:#94a3b8;font-size:11px;margin:0;">
              © ${new Date().getFullYear()} EduPulse University Portal. This is an automated institutional message.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
