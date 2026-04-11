import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Tool } from "../types";
import { formatUah } from "../utils/formatCurrency";
import { CONTACT_WHATSAPP_PHONE } from "../utils/toolsData";
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

function buildTelegramShareHref(message: string) {
  const text = encodeURIComponent(message);
  return `https://t.me/share/url?url=&text=${text}`;
}

export function ToolCard({ tool, onOpenOrder }: ToolCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{tool.name}</h2>

      <h3 className={styles.subheading}>Характеристики</h3>
      <ul className={styles.specs}>
        {tool.characteristics.map((row) => (
          <li key={row.label} className={styles.specRow}>
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
          <span className={styles.completenessLabel}>Комплектность:</span> {tool.state.completeness}
        </p>
        {tool.state.remarks ? (
          <p className={styles.remarks}>
            <span className={styles.remarksLabel}>Замечания:</span> {tool.state.remarks}
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
            <SwiperSlide key={src} className={styles.slide}>
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
        <a className={styles.btnPrimary} href={buildWhatsAppHref(tool.bookingMessage)}>
          Забронировать в WhatsApp
        </a>
        <a className={styles.btnSecondary} href={buildTelegramShareHref(tool.bookingMessage)}>
          Забронировать в Telegram
        </a>
      </div>
    </article>
  );
}
