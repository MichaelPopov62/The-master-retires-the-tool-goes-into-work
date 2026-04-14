/** Общая логика POST /api/order — Vercel и Vite dev middleware */

import crypto from "node:crypto";
import { validateOrderPayload } from "../src/utils/orderValidation";

function escapeTelegramHtml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

type VerifiedTelegramInitData = {
  userId: number;
  authDate: number;
};

function verifyTelegramWebAppInitData(
  initData: string,
  botToken: string,
  maxAgeSec: number,
): VerifiedTelegramInitData | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    return null;
  }

  const pairs: string[] = [];
  for (const [key, value] of params.entries()) {
    if (key === "hash") continue;
    pairs.push(`${key}=${value}`);
  }
  pairs.sort((a, b) => a.localeCompare(b));
  const dataCheckString = pairs.join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const ok =
    hash.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(hash, "utf8"), Buffer.from(expected, "utf8"));
  if (!ok) {
    return null;
  }

  const authDateStr = params.get("auth_date");
  const authDate = authDateStr ? Number(authDateStr) : NaN;
  if (!Number.isFinite(authDate)) {
    return null;
  }
  const nowSec = Math.floor(Date.now() / 1000);
  if (maxAgeSec > 0 && nowSec - authDate > maxAgeSec) {
    return null;
  }

  const userRaw = params.get("user");
  if (!userRaw) {
    return null;
  }
  let user: unknown;
  try {
    user = JSON.parse(userRaw) as unknown;
  } catch {
    return null;
  }
  if (user == null || typeof user !== "object") {
    return null;
  }
  const id = (user as Record<string, unknown>).id;
  if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) {
    return null;
  }

  return { userId: id, authDate };
}

const perUserDayCounter = new Map<string, number>();

/** Разбор body из Vercel (строка JSON или объект) */
export function parseOrderBodyFromVercel(raw: unknown): unknown {
  if (raw == null) {
    return null;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  return raw;
}

export async function handleOrderPayload(body: unknown): Promise<{
  status: number;
  json: { ok: boolean; error?: string };
}> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Не заданы TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
    return {
      status: 500,
      json: { ok: false, error: "Сервер не настроен" },
    };
  }

  let payload: Awaited<ReturnType<typeof validateOrderPayload>>;
  try {
    payload = await validateOrderPayload(body);
  } catch (e) {
    if (e instanceof Error && e.name === "ValidationError") {
      return { status: 400, json: { ok: false, error: e.message } };
    }
    return { status: 400, json: { ok: false, error: "Некорректное тело запроса" } };
  }

  const requireInitData = (process.env.REQUIRE_TELEGRAM_INIT_DATA ?? "").toLowerCase() === "true";
  const initDataMaxAgeSecRaw = process.env.TELEGRAM_INITDATA_MAX_AGE_SEC ?? "";
  const initDataMaxAgeSec = initDataMaxAgeSecRaw ? Number(initDataMaxAgeSecRaw) : 24 * 60 * 60;
  const verifiedInitData = payload.telegramInitData
    ? verifyTelegramWebAppInitData(payload.telegramInitData, token, initDataMaxAgeSec)
    : null;

  if (requireInitData && !verifiedInitData) {
    return { status: 401, json: { ok: false, error: "Требуется авторизация Telegram" } };
  }

  // Бизнес-валидация: лимит заявок на пользователя в сутки (работает надёжно в dev, на serverless — best effort).
  const limitRaw = process.env.ORDER_LIMIT_PER_TG_USER_PER_DAY ?? "";
  const limit = limitRaw ? Number(limitRaw) : 0;
  if (limit > 0 && verifiedInitData) {
    const day = new Date().toISOString().slice(0, 10);
    const key = `${verifiedInitData.userId}:${day}`;
    const current = perUserDayCounter.get(key) ?? 0;
    if (current >= limit) {
      return { status: 429, json: { ok: false, error: "Лимит заявок исчерпан. Попробуйте позже." } };
    }
    perUserDayCounter.set(key, current + 1);
  }

  const text = [
    "🛠 <b>Новая заявка с сайта</b>",
    "",
    verifiedInitData ? `<b>Telegram user_id:</b> ${verifiedInitData.userId}` : null,
    `<b>Имя:</b> ${escapeTelegramHtml(payload.name)}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(payload.phone)}`,
    `<b>Инструмент:</b> ${escapeTelegramHtml(payload.toolName)}`,
  ]
    .filter((x): x is string => typeof x === "string")
    .join("\n");

  const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const tgRes = await fetch(tgUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const tgJson = (await tgRes.json()) as { ok?: boolean; description?: string };

  if (!tgRes.ok || !tgJson.ok) {
    console.error("Telegram API:", tgJson);
    return {
      status: 502,
      json: { ok: false, error: "Не удалось отправить в Telegram" },
    };
  }

  return { status: 200, json: { ok: true } };
}
