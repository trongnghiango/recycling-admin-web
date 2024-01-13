import React from "react";
import { NextPage } from "next";
import { UploadPage } from "components/pages/upload-page/UploadPage";
import UploadClinicPage from "@/components/pages/clinic-page/UploadClinicPage";
import {
  uploadAvatarRequest,
  uploadFileRequest,
} from "@/domains/upload/upload.services";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";
import { getUserFromCookies } from "@/utils/JWT";
import { decryptId } from "@/utils/aesUtil";

interface IProps {
  data: any;
}

const UploadRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const clinicCode = data["clinicCode"];
  const uploadFilesHandler = async (formData: FormData) => {
    if (!!clinicCode) {
      const response = await uploadAvatarRequest(
        clinicCode,
        formData,
        (event: any) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        }
      );
      if (!!response) {
        alert("O Ko con do");
      }
    }
  };

  return (
    <>
      <UploadClinicPage
        label={`logo_${clinicCode.toString()}`}
        uploadFileName="thePhoto"
        onChange={uploadFilesHandler}
      />
    </>
  );
};

UploadRoute.getInitialProps = async (context) => {
  const { query, req, res } = context;

  // check? client side rendering OR server side rendering
  const server = !!req ? { req, res } : undefined;
  const user = getUserFromCookies(server);

  if (!user || !query || !query["p"]) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }
  console.log("QUERY::", decryptId(query["p"].toString()));

  const clinicCode = decryptId(query["p"].toString());

  return {
    data: JSON.parse(JSON.stringify({ clinicCode })),
  };
};

// ts-prune-ignore-next
export default withSoftReload(UploadRoute);
