import { useEffect, useId, useRef, useState } from "react";
import { getOrderApiUrl } from "../utils/orderApi";
import styles from "./OrderModal.module.css";

type OrderModalProps = {
  open: boolean;
  toolName: string;
  onClose: () => void;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function OrderModal({ open, toolName, onClose }: OrderModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instrument, setInstrument] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    setName("");
    setPhone("");
    setInstrument(toolName);
    setSubmitState("idle");
    setErrorMessage("");
    const id = requestAnimationFrame(() => nameRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, toolName]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitState === "loading") {
      return;
    }
    setSubmitState("loading");
    setErrorMessage("");
    try {
      const res = await fetch(getOrderApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          toolName: instrument.trim(),
        }),
      });
      let data: { ok?: boolean; error?: string };
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        setSubmitState("error");
        setErrorMessage(
          "Сервер вернул не JSON (проверьте URL API или откройте сайт через dev-сервер).",
        );
        return;
      }
      if (!res.ok || !data.ok) {
        setSubmitState("error");
        setErrorMessage(data.error ?? "Не удалось отправить заявку");
        return;
      }
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setErrorMessage("Нет связи с сервером. Попробуйте позже или напишите в мессенджер.");
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            Заявка в Telegram
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        {submitState === "success" ? (
          <p className={styles.success}>
            Заявка отправлена. Скоро свяжемся по телефону или в мессенджере.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Имя</span>
              <input
                ref={nameRef}
                className={styles.input}
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Телефон</span>
              <input
                className={styles.input}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Инструмент</span>
              <input
                className={styles.input}
                name="toolName"
                required
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              />
            </label>
            {submitState === "error" && errorMessage ? (
              <p className={styles.error} role="alert">
                {errorMessage}
              </p>
            ) : null}
            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className={styles.btnSubmit} disabled={submitState === "loading"}>
                {submitState === "loading" ? "Отправка…" : "Отправить"}
              </button>
            </div>
          </form>
        )}

        {submitState === "success" ? (
          <div className={styles.actions}>
            <button type="button" className={styles.btnSubmit} onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
