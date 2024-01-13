import "../scss/main.scss";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import AppProvider, { useStateValue } from "@/state/AppProvider";
import KPLoader from "@/components/ui/kloader/KLoader";
import { AuthProvider } from "@/auth-context/AuthContext";
import { Provider } from "react-redux";
import store from "../redux"

const NextApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const handleStart = () => {
    setPageLoading(true);
  };
  const handleComplete = () => {
    setPageLoading(false);
  };
  const { dispatch } = useStateValue();

  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    return (
      <>
        <KPLoader />
      </>
    );
  } else {
    return (
      <Provider store={store}>


        <AppProvider>
          {/* <AuthProvider> */}
          <Component {...pageProps} />
          {/* </AuthProvider> */}
        </AppProvider>
      </Provider>
    );
  }
};
// ts-prune-ignore-next
export default NextApp;

// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric);
// }
