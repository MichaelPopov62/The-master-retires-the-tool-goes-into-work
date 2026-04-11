/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Повний URL до /api/order, якщо фронт і API на різних хостах */
  readonly VITE_ORDER_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "swiper/css";
declare module "swiper/css/pagination";
