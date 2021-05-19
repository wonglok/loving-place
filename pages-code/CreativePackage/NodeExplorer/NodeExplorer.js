import { useRouter } from "next/router";
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
  // Hand,
  ProjectStore,
  provdeCanvasState,
  AutoSaver,
} from "../AppEditorState/AppEditorState";
// import { useEffect } from "react";
import { CommunicationBridge } from "../BridgeLine/BridgeLine";
import { Picker } from "../Picker/Picker";
import { useEffect, useMemo, useState } from "react";
import { Project } from "../../api/Project";
import { AuthState, EnvConfig, LambdaClient } from "../../api/realtime";
// import { useEffect } from "react";
//

function DisplayBlockers() {
  ProjectStore.makeKeyReactive("blockers");
  return (
    <group>
      {ProjectStore.blockers.map((blocker) => {
        return <Blocker key={blocker._id} blocker={blocker}></Blocker>;
      })}
    </group>
  );
}

function DisplayPickers() {
  //
  ProjectStore.makeKeyReactive("pickers");

  return (
    <group>
      {ProjectStore.pickers.map((picker) => {
        return <Picker key={picker._id} picker={picker}></Picker>;
      })}
    </group>
  );
}

function DisplayConnections() {
  //
  ProjectStore.makeKeyReactive("blockers");
  ProjectStore.makeKeyReactive("connections");
  ProjectStore.makeKeyReactive("ports");

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

// function AutoSaveCompo({ projectID = "demo" }) {
//   useEffect(() => {
//     //
//     //
//     let tt = setInterval(() => {
//       let latest = JSON.stringify(ProjectStore);
//       if (AutoSaver.trackingJSON !== latest) {
//         AutoSaver.trackingJSON = latest;

//         // SnapsDB({ projectID }).setItem(getID(), JSON.parse(latest));
//       }
//     }, 1500);
//     return () => {
//       clearInterval(tt);
//     };
//   }, []);
//   //
//   return <group></group>;
// }

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
      <DisplayPickers></DisplayPickers>

      {/* <Blocker blocker={{ _id: "blocker1", position: [200, 0, 0] }}></Blocker>
      <Blocker blocker={{ _id: "blocker2", position: [-200, 0, 0] }}></Blocker> */}
      {/* <BridgeLine></BridgeLine> */}
    </group>
  );
}

function NeedsToSave({ project, saveProject }) {
  AutoSaver.makeKeyReactive("showNeedsSave");
  let saveJSON = () => {
    //
  };
  //
  return (
    <>
      {AutoSaver.showNeedsSave ? (
        <div
          onClick={saveProject}
          className="cursor-pointer shadow-lg absolute top-0 right-0 rounded-xl m-2 p-3 text-white bg-yellow-500"
        >
          {/*  */}
          CMD + S to Save
          {/*  */}
        </div>
      ) : (
        <div className=" shadow-lg absolute top-0 right-0 rounded-xl m-2 p-3 bg-green-500 text-white ">
          {/*  */}
          Saved to Cloud
          {/*  */}
        </div>
      )}
    </>
  );
}

export function NodeExplorer({ project }) {
  if (!project) {
    throw new Error("missing project");
  }
  let [ready, setReady] = useState(true);

  let socket = useMemo(() => {
    //bridge-project-room
    let socket = new LambdaClient({
      url: EnvConfig.ws,
    });

    let user = AuthState.user.get();

    socket.send({
      action: "join-room",
      roomID: project._id,
      userID: `${user.userID}_____${user.username}`,
    });

    socket.on("join-room", (e) => {
      // console.log(e.connectionID);
      socket.connID = e.connectionID;
      console.log("joined-room", socket.connID, user.username, user.userID);
    });

    socket.on("bridge-project-room", (ev) => {
      console.log("bridge-project-room", ev);
    });

    return socket;
  }, []);

  let saveProject = async () => {
    console.log(project);
    let user = AuthState.user.get();

    socket.send({
      action: "bridge-project-room",
      roomID: project._id,
      userID: `${user.userID}_____${user.username}`,
      project: project,
    });

    project.largeString = JSON.stringify(ProjectStore);
    await Project.updateMine({ object: project });
    AutoSaver.showNeedsSave = false;
  };
  let autoSetupCleanUp = () => {
    let json = JSON.parse(project.largeString);

    ProjectStore._id = project._id;
    ProjectStore.pickers = [];
    ProjectStore.blockers = [];
    ProjectStore.ports = [];
    ProjectStore.connections = [];

    json.blockers.forEach((e) => {
      ProjectStore.blockers.addItem(e);
    });

    json.ports.forEach((e) => {
      ProjectStore.ports.addItem(e);
    });

    json.connections.forEach((e) => {
      ProjectStore.connections.addItem(e);
    });

    json.pickers.forEach((e) => {
      ProjectStore.pickers.addItem(e);
    });

    let fnc = (ev) => {
      let { metaKey, key } = ev;
      // if (metaKey + )
      if (metaKey && key === "s") {
        ev.preventDefault();

        saveProject();
      }
    };
    window.addEventListener("keydown", fnc);

    let tracker = JSON.stringify(ProjectStore);
    let autoSaveChecker = setInterval(() => {
      let latest = JSON.stringify(ProjectStore);
      if (latest !== tracker) {
        AutoSaver.showNeedsSave = true;
      }
      tracker = latest;
    }, 1000);

    setReady(true);
    return () => {
      clearInterval(autoSaveChecker);
      window.removeEventListener("keydown", fnc);
    };
  };

  useEffect(async () => {
    ProjectStore._id = project._id;
    if (project.largeString) {
      return autoSetupCleanUp();
    } else {
      project.largeString = JSON.stringify(ProjectStore);
      await Project.updateMine({ object: project });
      AutoSaver.showNeedsSave = false;
      return autoSetupCleanUp();
    }
  }, []);

  return ready ? (
    <div className="w-full h-full">
      <NodeExplorerInternal></NodeExplorerInternal>
      <NeedsToSave
        project={project}
        saveProject={() => {
          saveProject();
        }}
      ></NeedsToSave>
      <BackButton></BackButton>
    </div>
  ) : (
    <div>Loading....</div>
  );
}

function BackButton() {
  return (
    <div
      onClick={() => {
        window.location.assign("/home");
      }}
      className="cursor-pointer shadow-lg absolute top-0 left-0 rounded-xl m-2 p-3 text-white bg-gray-500"
    >
      Back
    </div>
  );
}

export function NodeExplorerInternal() {
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
