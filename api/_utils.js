import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export function getServiceClient() {
  return createClient(
    process.env.SUPABASE_URL || 'https://nvrgxaqnubalwsbstemu.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cmd4YXFudWJhbHdzYnN0ZW11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0ODcxOSwiZXhwIjoyMDg5MjI0NzE5fQ.jHDSPiiGzToenvSaEpzu74GUc_HD4FIAAsRahcaRZiQ'
  );
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function hash(value) {
  return crypto
    .createHmac('sha256', process.env.SECRET_SALT || 'founderhub-salt')
    .update(value)
    .digest('hex');
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export async function validateAdminToken(req) {
  const token = req.cookies?.admin_token || req.headers['x-admin-token'];
  if (!token) return false;
  const db = getServiceClient();
  const { data } = await db
    .from('admin_sessions')
    .select('token')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();
  return !!data;
}

export async function validateClaimantToken(req) {
  const token = req.cookies?.claimant_token || req.headers['x-claimant-token'];
  if (!token) return null;
  const db = getServiceClient();
  const { data } = await db
    .from('claimant_sessions')
    .select('claimant_id, claimants(email, initiative_ids)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();
  if (!data) return null;
  return {
    id: data.claimant_id,
    email: data.claimants.email,
    initiativeIds: data.claimants.initiative_ids,
  };
}

export async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `FounderHub NL <noreply@${process.env.EMAIL_DOMAIN || 'founderhub.nl'}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Email send failed:', err);
  }
  return res.ok;
}
