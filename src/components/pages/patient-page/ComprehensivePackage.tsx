import { Routes, RoutesDynamicKey } from "constants/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import copy from "copy-to-clipboard";

interface IProps {
  patientId: string;
  clinicCode: string;
  patientName?: string;
}

export default function ComprehensivePackage({
  patientId,
  clinicCode,
  patientName,
}: IProps) {
  const { asPath } = useRouter();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const URL = `${origin}${asPath}`;
  // console.log("url", origin);
  return (
    <>
      <div className="relative flex flex-col mobile:flex-row border-[1.3px] border-black gap-3 bg-white p-4 shadow mobile:justify-between">
        <h2 className="text-2xl font-bold">Comprehensive Package</h2>

        <div className="flex items-center gap-2 justify-end">
          <Link
            href={{
              pathname: Routes.Player,
              query: { p: patientId, cln: clinicCode, pname: patientName },
            }}
            passHref
          >
            <a target={"_blank"}>
              <span className="border-2 border-red-400 text-gray-700 rounded py-2 px-4">
                Watch
              </span>
            </a>
          </Link>

          <button
            onClick={() => {
              console.log("HI", `${origin}${Routes.Player}?p=${patientId}`);
              // Copy with options
              copy(
                `${origin}${
                  Routes.Player
                }?p=${patientId}&cln=${clinicCode}&pname=${encodeURIComponent(
                  patientName ?? ""
                )}`,
                {
                  debug: true,
                  message: "Press #{key} to copy",
                }
              );
            }}
          >
            <span className="border-2 border-blue-400 text-gray-700 rounded py-2 px-4">
              Copy Link
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
