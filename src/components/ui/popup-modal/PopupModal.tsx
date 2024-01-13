import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";
import Teardrop from "../teardrop/Teardrop";

interface IProp {
  show: boolean;
  setCancel?: () => void;
  children?: ReactNode;
}
export default function PopupModal({ show, setCancel, children }: IProp) {
  return (
    <>
      {/* {<div className="">
                <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                    
                >
                    Vertically centered modal
                </button>
            </div>} */}
      <div
        className={`modal fade z-50 fixed top-0 left-0 right-0 ${
          show ? "flex" : "hidden"
        } w-full h-full`}
        id="exampleModalCenter"
        tabIndex={-1}
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="relative flex w-full h-full jutify-center items-center  outline-none overflow-x-hidden overflow-y-auto">
          {children}
          <div className="absolute h-full top-0 left-0 right-0 bottom-0 z-30 blur bg-green-100 opacity-50"></div>
        </div>
      </div>
    </>
  );
}
