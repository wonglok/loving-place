import { useState } from "@hookstate/core";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
// import { GameControl } from "../GameControl/GameControl";
import { HDREnv } from "../HDREnv/HDREnv";
import { LineDrop } from "../LineDrop/LineDrop";
import { OrbitGraphControls } from "../OrbitGraphControls/OrbitGraphControls";
// import { MetalMan } from "../MetalMan/MetalMan";
import { EletricFloor } from "../EletricFloor/EletricFloor";
import { OverlayState, ToolbarState } from "../NodeState/NodeState";
import { BallsArena } from "../BallsArena/BallsArena";
// import { Physics } from "@react-three/cannon";
// import WashingMachine from "../WashingMachine/WashingMachine";
// import * as RT from "../api/realtime";

export function OrbitGraph() {
  const overlay = useState(OverlayState);
  const toolbar = useState(ToolbarState);
  const dpr = useState(1.0);

  useEffect(() => {
    let val = window.devicePixelRatio || 1.0;

    if (val > 1.75) {
      val = 1.75;
    }

    dpr.set(val);
  }, []);

  return (
    <div className={"h-full w-full relative"}>
      {/*  */}
      <Canvas
        className={"h-full w-full absolute top-0 left-0"}
        dpr={dpr.get()}
        antialias={true}
      >
        <ambientLight color={"white"} intensity={1}></ambientLight>

        <EletricFloor></EletricFloor>
        <OrbitGraphControls></OrbitGraphControls>
        <HDREnv></HDREnv>
        <LineDrop></LineDrop>

        <BallsArena></BallsArena>
      </Canvas>

      {/*  */}
      {overlay.get() === "open" && (
        <div className={"h-full w-full absolute top-0 left-0"}>123</div>
      )}
      {/*  */}
      {toolbar.get() === "open" && (
        <div className={"h-full top-0 right-0"}>123</div>
      )}
    </div>
  );
}
