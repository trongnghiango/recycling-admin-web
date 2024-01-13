import React from "react";
import style from "../../styles/header.module.scss";

type Props = {
  title?: string;
};

function Header({}: Props) {
  return <div className={style.wrapper}>Header</div>;
}

export default Header;
