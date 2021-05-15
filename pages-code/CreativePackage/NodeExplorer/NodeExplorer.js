import { Canvas } from "@react-three/fiber";
import { EditorBed } from "../EditorBed/EditorBed";
import { EditorControls } from "../EditorControls/EditorControls";
import { HDREnv } from "../../HDREnv/HDREnv";
// import { LineDrop } from "../../LineDrop/LineDrop";

// import { Bloom } from "../Bloom/Bloom.js";
import { Pylon } from "../Pylon/Pylon";
import { Blocker } from "../Blocker/Blocker";
import { useState } from "@hookstate/core";
import { BridgeLine } from "../BridgeLine/BridgeLine";
import { AOCCore } from "../AOCCore/AOCCore";
import { Hand } from "../AppEditorState/AppEditorState";
function Internal({ ProjectState }) {
  const project = useState(ProjectState);
  console.log(project.get());

  return (
    <group>
      <ambientLight color={"white"} intensity={0.5}></ambientLight>
      <directionalLight position={[10, 10, 10]}></directionalLight>
      <HDREnv></HDREnv>

      {/* <LineDrop></LineDrop> */}

      <EditorControls></EditorControls>
      <EditorBed></EditorBed>
      <Pylon color={"#00ffff"}></Pylon>

      <Blocker blocker={{ _id: "blocker1", position: [200, 0, 0] }}></Blocker>
      <Blocker blocker={{ _id: "blocker2", position: [-200, 0, 0] }}></Blocker>

      <BridgeLine></BridgeLine>
    </group>
  );
}

function Overlays() {
  Hand.onChangeKeyRenderUI("overlay");
  window.addEventListener("keydown", ({ key }) => {
    if (key === "Escape") {
      Hand.overlay = "";
    }
  });
  return <>{Hand.overlay === "core" && <AOCCore>123</AOCCore>}</>;
}

export function NodeExplorer({ ProjectState }) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={(typeof window !== "undefined" && window.devicePixelRatio) || 1.0}
      >
        <Internal ProjectState={ProjectState}></Internal>
      </Canvas>
      <Overlays></Overlays>
    </div>
  );
}

//
//

//
//

//
//
