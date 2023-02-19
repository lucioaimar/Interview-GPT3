import type { NextPage } from "next";
import type { AppType, AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "../styles/globals.css";
import { DefaultLayout } from "~/components/core/DefaultLayout";
import { api } from "~/utils/api";

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserProvider>
        <DefaultLayout>{page}</DefaultLayout>
      </UserProvider>
    ));

  return getLayout(<Component {...pageProps} />);
}) as AppType;

export default api.withTRPC(MyApp);
