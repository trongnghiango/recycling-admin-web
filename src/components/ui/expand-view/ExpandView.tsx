import { useState } from "react";
import styles from "./expand.module.scss";

interface IExpandProps {
  children: React.ReactNode;
}
export default function ExpandView({ children }: IExpandProps) {
  const [check, setCheck] = useState(false);
  const [showDiv, setShowDiv] = useState(false);

  const mountedStyle = { animation: "inAnimation 250ms ease-in" };
  const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards",
  };

  return (
    <>
      <div className={styles["expand-container"]}>
        <label className="text-2xl font-bold py-3">Add new patient</label>
        <input
          type="checkbox"
          name="one"
          id="add-new-patient"
          onChange={(e) => {
            setCheck(e.target.checked);
          }}
          className="h-6 w-6"
        />

        {<div className={styles["viewhidden"]}>{children}</div>}
      </div>
    </>
  );
}
