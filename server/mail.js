import nodemailer from 'nodemailer'

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'jadendficklin@gmail.com'
const CONTACT_FROM_NAME = process.env.CONTACT_FROM_NAME || 'JFD Design Website'

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildContactEmail({ name, email, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />')
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const subject = `JFD Design Website — New Lead from ${name}`

  const text = [
    'JFD DESIGN WEBSITE — NEW LEAD INQUIRY',
    '=====================================',
    '',
    `Submitted: ${submittedAt}`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Project details:',
    message,
    '',
    '---',
    'This message was sent from the contact form at jfddesign.com.',
  ].join('\n')

  const html = `
    <div style="margin:0;padding:0;background:#f7f5f0;font-family:Arial,Helvetica,sans-serif;color:#1a2b3c;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f5f0;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(26,43,60,0.12);">
              <tr>
                <td style="padding:28px 32px;background:#2c4a5e;color:#ffffff;">
                  <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#c9a96e;font-weight:700;">JFD Design Website</p>
                  <h1 style="margin:0;font-size:24px;line-height:1.2;">New Lead Inquiry</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 32px;">
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#4a5f73;">
                    Someone submitted the contact form on your JFD Design website.
                  </p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(26,43,60,0.1);border-radius:12px;overflow:hidden;">
                    <tr>
                      <td style="padding:14px 16px;background:#f7f5f0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5f73;">Submitted</td>
                      <td style="padding:14px 16px;font-size:15px;">${escapeHtml(submittedAt)}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 16px;background:#f7f5f0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5f73;">Name</td>
                      <td style="padding:14px 16px;font-size:15px;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 16px;background:#f7f5f0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5f73;">Email</td>
                      <td style="padding:14px 16px;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#2c4a5e;">${safeEmail}</a></td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:14px 16px;background:#f7f5f0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4a5f73;">Project details</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:16px;font-size:15px;line-height:1.6;color:#1a2b3c;">${safeMessage}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 32px 28px;font-size:12px;line-height:1.5;color:#4a5f73;border-top:1px solid rgba(26,43,60,0.08);">
                  Lead form notification from the JFD Design website contact page.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `

  return { subject, text, html }
}

export async function sendContactEmail({ name, email, message }) {
  const transporter = getTransporter()
  const { subject, text, html } = buildContactEmail({ name, email, message })
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER

  await transporter.sendMail({
    from: `"${CONTACT_FROM_NAME}" <${fromAddress}>`,
    to: CONTACT_TO_EMAIL,
    replyTo: `"${name}" <${email}>`,
    subject,
    text,
    html,
  })
}
