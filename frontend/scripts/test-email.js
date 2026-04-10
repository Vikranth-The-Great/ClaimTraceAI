import https from 'https';

const API_KEY = 're_EUK6sq2L_CmH4zuioe3ddZnLdt3oXif5F';
const TO = 'svikranth40@gmail.com';

const html = [
  '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;">',
  '<div style="background:linear-gradient(135deg,#1e3a8a,#2563EB);padding:24px 32px;border-radius:10px 10px 0 0;">',
  '<h1 style="color:#fff;margin:0;font-size:20px;font-weight:900;">ClaimTrace AI</h1>',
  '<p style="color:#BFDBFE;margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Email Delivery Test</p>',
  '</div>',
  '<div style="background:#fff;border:1px solid #E5E7EB;padding:32px;border-radius:0 0 10px 10px;">',
  '<p style="color:#111827;font-size:15px;line-height:1.7;">This is a <strong>test email</strong> confirming that the Resend API integration for ClaimTrace AI is active and working correctly.</p>',
  '<div style="background:#ECFDF5;border:1px solid #6EE7B7;border-radius:8px;padding:16px 20px;margin:24px 0;">',
  '<p style="color:#065F46;font-size:14px;font-weight:700;margin:0;">✅ Resend API Key is valid and operational</p>',
  '<p style="color:#047857;font-size:13px;margin:6px 0 0;">You will receive full 5-stage AI audit reports at this address after processing claims on the ClaimTrace AI dashboard.</p>',
  '</div>',
  '<p style="color:#6B7280;font-size:12px;">Powered by Resend · ClaimTrace AI Audit Workspace</p>',
  '</div>',
  '</div>',
].join('');

const payload = JSON.stringify({
  from: 'ClaimTrace AI <onboarding@resend.dev>',
  to: [TO],
  subject: 'ClaimTrace AI — Email Delivery Test ✅',
  html: html,
});

const options = {
  hostname: 'api.resend.com',
  port: 443,
  path: '/emails',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + API_KEY,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

console.log('Sending test email to', TO, '...');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('SUCCESS — Email sent! Status:', res.statusCode);
      console.log('Response:', body);
    } else {
      console.error('FAILED — Status:', res.statusCode);
      console.error('Response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Network error:', e.message);
});

req.write(payload);
req.end();
