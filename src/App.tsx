import { Catalog } from "./components/Catalog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Catalog />
      </main>
      <Footer />
    </div>
  );
}
