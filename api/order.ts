import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleOrderPayload, parseOrderBodyFromVercel } from "./orderHandler";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = parseOrderBodyFromVercel(req.body);
  const result = await handleOrderPayload(body);
  return res.status(result.status).json(result.json);
}
