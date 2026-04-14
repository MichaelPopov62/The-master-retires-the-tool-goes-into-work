import { useEffect, useId, useRef, useState } from "react";
import { getOrderApiUrl } from "../utils/orderApi";
import { orderPayloadSchema, validateOrderPayload } from "../utils/orderValidation";
import styles from "./OrderModal.module.css";

type OrderModalProps = {
  open: boolean;
  toolName: string;
  onClose: () => void;
};

type SubmitState = "idle" | "loading" | "success" | "error";

type FieldKey = "name" | "phone" | "toolName";

export function OrderModal({ open, toolName, onClose }: OrderModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instrument, setInstrument] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    phone: false,
    toolName: false,
  });
  const [fieldError, setFieldError] = useState<Record<FieldKey, string>>({
    name: "",
    phone: "",
    toolName: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    setName("");
    setPhone("");
    setInstrument(toolName);
    setSubmitState("idle");
    setErrorMessage("");
    setTouched({ name: false, phone: false, toolName: false });
    setFieldError({ name: "", phone: "", toolName: "" });
    const id = requestAnimationFrame(() => nameRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, toolName]);

  async function validateField(
    next: { name: string; phone: string; toolName: string },
    key: FieldKey,
  ) {
    try {
      await orderPayloadSchema.validateAt(key, next);
      setFieldError((s) => ({ ...s, [key]: "" }));
    } catch (e) {
      if (e instanceof Error && e.name === "ValidationError") {
        setFieldError((s) => ({ ...s, [key]: e.message }));
        return;
      }
      setFieldError((s) => ({ ...s, [key]: "Некорректное значение" }));
    }
  }

  function inputClass(key: FieldKey): string {
    if (!touched[key]) {
      return styles.input;
    }
    if (fieldError[key]) {
      return `${styles.input} ${styles.inputBad}`;
    }
    return `${styles.input} ${styles.inputOk}`;
  }

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (submitState === "loading") {
      return;
    }
    setSubmitState("loading");
    setErrorMessage("");
    try {
      const payload = await validateOrderPayload({
        name,
        phone,
        toolName: instrument,
      });
      const res = await fetch(getOrderApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    } catch (e) {
      if (e instanceof Error && e.name === "ValidationError") {
        setSubmitState("error");
        setErrorMessage(e.message);
        return;
      }
      setSubmitState("error");
      setErrorMessage("Нет связи с сервером. Попробуйте позже или напишите в мессенджер.");
    }
  };

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
                className={inputClass("name")}
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  const v = e.target.value;
                  setName(v);
                  if (touched.name) {
                    void validateField({ name: v, phone, toolName: instrument }, "name");
                  }
                }}
                onBlur={() => {
                  setTouched((s) => ({ ...s, name: true }));
                  void validateField({ name, phone, toolName: instrument }, "name");
                }}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Телефон</span>
              <input
                className={inputClass("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => {
                  const v = e.target.value;
                  setPhone(v);
                  if (touched.phone) {
                    void validateField({ name, phone: v, toolName: instrument }, "phone");
                  }
                }}
                onBlur={() => {
                  setTouched((s) => ({ ...s, phone: true }));
                  void validateField({ name, phone, toolName: instrument }, "phone");
                }}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Инструмент</span>
              <input
                className={inputClass("toolName")}
                name="toolName"
                required
                value={instrument}
                onChange={(e) => {
                  const v = e.target.value;
                  setInstrument(v);
                  if (touched.toolName) {
                    void validateField({ name, phone, toolName: v }, "toolName");
                  }
                }}
                onBlur={() => {
                  setTouched((s) => ({ ...s, toolName: true }));
                  void validateField({ name, phone, toolName: instrument }, "toolName");
                }}
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
