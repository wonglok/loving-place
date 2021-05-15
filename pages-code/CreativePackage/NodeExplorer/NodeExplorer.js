import { Canvas } from "@react-three/fiber";
import { EditorBed } from "../EditorBed/EditorBed";
import { EditorControls } from "../EditorControls/EditorControls";
import { HDREnv } from "../../HDREnv/HDREnv";
// import { LineDrop } from "../../LineDrop/LineDrop";

// import { Bloom } from "../Bloom/Bloom.js";
import { Pylon } from "../Pylon/Pylon";
import { Blocker } from "../Blocker/Blocker";
import { useState } from "@hookstate/core";
function Internal({ ProjectState }) {
  const project = useState(ProjectState);
  console.log(project.get());

  return (
    <group>
      <ambientLight color={"white"} intensity={0.5}></ambientLight>
      <HDREnv></HDREnv>

      {/* <LineDrop></LineDrop> */}

      <EditorControls></EditorControls>
      <EditorBed></EditorBed>
      <Pylon color={"#00ffff"}></Pylon>

      <Blocker blocker={{ position: [300, 0, -100] }}></Blocker>
    </group>
  );
}

export function NodeExplorer({ ProjectState }) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={(typeof window !== "undefined" && window.devicePixelRatio) || 1.0}
      >
        <Internal ProjectState={ProjectState}></Internal>
      </Canvas>
    </div>
  );
}

//
//

//
//

//
//
