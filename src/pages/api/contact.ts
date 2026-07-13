import type { APIRoute } from 'astro';

export const prerender = false; // Ensures this route runs dynamically on server-side

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, goal, platform } = body;

    // Server-side validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const contactEmail = import.meta.env.CONTACT_EMAIL || 'codivexagency@gmail.com';
    const fromEmail = import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Development mode fallback when Resend key is not configured
    if (!resendApiKey || resendApiKey === 're_your_api_key_here') {
      console.log('--- DEVELOPMENT CONTACT FORM INQUIRY RECEIVED ---');
      console.log('Recipient (CONTACT_EMAIL):', contactEmail);
      console.log('Sender (RESEND_FROM_EMAIL):', fromEmail);
      console.log('Inquiry details:', { name, email, goal, platform, message });
      console.log('--------------------------------------------------');
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Inquiry simulated successfully in development mode.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Codivex Inquiries <${fromEmail}>`,
        to: contactEmail,
        subject: `New Project Strategy Inquiry from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c1c7cf; border-radius: 8px; background-color: #121416; color: #e2e2e5;">
            <h2 style="color: #ffb3b5; border-bottom: 1px solid rgba(193, 199, 207, 0.2); padding-bottom: 10px;">New Strategy Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Goal:</strong> ${goal || 'Not specified'}</p>
            <p><strong>Preferred Platform:</strong> ${platform || 'Not specified'}</p>
            <hr style="border: 0; border-top: 1px solid rgba(193, 199, 207, 0.2); margin: 20px 0;" />
            <p><strong>Project Brief / Core Requirements:</strong></p>
            <div style="background-color: #1a1c1e; padding: 15px; border-radius: 4px; border-left: 4px solid #800020; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Resend API Error details:', errorResponse);
      return new Response(JSON.stringify({ error: errorResponse.message || 'Failed to dispatch email.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const responseData = await response.json();
    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact API Route Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
