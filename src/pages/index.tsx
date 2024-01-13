import { useAuth } from "@/auth-context/AuthContext";
import { AdminLayout } from "@/components/shared/layouts/AdminLayout";
import { getClinics } from "@/domains/clinics/clinics.services";
import { getPatients } from "@/domains/patients/patients.services";
import withSoftReload, {
  NextPageWithInitialProps,
  SoftReloadProps,
} from "@/hooks/withSoftReload";
import { getCookie } from "cookies-next";
import Link from "next/link";

interface IProps {
  data: any;
}

const HomeRoute: NextPageWithInitialProps<IProps & SoftReloadProps, IProps> = ({
  data,
}) => {
  const { loading, setLoading } = useAuth();
  const [clinics, patients] = data["result"];
  console.log({ loading });
  return (
    <AdminLayout title="Patients">
      <div className="container mx-auto">
        <div className="flex flex-col my-6 items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg my-4 text-gray-500">
            Tính năng Dashboard sẽ được tích hợp trong thời gian sớm nhất.
          </p>
          <button onClick={() => setLoading(true)}>Start</button>
          <button onClick={() => setLoading(false)}>End</button>
          <p>{loading ? "loading" : "OK"}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

HomeRoute.getInitialProps = async (context) => {
  // fetch data
  const { query, req, res } = context;
  const user = getCookie("user", { req, res });

  if (!user) {
    return {
      data: JSON.parse(JSON.stringify({ result: [] })),
    };
  }

  const result = await Promise.all([
    getClinics({ req, res }),
    getPatients({ req, res }),
  ]);

  return {
    data: JSON.parse(JSON.stringify({ result })),
  };
};

export default withSoftReload(HomeRoute);
