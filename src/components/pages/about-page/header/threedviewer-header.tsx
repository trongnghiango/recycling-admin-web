/* eslint-disable @next/next/no-img-element */
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useStateValue } from "state/AppProvider";
import {
  INC_STEP,
  SET_STEP,
  TOGGLE_PLAY,
  UPDATE_CLINIC_CODE,
} from "state/ActionTypes";
import { StateActions } from "state/interfaces";
const playIcon = "/assets/icons/play.svg";
const pauseIcon = "/assets/icons/pause.svg";
const resetIcon = "/assets/icons/reset.svg";

const style = {
  wrapper: ``,

  rightSection: `hidden mobile:flex items-center justify-end gap-3 py-2`,
  rightButton: `flex items-center justify-center h-[36px] px-5 border border-[#00B8DE] text-[#00B8DE] rounded hover:text-white hover:bg-[#00B8DE]`,
};

const ThreeDViewerHeader = () => {
  const { state, dispatch } = useStateValue();
  const { length, currentStep, isPlaying, stepsData, clinicCode } = state.teeth;
  const path = `/assets/images/logo_${clinicCode}.png`;
  // console.log("LOGO path::", path);
  if (!!!clinicCode) {
    // dispatch({
    //   type: UPDATE_CLINIC_CODE,
    //   payload: {clinicCode: '010'}
    // })
  }
  return (
    <div className="w-full min-h-[70px] flex items-center justify-content mobile:justify-between container mx-auto">
      <div
        className={`relative h-[60px] w-auto hover:scale-105 cursor-pointer`}
      >
        <img
          src={path}
          // height={35}
          // width={150}
          // logo ty le 1hx3w
          alt={"LOGO"}
          // layout={"fill"}
          className={`w-full h-full`}
          onError={(event: any) => {
            event.target.src = "/assets/images/logo1.png";
            event.onerror = null;
          }}
        />
      </div>

      {/* <div className={'image-container'}>
      </div> */}
      {/* <Image src={path} layout="fill" className={'image'} /> */}

      <div className={style.rightSection}>
        <div className={style.rightButton}>Treatment</div>
        <button className={style.rightButton}>Staging</button>
      </div>

      {/* <Image src={'/assets/images/viewZY.png'} height={35} width={120} alt='image' /> */}
    </div>
  );
};

export default ThreeDViewerHeader;
