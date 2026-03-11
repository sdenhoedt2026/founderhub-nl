import { getServiceClient, cors, validateAdminToken, sendEmail } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getServiceClient();

  // GET — admin only, returns all claims
  if (req.method === 'GET') {
    const isAdmin = await validateAdminToken(req);
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });

    const { data, error } = await db
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST — public, submit a new claim
  if (req.method === 'POST') {
    const { initiative_id, initiative_name, claimant_name, claimant_email, claimant_org, reason } = req.body;
    if (!initiative_id || !claimant_name || !claimant_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await db.from('claims').insert({
      initiative_id,
      initiative_name,
      claimant_name,
      claimant_email,
      claimant_org,
      reason,
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });

    const appUrl = process.env.APP_URL || 'https://founderhub-nl.vercel.app';
    await sendEmail({
      to: ['lisette@upstreamfestival.com', 'hoedt@delmic.com'],
      subject: `New listing claim: ${initiative_name}`,
      html: `
        <h2>New claim request on FounderHub NL</h2>
        <p><strong>Initiative:</strong> ${initiative_name} (ID: ${initiative_id})</p>
        <p><strong>Name:</strong> ${claimant_name}</p>
        <p><strong>Email:</strong> ${claimant_email}</p>
        <p><strong>Organisation:</strong> ${claimant_org || '—'}</p>
        <p><strong>Why they're claiming:</strong> ${reason || '—'}</p>
        <br>
        <p>
          <a href="${appUrl}/admin" style="background:#4f6df5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            Review in admin dashboard
          </a>
        </p>
        <p style="color:#94a3b8;font-size:12px;">Claim ID: ${data.id}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
