/** URL serverless-функции заявки; при статике на другом хосте задайте полный URL в .env */
export function getOrderApiUrl(): string {
  const fromEnv = import.meta.env.VITE_ORDER_API_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }
  return "/api/order";
}
