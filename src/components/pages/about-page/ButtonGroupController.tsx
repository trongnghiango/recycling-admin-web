import { FC, useState } from "react";
import { TOGGLE_SUPER } from "state/ActionTypes";
import { useStateValue } from "state/AppProvider";
import { SuperButton } from "./button";
export type ISType = { active: boolean } | undefined;

interface Props {
  front: ISType;
  up: ISType;
  left: ISType;
  right: ISType;
  down: ISType;
  behind: ISType;
  upper: ISType;
  lower: ISType;
  onUpRotate: () => void;
  onLeftRotate: () => void;
  onRightRotate: () => void;
  onDownRotate: () => void;
  onFrontRotate: () => void;
  onBehindRotate: () => void;
  onUpperShow: () => void;
  onLowerShow: () => void;
  onSuper?: () => void;
}

const style = {
  btnControl: `flex justify-center items-center p-[4px] my-[2px] rounded hover:border-[#a2a2a2]`,
};

export const ButtonGroupController: FC<Props> = ({
  front,
  up,
  left,
  right,
  down,
  behind,
  upper,
  lower,
  onUpRotate,
  onLeftRotate,
  onRightRotate,
  onDownRotate,
  onFrontRotate,
  onBehindRotate,
  onUpperShow,
  onLowerShow,
}) => {
  console;
  const [sw, setSw] = useState<boolean>(false);
  const { state, dispatch } = useStateValue();
  const toggleSuperHandler = () => {
    dispatch({ type: TOGGLE_SUPER, payload: undefined });
  };

  const { isSuper } = state.teeth;
  const _super = (upper || lower) && isSuper;
  return (
    <>
      <div
        className={`absolute top-0 right-0 z-40 flex ${
          sw ? "justify-end" : "justify-center w-full"
        }`}
      >
        {sw ? (
          <div className="">
            <div className="grid grid-cols-3 gap-1 mr-[16px] md:mr-[50px]">
              <div className="col-start-1 col-span-1">
                <div className={style.btnControl}>
                  <button
                    className={`menuBtn menuBtn-super-${
                      isSuper ? "show" : "hide"
                    }`}
                    onClick={toggleSuperHandler}
                  ></button>
                </div>
              </div>
              <div className="col-start-2 col-span-1">
                <ButtonCtl
                  type={up}
                  name={getVariableName({ up })}
                  onClick={onUpRotate}
                />
              </div>
              <div className="col-start-3 col-span-1">
                <SuperButton
                  onClick={() => {
                    setSw(!sw);
                  }}
                />
              </div>

              <div className="col-span-1 col-start-1">
                {/* <button className='hover:scale-105 menuBtn menuBtn-super-' onClick={() => setLeft(true)}></button> */}
                <ButtonCtl
                  type={left}
                  name={getVariableName({ left })}
                  onClick={onLeftRotate}
                />
              </div>
              <div className="col-span-1 col-start-2">
                {/* <button className='text-red-500 menuBtn menuBtn-super-' onClick={() => setFront(true)}></button> */}
                <ButtonCtl
                  type={front}
                  name={getVariableName({ front })}
                  onClick={onFrontRotate}
                />
              </div>
              <div className="col-span-1 col-start-3">
                <ButtonCtl
                  type={right}
                  name={getVariableName({ right })}
                  onClick={onRightRotate}
                />
              </div>
              <div className="col-span-1 col-start-1">
                {/* <button className={`btn btn-upper${upper ? '' : '_active'}`} onClick={onUpperShow}></button> */}
                <ButtonCtl
                  type={upper}
                  name={getVariableName({ upper })}
                  onClick={onUpperShow}
                />
              </div>
              <div className="col-span-1 col-start-2">
                <ButtonCtl
                  type={behind}
                  name={getVariableName({ behind })}
                  onClick={onBehindRotate}
                />
              </div>
              <div className="col-span-1 col-start-3">
                {/* <button className={`btn btn-lower${lower ? '' : '_active'}`} onClick={onLowerShow}></button> */}
                <ButtonCtl
                  type={lower}
                  name={getVariableName({ lower })}
                  onClick={onLowerShow}
                />
              </div>

              <div className="col-span-1 col-start-2">
                <ButtonCtl
                  type={down}
                  name={getVariableName({ down })}
                  onClick={onDownRotate}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-[18px] md:gap-[32px]">
            <ButtonCtl
              type={left}
              name={getVariableName({ left })}
              label="Left"
              onClick={onLeftRotate}
            />
            <ButtonCtl
              type={right}
              name={getVariableName({ right })}
              label="Right"
              onClick={onRightRotate}
            />
            <ButtonCtl
              type={upper}
              name={getVariableName({ upper })}
              label="Upper"
              onClick={onUpperShow}
            />
            <ButtonCtl
              type={lower}
              name={getVariableName({ lower })}
              label="Lower"
              onClick={onLowerShow}
            />

            <ButtonCtl
              type={front}
              name={getVariableName({ front })}
              label="Front"
              onClick={onFrontRotate}
            />
            <ButtonCtl
              type={behind}
              name={getVariableName({ behind })}
              label="Behind"
              onClick={onBehindRotate}
            />
            <ButtonCtl
              type={up}
              name={getVariableName({ up })}
              label="Up"
              onClick={onUpRotate}
            />
            <ButtonCtl
              type={down}
              name={getVariableName({ down })}
              label="Down"
              onClick={onDownRotate}
            />

            <SuperButton
              label="Switch"
              onClick={() => {
                setSw(!sw);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const ButtonCtl = ({
  type,
  name,
  label,
  onClick,
}: {
  type?: ISType;
  name: string;
  label?: string;
  onClick: () => void;
}) => {
  return (
    <button className="py-1" onClick={onClick}>
      <div
        className={`relative text-gray-400 hover:text-[#00a2d8] btn btn-${name}${
          type ? "_active text-[#00a2d8]" : ""
        } h-full w-full`}
      >
        {label && (
          <span className="absolute bottom-0 text-sm left-1/2 font-light translate-y-full -translate-x-1/2">
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

function getVariableName(unknownVariable: any): string {
  return Object.keys(unknownVariable)[0];
}
