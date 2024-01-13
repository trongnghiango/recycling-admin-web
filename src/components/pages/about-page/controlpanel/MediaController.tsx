import React, { useRef, useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useStateValue } from "state/AppProvider";
import { useInterval } from "react-use";

import { INC_STEP, SET_STEP, TOGGLE_PLAY } from "state/ActionTypes";
import playIcon from "assets/icons/play.svg";
import pauseIcon from "assets/icons/pause.svg";
import resetIcon from "assets/icons/reset.svg";
import prevIcon from "assets/icons/ic_previous_step.png";
import nextIcon from "assets/icons/ic_next_step.png";
import octagonImage from "assets/images/octagon.png";

import ContentLoader from "react-content-loader";
import { Slogan } from "components/pages/about-page/Slogan";
import Teardrop from "components/ui/teardrop/Teardrop";
import { useForm } from "react-hook-form";

const style = {
  wrapper: `relative w-full h-[70px] flex items-center justify-center shadow-[4px_4px_9px_4px_#3b71ca] transition duration-150 ease-in-out`,
  container: `container flex items-center justify-center w-full tablet:pr-[70px]`,
  leftSection: `flex items-center h-full justify-center`,
  leftViewControl: `flex-1 flex items-center justify-center px-4 gap-2 shadow-[4px_4px_9px_4px_#3b71ca] transition duration-150 ease-in-out`,
  leftControlMenu: `hidden mx-4 h-[30px] w-[30px] bg-green-300`, //unused
  centerViewChecker: `absolute bottom-[70px] px-4 tablet:relative tablet:bottom-0 flex w-full h-[70px] justify-start items-center`,
  contentChecker: `mx-auto flex w-full h-[70px] items-center gap-[1px] `,
  rightSection: `hidden items-center`,
};

