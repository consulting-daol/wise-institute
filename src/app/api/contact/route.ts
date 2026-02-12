import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER || process.env.MAVIS_EMAIL;
    const smtpPass = process.env.SMTP_PASS || process.env.MAVIS_PASS;
    const smtpTo = process.env.SMTP_TO || smtpUser || 'info@wiseinstitute.com';

    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"WISE Institute Website" <${smtpUser}>`,
      to: smtpTo,
      subject: `[WISE Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #F4F3F2; padding: 20px;">
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background: #013D3A; padding: 32px 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">
                  WISE Institute
                </h1>
                <div style="width: 48px; height: 2px; background: rgba(255,255,255,0.5); margin: 16px auto 12px auto;"></div>
                <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.85); letter-spacing: 0.05em; text-transform: uppercase;">
                  New Contact Inquiry
                </p>
              </div>
              <div style="padding: 32px 24px;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 20px 0; font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                    Contact Information
                  </h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Name</td>
                      <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Email</td>
                      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #013D3A; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #64748b; font-size: 0.75rem; text-transform: uppercase;">Subject</td>
                      <td style="padding: 8px 0; color: #0f172a;">${subject}</td>
                    </tr>
                  </table>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
                  <h3 style="margin: 0 0 16px 0; font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                    Message
                  </h3>
                  <div style="color: #334155; line-height: 1.7; font-size: 0.95rem; white-space: pre-line;">${message}</div>
                </div>
                <div style="margin-top: 24px;">
                  <a href="mailto:${email}" style="display: inline-block; background: #013D3A; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 0.8rem; border-radius: 8px;">
                    Reply to ${name}
                  </a>
                </div>
              </div>
              <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 0.75rem;">
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
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mail send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
