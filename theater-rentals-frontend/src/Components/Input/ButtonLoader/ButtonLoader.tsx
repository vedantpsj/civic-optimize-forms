import React from "react";
import style from "./ButtonLoader.module.scss";

export default function ButtonLoader() {
  return (
    <div className={style.buttonLoader}>
      <span className={style.buttonLoader__dots}></span>
      <span className={style.buttonLoader__dots}></span>
      <span className={style.buttonLoader__dots}></span>
    </div>
  );
}
