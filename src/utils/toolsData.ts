import type { Tool } from "../types";

/**
 * Каталог: все поля `priceUah` и итоги — в гривнах (UAH).
 * См. `ALL_CALCULATIONS_IN_UAH`, `src/utils/currency.json`, `docs/CURRENCY-TZ.md`.
 */

/** Для wa.me: только цифры международного номера, без «+», пробелов и дефисов */
export const CONTACT_WHATSAPP_PHONE = "380689083460";

/** Район / город для футера */
export const CONTACT_LOCATION =
  "с. Гатне, Киевская область (встреча у м. Теремки по договорённости)";

/** Телефон в футере (как показывать посетителю) */
export const CONTACT_PHONE_DISPLAY = "+380 68 908 34 60";

/** Мессенджеры одной строкой для футера */
export const CONTACT_MESSENGERS_DISPLAY = "WhatsApp, Telegram";

/**
 * Важно: в Telegram «имя» (title) и «username» — разные вещи.
 * Кнопке нужна именно ссылка на username вида `https://t.me/<username>`.
 * Если при клике открывается «чужой» аккаунт (например, с суффиксом вроде `-s`),
 * значит у вашего бота ДРУГОЙ username. Откройте бота → профиль → «Поделиться»/«Copy link»
 * и вставьте ссылку сюда.
 */
export const CONTACT_TELEGRAM_BOT_BOOKING_URL =
  "https://t.me/PMS_MSbot" as const;

/** Допустимые символы в параметре `start` deep link (см. документацию Telegram Bot API). */
const TELEGRAM_START_PAYLOAD_RE = /^[a-zA-Z0-9_-]+$/;

/**
 * Черновик сообщения для чата с ботом. Параметр `?text=` в t.me для **ботов** в клиентах Telegram обычно не подставляется в поле ввода (в отличие от людей/каналов), поэтому тот же текст копируют в буфер на клик по кнопке на сайте.
 */
export function telegramBookingDraftText(tool: Pick<Tool, "name">): string {
  return `Здравствуйте! Бронь: ${tool.name}`;
}

/**
 * Deep link бота: только `?start=<id>` (латиница). Полное название инструмента бот может вернуть по id через {@link getToolDisplayNameForTelegramStartPayload} или пользователь вставит текст из {@link telegramBookingDraftText}.
 */
export function buildTelegramBookingUrl(tool: Pick<Tool, "id">): string {
  if (!TELEGRAM_START_PAYLOAD_RE.test(tool.id)) {
    console.warn(
      `[toolsData] id «${tool.id}» не подходит для Telegram ?start= (нужны A–Z, a–z, 0–9, _, -).`,
    );
  }
  return `${CONTACT_TELEGRAM_BOT_BOOKING_URL}?start=${tool.id}`;
}

