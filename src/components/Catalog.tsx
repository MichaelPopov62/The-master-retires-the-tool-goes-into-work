import { formatUah } from "../utils/formatCurrency";
import {
  comboGiftDescription,
  comboPriceUah,
  tools,
  toolsTotalPriceUah,
} from "../utils/toolsData";
import { ToolCard } from "./ToolCard";
import styles from "./Catalog.module.css";

type CatalogProps = {
  onOpenOrder: (toolName: string) => void;
};

export function Catalog({ onOpenOrder }: CatalogProps) {
  const savings = toolsTotalPriceUah - comboPriceUah;

  return (
    <div className={styles.catalog}>
      <section className={styles.section} aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className={styles.heading}>
          Каталог инструмента
        </h2>
        <p className={styles.intro}>
          Всё из одних рук: перфоратор, шуруповёрт, болгарка, лазерный уровень и пылесос. Можно взять точечно или
          пакетом — ниже есть комбо.
        </p>

        <div className={styles.grid}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onOpenOrder={onOpenOrder} />
          ))}
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="why-price-heading">
        <h2 id="why-price-heading" className={styles.panelTitle}>
          Почему такая цена?
        </h2>
        <p className={styles.panelText}>
          Это не «маркетплейс с сюрпризом»: инструмент оригинальный, покупался в проверенных точках для своих
          работ. Регулярно чистил, смазывал, менял расходники вовремя — не гонял до «убитого» состояния. Цена
          отражает реальный остаток ресурса и комплект, а не «как договоримся на барахолке».
        </p>
      </section>

      <section className={styles.combo} aria-labelledby="combo-heading">
        <h2 id="combo-heading" className={styles.comboTitle}>
          Заберите всё сразу
        </h2>
        <p className={styles.comboLead}>
          <strong>{formatUah(comboPriceUah)}</strong> за весь набор вместо{" "}
          <span className={styles.comboStrike}>{formatUah(toolsTotalPriceUah)}</span> по отдельности.
        </p>
        <p className={styles.comboGift}>
          В подарок к пакету — {comboGiftDescription}. Экономия около{" "}
          <strong>{formatUah(Math.max(0, savings))}</strong> плюс меньше поездок и переписок.
        </p>
      </section>
    </div>
  );
}
