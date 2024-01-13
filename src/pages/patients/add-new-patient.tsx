import AddNewPatient from "components/pages/patient-page/AddNewPatient";
import PatientDetail from "components/pages/patient-page/PatientDetail";
import { AdminLayout } from "components/shared/layouts/AdminLayout";
import BasicLayout from "components/shared/layouts/BasicLayout";
import { DashLayout } from "components/shared/layouts/DashLayout";

export default function AddNewPatientRoute() {
  return (
    <AdminLayout title="Patients">
      <AddNewPatient />
    </AdminLayout>
  );
}
