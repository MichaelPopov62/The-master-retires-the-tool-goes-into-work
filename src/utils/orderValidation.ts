import * as yup from "yup";

export type OrderPayload = {
  name: string;
  phone: string;
  toolName: string;
  /**
   * Telegram WebApp initData (querystring). Если включен REQUIRE_TELEGRAM_INIT_DATA,
   * бэкенд будет требовать и проверять этот параметр.
   */
  telegramInitData?: string;
};

export function sanitizePlainText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  // Не даём инъектить HTML/теги в Telegram HTML parse_mode.
  const withoutTags = value.replaceAll(/<[^>]*>/g, " ");
  return withoutTags.replaceAll(/\s+/g, " ").trim();
}

function normalizePhone(value: unknown): string {
  const s = sanitizePlainText(value);
  // Оставляем +, цифры, пробелы, (), дефисы — для удобного ввода человеком.
  return s.replaceAll(/[^\d+\-() ]/g, "");
}

const MAX_FIELD = 400;

export const orderPayloadSchema: yup.ObjectSchema<OrderPayload> = yup
  .object({
    name: yup
      .string()
      .transform((v) => sanitizePlainText(v).slice(0, MAX_FIELD))
      .required("Укажите имя")
      .matches(
        /^[\p{Script=Cyrillic}\s'’\-]+$/u,
        "Имя должно быть только кириллицей",
      )
      .min(2, "Имя слишком короткое")
      .max(120, "Имя слишком длинное"),
    phone: yup
      .string()
      .transform((v) => normalizePhone(v).slice(0, MAX_FIELD))
      .required("Укажите телефон")
      .min(6, "Телефон слишком короткий")
      .max(30, "Телефон слишком длинный"),
    toolName: yup
      .string()
      .transform((v) => sanitizePlainText(v).slice(0, MAX_FIELD))
      .required("Укажите инструмент")
      .min(2, "Название инструмента слишком короткое")
      .max(200, "Название инструмента слишком длинное"),
    telegramInitData: yup
      .string()
      .transform((v) => sanitizePlainText(v).slice(0, 4096))
      .optional(),
  })
  .noUnknown(true, "Лишние поля в запросе")
  .required();

export async function validateOrderPayload(input: unknown): Promise<OrderPayload> {
  return await orderPayloadSchema.validate(input, {
    abortEarly: true,
    stripUnknown: true,
  });
}