const img = (seed: string, w = 800, h = 520) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const fromPublic = (pathFromPublicRoot: string) => {
  const trimmed = pathFromPublicRoot.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${trimmed}`;
};

export const tools: Tool[] = [
  {
    id: "perforator",
    name: "Перфоратор SDS-plus Bosch GBH 2-26 DRE",
    priceUah: 12_500,
    imageUrls: [img("tool-perf-1"), img("tool-perf-2"), img("tool-perf-3")],
    demoVideoUrl: "https://www.youtube.com/shorts/",
    bookingMessage:
      "Здравствуйте! Хочу забронировать перфоратор Bosch GBH 2-26 DRE из объявления «мастер на пенсии».",
    characteristics: [
      { label: "Питание", value: "сеть 220 В" },
      { label: "Мощность", value: "800 Вт" },
      { label: "Энергия удара", value: "2,7 Дж" },
      { label: "Патрон", value: "SDS-plus, быстросъёмный адаптер под сверло" },
      { label: "Режимы", value: "сверление, удар, долбление" },
      { label: "Вес", value: "2,7 кг" },
    ],
    state: {
      resourcePercentRemaining: 85,
      resourceScaleLabel: "Ресурс инструмента",
      wearCaption: "15% износ — бурил по дому и лёгкому кирпичу, без перегрева",
      completeness:
        "Коробка, инструкция, дополнительная рукоятка, ограничитель глубины, смазка для буров.",
      remarks: "Кнопки и кабель целые, люфта патрона нет.",
    },
  },

  {
    id: "bolgarka",
    name: "УШМ (болгарка) 125 мм, 1400 Вт",
    priceUah: 5_500,
    imageUrls: [],
    bookingMessage:
      "Здравствуйте! Хочу забронировать УШМ 125 мм из объявления о распродаже инструмента.",
    characteristics: [
      { label: "Диск", value: "125 мм" },
      { label: "Мощность", value: "1400 Вт" },
      { label: "Обороты", value: "до 11 000 об/мин" },
      {
        label: "Защита",
        value: "плавный пуск, блокировка при отключении сети",
      },
      { label: "Рукоятка", value: "дополнительная, с виброгасением" },
    ],
    state: {
      resourcePercentRemaining: 82,
      resourceScaleLabel: "Ресурс инструмента",
      wearCaption: "18% износ — рез металл/плитка на объектах, без падений",
      completeness:
        "Ключ для диска, кожух, в работе только оригинальные диски среднего класса.",
      remarks: "Щётки не искрят, подшипники без гула.",
    },
  },

  {
    id: "pylesos",
    name: "Строительный пылесос L-класс, 1400 Вт",
    priceUah: 9_800,
    imageUrls: [],
    bookingMessage:
      "Здравствуйте! Хочу забронировать строительный пылесос L-класс из объявления.",
    characteristics: [
      { label: "Класс", value: "L (строительная пыль, штукатурка)" },
      { label: "Мощность", value: "1400 Вт" },
      { label: "Объём бака", value: "30 л" },
      { label: "Шланг", value: "3 м, антистатический" },
      { label: "Фильтр", value: "полуавтоматическая очистка (встряхивание)" },
    ],
    state: {
      resourcePercentRemaining: 80,
      resourceScaleLabel: "Ресурс инструмента",
      wearCaption:
        "20% износ — работал с шлифмашиной и перфоратором, всегда с мешком",
      completeness:
        "Мешок многоразовый, HEPA-кассета, насадки для пола и щели.",
      remarks: "Корпус без трещин, всасывание стабильное.",
    },
  },
  {
    id: "wagner-wall-sprayer-w450",
    name: "Wagner WallSprayer W 450 — електрична система розпилення фарби для внутрішніх робіт",
    priceUah: 4500,
    imageUrls: [
      fromPublic("images/tools/soap-dispenser-and-compressor.webp"),
      fromPublic("images/tools/characteristics.webp"),
      fromPublic("images/tools/a set of paintbrushes.webp"),
      fromPublic("images/tools/nameplate.webp"),
    ],
    bookingMessage:
      "Здравствуйте! Хочу забронировать Wagner WallSprayer W 450 из вашего каталога (мастер на пенсии).",
    characteristics: [
      { label: "Повна назва", value: "Wagner Wall Sprayer W 450" },
      { label: "Технологія", value: "HVLP (High Volume Low Pressure)" },
      { label: "Потужність", value: "460 Вт" },
      { label: "Продуктивність", value: "до 230 мл/хв (регулюється)" },
      { label: "Швидкість", value: "≈15 м² за 10 хв" },
      { label: "Обʼєм резервуара", value: "1,3 л" },
      { label: "Довжина повітряного шланга", value: "1,8 м" },
      { label: "Вага", value: "2 кг" },
      { label: "Максимальна вʼязкість", value: "3400 мПа·с" },
    ],
    state: {
      resourcePercentRemaining: 90,
      resourceScaleLabel: "Ресурс інструмента",
      wearCaption:
        "10% знос — для внутрішніх робіт, без падінь та перегріву (актуалізуйте під ваш реальний стан).",
      completeness:
        "Базовий блок (турбіна), насадка I-Spray з бачком 1,3 л, повітряний шланг, ремінь, заливна воронка, палка-мішалка, інструкція, набір запасних ущільнювачів.",
      remarks:
        "Під густі інтерʼєрні фарби. Для лаків/емалей може знадобитися додаткова насадка Wood & Metal.",
    },
  },
];

/** Название инструмента для ответа бота пользователю по аргументу /start (если id есть в каталоге). */
export function getToolDisplayNameForTelegramStartPayload(
  startPayload: string,
): string | undefined {
  return tools.find((t) => t.id === startPayload)?.name;
}

export const toolsTotalPriceUah = tools.reduce((sum, t) => sum + t.priceUah, 0);

/** Пакет «всё сразу» — ниже суммы по отдельности (грн) */
export const comboPriceUah = Math.round(toolsTotalPriceUah * 0.9);

export const comboGiftDescription =
  "набор расходников (сверла по бетону 6–10 мм, пару дисков по металлу) или большой чемодан для хранения инструмента";
