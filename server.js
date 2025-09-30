// /api/raw.js
import crypto from "crypto";

// ⚠️ PERINGATAN: ini ephemeral di Vercel, jadi token bisa hilang kalau cold start.
// Kalau mau serius, simpan token di DB (misalnya Supabase, Redis, atau Vercel KV)
const VALID_TOKENS = new Set();

const RAW_SCRIPT_URL = "https://raw.githubusercontent.com/sinret/rbxscript.com-scripts-reuploads-/main/ak47";
const TIKTOK_URL = "https://www.tiktok.com/@youraccount";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token || !VALID_TOKENS.has(token)) {
    return res.redirect(302, TIKTOK_URL);
  }

  try {
    const resp = await fetch(RAW_SCRIPT_URL);
    if (!resp.ok) return res.redirect(302, TIKTOK_URL);

    const body = await resp.text();

    // Sekali pakai
    VALID_TOKENS.delete(token);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(body);
  } catch (err) {
    return res.redirect(302, TIKTOK_URL);
  }
}