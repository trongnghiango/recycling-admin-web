import styles from "./Teardrop.module.scss";

interface IProps {
  content?: any;
}

export default function Teardrop({ content = "0" }: IProps) {
  return (
    <>
      <div className={styles.teardrop}>
        <div className={styles.teardrop__content}>{content}</div>
      </div>
    </>
  );
}
