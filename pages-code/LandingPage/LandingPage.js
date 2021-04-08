import { useState } from "@hookstate/core";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { GameControl } from "../GameControl/GameControl";
import { HDREnv } from "../HDREnv/HDREnv";
import { LineDrop } from "../LineDrop/LineDrop";
import { MetalMan } from "../MetalMan/MetalMan";
import { PlaceFloor } from "../PlaceFloor/PlaceFloor";

export default function LandingPage() {
  const dpr = useState(1.0);

  useEffect(() => {
    let val = window.devicePixelRatio || 1.0;
    if (val > 2) {
      val = 2;
    }

    dpr.set(val);
  }, []);

  return (
    <Canvas
      className={"h-full w-full"}
      dpr={dpr.get()}
      antialias={true}
      camera={{ position: [0, 150, 150] }}
    >
      <ambientLight color={"white"} intensity={1}></ambientLight>
      <MetalMan></MetalMan>

      <HDREnv></HDREnv>
      <GameControl></GameControl>
      <PlaceFloor></PlaceFloor>
      <LineDrop></LineDrop>
    </Canvas>
  );
}
