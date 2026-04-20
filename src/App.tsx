import { useState } from "react";
import { Catalog } from "./components/Catalog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OrderModal } from "./components/OrderModal";
import styles from "./App.module.css";

export default function App() {
  // Состояние модального окна заявки: открыто ли и для какого инструмента.
  const [orderModal, setOrderModal] = useState<{ open: boolean; toolName: string }>({
    open: false,
    toolName: "",
  });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Catalog
          // Обработчик "открыть заявку": сохраняем выбранный инструмент и показываем модалку.
          onOpenOrder={(toolName) => setOrderModal({ open: true, toolName })}
        />
      </main>
      <Footer />
      <OrderModal
        open={orderModal.open}
        toolName={orderModal.toolName}
        // Обработчик закрытия модалки: прячем окно, но сохраняем последнее название инструмента.
        onClose={() => setOrderModal((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
