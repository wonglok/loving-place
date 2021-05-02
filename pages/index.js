import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
// import LandingPage from "../pages-code/LandingPage/LandingPage.js";
// import { SortaFun } from "../pages-code/SortaFun/SortaFun.js";

// const SortaFun = dynamic(
//   () => import("../pages-code/SortaFun/SortaFun.js").then((e) => e.SortaFun),
//   {
//     ssr: false,
//   }
// );

export default function Home({ buildTimeCache }) {
  return (
    <>
      <Head>
        <title>Loving.Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full lg:w-10/12 lg:mx-auto">
        <a className="p-3 m-3" href={"/"}>
          EffectNode
        </a>
        <Link href="/login">
          <button className={"p-3 m-3"}>Go Login</button>
        </Link>
      </div>

      <img
        src="/texture/procedralvfx.png"
        className="w-full lg:w-10/12 lg:mx-auto"
      />

      {/* <SortaFun></SortaFun> */}
      {/* <div>Landing Page</div> */}
      {/* <LandingPage></LandingPage> */}
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

/*

//

*/
