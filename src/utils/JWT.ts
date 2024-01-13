import { decryptId, encryptId } from "./aesUtil";
import { setCookie, getCookie, getCookies } from "cookies-next";
import { len } from "./utils";

export function setUserToCookies(data: any, server?: { req: any; res: any }) {
  try {
    console.log(len(JSON.stringify(data)));
    const cryptUser = encryptId(JSON.stringify(data));
    console.log(len(cryptUser));
    setCookie("account", cryptUser, server);
  } catch (error: any) {
    console.log("ERROR::", error.message);
  }
}

export function getUserFromCookies(server?: { req: any; res: any }) {
  try {
    const ddd = getCookie("account", server);
    const dd = decryptId(ddd?.toString() ?? "{}");
    return JSON.parse(dd ?? "{}");
  } catch (error: any) {
    console.warn("ERROR::", error.message);
    return null;
  }
}
