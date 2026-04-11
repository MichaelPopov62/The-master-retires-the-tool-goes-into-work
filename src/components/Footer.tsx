import {
  CONTACT_LOCATION,
  CONTACT_MESSENGERS_DISPLAY,
  CONTACT_PHONE_DISPLAY,
} from "../toolsData";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Условия сделки</h2>
        <p className={styles.note}>
          Чтобы потом не было недопонимания — коротко и по делу, как договариваемся на объекте.
        </p>
        <ul className={styles.list}>
          <li>
            <span className={styles.term}>Осмотр:</span> проверка на месте — подключим, включим, протестируем
            под вашими глазами.
          </li>
          <li>
            <span className={styles.term}>Гарантия:</span> инструмент категории Б/У. Проверка при покупке —
            финальный этап. После передачи денег и инструмента сделка считается закрытой, возврата нет.
          </li>
          <li>
            <span className={styles.term}>Локация:</span> {CONTACT_LOCATION}
          </li>
          <li>
            <span className={styles.term}>Связь:</span> {CONTACT_PHONE_DISPLAY} | {CONTACT_MESSENGERS_DISPLAY}
          </li>
        </ul>
        <p className={styles.copy}>Спасибо за внимание — пусть инструмент дальше работает, а не пылится.</p>
      </div>
    </footer>
  );
}
