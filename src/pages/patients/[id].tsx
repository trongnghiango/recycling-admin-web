import PatientDetail from "components/pages/patient-page/PatientDetail";
import { AdminLayout } from "components/shared/layouts/AdminLayout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { decryptId } from "utils/aesUtil";

export default function PatientRoute({ title, patient, patient_id }: any) {
  return (
    <AdminLayout title={`${!!title ? title : "Patients"}`}>
      {!!patient && typeof patient === "object" && (
        <PatientDetail {...patient} patient_id={patient_id} />
      )}
    </AdminLayout>
  );
}

/**
 * ts-prune-ignore-next
 */
export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  try {
    // const film = await getFilm(props.params?.id as string);
    //call api get patient detail
    const str = query["patient"]?.toString() ?? "";

    console.log("[Page Patient Detail]::", str, query["id"]);
    const patient = JSON.parse(str ?? {});
    const title = decryptId(query["p"]?.toString() ?? "");
    return { props: { title, patient, patient_id: query["p"]?.toString() } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
}
