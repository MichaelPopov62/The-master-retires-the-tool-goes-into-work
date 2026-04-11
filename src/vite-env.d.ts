/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "swiper/css";
declare module "swiper/css/pagination";
