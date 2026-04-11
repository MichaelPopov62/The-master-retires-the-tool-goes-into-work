import styles from "./ResourceBar.module.css";

type ResourceBarProps = {
  label: string;
  percentRemaining: number;
  caption: string;
};

/** Визуальная шкала остатка ресурса (анти-износ) */
export function ResourceBar({ label, percentRemaining, caption }: ResourceBarProps) {
  const clamped = Math.min(100, Math.max(0, percentRemaining));

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.percent}>{clamped}% остаток</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
