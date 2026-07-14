import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Guard: fail fast with a clear message if SMTP is not configured
  const smtpUser = import.meta.env.SMTP_USER;
  const smtpPass = import.meta.env.SMTP_PASS;
  const smtpTo   = import.meta.env.SMTP_TO ?? smtpUser;

  if (!smtpUser || !smtpPass) {
    console.error('[contact] SMTP_USER or SMTP_PASS env var is missing.');
    return new Response(JSON.stringify({ success: false, message: 'Server misconfiguration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();

    const name     = formData.get('name')?.toString().trim()     ?? '';
    const email    = formData.get('email')?.toString().trim()    ?? '';
    const goal     = formData.get('goal')?.toString().trim()     ?? '';
    const platform = formData.get('platform')?.toString().trim() ?? '';
    const budget   = formData.get('budget')?.toString().trim()   ?? '';
    const message  = formData.get('message')?.toString().trim()  ?? '';

    if (!name || !email) {
      return new Response(JSON.stringify({ success: false, message: 'Name and email are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Codivex Website" <${smtpUser}>`,
      to: smtpTo,
      replyTo: email,
      subject: 'New Project Strategy Inquiry – Codivex',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <h2 style="border-bottom:2px solid #E63946;padding-bottom:8px;color:#E63946">
            New Strategy Inquiry
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:8px 0;font-weight:600;width:120px">Name</td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            ${goal     ? `<tr><td style="padding:8px 0;font-weight:600">Goal</td><td style="padding:8px 0">${goal}</td></tr>` : ''}
            ${platform ? `<tr><td style="padding:8px 0;font-weight:600">Platform</td><td style="padding:8px 0">${platform}</td></tr>` : ''}
            ${budget   ? `<tr><td style="padding:8px 0;font-weight:600">Budget</td><td style="padding:8px 0">${budget}</td></tr>` : ''}
          </table>
          ${message ? `<div style="margin-top:16px"><strong>Message:</strong><p style="margin-top:8px;white-space:pre-wrap">${message}</p></div>` : ''}
          <p style="margin-top:32px;font-size:12px;color:#888">Sent from Codivex website contact form</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[contact] Mailer error:', err);
    return new Response(JSON.stringify({ success: false, message: 'Failed to send email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
