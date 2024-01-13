import KPLoader from "@/components/ui/kloader/KLoader";
import { getMe } from "@/domains/auth/auth.services";
import { getUserFromCookies } from "@/utils/JWT";
import { deleteCookie } from "cookies-next";
// import { KPLoader } from "components/shared/layouts/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useStateValue } from "state/AppProvider";
import { AuthProvider, useAuth } from "./AuthContext";
interface IProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: IProps) => {
  // const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);

  const { loading, setLoading } = useAuth();

  /**
   * desc: user roles is admin?
   * @returns (boolean)
   */
  const checkAdmin = () => {
    //check accessToken -> null -> return fals
    if (!roles) return false;
    if (roles?.length <= 0) return false;

    // role user include ADMIN in Arr ROLES[] -> return true;
    const arr = roles?.map(({ code }: any, _idx) => code);
    // console.log({ arr });
    if (arr?.includes("ADMIN")) {
      return true; //check ok
    }
    return false;
  };

  useEffect(() => {
    (async function () {
      setLoading(true);

      const { data } = await getMe();
      if (!!data) {
        setRoles(data.roles);
        // console.log("Profiles::", data);
      } else if (!window.location.pathname.includes("/login")) {
        deleteCookie("account");
        window.location.pathname = "/login";
      } else {
        console.log("dang o trang login?? ");
      }
      setLoading(false);
    })();

    return () => {
      setLoading(false);
    };
  }, []);

  if (!!loading) {
    return (
      <>
        <KPLoader />
      </>
    );
  }

  if (!checkAdmin() && window.location.pathname !== "/login") {
    return (
      <>
        <KPLoader />
      </>
    );

    // return (
    //   <>
    //     <div className="h-screen flex flex-col justify-center items-center bg-red-400 gap-8">
    //       <h1 className="text-3xl font-bold">Truy cập dịch vụ bị từ chối!!!</h1>
    //       <Link
    //         href={{
    //           pathname: "/login",
    //         }}
    //         passHref
    //       >
    //         <a>
    //           <span className="border-2 border-red-400 text-gray-700 rounded py-2 px-4">
    //             Sign in
    //           </span>
    //         </a>
    //       </Link>
    //     </div>
    //   </>
    // );
  }

  // async function loadUserFromCookies() {
  //   setLoading(true);
  //   const user = await getUserFromCookies();
  //   if (user) {
  //     setUser(true);
  //     setRoles(user.user.roles);
  //   }
  //   setLoading(false);
  // }

  // loadUserFromCookies();

  return <>{children}</>;
};

export const ProtectRoute = ({ children }: IProps) => {
  // const { isAuthenticated, isLoading } = useAuth();
  // if (isLoading || (!isAuthenticated && window.location.pathname !== '/login')) {
  //   return (
  //     <>
  //       <h1>
  //         Loading...
  //       </h1>

  //     </>
  //   );
  // }
  return children;
};
