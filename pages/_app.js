import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { Sarabun } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={"min-h-full " + sarabun.className}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