export const PlayerSpeed = {
  "x0.5": 2000,
  "x0.7": 1500,
  x1: 1000,
  "x1.5": 500,
  x2: 250,
};
const MediaController = () => {
  const { state, dispatch } = useStateValue();
  const [speed, setSpeed] = useState(PlayerSpeed.x1);
  const { length, currentStep, isPlaying, stepsData, maxLength, manLength } =
    state.teeth;
  const refTimerId = useRef<NodeJS.Timer>(); //when using: .current
  const refLeftSection = useRef<any>();

  const isLoading = () => (state.loading ? true : false);

  useInterval(
    () => {
      // console.log("Timer::", new Date());
      if (length && currentStep < length) {
        dispatch({ type: SET_STEP, payload: { currentStep: currentStep + 1 } });
      }
    },
    isPlaying ? speed : null
  );

  /**
   * reset func
   */
  const resetStep = () => {
    if (isLoading()) return;
    clearTimer();
    dispatch({ type: SET_STEP, payload: { currentStep: 0 } });
  };

  /**
   * play func
   * @returns
   */
  const handlePlay = () => {
    if (isLoading()) return;
    if (length && currentStep >= length) {
      resetStep();
    }
    //chuyen trang thai play/pause: isPlaying
    if (!isPlaying) {
      dispatch({ type: TOGGLE_PLAY, payload: { isPlaying: true } });
      // playContinues();
    } else {
      dispatch({ type: TOGGLE_PLAY, payload: { isPlaying: false } });
    }
  };

  /**
   *
   * @returns ..
   */
  const handlePause = () => clearTimer();

  /**
   * clear timer
   */
  const clearTimer = () => {
    if (refTimerId.current) clearTimeout(refTimerId.current);
  };

  /**
   * func stop
   */
  const handleStop = () => {
    if (isLoading()) return;
    if (isPlaying) {
      //chuyen trang thai play/pause: isPlaying
      dispatch({ type: TOGGLE_PLAY, payload: { isPlaying: false } });
    }
    resetStep();
  };

  /**
   * func set step position for teeth
   * @param stepIndex : vi tri step
   */
  const setPositionStepHandler = (stepIndex: number) => {
    // console.log('touch')
    dispatch({ type: SET_STEP, payload: { currentStep: stepIndex } });
  };

  //check isPlaying
  // if (isPlaying) {
  //   if (length && currentStep < length) {
  //     playContinues();
  //   }
  // }

  const prevStepHandler = () => {
    if (isLoading()) return;
    if (currentStep > 0)
      dispatch({ type: SET_STEP, payload: { currentStep: currentStep - 1 } });
  };

  const nextStepHandler = () => {
    if (isLoading()) return;
    if (length && currentStep < length)
      dispatch({ type: SET_STEP, payload: { currentStep: currentStep + 1 } });
  };

  const isDisabled = () => (currentStep < 0 ? true : false);

  useEffect(() => {
    // if (refTimerId.current) console.log('currentStep::', currentStep, length, isPlaying);
    // if (currentStep === length) dispatch({ type: TOGGLE_PLAY } as StateActions)
    if (length && currentStep >= length) {
      dispatch({ type: TOGGLE_PLAY, payload: { isPlaying: false } });
    }
    // return () => { };
  }, [currentStep, dispatch, length]);

  return (
    <>
      <div
        className={style.wrapper}
        aria-disabled={isDisabled()}
        style={
          isDisabled()
            ? { pointerEvents: "none", opacity: 0.5 }
            : { pointerEvents: "auto", opacity: 1 }
        }
      >
        <div className={style.container}>
          <div className={style.leftSection}>
            <div className={style.leftControlMenu}></div>
            <div className={style.leftViewControl}>
              <button
                onClick={prevStepHandler}
                className="relative w-[16px] h-[16px] rounded-full opacity-75 hover:opacity-100"
              >
                <Image src={prevIcon} layout={"fill"} alt={"resetIcon"} />
              </button>

              <button
                onClick={handlePlay}
                onTouchEndCapture={() => console.log("move")}
                className="p-1 w-[50px] h-[50px] flex justify-center items-center rounded-full  opacity-75 hover:opacity-100"
              >
                {isPlaying ? (
                  <Image
                    src={pauseIcon}
                    height={"33px"}
                    width={"33px"}
                    alt={"pauseIcon"}
                  />
                ) : (
                  <Image
                    src={playIcon}
                    height={"33px"}
                    width={"33px"}
                    alt={"playIcon"}
                  />
                )}
              </button>
              <button
                onClick={nextStepHandler}
                className="relative w-[16px] h-[16px] rounded-full opacity-75 hover:opacity-100"
              >
                <Image src={nextIcon} layout={"fill"} alt={"resetIcon"} />
              </button>
            </div>
          </div>
          {stepsData && length && length > 3 ? (
            <div className={style.centerViewChecker}>
              <SpeedSelector
                list={Object.keys(PlayerSpeed)}
                onItemSelected={(item) => {
                  setSpeed(PlayerSpeed[item]);
                }}
              />
              <div className={style.contentChecker}>
                <div
                  className="flex flex-col justify-center mx-4 rounded-md"
                  // onClick={() => setSpeed(PlayerSpeed.X2)}
                >
                  <span className="font-extrabold text-black bg-blue-300 px-2 py-1 rounded-t-md">
                    U
                  </span>
                  <span className="font-extrabold text-black bg-red-200 px-2 py-1 rounded-b-md">
                    L
                  </span>
                </div>
                {length &&
                  Object.keys(stepsData).map((item, index) => {
                    const styleMax = `${
                      stepsData[item]["noMax"] === true
                        ? "bg-gray-500"
                        : currentStep >= index
                        ? "bg-red-500"
                        : "bg-blue-400"
                    } h-full max-h-[5px] w-full flex-1 max-w-[25px] rounded translate-y-[-4px]`;
                    const styleMan = `${
                      stepsData[item]["noMan"] === true
                        ? "bg-gray-500"
                        : currentStep >= index
                        ? "bg-green-500"
                        : "bg-blue-400"
                    } h-full max-h-[5px] w-full flex-1 max-w-[25px] rounded translate-y-[4px]`;

                    // console.log('Style:::', index, styleMan)
                    return (
                      <div
                        key={index}
                        className={`flex flex-col relative h-1/4 gap-2 flex-1 cursor-pointer border border-transparent hover:border-red-600 hover:h-1/3`}
                        // onTouchMoveCapture={() => setPositionStepHandler(index)}
                        onMouseUp={() => setPositionStepHandler(index)}
                      >
                        <div className="w-full h-full flex justify-center items-center">
                          <div className={styleMax} />
                        </div>
                        <div className="w-full h-full flex justify-center items-center">
                          <div className={styleMan} />
                        </div>
                        {index % 5 === 0 && (
                          <div className="hidden absolute w-full h-full top-0 mobile:flex justify-center items-center">
                            <span className={`text-white mt-[2px]`}>
                              {index}
                            </span>
                          </div>
                        )}

                        {currentStep === index && (
                          <div className="absolute -top-3/4 -bottom-3/4 border-[2px] -translate-x-1/2 left-1/2 w-full z-50 rounded border-orange-400">
                            {/* {currentStep} */}

                            <div
                              className={`absolute top-[-50px] left-1/2 -translate-x-1/2 min-w-full w-[40px] h-12 rounded-lg px-[-8px] flex justify-center items-center`}
                            >
                              <div>
                                <Teardrop content={currentStep} />
                              </div>
                              {/* <div className="relative h-full w-[40px] flex items-center">
                                  <Image
                                    src={'/assets/icons/ic_progress.png'}
                                    alt={'icon'}
                                    layout={'fill'}
                                  />
                                  <div className="absolute z-50 top-1/6 -translate-x-1/2 left-1/2 text-lg ">{currentStep}</div>
                                </div> */}
                            </div>
                            {/* <div
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 min-w-full w-[40px] h-10 rounded-lg bg-slate-700 px-[-8px] flex justify-center items-center`}
                        >
                        </div> */}
                          </div>
                        )}
                      </div>
                    );
                  })}
                {currentStep > -1 ? (
                  <div className="relative mx-2 h-[48px] w-[48px]">
                    <Image src={octagonImage} alt={"octagon"} layout={"fill"} />
                    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
                      <span className="text-xl">{length}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleStop}
                    className="ml-2 p-2 w-[35px] h-[35px] bg-slate-300 opacity-50 hover:opacity-75 rounded-full"
                  >
                    <Image
                      src={resetIcon}
                      height={"25px"}
                      width={"25px"}
                      alt={"resetIcon"}
                    />
                  </button>
                )}
              </div>
            </div>
          ) : undefined}
          {/* Right session */}
          <div className={style.rightSection}></div>
        </div>
      </div>
    </>
  );
};

