/** Общая логика POST /api/order — Vercel и Vite dev middleware */

const MAX_FIELD = 400;

function trimField(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, MAX_FIELD);
}

function escapeTelegramHtml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

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

  if (body == null || typeof body !== "object") {
    return {
      status: 400,
      json: { ok: false, error: "Некорректное тело запроса" },
    };
  }

  const record = body as Record<string, unknown>;
  const name = trimField(record.name);
  const phone = trimField(record.phone);
  const toolName = trimField(record.toolName);

  if (!name || !phone || !toolName) {
    return {
      status: 400,
      json: {
        ok: false,
        error: "Укажите имя, телефон и название инструмента",
      },
    };
  }

  const text = [
    "🛠 <b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeTelegramHtml(name)}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(phone)}`,
    `<b>Инструмент:</b> ${escapeTelegramHtml(toolName)}`,
  ].join("\n");

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
