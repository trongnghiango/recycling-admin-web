import React from "react";
// import './controlpanel.css';
import {
  TOGGLE_MANDIBULAR,
  TOGGLE_MAXILLARY,
  TOGGLE_SUPER,
  TOGGLE_UPPER,
} from "state/ActionTypes";
import { useStateValue } from "state/AppProvider";
import { StateActions } from "state/interfaces";

const style = {
  btnControl: `flex justify-center items-center border-[2px] p-[4px] my-[2px] rounded hover:border-[#a2a2a2]`,
};

export default function ControlPanel() {
  const { state, dispatch } = useStateValue();
  const { maxi, mand, isSuper, upperAction } = state.teeth;
  // console.log(maxi)

  const handleBtn = () => {
    // console.log('click')
  };
  const handleBtn2 = () => {
    // console.log('click')
    // dispatch({ type: actionTypes.SHOW_MANDIBULAR })
  };
  const maxiHandler = () =>
    dispatch({ type: TOGGLE_MAXILLARY, payload: { maxi: false } });

  const mandHandler = () =>
    dispatch({ type: TOGGLE_MANDIBULAR, payload: { mand: false } });
  // const handleHideSuper = () => dispatch({ type: actionTypes.HIDE_SUPER })

  const toggleSuperHandler = () => {
    dispatch({ type: TOGGLE_SUPER, payload: undefined });
    // console.log('isSuper ======')
  };

  const toggleHandler = () => dispatch({ type: TOGGLE_UPPER } as StateActions);

  const _super = (mand || maxi) && isSuper;
  // console.log('Upper::', upperAction)
  return (
    <div className="flex">
      <ul className="px-2 flex flex-col justify-center items-center border mx-2 z-50">
        <li className={style.btnControl}>
          <button
            className={`menuBtn menuBtn-super-${_super ? "show" : "hide"}`}
            onClick={toggleSuperHandler}
          ></button>
        </li>

        <li className={style.btnControl}>
          <button
            className={`menuBtn menuBtn-${_super ? "active" : "hide"}`}
            onClick={toggleHandler}
          ></button>
        </li>

        <li className={style.btnControl}>
          <button
            className={`btn maxillary-${maxi ? "show" : "hide"}`}
            onClick={maxiHandler}
          ></button>
        </li>

        <li className={style.btnControl}>
          <button
            className={`btn mandibular-${mand ? "show" : "hide"} w-full h-full`}
            onClick={mandHandler}
          ></button>
        </li>

        <li className={style.btnControl}>
          <button
            className={`btn btn-${mand ? "8" : "7"} w-full h-full`}
            onClick={mandHandler}
          ></button>
        </li>
        <li className={style.btnControl}>
          <button
            className={`btn mandibular-${mand ? "show" : "hide"} w-full h-full`}
            onClick={mandHandler}
          ></button>
        </li>
      </ul>
    </div>
  );
}
