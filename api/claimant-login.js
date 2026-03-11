import { getServiceClient, cors, randomToken, hash } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const db = getServiceClient();
  const { data: claimant } = await db
    .from('claimants')
    .select('id, email, initiative_ids, password_hash')
    .eq('email', email.toLowerCase())
    .single();

  if (!claimant || claimant.password_hash !== hash(password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = randomToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  await db.from('claimant_sessions').insert({
    token,
    claimant_id: claimant.id,
    expires_at: expiresAt.toISOString(),
  });

  res.setHeader('Set-Cookie', `claimant_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
  return res.status(200).json({
    ok: true,
    token,
    email: claimant.email,
    initiativeIds: claimant.initiative_ids,
  });
}
