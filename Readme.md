# Мастер уходит на пенсию — инструмент в работу

Лендинг-витрина **б/у инструмента**: каталог карточек, оформление заявки в Telegram, ссылки на WhatsApp. Фронтенд на **React + TypeScript + Vite**, цены в **гривнах (UAH)**.

## Стек

- **React 19**, **TypeScript**, **Vite 7**, **@vitejs/plugin-react**
- **CSS Modules**, глобальные переменные в `src/global.css`
- **Swiper** — слайдер фото в карточке (пагинация точками)
- **Vercel Serverless** — `api/order.ts` + **`api/orderHandler.ts`** (общая логика заявки)
- **Локальный dev** — в **`vite.config.ts`** middleware обрабатывает **`POST /api/order`** (тот же обработчик, что и на Vercel)

## Структура проекта

```text
├── api/
│   ├── order.ts          # обёртка Vercel → POST /api/order
│   └── orderHandler.ts   # валидация + Telegram Bot API (общий код с dev-middleware)
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
└── vite.config.ts        # base, loadEnv(.env), middleware POST /api/order в dev
```

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm install` | Установка зависимостей |
| `npm run dev` | Локальный dev-сервер Vite + **`POST /api/order`** (см. ниже) |
| `npm run server` | То же, что `dev` (алиас для привычной команды) |
| `npm run build` | `tsc` + production-сборка в `dist/` |
| `npm run preview` | Просмотр **`dist/`** без **`/api/order`** |
| `npm run deploy` | Сборка + публикация на **GitHub Pages** (`gh-pages`) |

## Переменные окружения

1. Скопируйте `.env.example` в **`.env`** (файл `.env` в git не коммитится).
2. Заполните для работы **`api/order.ts`**:

| Переменная | Где используется |
|------------|------------------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чата/канала, куда бот отправляет заявки |

На фронте в **`src/utils/toolsData.ts`** задайте **`CONTACT_TELEGRAM_BOT_BOOKING_URL`** (`https://t.me/<username>` бота).

Опционально:

| Переменная | Назначение |
|------------|------------|
| `VITE_ORDER_API_URL` | Полный URL к **`POST /api/order`**, если фронт и API на **разных** доменах (например GitHub Pages + Vercel) |

Секреты бота **не** должны иметь префикс **`VITE_`** — они только на сервере.

## Telegram: кнопка «Забронировать в Telegram» и заявка из модалки

### Прямая ссылка на бота (карточка)

- У каждого инструмента в каталоге есть **`id`** (короткий латинский slug: `perforator`, `laser-level` и т.д.) — поле в **`toolsData.ts`**, тип **`Tool`** в **`types.ts`**.
- **`buildTelegramBookingUrl(tool)`** собирает **`https://t.me/<бот>?start=<id>`**. Параметр **`start`** должен укладываться в правила Telegram (латиница, цифры, `_`, `-`).
- Параметр **`?text=`** в клиентах Telegram для **ботов** обычно **не подставляет** черновик в поле ввода, поэтому на сайте при клике текст **`telegramBookingDraftText(tool)`** («Здравствуйте! Бронь: …» с полным **`name`**) копируется в **буфер обмена** (`navigator.clipboard`).
- Под кнопкой — краткая подсказка: вставка в чат бота (**ctrl+v**), указать телефон и имя, время резерва 48 часов.
- Для ответа бота пользователю по аргументу **`/start`** можно сопоставить **`id`** с названием: **`getToolDisplayNameForTelegramStartPayload(payload)`** в **`toolsData.ts`** (логику дублируют в коде бота при необходимости).

### Форма «Заявка в Telegram» (модалка)

- **`OrderModal`** → **`POST`** на **`getOrderApiUrl()`** (`src/utils/orderApi.ts`): по умолчанию **`/api/order`**, или полный URL из **`VITE_ORDER_API_URL`**.
- Тело JSON: **`name`**, **`phone`**, **`toolName`**. Ответ: **`{ ok, error? }`**. Сервер шлёт сообщение в чат через **Telegram Bot API** (`sendMessage`, HTML с экранированием).

## Локальная разработка и сервер заявок

- **`npm run dev`** / **`npm run server`**: Vite поднимает SPA; **`vite.config.ts`** через **`loadEnv`** подхватывает **`.env`** (в т.ч. **`TELEGRAM_*` без префикса `VITE_`**) и регистрирует **middleware** на путь **`/api/order`** (**`OPTIONS`** + **`POST`**), вызывающий **`handleOrderPayload`** из **`api/orderHandler.ts`** — то же поведение, что у serverless **`api/order.ts`** на Vercel.
- Без заполненного **`.env`** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) форма вернёт ошибку настройки сервера.
- Альтернатива: **`vercel dev`** из корня репозитория.
- Если фронт открыт **не** с dev-сервера (например, открыли **`index.html`** с диска или только **`preview`**), **`fetch('/api/order')`** не сработает — используйте **`VITE_ORDER_API_URL`** на задеплоенный API или dev URL.
- **`npm run preview`**: статическая раздача **`dist/`** — эндпоинта **`/api/order`** нет.

## Деплой

### GitHub Pages (фронт)

В `vite.config.ts` задан **`base: "/the-master-retires-the-tool-goes-into-work/"`** под путь репозитория. При смене имени репозитория обновите `base`. Команда: **`npm run deploy`**.

Статический хостинг **не выполняет** serverless-функции — форма заявки на Pages без API не дойдёт до Telegram, пока не настроен **`VITE_ORDER_API_URL`** на живой URL **`/api/order`**.

### Vercel (фронт + API)

Подключите репозиторий к Vercel: папка **`api/`** станет функцией **`POST /api/order`**. В настройках проекта добавьте **`TELEGRAM_BOT_TOKEN`** и **`TELEGRAM_CHAT_ID`**. При необходимости задайте **`base: "/"`** в Vite для корня домена.

## Функциональность

- Шапка с текстом о завершении карьеры, каталог из **`toolsData`**, блок «Почему такая цена», комбо-предложение
- Карточка: H2, характеристики, блок состояния в рамке, **ResourceBar** (шкала остатка), **Swiper** с фото, цена в UAH, модалка заявки, WhatsApp и **«Забронировать в Telegram»** (deep link `?start=<id>`, копирование текста в буфер, подсказка под кнопкой)
- Футер с условиями сделки (осмотр, гарантия Б/У, локация, связь)

Подробные соглашения по валюте — **`docs/CURRENCY-TZ.md`**, по стилю кода и UX — **`.cursorrules`**.

## Ссылка (GitHub Pages)

<https://michaelpopov62.github.io/The-master-retires-the-tool-goes-into-work/>

## Автор

mik
