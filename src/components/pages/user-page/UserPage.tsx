import Image from "next/image";
import React from "react";
import { IUser } from "state/interfaces/user.interface";
import { UserItem } from "./ListUsers";

interface IProps {
  users: IUser[];
}

export const UserPage: React.FC<IProps> = ({ users }) => {
  return (
    <>
      <section className="flex flex-col mx-4 gap-8">
        {/* <div className='search flex items-center gap-4'>
          <div className='input__search flex-1 h-[70px] border'>
            <Image src={'/assets/icons/list.svg'} height={20} width={20} alt={'image'} color={'white'} />
          </div>
          <div className='right-control '>
            <button className='text-2xl bg-blue-400 p-4 cursor-pointer'>Add New Patient</button>
          </div>
        </div> */}

        <div className="list-patients">
          <h3 className="text-3xl mb-4">Danh sách bệnh nhân</h3>
          <ul className="flex items-center flex-wrap gap-[16px] mx-auto flex-1">
            {Array.isArray(users) &&
              users.map((user: any, i: number) => (
                <UserItem key={i} user={user} />
              ))}
          </ul>
        </div>
      </section>
    </>
  );
};
