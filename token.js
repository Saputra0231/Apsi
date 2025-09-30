// /api/token.js
import crypto from "crypto";

// Simpan token sementara (ephemeral)
const VALID_TOKENS = new Set();

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { password } = req.body;
  if (password !== process.env.ADMIN_PASS) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  VALID_TOKENS.add(token);

  // auto-expire 3 menit
  setTimeout(() => VALID_TOKENS.delete(token), 3 * 60 * 1000);

  return res.status(200).json({ ok: true, token });
}