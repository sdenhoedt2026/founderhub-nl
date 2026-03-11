import { getServiceClient, cors } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.cookies?.admin_token || req.headers['x-admin-token'];
  if (token) {
    const db = getServiceClient();
    await db.from('admin_sessions').delete().eq('token', token);
  }
  res.setHeader('Set-Cookie', 'admin_token=; Path=/; HttpOnly; Max-Age=0');
  return res.status(200).json({ ok: true });
}
