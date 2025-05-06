import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/router";

import CR from "@/components/CR";
import RB2B from "@/components/RB2B";
import Vector from "@/components/Vector";
import VectorConnect from "@/components/VectorConnect";

export default function MyApp({
  Component, pageProps,
}: AppProps) {
  const router = useRouter();

  let script = null;
  if (router.pathname === "/") {
    script = <Vector />;
  } else if (router.pathname.startsWith("/connect")) {
    script = (
      <>
        <CR />
        <RB2B />
        <VectorConnect />
      </>
    );
  }

  return <>
    {script}
    <Component {...pageProps} />
    <Analytics />
  </>;
}
