import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "hooks/withSoftReload";
import { getPatients } from "domains/patients/patients.services";
import { AdminLayout } from "components/shared/layouts/AdminLayout";
// import PatientsPages from "components/pages/patients-page/PatientsPage";
import { getClinics } from "domains/clinics/clinics.services";
import { getUserFromCookies } from "@/utils/JWT";
const PatientsPages = dynamic(
  () => import("components/pages/patients-page/PatientsPage"),
  {
    suspense: true,
  }
);

interface IProps {
  data: any;
}

const PatientsRoute: NextPageWithInitialProps<
  IProps & SoftReloadProps,
  IProps
> = ({ data, softReload }) => {
  const [clinics, patients] = data["result"];

  return (
    <AdminLayout title="Patients">
      {!!clinics && patients && (
        <PatientsPages
          patients={patients["data"]}
          clinics={clinics["data"]}
          softReload={softReload}
        />
      )}
    </AdminLayout>
  );
};

PatientsRoute.getInitialProps = async (context) => {
  // fetch data
  const { query, req, res } = context;
  const server = !!req ? { req, res } : undefined;
  // console.log("PATIENT PAGE::", query);
  const user = getUserFromCookies(server);

  if (!user) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }

  const result = await Promise.all([getClinics(server), getPatients(server)]);
  // console.log("TEST::", JSON.stringify(result));

  return {
    data: JSON.parse(JSON.stringify({ result })),
  };
};

export default withSoftReload(PatientsRoute);
