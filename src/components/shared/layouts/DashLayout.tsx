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
import { useWindowSize } from "hooks/useWindowSize";
import { useStateValue } from "state/AppProvider";
import { MHeader } from "../header/MHeader";

interface IProps {
  title?: string;
  pageType?: string;
  children: ReactNode;
}

export const DashLayout: React.FC<IProps> = (props) => {
  const { title = "This is the default title", pageType = undefined } = props;
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
        <div style={{ height }} className={`relative flex flex-col w-full`}>
          {/* Header Section */}
          <header>
            <MHeader />
          </header>
          <main className={`relative flex-1 flex flex-col overflow-y-auto`}>
            {props.children}

            {/* Footer Section */}
            <footer className="flex items-center justify-center my-4">
              {
                <p>
                  © Kool Smile JSC. All rights reserved. Privacy Terms of Use
                </p>
              }
            </footer>
          </main>

          {/* Footer Section */}
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

DashLayout.displayName = "DashLayout";
