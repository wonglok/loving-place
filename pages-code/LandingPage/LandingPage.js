import { useState } from "@hookstate/core";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { BallsArena } from "../BallsArena/BallsArena";
import { GameControl } from "../GameControl/GameControl";
import { HDREnv } from "../HDREnv/HDREnv";
import { LineDrop } from "../LineDrop/LineDrop";
import { MetalMan } from "../MetalMan/MetalMan";
import { PlaceFloor } from "../PlaceFloor/PlaceFloor";
// import { Physics } from "@react-three/cannon";
// import WashingMachine from "../WashingMachine/WashingMachine";
// import * as RT from "../api/realtime";

export default function LandingPage() {
  const dpr = useState(1.0);

  useEffect(() => {
    let val = window.devicePixelRatio || 1.0;

    if (val > 1.75) {
      val = 1.75;
    }

    dpr.set(val);

    // fetch("https://prod-rest.realtime.effectnode.com/")
    //   .then((e) => e.json())
    //   .then(console.log);

    try {
      fetch("http://localhost:3333/")
        .then((e) => e.json())
        .then(console.log, console.log);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Canvas
      className={"h-full w-full"}
      dpr={dpr.get()}
      antialias={true}
      camera={{ position: [0, 150, 150] }}
    >
      {/*  */}
      <PlaceFloor></PlaceFloor>
      <MetalMan></MetalMan>
      <GameControl></GameControl>

      {/*  */}
      <group position-z={-100}>
        <BallsArena></BallsArena>
      </group>

      {/*  */}
      <ambientLight color={"white"} intensity={1}></ambientLight>
      <HDREnv></HDREnv>
      <LineDrop></LineDrop>
    </Canvas>
  );
}

//

//

// export async function getStaticProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

//

//

//

//
//

//
