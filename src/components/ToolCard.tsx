import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Tool } from "../types";
import { formatUah } from "../utils/formatCurrency";
import {
  buildTelegramBookingUrl,
  CONTACT_WHATSAPP_PHONE,
  telegramBookingDraftText,
} from "../utils/toolsData";
import { ResourceBar } from "./ResourceBar";
import styles from "./ToolCard.module.css";

type ToolCardProps = {
  tool: Tool;
  onOpenOrder: (toolName: string) => void;
};

function buildWhatsAppHref(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_WHATSAPP_PHONE}?text=${text}`;
}

/** Telegram для ботов не заполняет поле из URL — копируем текст заявки в буфер перед открытием чата. */
function copyTelegramBookingDraft(tool: Tool) {
  const line = telegramBookingDraftText(tool);
  void navigator.clipboard.writeText(line).catch(() => {
    /* нет прав или не HTTPS — ссылка всё равно откроется */
  });
}

export function ToolCard({ tool, onOpenOrder }: ToolCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{tool.name}</h2>

      <h3 className={styles.subheading}>Характеристики</h3>
      <ul className={styles.specs}>
        {tool.characteristics.map((row, index) => (
          <li key={`${row.label}-${index}`} className={styles.specRow}>
            <span className={styles.specLabel}>{row.label}</span>
            <span className={styles.specValue}>{row.value}</span>
          </li>
        ))}
      </ul>

      <div className={styles.stateFrame} aria-label="Состояние инструмента">
        <h3 className={styles.stateTitle}>Состояние инструмента</h3>
        <ResourceBar
          label={tool.state.resourceScaleLabel}
          percentRemaining={tool.state.resourcePercentRemaining}
          caption={tool.state.wearCaption}
        />
        <p className={styles.completeness}>
          <span className={styles.completenessLabel}>Комплектность:</span>{" "}
          {tool.state.completeness}
        </p>
        {tool.state.remarks ? (
          <p className={styles.remarks}>
            <span className={styles.remarksLabel}>Замечания:</span>{" "}
            {tool.state.remarks}
          </p>
        ) : null}
      </div>

      <div className={styles.gallery}>
        <Swiper
          className={styles.swiper}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
        >
          {tool.imageUrls.map((src, index) => (
            <SwiperSlide key={`${src}-${index}`} className={styles.slide}>
              <img
                src={src}
                alt={`${tool.name} — фото ${index + 1}`}
                loading="lazy"
                decoding="async"
                className={styles.photo}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <p className={styles.price}>
        Цена: <strong>{formatUah(tool.priceUah)}</strong>
      </p>

      {tool.demoVideoUrl ? (
        <p className={styles.video}>
          <a href={tool.demoVideoUrl} target="_blank" rel="noopener noreferrer">
            Короткое видео: включение и работа без искр
          </a>
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnOrder}
          onClick={() => onOpenOrder(tool.name)}
        >
          Заявка в Telegram (форма)
        </button>
        <a
          className={styles.btnPrimary}
          href={buildWhatsAppHref(tool.bookingMessage)}
        >
          Забронировать в WhatsApp
        </a>
        <div className={styles.telegramAction}>
          <a
            className={styles.btnSecondary}
            href={buildTelegramBookingUrl(tool)}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby={`telegram-book-hint-${tool.id}`}
            title="Текст заявки копируется в буфер обмена"
            onClick={() => copyTelegramBookingDraft(tool)}
          >
            Забронировать в Telegram
          </a>
          <p
            id={`telegram-book-hint-${tool.id}`}
            className={styles.telegramHint}
          >
            При бронировании на странице бота нажмите ctrl+v. Укажите свой
            телефон и имя. Время бронирования — 48 часов.
          </p>
        </div>
      </div>
    </article>
  );
}
