import React, { useState } from "react";
import Link from "next/link";
import { IUser } from "state/interfaces/user.interface";
import { Routes, RoutesDynamicKey } from "constants/routes";
import Image from "next/image";
import { APP_STATE_NAME, useStateValue } from "state/AppProvider";
import { LOGIN } from "state/ActionTypes";
import { encryptId, getUrl } from "utils/aesUtil";

interface IProps {
  user: IUser;
}

export const UserItem: React.FC<IProps> = ({ user }) => {
  const [hover, setHover] = useState(false);
  const { state, dispatch } = useStateValue();
  const handler = () => {
    dispatch({ type: LOGIN, payload: user });
  };

  const renderHandler = () => {
    localStorage.setItem(APP_STATE_NAME, JSON.stringify(state));
    console.log("click");
  };

  const selectedPatientHandler = (e: any) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <li
      className={`
      text-white bg-black px-4 py-2 hover:border-white border-[2px] border-gray-300 hover:scale-[1.02] transition-transform hover:shadow-2xl rounded-lg flex-1 cursor-pointer
      `}
      onClick={selectedPatientHandler}
    >
      <div className="relative flex flex-col gap-y-4">
        <div className="flex gap-4 items-center">
          <Image
            src={"/assets/images/image_01.svg"}
            height={35}
            width={35}
            alt="image"
          />
          <span className="flex-1 text-3xl">{user.name}</span>
        </div>
        <div className="">{JSON.stringify(user)}</div>
        <p className="font-normal">
          {user.created ? user.created : "ngay tao"}
        </p>

        <button
          className="absolute bottom-2 right-2 text-[#C19A30] shadow-2xl z-100 transition-transform hover:scale-110"
          onClick={renderHandler}
        >
          <Link
            href={{
              pathname: Routes.Player,
              query: { name: user.name, p: encryptId(user.userId) },
            }}
          >
            <a onClick={handler} className="">
              Render
            </a>
          </Link>
        </button>
      </div>
    </li>
  );
};

UserItem.displayName = "UserItem";
