import styles from "./KLoader.module.scss";
export default function KPLoader() {
  return (
    <>
      <div className={styles.kprogress}>
        <div className={styles.bar} role="bar">
          <div className={styles.peg}></div>
        </div>
        <div className={styles.spinner} role="spinner">
          <div className={styles.spinner_icon}></div>
        </div>
      </div>
      <div className="absolute h-full top-0 left-0 right-0 bottom-0 z-30 blur bg-green-100 opacity-50"></div>
    </>
  );
}
