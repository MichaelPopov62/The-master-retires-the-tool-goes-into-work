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

const img = (seed: string, w = 800, h = 520) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

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
    id: "shurupovert",
    name: "Аккумуляторный ударный шуруповёрт 18 В",
    priceUah: 8_900,
    imageUrls: [img("tool-shur-1"), img("tool-shur-2"), img("tool-shur-3")],
    demoVideoUrl: "https://www.youtube.com/shorts/",
    bookingMessage:
      "Добрый день! Забронировать ударный шуруповёрт 18 В из каталога мастера.",
    characteristics: [
      {
        label: "Напряжение",
        value: "18 В (платформа аккумуляторов одного бренда)",
      },
      { label: "Крутящий момент", value: "до 60 Н·м" },
      { label: "Аккумуляторы", value: "2×5 А·ч Li-ion" },
      {
        label: "Особенности",
        value: "ударный режим, подсветка, реверс, 2 скорости",
      },
      { label: "Патрон", value: "1,5–13 мм, быстрозажимной" },
    ],
    state: {
      resourcePercentRemaining: 88,
      resourceScaleLabel: "Ресурс инструмента",
      wearCaption: "12% износ — монтаж мебели и перегородок, без перегруза",
      completeness: "Два АКБ, зарядное устройство, кейс, бита РН2.",
    },
  },
  {
    id: "bolgarka",
    name: "УШМ (болгарка) 125 мм, 1400 Вт",
    priceUah: 5_500,
    imageUrls: [img("tool-usm-1"), img("tool-usm-2"), img("tool-usm-3")],
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
    id: "laser-level",
    name: "Лазерный уровень 2×360° (линии + вертикаль)",
    priceUah: 7_200,
    imageUrls: [img("tool-las-1"), img("tool-las-2"), img("tool-las-3")],
    bookingMessage:
      "Добрый день! Забронировать лазерный уровень 2×360° из вашего каталога.",
    characteristics: [
      { label: "Лучи", value: "горизонталь 360°, вертикаль 360°" },
      { label: "Точность", value: "±2 мм на 10 м" },
      {
        label: "Компенсация",
        value: "автоматическая, с индикацией вне диапазона",
      },
      { label: "Крепление", value: 'магнитное основание, резьба 1/4"' },
      { label: "Питание", value: "Li-ion, зарядка USB-C" },
    ],
    state: {
      resourcePercentRemaining: 90,
      resourceScaleLabel: "Ресурс инструмента",
      wearCaption: "10% износ — в основном внутренняя отделка",
      completeness: "Прибор, штатив-мини, мишень, чехол.",
    },
  },
  {
    id: "pylesos",
    name: "Строительный пылесос L-класс, 1400 Вт",
    priceUah: 9_800,
    imageUrls: [img("tool-pyl-1"), img("tool-pyl-2"), img("tool-pyl-3")],
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
];

export const toolsTotalPriceUah = tools.reduce((sum, t) => sum + t.priceUah, 0);

/** Пакет «всё сразу» — ниже суммы по отдельности (грн) */
export const comboPriceUah = 39_900;

export const comboGiftDescription =
  "набор расходников (сверла по бетону 6–10 мм, пару дисков по металлу) или большой чемодан для хранения инструмента";