function SpeedSelector({
  list,
  defaultItem,
  onItemSelected,
}: {
  list: any[];
  defaultItem?: any;
  onItemSelected: (item: string) => void;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      speed: defaultItem || "x1",
    },
  });
  const selectSpeedHandler = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedItem = e.target.value;
    console.log("Call api get doctors from clinicCode::", e.target.value);
    onItemSelected(selectedItem);
  };
  return (
    <>
      <div className={`relative flex items-center`}>
        <select
          {...register("speed")}
          className="arrowhidden__select flex items-center whitespace-nowrap rounded bg-clip-padding text-right dark:bg-neutral-700 px-3 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[4px_4px_9px_4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[4px_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 "
          onChange={selectSpeedHandler}
          defaultValue={"NNNN"}
        >
          {Array.isArray(list) &&
            list.map((item, idx) => (
              <option
                key={idx}
                value={item}
                className="block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
              >
                {item}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}

const MyLoader = (props: any) => (
  <ContentLoader
    speed={20}
    width={"80vw"}
    height={70}
    viewBox="0 0 400 70"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {/* <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />  */}
    {/* <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />  */}
    {/* <rect x="0" y="10" rx="3" ry="3" width="410" height="18" />  */}
    {/* <rect x="0" y="30" rx="3" ry="3" width="380" height="18" />  */}
    {/* <rect x="0" y="50" rx="3" ry="3" width="178" height="18" />  */}
    <circle cx="45" cy="35" r="15" />
    <circle cx="100" cy="35" r="25" />
    <circle cx="155" cy="35" r="15" />
  </ContentLoader>
);

export default MediaController;
