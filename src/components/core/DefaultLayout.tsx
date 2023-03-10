import type { ReactNode } from "react";
import { Nav } from "./Nav";

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Nav />

      <main className="mt-10">{children}</main>
    </>
  );
};
