import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { getUserFromCookies } from "@/utils/JWT";
import { useAuth } from "@/auth-context/AuthContext";

const initTabs = [
  {
    id: "0",
    title: "Dashboard",
    active: true,
    route: "/",
  },
  {
    id: "1",
    title: "Patients",
    active: false,
    route: "/patients",
  },
  {
    id: "2",
    title: "Clinics",
    active: false,
    route: "/clinics",
  },
  {
    id: "3",
    title: "Doctors",
    active: false,
    route: "/doctors",
  },
  {
    id: "4",
    title: "Accounts",
    active: false,
    route: "/accounts",
  },
  {
    id: "5",
    title: "Support",
    active: false,
    route: "/support",
  },
  {
    id: "6",
    title: "Virtual Care",
    active: false,
    route: "/virtual-care",
  },
];
export const MHeader = () => {
  const [tabs, setTabs] = useState(initTabs);
  const [user, setUser] = useState<any>({});
  const router = useRouter();
  const { setLoading } = useAuth();

  const selectTabHandler = (selected_id: string) => {
    const temps = [...tabs];
    //temps[selected_id]?.active = true;
    temps.forEach((ite) => {
      ite.active = false;
      // if (ite.id === selected_id) {
      //   console.log(selected_id, ite.route);
      // }
    });
    setTabs(temps);
  };

  const logout = () => {
    deleteCookie("user");
    setLoading(true);
    window.location.pathname = "/login";
  };
  useEffect(() => {
    const res = getUserFromCookies();
    if (!!res && !!res.user) {
      setUser(res.user);
      // console.log(res.user.name);
    }
  }, []);
  return (
    <div className="bg-[#3D3935] text-[#575659]">
      <div className="relative">
        <div className="flex h-[74px] items-center px-4">
          {/* button menu for mobile */}
          <div className="absolute z-20 top-0 right-0 mr-4 translate-y-full transform-gpu lg:hidden">
            <button type="button" className="sideNavbarToggle text-white">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          {/*Logok*/}
          <div className="flex w-full items-center">
            <Link href={"/"} passHref>
              <button className="header-left relative z-50 h-[30px] w-[150px] cursor-pointer">
                <Image
                  src="/assets/images/logo1.png"
                  alt="logo"
                  layout="fill"
                  priority
                />
              </button>
            </Link>
          </div>
        </div>

        {/* navbar right   */}
        <div
          className={`
          navBarRight 
          absolute top-0 bottom-0 right-0 left-0 flex items-center justify-end`}
        >
          <div className="flex-end text-white pr-[60px]">
            <ul className="">
              <li className="dropdown">
                <a className="flex items-center gap-3 text-lg">
                  <span className="header-greeting-text text-2xl">Hello,</span>
                  <span className="doctorName font-semibold text-xl text-orange-500">
                    {user?.name}
                  </span>

                  <span className="header-profile-picture">
                    <button
                      className=" text-lightBlue-400 align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal shadow-lg outline-none focus:outline-none"
                      type="button"
                    >
                      <div className="relative h-10 w-10">
                        <Image
                          src="https://cdn.dribbble.com/users/2364329/screenshots/4759681/dribbble-11.jpg"
                          layout="fill"
                          className="rounded-full"
                        />
                      </div>
                    </button>
                  </span>

                  <button
                    className="px-4 py-1 rounded border border-red-500 hover:bg-red-400 hover:text-black"
                    onClick={logout}
                  >
                    Logout
                  </button>
                  <span className="header-drop-down-icon hidden"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* menu  */}
      <div className="container mx-auto flex flex-col justify-center">
        <ul className="flex h-full items-center gap-8 text-base font-bold text-[#9d9d9d]">
          {tabs.map((item, idx) => (
            <Link href={item.route ?? "/"} passHref key={idx}>
              <li
                className={`${
                  router.pathname === item.route ||
                  (router.pathname.includes(item.route) && item.route !== "/")
                    ? "item-menu-tab_active"
                    : ""
                } item-menu-tab h-full bg-red-300 py-4 leading-6`}
              >
                <a
                  onClick={() => selectTabHandler(item.id)}
                  className="h-full whitespace-nowrap"
                >
                  {item.title}
                </a>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};
