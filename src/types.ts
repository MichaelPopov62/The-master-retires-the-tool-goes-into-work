/** Одна строка характеристики в списке на карточке */
export interface ToolCharacteristic {
  label: string;
  value: string;
}

/** Состояние Б/У: шкала ресурса и текстовые поля */
export interface ToolState {
  /** Остаток ресурса в % (100 − износ); при износе 10–20% здесь 80–90 */
  resourcePercentRemaining: number;
  /** Подпись к шкале, например «Ресурс инструмента» */
  resourceScaleLabel: string;
  /** Пояснение к износу (почти новый, рабочее и т.д.) */
  wearCaption: string;
  /** Комплектность: что входит в комплект */
  completeness: string;
  /** Замечания по внешнему виду или эксплуатации */
  remarks?: string;
}

export interface Tool {
  /**
   * Короткий латинский slug для deep link `t.me/<бот>?start=<id>` (A–Z, a–z, 0–9, `_`, `-`, до 64 символов).
   * Тот же id бот использует в `/start`, чтобы показать человеку полное название из `name`.
   */
  id: string;
  name: string;
  /** Цена в гривнах (UAH) */
  priceUah: number;
  characteristics: ToolCharacteristic[];
  state: ToolState;
  /** URL изображений для слайдера Swiper */
  imageUrls: string[];
  /** Ссылка на короткое видео-демо (опционально) */
  demoVideoUrl?: string;
  /** Текст для кнопки «забронировать» в мессенджерах */
  bookingMessage: string;
}
