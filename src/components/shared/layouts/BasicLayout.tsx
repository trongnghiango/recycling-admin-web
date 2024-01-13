import Head from "next/head";
import { ReactNode } from "react";
// import { useWindowSize } from 'react-use';
import { useWindowSize } from "hooks/useWindowSize";
import { useStateValue } from "state/AppProvider";

interface IProps {
  title?: string;
  pageType?: string;
  children: ReactNode;
}

export default function BasicLayout(props: IProps) {
  const { title } = props;

  const { state } = useStateValue();
  const window = useWindowSize();
  let height: number | undefined;
  if (window) {
    height = window.height;
  }
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <>
        <div style={{ height }} className={`relative flex flex-col w-full`}>
          <header></header>

          <main className={`relative flex-1 flex flex-col overflow-hidden }`}>
            {props.children}
          </main>

          {/* Footer Section */}
          <footer className="absolute bottom-0 left-0 right-0 z-40"></footer>
        </div>
        {state.loading && <Loading />}
      </>
    </>
  );
}

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

BasicLayout.displayName = "BasicLayout";
