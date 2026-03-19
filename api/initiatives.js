import { getServiceClient, cors, validateAdminToken, validateClaimantToken } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getServiceClient();

  // GET — public, returns all initiatives
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('initiatives')
      .select('*')
      .order('id');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // PUT — update a single initiative (admin or its claimant)
  if (req.method === 'PUT') {
    const { id, ...fields } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    const isAdmin = await validateAdminToken(req);
    if (!isAdmin) {
      const claimant = await validateClaimantToken(req);
      if (!claimant || !claimant.initiativeIds.includes(Number(id))) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const allowed = ['name', 'type', 'secondary_type', 'url', 'organization',
      'access', 'cost', 'notes', 'province', 'city', 'industries', 'format'];
    const update = {};
    for (const key of allowed) {
      if (fields[key] !== undefined) update[key] = fields[key];
    }
    update.updated_at = new Date().toISOString();

    const { error } = await db.from('initiatives').update(update).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  // POST — create a new initiative (admin only)
  if (req.method === 'POST') {
    const isAdmin = await validateAdminToken(req);
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });

    const { data: maxRow } = await db
      .from('initiatives')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    const nextId = (maxRow?.id ?? 0) + 1;

    const allowed = ['name', 'type', 'secondary_type', 'url', 'organization',
      'access', 'cost', 'notes', 'province', 'city', 'industries', 'format'];
    const fields = req.body || {};
    const record = { id: nextId };
    for (const key of allowed) {
      if (fields[key] !== undefined) record[key] = fields[key];
    }
    record.updated_at = new Date().toISOString();

    const { data, error } = await db.from('initiatives').insert(record).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // DELETE — admin only
  if (req.method === 'DELETE') {
    const isAdmin = await validateAdminToken(req);
    if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });
    const { error } = await db.from('initiatives').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
