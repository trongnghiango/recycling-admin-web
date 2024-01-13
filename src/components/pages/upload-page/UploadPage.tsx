import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Routes } from "@/constants/routes";
import { UiFileInputButton } from "components/ui/ui-file-input-button/UiFileInputButton";
import {
  deleteFileRequest,
  getListFiles,
  uploadFileRequest,
} from "../../../domains/upload/upload.services";
import Image from "next/image";
import { decryptId } from "utils/aesUtil";
import { splitNumberFromString } from "utils/utils";
import { useStateValue } from "@/state/AppProvider";
import { SET_LOADING } from "@/state/ActionTypes";

const s = {
  wrapper: `flex-1 flex flex-col mx-auto container`,
  title: `text-3xl p-4 text-center`,
  fileItem: `flex flex-col justify-center mx-8`,
  fileSmallItem: `px-4 m-2 rounded border-[2px] border-[#C19A30] flex items-center justify-between hover:scale-[1.01] hover:bg-[#C19A30] hover:cursor-pointer`,
  delButton: `my-2 w-[30px] h-[30px] rounded-full bg-gray-500 flex justify-center items-center hover:bg-white`,
};

interface IProps {
  p?: string;
}

export const UploadPage: React.FC<IProps> = ({ p }) => {
  const [user, setUser] = useState("phongbd");
  const [fileName, setFileName] = useState("Maxillary-1.stl");
  const [data, setData] = useState<any>();
  const { state, dispatch } = useStateValue();
  const { loading } = state;
  console.log(":::::::", { p });
  const userId = decryptId(p ?? "");

  const setLoading = (value: boolean) => {
    dispatch({
      type: SET_LOADING,
      payload: { loading: value },
    });
  };

  const uploadHandler = async (formData: FormData) => {
    if (!!userId) {
      setLoading(true);
      const response = await uploadFileRequest(
        userId,
        formData,
        (event: any) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        }
      );
      getFilesInfoHandler(userId);
      setLoading(false);
    }
  };

  const deleteHandler = async (userId: string, fileName: string) => {
    // console.log('Delete File::', {userId, fileName})

    const res = await deleteFileRequest(userId, fileName, (event: any) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    });
  };

  const getFilesInfoHandler = async (userId: string) => {
    const { data, error }: any = await getListFiles(userId, (event: any) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    });
    if (error)
      console.log(
        "[GetFilesInfo] [UploadPage] Response::",
        JSON.stringify(error)
      );

    // console.log("StepList:::", data);

    if (Array.isArray(data)) {
      let obj = {};
      for (const fname of data) {
        const file = decryptId(fname);
        if (!!file) {
          const [key] = splitNumberFromString(file) ?? ["0"];

          if (key) {
            const maxillary =
              file.includes(".obj") && file.includes("Maxillary")
                ? `/${file}`
                : undefined;
            const mandibular =
              file.includes(".obj") && file.includes("Mandibular")
                ? `/${file}`
                : undefined;

            if (maxillary) {
              obj = {
                ...obj,
                [key]: { ...obj[key], maxillary },
              };
            }

            if (mandibular) {
              obj = {
                ...obj,
                [key]: { ...obj[key], mandibular },
              };
            }
          }
        }
        if (Object.values(obj).length > 0) setData(obj);
      }
    }
  };

  const preDeleteHandler = (dat: any) => {
    const exist =
      dat.includes("Mandibular") | dat.includes("Maxillary")
        ? dat.replace(`./uploads/${user}/`, "")
        : undefined;
    deleteHandler(user, exist);
    if (userId) {
      getFilesInfoHandler(userId);
    }
  };

  useEffect(() => {
    if (userId) {
      getFilesInfoHandler(userId);
    }
  }, []);

  if (!userId) {
    return <></>;
  }

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Upload</h1>
      {/* <p>This is the Upload page</p> */}

      <div>
        <UiFileInputButton
          label="Upload Folder Files"
          uploadFileName="theFiles"
          onChange={uploadHandler}
          allowMultipleFiles={true}
        />
      </div>
      <div
        className={`p-4 mt-2 rounded border-[2px] border-red-700 flex items-center justify-center hover:scale-[1.01] hover:bg-red-700 hover:cursor-pointer`}
      >
        <button className={`flex items-center justify-between gap-4`}>
          <div className="relative h-4 w-4">
            <Image
              src={"/assets/icons/delete.svg"}
              layout="fill"
              alt={"deleteIcon"}
            />
          </div>
          <span className="flex items-center text-md font-semibold">
            All Delete
          </span>
        </button>
      </div>

      <div className="">
        <details className="group mt-2 p-4 rounded border-[2px] border-[#C19A30] flex items-center justify-between">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-lg font-semibold">
              {" "}
              Steps List ({!!data && <>{Object.keys(data).length - 1}</>})
            </span>
            <span className="transition group-open:rotate-180">
              <svg
                fill="none"
                height={24}
                shapeRendering="geometricPrecision"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                width={24}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
            {data &&
              Object.keys(data).map((key, index) => (
                <div key={index} className={s.fileItem}>
                  {Object.keys(data[key]).map((k, i) => (
                    <div key={i} className={s.fileSmallItem}>
                      <p>{data[key][k]}</p>

                      <button
                        className={s.delButton}
                        onClick={() => preDeleteHandler(data[key][k])}
                      >
                        <Image
                          src={"/assets/icons/delete.svg"}
                          height={10}
                          width={10}
                          alt={"deleteIcon"}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </details>
      </div>
    </div>
  );
};

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}

UploadPage.displayName = "UploadPage";
