import currencyJson from "./currency.json";

/**
 * ТЗ — валюта:
 * Базовая валюта расчёта — гривна (UA).
 * Расчёты производятся исключительно в национальной валюте (UAH).
 * В интерфейсе пользователю — итоговая цифра и символ ₴ рядом с числом.
 */
export type CurrencyConfig = {
  currency: "UAH";
  currencySymbol: string;
  allCalculationsInUah: boolean;
  displayLocale: string;
};

export const CURRENCY_CONFIG = currencyJson as CurrencyConfig;

/** Явная отметка в коде: все расчёты сумм — в гривнах (см. currency.json → allCalculationsInUah) */
export const ALL_CALCULATIONS_IN_UAH: boolean = CURRENCY_CONFIG.allCalculationsInUah === true;

