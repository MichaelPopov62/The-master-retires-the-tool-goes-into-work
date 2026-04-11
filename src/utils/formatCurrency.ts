import { ALL_CALCULATIONS_IN_UAH, CURRENCY_CONFIG } from "./currencyMeta";

if (!ALL_CALCULATIONS_IN_UAH) {
  throw new Error(
    "Ожидались расчёты только в UAH (проверьте src/utils/currency.json → allCalculationsInUah).",
  );
}

/**
 * Отображение суммы в интерфейсе: отформатированное число + символ валюты (₴).
 * Без style: "currency" в Intl — только цифра и знак, как в ТЗ.
 */
export function formatUah(value: number): string {
  const formatted = new Intl.NumberFormat(CURRENCY_CONFIG.displayLocale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
  return `${formatted}\u00A0${CURRENCY_CONFIG.currencySymbol}`;
}
