import axios from "axios";
import dynamic from "next/dynamic";
const PatientsPages = dynamic(
  () => import("components/pages/patients-page/PatientsPage"),
  {
    suspense: true,
  }
);

import BasicLayout from "components/shared/layouts/BasicLayout";
import { DashLayout } from "components/shared/layouts/DashLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { AdminLayout } from "components/shared/layouts/AdminLayout";
import { getClinics } from "domains/clinics/clinics.services";
import ClinicPage from "components/pages/clinic-page/ClinicPage";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";
import { getUserFromCookies } from "@/utils/JWT";

export interface IReloadPageProps {
  softReload: () => void;
}

interface IProps {
  data: any[];
}

const ClinicsRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const clinics = data["result"];

  if (!!data) console.log(data["result"]);
  return (
    <AdminLayout title="Patients">
      <ClinicPage clinics={clinics["data"]} softReload={softReload} />
    </AdminLayout>
  );
};

ClinicsRoute.getInitialProps = async (context) => {
  const { query, req, res } = context;

  // check? client side rendering OR server side rendering
  const server = !!req ? { req, res } : undefined;
  // console.log("QUERY::", query);
  const user = getUserFromCookies(server);
  if (!user) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }

  const result = await getClinics(server);

  return {
    data: JSON.parse(JSON.stringify({ result })),
  };
};

export default withSoftReload(ClinicsRoute);
