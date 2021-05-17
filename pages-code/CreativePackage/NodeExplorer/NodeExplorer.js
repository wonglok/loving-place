import { Canvas, useFrame } from "@react-three/fiber";
import { EditorBed } from "../EditorBed/EditorBed";
import { EditorControls } from "../EditorControls/EditorControls";
import { HDREnv } from "../../HDREnv/HDREnv";
// import { LineDrop } from "../../LineDrop/LineDrop";

import { Pylon } from "../Pylon/Pylon";
import { Blocker } from "../Blocker/Blocker";
import { Overlays } from "../AOItemList/AOItemList";
import { TempAdd } from "../TempAdd/TempAdd";
import {
  Hand,
  ProjectStore,
  provdeCanvasState,
} from "../AppEditorState/AppEditorState";
import { useEffect } from "react";
import { CommunicationBridge } from "../BridgeLine/BridgeLine";
// import { useEffect } from "react";

function DisplayBlockers() {
  ProjectStore.onChangeKeyRenderUI("blockers");

  return (
    <group>
      {ProjectStore.blockers.map((blocker) => {
        return <Blocker key={blocker._id} blocker={blocker}></Blocker>;
      })}
    </group>
  );
}

function DisplayConnections() {
  ProjectStore.onChangeKeyRenderUI("connections");
  ProjectStore.onChangeKeyRenderUI("ports");

  return (
    <group>
      {ProjectStore.connections.map((conn) => {
        return (
          <CommunicationBridge
            key={conn._id}
            connection={conn}
          ></CommunicationBridge>
        );
      })}
    </group>
  );
}

function Internal() {
  useFrame((st) => {
    provdeCanvasState(st);
  });

  return (
    <group>
      <ambientLight color={"white"} intensity={0.5}></ambientLight>
      <directionalLight position={[10, 10, 10]}></directionalLight>
      <HDREnv></HDREnv>

      {/* <LineDrop></LineDrop> */}

      <EditorControls></EditorControls>
      <EditorBed></EditorBed>
      <Pylon color={"#00ffff"}></Pylon>

      <TempAdd></TempAdd>
      <DisplayBlockers></DisplayBlockers>
      <DisplayConnections></DisplayConnections>

      {/* <Blocker blocker={{ _id: "blocker1", position: [200, 0, 0] }}></Blocker>
      <Blocker blocker={{ _id: "blocker2", position: [-200, 0, 0] }}></Blocker> */}
      {/* <BridgeLine></BridgeLine> */}
    </group>
  );
}

export function NodeExplorer() {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={(typeof window !== "undefined" && window.devicePixelRatio) || 1.0}
      >
        <Internal></Internal>
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
