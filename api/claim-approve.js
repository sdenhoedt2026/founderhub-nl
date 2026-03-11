import { getServiceClient, cors, validateAdminToken, randomToken, hash, sendEmail } from './_utils.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const isAdmin = await validateAdminToken(req);
  if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });

  const { claim_id, action } = req.body; // action: 'approve' | 'deny'
  if (!claim_id || !action) return res.status(400).json({ error: 'claim_id and action required' });

  const db = getServiceClient();

  // Load the claim
  const { data: claim, error: claimErr } = await db
    .from('claims')
    .select('*')
    .eq('id', claim_id)
    .single();
  if (claimErr || !claim) return res.status(404).json({ error: 'Claim not found' });

  if (action === 'deny') {
    await db.from('claims').update({ status: 'denied' }).eq('id', claim_id);
    await sendEmail({
      to: claim.claimant_email,
      subject: 'Your FounderHub NL claim request',
      html: `
        <p>Hi ${claim.claimant_name},</p>
        <p>Thank you for submitting a claim for <strong>${claim.initiative_name}</strong> on FounderHub NL.</p>
        <p>After review, we were unable to approve your request at this time. If you believe this is a mistake, please reply to this email.</p>
        <p>Kind regards,<br>FounderHub NL</p>
      `,
    });
    return res.status(200).json({ ok: true });
  }

  if (action === 'approve') {
    // Generate a password for the claimant
    const password = randomToken(8); // 16-char hex password
    const passwordHash = hash(password);

    // Upsert claimant — if they already have an account, add the new initiative
    const { data: existing } = await db
      .from('claimants')
      .select('id, initiative_ids')
      .eq('email', claim.claimant_email)
      .single();

    let claimantId;
    if (existing) {
      const ids = [...new Set([...existing.initiative_ids, claim.initiative_id])];
      await db.from('claimants').update({ initiative_ids: ids }).eq('id', existing.id);
      claimantId = existing.id;
    } else {
      const { data: newClaimant } = await db
        .from('claimants')
        .insert({
          email: claim.claimant_email,
          password_hash: passwordHash,
          initiative_ids: [claim.initiative_id],
        })
        .select()
        .single();
      claimantId = newClaimant.id;
    }

    // Mark claim as approved
    await db.from('claims').update({ status: 'approved' }).eq('id', claim_id);

    const appUrl = process.env.APP_URL || 'https://founderhub-nl.vercel.app';
    await sendEmail({
      to: claim.claimant_email,
      subject: `Your FounderHub NL listing access — ${claim.initiative_name}`,
      html: `
        <p>Hi ${claim.claimant_name},</p>
        <p>Great news! Your claim for <strong>${claim.initiative_name}</strong> on FounderHub NL has been approved.</p>
        <p>You can now log in to update your listing:</p>
        <p>
          <strong>Login URL:</strong> <a href="${appUrl}/my-listing">${appUrl}/my-listing</a><br>
          <strong>Email:</strong> ${claim.claimant_email}<br>
          <strong>Password:</strong> ${existing ? '(your existing password)' : password}
        </p>
        ${existing ? '' : `<p style="color:#ef4444;">Please save this password — it won't be shown again.</p>`}
        <p>Kind regards,<br>FounderHub NL</p>
      `,
    });

    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: 'Invalid action' });
}
