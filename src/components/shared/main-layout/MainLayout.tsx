import React, { PropsWithChildren, ReactNode, Suspense } from "react";
import Head from "next/head";
import { MainNavigation } from "../main-navigation/MainNavigation";
import dynamic from "next/dynamic";
const MediaController = dynamic(
  () => import("components/pages/about-page/controlpanel/MediaController"),
  {
    suspense: true,
  }
);
import ThreeDViewerHeader from "components/pages/about-page/header/threedviewer-header";
import { useWindowSize } from "hooks/useWindowSize";
import { useStateValue } from "state/AppProvider";

interface IProps {
  title?: string;
  pageType?: string;
  children: ReactNode;
}

export const MainLayout: React.FC<IProps> = (props) => {
  const { title = "Viewer", pageType = undefined } = props;
  const window = useWindowSize();
  const isRenderPage = pageType && pageType === "render";
  let height: number | undefined;
  if (window) {
    height = window.height;
  }

  const { state } = useStateValue();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <>
        <div
          style={{ height }}
          className={`relative flex flex-col w-full bg-[#111]`}
        >
          <header>
            {isRenderPage ? <ThreeDViewerHeader /> : <MainNavigation />}
          </header>
          <main
            className={`relative flex-1 bg-[#111111] flex flex-col ${
              isRenderPage ? "overflow-hidden mb-[70px]" : "overflow-y-auto"
            }`}
          >
            {props.children}
          </main>

          {/* Footer Section */}
          <footer className="absolute bottom-0 left-0 right-0 z-40">
            <div className="bg-[#3D3935] flex items-center">
              {isRenderPage && (
                <Suspense fallback={null}>
                  <MediaController />
                </Suspense>
              )}
            </div>
          </footer>
        </div>
        {state.loading && <Loading />}
      </>
    </>
  );
};

const Loading = () => (
  <>
    <div className="loading bg-[#fff] opacity-75 flex flex-col justify-center items-center">
      <div className="effect-loading blur-2xl"></div>
      <KPLoader />
    </div>
  </>
);

export const KPLoader = () => {
  return (
    <div id="nprogress">
      <div className="bar" role="bar">
        <div className="peg"></div>
      </div>
      <div className="spinner" role="spinner">
        <div className="spinner-icon"></div>
      </div>
    </div>
  );
};

MainLayout.displayName = "MainLayout";
