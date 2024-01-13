import React, { Suspense, useEffect } from "react";
import { MainLayout } from "../../components/shared/main-layout/MainLayout";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
const PlayerPage = dynamic(
  () => import("../../components/pages/player-page/PlayerPage"),
  {
    suspense: true,
  }
);
import {
  getInitDataFromGit,
  syncDataFromGithubV2,
} from "@/utils/getDataFromGit";
import { decryptId, encryptTest, _base64ToArrayBuffer } from "@/utils/aesUtil";
import { Slogan } from "@/components/pages/about-page/Slogan";
import { useStateValue } from "@/state/AppProvider";
import PopupModal from "../../components/ui/popup-modal/PopupModal";
import { UPDATE_CLINIC_CODE } from "@/state/ActionTypes";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";
import { getListFiles } from "@/domains/upload/upload.services";

interface IProps {
  data: any;
  link?: string;
}

const PlayerRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const { stepsname, patientName, userId, clinicCode, isOk } = data["result"];
  const { state, dispatch } = useStateValue();

  // console.log("clinic::", { stepsname, patientName, userId, clinicCode, isOk });

  useEffect(() => {
    if (!!clinicCode) {
      // console.log("DDDDDDDDDD:::", clinicCode);
      dispatch({
        type: UPDATE_CLINIC_CODE,
        payload: { clinicCode: clinicCode },
      });
    }
  }, [clinicCode]);

  return (
    <MainLayout title={patientName} pageType="render">
      {!!stepsname && userId && clinicCode ? (
        <Suspense fallback={null}>
          <PlayerPage ldata={stepsname} userId={userId} />
        </Suspense>
      ) : (
        <>
          <div className="w-full h-full flex items-center justify-center">
            <Slogan />
            <p>CONNECTION ERROR!!!</p>
          </div>
        </>
      )}
    </MainLayout>
  );
};

PlayerRoute.getInitialProps = async (context) => {
  const { query, req, res } = context;

  // check? client side rendering OR server side rendering
  const server = !!req ? { req, res } : undefined;
  console.log("QUERY::", query);

  let userId: string | undefined;
  if (!!query["p"]) userId = decryptId(query["p"].toString());

  if (!userId) {
    alert("KHONG TIM THAY DU LIEU HOAC LOI KET NOI");
    return {
      data: JSON.parse(JSON.stringify({})),
    };
  }

  // Call data in here
  const { data }: any = await getListFiles(
    userId,
    (event: any) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    },
    server
  );

  return {
    data: JSON.parse(
      JSON.stringify({
        result: {
          stepsname: data,
          patientName: query["pname"],
          clinicCode: query["cln"],
          userId,
        },
      })
    ),
  };
};

export default withSoftReload(PlayerRoute);

// export async function getServerSideProps({ query }: GetServerSidePropsContext) {
//   const { p, name, cln } = query;
//   // const link = getUrl('player', 'ortho');

//   const des = decryptId((p ?? "").toString());
//   console.log("Path player::", p, des, cln);

//   const user = des!.replaceAll("_", "");

//   // for git
//   // const dataInit = await getInitDataFromGit(user);

//   //from local

//   // let steps;
//   const steps = syncDataFromGithubV2(dataInit);

//   return {
//     props: {
//       data: JSON.parse(
//         JSON.stringify({
//           steps,
//           name,
//           clinicCode: cln,
//           p,
//           isOk: !!des ?? false,
//         })
//       ),
//     },
//   };
// }
