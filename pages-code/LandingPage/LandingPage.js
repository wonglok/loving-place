import { useState } from "@hookstate/core";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { GameControl } from "../GameControl/GameControl";
import { HDREnv } from "../HDREnv/HDREnv";
import { MetalMan } from "../MetalMan/MetalMan";
import { PlaceFloor } from "../PlaceFloor/PlaceFloor";

export default function LandingPage() {
  const dpr = useState(1.1);

  useEffect(() => {
    dpr.set(window.devicePixelRatio || 1.1);
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
    </Canvas>
  );
}
