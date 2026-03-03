import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { verifyRecaptchaToken } from '@/lib/recaptcha';

// WISE website palette (tailwind.config.js)
const PRIMARY_600 = '#0d9488';
const PRIMARY_700 = '#0f766e';
const SECONDARY_50 = '#f8fafc';
const SECONDARY_200 = '#e2e8f0';
const SECONDARY_500 = '#64748b';
const SECONDARY_700 = '#334155';
const SECONDARY_900 = '#0f172a';
const BODY_BG = '#fafafa';

function createEmailHTML(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WISE Institute Contact</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, -apple-system, BlinkMacSystemFont, sans-serif; background: ${BODY_BG}; line-height: 1.6; color: ${SECONDARY_900};">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 20px;">
        <div style="background: #ffffff; border: 2px solid ${SECONDARY_200}; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);">
          <div style="background: ${PRIMARY_700}; padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">
              WISE Institute
            </h1>
            <div style="width: 48px; height: 2px; background: rgba(255,255,255,0.5); margin: 16px auto 12px auto;"></div>
            <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.9); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">
              New Contact Inquiry
            </p>
          </div>
          <div style="padding: 28px 24px;">
            <div style="background: ${SECONDARY_50}; border: 2px solid ${SECONDARY_200}; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <p style="margin: 0 0 16px 0; font-size: 0.7rem; color: ${SECONDARY_500}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                Contact Information
              </p>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; width: 90px;">Name</td>
                  <td style="padding: 8px 0; color: ${SECONDARY_900}; font-weight: 500;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: ${PRIMARY_600}; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Subject</td>
                  <td style="padding: 8px 0; color: ${SECONDARY_900}; font-weight: 500;">${escapeHtml(subject)}</td>
                </tr>
              </table>
            </div>
            <div style="background: ${SECONDARY_50}; border: 2px solid ${SECONDARY_200}; border-radius: 12px; padding: 24px;">
              <p style="margin: 0 0 12px 0; font-size: 0.7rem; color: ${SECONDARY_500}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                Message
              </p>
              <div style="color: ${SECONDARY_700}; line-height: 1.7; font-size: 0.95rem; white-space: pre-line;">${escapeHtml(message)}</div>
            </div>
            <div style="margin-top: 24px;">
              <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: ${SECONDARY_900}; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 0.8rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(15,23,42,0.1), 0 2px 4px -2px rgba(15,23,42,0.1);">
                Reply to ${escapeHtml(name)}
              </a>
            </div>
          </div>
          <div style="background: ${SECONDARY_50}; padding: 20px 24px; text-align: center; border-top: 2px solid ${SECONDARY_200};">
            <p style="margin: 0; color: ${SECONDARY_500}; font-size: 0.75rem;">
              Sent from the WISE Institute contact form
            </p>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 0.7rem;">
              © ${new Date().getFullYear()} WISE Institute. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createEmailText(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return `
WISE Institute - New Contact Inquiry

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Information:
• Name: ${name}
• Email: ${email}
• Subject: ${subject}

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sent from the WISE Institute contact form.
Replying to this email will respond to the inquirer.
  `.trim();
}

/** 문의자에게 보내는 접수 확인 메일 (HTML) */
function createConfirmationHTML(name: string, subject: string, message: string) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting WISE Institute</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, -apple-system, BlinkMacSystemFont, sans-serif; background: ${BODY_BG}; line-height: 1.6; color: ${SECONDARY_900};">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 20px;">
        <div style="background: #ffffff; border: 2px solid ${SECONDARY_200}; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);">
          <div style="background: ${PRIMARY_700}; padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">
              WISE Institute
            </h1>
            <div style="width: 48px; height: 2px; background: rgba(255,255,255,0.5); margin: 16px auto 12px auto;"></div>
            <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.9); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">
              We received your message
            </p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="margin: 0 0 20px 0; color: ${SECONDARY_700}; font-size: 1rem;">
              Dear ${escapeHtml(name)},
            </p>
            <p style="margin: 0 0 20px 0; color: ${SECONDARY_700}; font-size: 1rem;">
              Thank you for contacting WISE Institute. We have received your inquiry and will get back to you as soon as possible.
            </p>
            <div style="background: ${SECONDARY_50}; border: 2px solid ${SECONDARY_200}; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <p style="margin: 0 0 12px 0; font-size: 0.7rem; color: ${SECONDARY_500}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                Your inquiry
              </p>
              <p style="margin: 0 0 8px 0; color: ${SECONDARY_900}; font-size: 0.95rem;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
              <div style="color: ${SECONDARY_700}; font-size: 0.95rem; white-space: pre-line; margin-top: 12px; padding-top: 12px; border-top: 1px solid ${SECONDARY_200};">${escapeHtml(message)}</div>
            </div>
            <p style="margin: 0; color: ${SECONDARY_500}; font-size: 0.9rem;">
              If you have any urgent questions, please reply to this email or contact us directly.
            </p>
          </div>
          <div style="background: ${SECONDARY_50}; padding: 20px 24px; text-align: center; border-top: 2px solid ${SECONDARY_200};">
            <p style="margin: 0; color: ${SECONDARY_500}; font-size: 0.75rem;">
              WISE Institute – Training that transforms
            </p>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 0.7rem;">
              © ${new Date().getFullYear()} WISE Institute. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/** 문의자에게 보내는 접수 확인 메일 (텍스트) */
function createConfirmationText(name: string, subject: string, message: string) {
  return `
Dear ${name},

Thank you for contacting WISE Institute. We have received your inquiry and will get back to you as soon as possible.

Your inquiry:
Subject: ${subject}

${message}

If you have any urgent questions, please reply to this email or contact us directly.

—
WISE Institute – Training that transforms
© ${new Date().getFullYear()} WISE Institute. All rights reserved.
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, recaptchaToken } = body;

    if (process.env.RECAPTCHA_SECRET_KEY && !recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification required' },
        { status: 400 }
      );
    }

    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
      if (!recaptchaResult.success) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const smtpUser =
      process.env.SMTP_USER ||
      process.env.ADMIN_USERNAME ||
      process.env.MAVIS_EMAIL;
    const rawPass =
      process.env.APP_PASSWORD ||
      process.env.SMTP_PASS ||
      process.env.MAVIS_PASS;
    const smtpPass = rawPass ? String(rawPass).replace(/\s+/g, '') : '';
    const smtpTo =
      process.env.SMTP_TO || smtpUser || 'info@wiseinstitute.com';

    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Email service connection failed' },
        { status: 500 }
      );
    }

    const senderEmail = String(email).trim();

    // 1) 관리자에게 문의 내용 전달
    const adminMailOptions = {
      from: `"WISE Institute Website" <${smtpUser}>`,
      to: smtpTo,
      subject: `[WISE Contact] ${subject}`,
      text: createEmailText(name, email, subject, message),
      html: createEmailHTML(name, email, subject, message),
      replyTo: senderEmail,
    };
    await transporter.sendMail(adminMailOptions);

    // 2) 문의자에게 Thank you / 접수 확인 메일 발송
    const confirmationMailOptions = {
      from: `"WISE Institute" <${smtpUser}>`,
      to: senderEmail,
      subject: `[WISE Institute] We received your inquiry: ${subject}`,
      text: createConfirmationText(name, subject, message),
      html: createConfirmationHTML(name, subject, message),
    };
    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mail send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
