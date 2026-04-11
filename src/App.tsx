import { useState } from "react";
import { Catalog } from "./components/Catalog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { OrderModal } from "./components/OrderModal";
import styles from "./App.module.css";

export default function App() {
  const [orderModal, setOrderModal] = useState<{ open: boolean; toolName: string }>({
    open: false,
    toolName: "",
  });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Catalog
          onOpenOrder={(toolName) => setOrderModal({ open: true, toolName })}
        />
      </main>
      <Footer />
      <OrderModal
        open={orderModal.open}
        toolName={orderModal.toolName}
        onClose={() => setOrderModal((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
