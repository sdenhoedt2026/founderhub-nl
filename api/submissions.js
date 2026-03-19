import { cors, sendEmail } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { initiative_name, type, secondary_type, url, organization, city, province, submitter_name, submitter_email, notes } = req.body;

    if (!initiative_name || !submitter_name || !submitter_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appUrl = process.env.APP_URL || 'https://founderhub-nl2.vercel.app';
    await sendEmail({
      to: ['lisette@upstreamfestival.com', 'hoedt@delmic.com'],
      subject: `New initiative submission: ${initiative_name}`,
      html: `
        <h2>New initiative submission on FounderHub NL</h2>
        <p><strong>Initiative name:</strong> ${initiative_name}</p>
        <p><strong>Type:</strong> ${type || '—'}</p>
        <p><strong>Secondary type:</strong> ${secondary_type || '—'}</p>
        <p><strong>Website:</strong> ${url ? `<a href="${url}">${url}</a>` : '—'}</p>
        <p><strong>Organisation:</strong> ${organization || '—'}</p>
        <p><strong>City:</strong> ${city || '—'}</p>
        <p><strong>Province:</strong> ${province || '—'}</p>
        <p><strong>Notes:</strong> ${notes || '—'}</p>
        <hr>
        <p><strong>Submitted by:</strong> ${submitter_name} (${submitter_email})</p>
        <br>
        <p>
          <a href="${appUrl}/admin" style="background:#4f6df5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            Open admin dashboard
          </a>
        </p>
      `,
    });

    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
