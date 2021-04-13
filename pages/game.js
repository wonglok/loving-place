import Head from "next/head";
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
export default function Home({ buildTimeCache }) {
  return (
    <>
      <Head>
        <title>Loving.Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingPage></LandingPage>
      {/* <div>{JSON.stringify(buildTimeCache)}</div> */}
      {/* <DynamicComponent></DynamicComponent> */}
    </>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      buildTimeCache: {
        abc: 123,
      },
    },
    notFound: false,
  };

  // const res = await fetch(``)
  // const data = await res.json()
  // if (!data) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }
  // return {
  //   props: { data }, // will be passed to the page component as props
  // }
};

//;
