import Head from "next/head";
// import dynamic from "next/dynamic";
import LandingPage from "../pages-code/LandingPage/LandingPage.js";

// const DynamicComponent = dynamic(
//   () => {
//     return (
//       import("../pages-code/LandingPage/LandingPage.js")
//         //
//         .then((e) => e.default)
//     );
//   },
//   { ssr: false }
// );

export default function Home() {
  return (
    <>
      <Head>
        <title>Loving.Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage></LandingPage>

      {/* <DynamicComponent></DynamicComponent> */}
    </>
  );
}
