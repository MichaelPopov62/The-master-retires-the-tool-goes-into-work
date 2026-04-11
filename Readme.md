# Мастер уходит на пенсию — инструмент в работу

Лендинг-витрина **б/у инструмента**: каталог карточек, оформление заявки в Telegram, ссылки на WhatsApp. Фронтенд на **React + TypeScript + Vite**, цены в **гривнах (UAH)**.

## Стек

- **React 19**, **TypeScript**, **Vite 7**, **@vitejs/plugin-react**
- **CSS Modules**, глобальные переменные в `src/global.css`
- **Swiper** — слайдер фото в карточке (пагинация точками)
- **Vercel Serverless** — `api/order.ts` (отправка заявки в Telegram Bot API)

## Структура проекта

```text
├── api/
│   └── order.ts          # POST /api/order → Telegram (Vercel)
├── docs/
│   └── CURRENCY-TZ.md    # ТЗ по валюте (UAH)
├── src/
│   ├── components/       # UI: Header, Catalog, ToolCard, Footer, OrderModal, ResourceBar
│   ├── utils/
│   │   ├── currency.json
│   │   ├── currencyMeta.ts
│   │   ├── formatCurrency.ts
│   │   ├── orderApi.ts   # URL заявки (/api/order или VITE_ORDER_API_URL)
│   │   └── toolsData.ts  # каталог инструментов, контакты
│   ├── App.tsx
│   ├── main.tsx
│   ├── global.css
│   ├── types.ts
│   └── vite-env.d.ts
├── .cursorrules          # правила для агента / команды
├── .env.example          # шаблон переменных окружения
└── vite.config.ts        # base для GitHub Pages
```

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm install` | Установка зависимостей |
| `npm run dev` | Локальный dev-сервер Vite |
| `npm run build` | `tsc` + production-сборка в `dist/` |
| `npm run preview` | Просмотр сборки |
| `npm run deploy` | Сборка + публикация на **GitHub Pages** (`gh-pages`) |

## Переменные окружения

1. Скопируйте `.env.example` в **`.env`** (файл `.env` в git не коммитится).
2. Заполните для работы **`api/order.ts`**:

| Переменная | Где используется |
|------------|------------------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чата/канала, куда бот отправляет заявки |

Опционально для фронта:

| Переменная | Назначение |
|------------|------------|
| `VITE_ORDER_API_URL` | Полный URL к API, если фронт и функции на **разных** доменах (например, статика на GitHub Pages, API на Vercel) |

Секреты бота **не** должны иметь префикс `VITE_` — они только на сервере.

## Локальная разработка

- **`npm run dev`** — только SPA. Эндпоинт **`/api/order`** в чистом Vite **не поднимается**.
- Чтобы тестировать заявки локально, используйте **[Vercel CLI](https://vercel.com/docs/cli)**: `vercel dev` из корня репозитория (подхватит `api/` и `.env`), либо деплой на Vercel и укажите `VITE_ORDER_API_URL` при отдельном хостинге фронта.

## Деплой

### GitHub Pages (фронт)

В `vite.config.ts` задан **`base: "/the-master-retires-the-tool-goes-into-work/"`** под путь репозитория. При смене имени репозитория обновите `base`. Команда: **`npm run deploy`**.

Статический хостинг **не выполняет** serverless-функции — форма заявки на Pages без API не дойдёт до Telegram, пока не настроен **`VITE_ORDER_API_URL`** на живой URL **`/api/order`**.

### Vercel (фронт + API)

Подключите репозиторий к Vercel: папка **`api/`** станет функцией **`POST /api/order`**. В настройках проекта добавьте **`TELEGRAM_BOT_TOKEN`** и **`TELEGRAM_CHAT_ID`**. При необходимости задайте **`base: "/"`** в Vite для корня домена.

## Функциональность

- Шапка с текстом о завершении карьеры, каталог из **`toolsData`**, блок «Почему такая цена», комбо-предложение
- Карточка: H2, характеристики, блок состояния в рамке, **ResourceBar** (шкала остатка), **Swiper** с фото, цена в UAH, модалка заявки, WhatsApp и «Поделиться в Telegram»
- Футер с условиями сделки (осмотр, гарантия Б/У, локация, связь)

Подробные соглашения по валюте — **`docs/CURRENCY-TZ.md`**, по стилю кода и UX — **`.cursorrules`**.

## Ссылка (GitHub Pages)

<https://michaelpopov62.github.io/The-master-retires-the-tool-goes-into-work/>

## Автор

mik
