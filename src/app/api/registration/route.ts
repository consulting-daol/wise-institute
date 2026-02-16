import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const PRIMARY_600 = '#0d9488';
const PRIMARY_700 = '#0f766e';
const SECONDARY_50 = '#f8fafc';
const SECONDARY_200 = '#e2e8f0';
const SECONDARY_500 = '#64748b';
const SECONDARY_700 = '#334155';
const SECONDARY_900 = '#0f172a';
const BODY_BG = '#fafafa';

const PROGRAM_LABELS: Record<string, string> = {
  'pdc-2026': 'PDC 2026 Live Surgery',
  'residency': 'Implant Residency (8-day)',
  'study-club': 'Live Surgery Study Club',
  'both': 'Both Programs',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  'beginner': 'Beginner (0-5 implants placed)',
  'intermediate': 'Intermediate (5-50 implants placed)',
  'advanced': 'Advanced (50+ implants placed)',
};

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

function adminRegistrationHTML(data: {
  name: string;
  email: string;
  clinic: string;
  experience: string;
  program: string;
  message: string;
}) {
  const programLabel = PROGRAM_LABELS[data.program] || data.program || '—';
  const experienceLabel = EXPERIENCE_LABELS[data.experience] || data.experience || '—';
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WISE Institute – New Registration</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: ${BODY_BG}; line-height: 1.6; color: ${SECONDARY_900};">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 20px;">
        <div style="background: #fff; border: 2px solid ${SECONDARY_200}; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);">
          <div style="background: ${PRIMARY_700}; padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #fff; letter-spacing: 0.02em;">WISE Institute</h1>
            <div style="width: 48px; height: 2px; background: rgba(255,255,255,0.5); margin: 16px auto 12px;"></div>
            <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.9); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">New Registration Interest</p>
          </div>
          <div style="padding: 28px 24px;">
            <div style="background: ${SECONDARY_50}; border: 2px solid ${SECONDARY_200}; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
              <p style="margin: 0 0 16px; font-size: 0.7rem; color: ${SECONDARY_500}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Registration details</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr><td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase; width: 100px;">Name</td><td style="padding: 8px 0; color: ${SECONDARY_900}; font-weight: 500;">${escapeHtml(data.name)}</td></tr>
                <tr><td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: ${PRIMARY_600}; text-decoration: none;">${escapeHtml(data.email)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Clinic</td><td style="padding: 8px 0; color: ${SECONDARY_900};">${escapeHtml(data.clinic) || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Experience</td><td style="padding: 8px 0; color: ${SECONDARY_900};">${escapeHtml(experienceLabel)}</td></tr>
                <tr><td style="padding: 8px 0; color: ${SECONDARY_500}; font-size: 0.75rem; text-transform: uppercase;">Program</td><td style="padding: 8px 0; color: ${SECONDARY_900};">${escapeHtml(programLabel)}</td></tr>
              </table>
            </div>
            ${data.message ? `
            <div style="background: ${SECONDARY_50}; border: 2px solid ${SECONDARY_200}; border-radius: 12px; padding: 24px;">
              <p style="margin: 0 0 12px; font-size: 0.7rem; color: ${SECONDARY_500}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Additional message</p>
              <div style="color: ${SECONDARY_700}; font-size: 0.95rem; white-space: pre-line;">${escapeHtml(data.message)}</div>
            </div>
            ` : ''}
            <div style="margin-top: 24px;">
              <a href="mailto:${escapeHtml(data.email)}" style="display: inline-block; background: ${SECONDARY_900}; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 0.8rem; border-radius: 1rem;">Reply to ${escapeHtml(data.name)}</a>
            </div>
          </div>
          <div style="background: ${SECONDARY_50}; padding: 20px 24px; text-align: center; border-top: 2px solid ${SECONDARY_200};">
            <p style="margin: 0; color: ${SECONDARY_500}; font-size: 0.75rem;">Sent from WISE Institute Schedule / Registration form</p>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 0.7rem;">© ${new Date().getFullYear()} WISE Institute.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function thankYouRegistrationHTML(name: string, programLabel: string) {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you – WISE Institute Registration</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: ${BODY_BG}; line-height: 1.6; color: ${SECONDARY_900};">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 20px;">
        <div style="background: #fff; border: 2px solid ${SECONDARY_200}; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04);">
          <div style="background: ${PRIMARY_700}; padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #fff; letter-spacing: 0.02em;">WISE Institute</h1>
            <div style="width: 48px; height: 2px; background: rgba(255,255,255,0.5); margin: 16px auto 12px;"></div>
            <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.9); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">Thank you for registering your interest</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="margin: 0 0 20px; color: ${SECONDARY_700}; font-size: 1rem;">Dear ${escapeHtml(name)},</p>
            <p style="margin: 0 0 20px; color: ${SECONDARY_700}; font-size: 1rem;">Thank you for registering your interest in ${escapeHtml(programLabel)}. We have received your details and will follow up with cohort availability, tuition, and what to prepare before live surgery days.</p>
            <p style="margin: 0 0 20px; color: ${SECONDARY_700}; font-size: 1rem;">If you have any questions in the meantime, reply to this email or contact us at info@wiseinstitute.com.</p>
          </div>
          <div style="background: ${SECONDARY_50}; padding: 20px 24px; text-align: center; border-top: 2px solid ${SECONDARY_200};">
            <p style="margin: 0; color: ${SECONDARY_500}; font-size: 0.75rem;">WISE Institute – Training that transforms</p>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 0.7rem;">© ${new Date().getFullYear()} WISE Institute. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function adminRegistrationText(data: { name: string; email: string; clinic: string; experience: string; program: string; message: string }) {
  const programLabel = PROGRAM_LABELS[data.program] || data.program || '—';
  const experienceLabel = EXPERIENCE_LABELS[data.experience] || data.experience || '—';
  return `
WISE Institute – New Registration Interest

Name: ${data.name}
Email: ${data.email}
Clinic: ${data.clinic || '—'}
Experience: ${experienceLabel}
Program: ${programLabel}

Additional message:
${data.message || '—'}
  `.trim();
}

