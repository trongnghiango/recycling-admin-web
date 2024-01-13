import leftArrowIcon from "assets/icons/doubleleftarrow.svg";
import rightArrowIcon from "assets/icons/doublerightarrow.svg";
import { useState } from "react";
import Image from "next/image";

function ArrowIcon() {
  return (
    <svg className="fill-current text-white">
      <g>
        <path d="M324.3,828.9" />
        <path d="M848.6,828.9" />
        <path d="M10,859.9" />
        <path d="M483.6,923.2L903.3,500L483.6,76.8l-2.5,2v162L738.3,500L481.1,759.2v161.5L483.6,923.2z" />
        <path d="M99.2,923.2L519.4,500L99.2,76.8l-2,2v162L353.9,500L97.2,759.2v161.5L99.2,923.2z" />
        <path d="M990,859.9" />
      </g>
    </svg>
  );
}

export function InfoTable() {
  const [showTable, setShowTable] = useState<boolean>(false);
  return (
    <div className="hidden tablet:flex info__table bottom-12 md:bottom-0 left-2 p-4 flex-col gap-2 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[4px_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
      <button
        className={`py-2 px-4 flex justify-between items-center border border-[#00B8DE] text-[#00B8DE] rounded hover:text-white hover:bg-[#00B8DE] leading text-[14px]`}
      >
        Show Movement Table
        {showTable ? (
          <Image
            src={leftArrowIcon}
            height={"20px"}
            width={"25px"}
            alt={"pauseIcon"}
            className={`text-[#00B8DE]`}
          />
        ) : (
          <Image
            src={rightArrowIcon}
            height={"20px"}
            width={"25px"}
            alt={"playIcon"}
          />
        )}
      </button>
      <div className="grid grid-cols-3 gap-2 min-w-[220px] text-[16px] text-white tracking-wider">
        <>
          <div className="col-start-1 col-span-2">Extrusion/Instrusion</div>
          <span className="col-start-3 col-span-1 text-right ">0.00mm</span>
        </>
        <>
          <div className="col-start-1 col-span-2">Translation, B/L</div>
          <span className="col-start-3 col-span-1 text-right">0.00mm</span>
        </>

        <>
          <div className="col-start-1 col-span-2">Translation, M/D</div>
          <span className="col-start-3 col-span-1 text-right">0.00mm</span>
        </>
        <>
          <div className="col-start-1 col-span-2">Rotation</div>
          <span className="col-start-3 col-span-1 text-right tracking-widest">
            0.00°
          </span>
        </>
        <>
          <div className="col-start-1 col-span-2">Angulation</div>
          <span className="col-start-3 col-span-1 text-right tracking-widest">
            0.00°
          </span>
        </>
        <>
          <div className="col-start-1 col-span-2">Torque</div>
          <span className="col-start-3 col-span-1 text-right tracking-widest">
            0.00°
          </span>
        </>
      </div>
    </div>
  );
}
