import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <p className={styles.tag}>Распродажа личного инструмента</p>
        <h1 className={styles.title}>Мастер завершает карьеру — инструмент ищет нового хозяина</h1>
        <p className={styles.lead}>
          Более тридцати лет в отделке и мелком ремонте. Всё покупалось для своих объектов, обслуживалось
          вовремя. Продаю без суеты: смотрите фото, спрашивайте — покажу включение и работу на месте.
        </p>
      </div>
    </header>
  );
}
