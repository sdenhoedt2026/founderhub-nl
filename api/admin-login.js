import { getServiceClient, cors, randomToken } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const validUser = process.env.ADMIN_USERNAME || 'founderhubadmin';
  const validPass = process.env.ADMIN_PASSWORD || 'F4F2026@!';

  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = randomToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  const db = getServiceClient();
  await db.from('admin_sessions').insert({ token, expires_at: expiresAt.toISOString() });

  res.setHeader('Set-Cookie', `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`);
  return res.status(200).json({ ok: true, token });
}
