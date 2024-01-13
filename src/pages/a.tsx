import dynamic from "next/dynamic";
const PlayerPage = dynamic(
  () => import("components/pages/player-page/PlayerPage"),
  {
    suspense: true,
  }
);

import { AdminLayout } from "components/shared/layouts/AdminLayout";
import { getClinics } from "domains/clinics/clinics.services";
import ClinicPage from "components/pages/clinic-page/ClinicPage";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";
import { getUserFromCookies } from "@/utils/JWT";
import { getListFiles } from "@/domains/upload/upload.services";
import { decryptId, getBlobLinkV2 } from "@/utils/aesUtil";
import { BASE_URL } from "@/domains/common/config";
import { IOrthodontics, IStep } from "@/state/interfaces/teeth.interface";
import { splitNumberFromString } from "@/utils/utils";
import { MainLayout } from "@/components/shared/main-layout/MainLayout";

export interface IReloadPageProps {
  softReload: () => void;
}

interface IProps {
  data: any[];
}

const SampleRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const { listnames, userId } = data["result"];

  // if (!!data) console.log(data["result"]);
  return (
    <MainLayout title="Patients" pageType="render">
      <PlayerPage userId={userId} ldata={listnames} />
    </MainLayout>
  );
};

SampleRoute.getInitialProps = async (context) => {
  if (typeof window !== "undefined") {
    console.log("RENDER:: CLIENT SIDE RENDERING");
  }

  const { query, req, res } = context;
  // check? client side rendering OR server side rendering
  const server = !!req ? { req, res } : undefined;

  // For Protected Route ..
  const user = getUserFromCookies(server);
  if (!user || !server) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }

  const userId = "03858458";

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

  // console.log("DATA::", data, data.length);
  return {
    data: JSON.parse(JSON.stringify({ result: { listnames: data, userId } })),
  };
};

const executeAllTasks = async (taskUrls: any[]) => {
  return await Promise.all(
    taskUrls.map((value: any, idx: number) => getSingleFile)
  );
};

const getSingleFile = async (q: string, server: { req: any; res: any }) => {
  const res = await fetch(
    `${
      server ? BASE_URL : ""
    }/api/getfiles?user=01010009&name=${encodeURIComponent(q)}`
  ).then((response) => response.arrayBuffer());
  const blobUrl = getBlobLinkV2(res);

  return {
    name: q,
    size: res.byteLength,
    blobUrl,
  };
};

function getDataFromLocal(data: any[]) {
  let dataRes: IOrthodontics<IStep> = {};

  for (const { name, size, blobUrl } of data) {
    const decname = decryptId(name) ?? "";

    const [key] = splitNumberFromString(decname) ?? ["0"];
    if (!!decname && !!key) {
      const maxillary =
        decname.includes("mx-") || decname.includes("Maxillary-")
          ? blobUrl
          : undefined;
      const mandibular =
        decname.includes("mn-") || decname.includes("Mandibular-")
          ? blobUrl
          : undefined;

      if (maxillary) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], maxillary },
        };
      }

      if (mandibular) {
        dataRes = {
          ...dataRes,
          [key]: { ...dataRes[key], mandibular },
        };
      }
    }
  }
  return dataRes;
}

export default withSoftReload(SampleRoute);
