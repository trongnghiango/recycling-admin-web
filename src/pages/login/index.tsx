import SignIn from "components/pages/auth-page/SignIn";
import BasicLayout from "components/shared/layouts/BasicLayout";
import { GetServerSidePropsContext } from "next";

export default function LoginRoute() {
  return (
    <BasicLayout>
      <SignIn />
    </BasicLayout>
  );
}
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   console.log(context.req.headers.referer ?? "quan");
//   console.log("Dir::", process.cwd());

//   return {
//     props: {
//       data: JSON.parse(JSON.stringify({})),
//     },
//   };
// }
