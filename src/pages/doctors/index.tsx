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
import { getDoctors } from "domains/doctors/doctors.services";
import DoctorPage from "components/pages/doctor-page/DoctorPage";
import { getUserFromCookies } from "@/utils/JWT";
import { getClinics } from "@/domains/clinics/clinics.services";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";

export interface IReloadPageProps {
  softReload?: () => void;
}

interface IProps {
  data: any;
}

const DoctorsRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const [clinics, doctors] = data["result"];

  // useEffect(() => {
  //   (async function () {
  //     const res = await getDoctors();
  //     setDoctors(res.data);
  //     console.log("TEO:::", res);
  //   })();
  // }, []);
  // console.log({ clinics, doctors });

  return (
    <AdminLayout title="Patients">
      <DoctorPage
        doctors={doctors["data"]}
        clinics={clinics["data"]}
        softReload={softReload}
      />
    </AdminLayout>
  );
};

DoctorsRoute.getInitialProps = async (context) => {
  const { query, req, res } = context;

  // check? client side rendering OR server side rendering
  const server = !!req ? { req, res } : undefined;
  console.log("QUERY::", query);
  const user = getUserFromCookies(server);
  if (!user) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }

  const result = await Promise.all([getClinics(server), getDoctors(server)]);
  console.log("Clinics::Doctors", JSON.stringify(result));

  return {
    data: JSON.parse(JSON.stringify({ result })),
  };
};

export default withSoftReload(DoctorsRoute);
