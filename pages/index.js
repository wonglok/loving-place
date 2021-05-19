import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

// import dynamic from "next/dynamic";
// import LandingPage from "../pages-code/LandingPage/LandingPage.js";
// import { SortaFun } from "../pages-code/SortaFun/SortaFun.js";
// const SortaFun = dynamic(
//   () => import("../pages-code/SortaFun/SortaFun.js").then((e) => e.SortaFun),
//   {
//     ssr: false,
//   }
// );

function DefaultSite() {
  return (
    <>
      <Head>
        <title>iLaborary at Thank you Jesus Church</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full lg:w-10/12 lg:mx-auto">
        <div className="p-3 pt-8 lg:pt-24">
          <div className="text-3xl lg:text-5xl text-bold">
            Thank you Jesus{" "}
            <span className="lg:hidden">
              <br />
            </span>
            Church Technologies
          </div>
        </div>
        <div className="p-3">
          <div className="text-xl text-gray-500 lg:text-2xl ">
            inspired by heaven & made via{" "}
            <a
              target="_blank"
              className="underline text-lg"
              href="https://www.linkedin.com/in/wonglok831/"
            >
              Lok Lok
            </a>
          </div>
        </div>
        <div className="p-3">
          <div className="lg:text-lg ">Inventions and Gifts from Heaven:</div>
        </div>
        <div className="p-3">
          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://thankyou.jesus.academy/church?character=janice"
            >
              Thankyou Jesus Church Online Demo
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              VueJS based 3D Virtual Room Demo
            </div>
          </div>

          {/*  */}
          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://thankyou.church"
            >
              Thank You Jesus Church Blog
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>Parise the LORD!</div>
          </div>
          {/*  */}
          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://cloud.effectnode.com"
            >
              Effect Node Cloud
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Production Ready Tool for AR/VR
            </div>
          </div>
          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://effectnode.com"
            >
              Effect Node
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Webbys 2019 Nominee
            </div>
            <div className={"ml-4 text-sm text-gray-600"}>
              Webbys 2019 Judgeship
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://cloud.effectnode.com"
            >
              Effect Node Desktop Studio
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Webby 2021 Honouree
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://igraph.effectnode.com"
            >
              Effect Node iGraph
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              W3 Awrads Silver 2020
            </div>
            <div className={"ml-4 text-sm text-gray-600"}>
              Creative Coding Tool for web 3d movie
            </div>
          </div>

          {/*  */}

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://shader.wonglok.com/shader-gui"
            >
              Shader Remixer V0
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              GLSL Code Generator
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://shader.wonglok.com/shader-svg"
            >
              Shader Remixer V1
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              GLSL Code Generator
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://age.wonglok.com/v0/age"
            >
              Shader Remixer V2
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              GLSL Code Generator
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://v2.effectnode.com"
            >
              Shader Remixer V3
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              ThreeJS Node Remixer API
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://withloklok.com/"
            >
              With Lok Lok
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              PlayStation Look and Feel - WebGL Demo
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://creativecodelab.com/"
            >
              Creative Code Lab
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Modularise Code with Human Input
            </div>
            <div className={"ml-4 text-sm text-gray-600"}>
              Best for Testing out different pipeline of Three.JS
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://o3d-gen2.vercel.app/"
            >
              O3D-GEN2
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              (Vue based 3D Apps Framework Generation 2)
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://o3d-gen3.vercel.app/docs/code-walkthrough"
            >
              O3D-GEN3
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Vue based 3D Apps Framework Generation 3
            </div>
          </div>

          <div className="text-sm mb-3 lg:text-lg ">
            <a
              target="_blank"
              className="underline text-lg"
              href="https://togethertime.me/"
            >
              Together Time
            </a>
            <div className={"ml-4 text-sm text-gray-600"}>
              Lok's Social Network in 3D
            </div>
          </div>
        </div>

        {/* <a className="p-3 m-3" href={"/"}>
          Effect Node Cloud
        </a>

        <Link href="/login">
          <button className={"p-3 m-3"}>Go Login</button>
        </Link> */}
        {/* <Link href="/node">
          <button className={"p-3 m-3"}>Node</button>
        </Link> */}
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=59"
  );

  return {
    props: {
      query: {
        ...query,
      },
      host: req.headers.host,
    },
  };
}

//
function EffectNodeCloud({ site }) {
  return (
    <div>
      <Head>
        <title>EffectNode Cloud</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full lg:w-10/12 lg:mx-auto">
        <div className="p-3 pt-8 lg:pt-24">
          <div className="text-3xl lg:text-5xl text-bold">EffectNode Cloud</div>
        </div>
        <div className="p-3">
          <div className="text-xl text-gray-500 lg:text-2xl ">
            Inspired by heaven & made via{" "}
            <a
              target="_blank"
              className="underline text-lg"
              href="https://www.linkedin.com/in/wonglok831/"
            >
              Lok Lok
            </a>
          </div>
        </div>
        <div className="px-3">
          <div className="text-xs text-gray-500 ">Hosted on Domain: {site}</div>
        </div>

        <div className="p-3">
          <div className="text-sm mb-3 lg:text-lg ">
            <Link href="/login">
              <button className={""}>Login</button>
            </Link>
          </div>
          <div className="text-sm mb-3 lg:text-lg ">
            <Link href="/register">
              <button className={""}>Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// function EffectNodeChurch({}) {
//   return <div>Church</div>;
// }

export default function Home({ host, query }) {
  let open = host.split(":")[0];

  // only dev machine can use debug
  if (process.env.NODE_ENV === "development") {
    if (query.debugsite) {
      open = query.debugsite;
    }
  }

  //
  if (open === "loving.place") {
    return <EffectNodeCloud site={open}></EffectNodeCloud>;
  }
  if (open === "cloud.effectnode.com") {
    return <EffectNodeCloud site={open}></EffectNodeCloud>;
  }
  if (open === "wonglok.local") {
    return <EffectNodeCloud site={open}></EffectNodeCloud>;
  }
  // //
  // if (open === "church.effectnode.com") {
  //   return <EffectNodeChurch></EffectNodeChurch>;
  // }

  return (
    <>
      <DefaultSite></DefaultSite>
      {/* <SortaFun></SortaFun> */}
      {/* <div>Landing Page</div> */}
      {/* <LandingPage></LandingPage> */}
      {/* <div>{JSON.stringify(buildTimeCache)}</div> */}
      {/* <DynamicComponent></DynamicComponent> */}
    </>
  );
}

// export const getStaticProps = async () => {
//   return {
//     props: {
//       buildTimeCache: {
//         abcdefg: 123,
//       },
//     },
//     notFound: false,
//   };

//   // const res = await fetch(``)
//   // const data = await res.json()
//   // if (!data) {
//   //   return {
//   //     redirect: {
//   //       destination: '/',
//   //       permanent: false,
//   //     },
//   //   }
//   // }
//   // return {
//   //   props: { data }, // will be passed to the page component as props
//   // }
// };

//;

/*

//

*/