function thankYouRegistrationText(name: string, programLabel: string) {
  return `
Dear ${name},

Thank you for registering your interest. We have received your details and will follow up with cohort availability, tuition, and what to prepare before live surgery days.

If you have any questions, reply to this email or contact us at info@wiseinstitute.com.

—
WISE Institute – Training that transforms
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, clinic = '', experience = '', program = '', message = '' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
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
      auth: { user: smtpUser, pass: smtpPass },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Email service connection failed' },
        { status: 500 }
      );
    }

    const senderEmail = String(email).trim();
    const registrationData = {
      name: String(name).trim(),
      email: senderEmail,
      clinic: String(clinic).trim(),
      experience: String(experience).trim(),
      program: String(program).trim(),
      message: String(message).trim(),
    };
    const programLabel = PROGRAM_LABELS[registrationData.program] || registrationData.program || 'our programs';

    // 1) Admin: new registration
    await transporter.sendMail({
      from: `"WISE Institute Website" <${smtpUser}>`,
      to: smtpTo,
      subject: `[WISE Registration] ${registrationData.name} – ${programLabel}`,
      replyTo: senderEmail,
      text: adminRegistrationText(registrationData),
      html: adminRegistrationHTML(registrationData),
    });

    // 2) Registrant: thank you email
    await transporter.sendMail({
      from: `"WISE Institute" <${smtpUser}>`,
      to: senderEmail,
      subject: `[WISE Institute] Thank you for your registration interest`,
      text: thankYouRegistrationText(registrationData.name, programLabel),
      html: thankYouRegistrationHTML(registrationData.name, programLabel),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration mail error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration. Please try again later.' },
      { status: 500 }
    );
  }
}
