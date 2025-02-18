import { useEffect } from "react";
import SimplePeer from "simple-peer";
import { JoinNode } from "three-stdlib";
import { AuthState, EnvConfig, LambdaClient } from "../../api/realtime";
import {
  makeSimpleShallowStore,
  ProjectStore,
} from "../AppEditorState/AppEditorState";

export const WebRTCStore = makeSimpleShallowStore({
  //
  socket: false,

  //
  enBatteries: false,
  clients: [],
});

let makeReceiverLogic = ({ project }) => {
  let projectID = project._id;

  let socket = new LambdaClient({
    url: EnvConfig.ws,
  });
  WebRTCStore.socket = socket;

  // let user = AuthState.user.get();

  socket.send({
    action: "join-room",
    roomID: projectID,
    userID: `TruthProvider`,
  });

  socket.on("reconnect", () => {
    socket.send({
      action: "join-room",
      roomID: projectID,
      userID: `TruthProvider`,
    });
  });

  socket.on("join-room", (resp) => {
    socket.send({
      action: "encloud-ready",
      roomID: projectID,
      userID: "TruthProvider",
    });
    socket.connID = resp.connectionID;

    socket.on("signal", (req) => {
      if (req.connectionID && req.userID !== "TruthProvider") {
        let peer = new SimplePeer({
          initiator: false,
          trickle: false,
        });

        peer.on("signal", (v) => {
          socket.send({
            action: "signal",
            roomID: projectID,
            userID: `TruthProvider`,
            signal: v,
            connectionID: req.connectionID,
          });
        });

        peer.signal(req.signal);

        peer.once("connect", () => {
          console.log("[P2P]: TruthProvider OK");
          window.dispatchEvent(new CustomEvent("sync-to-TruthReceiver", {}));
        });

        peer.on("data", (buffer) => {
          let json = JSON.parse(buffer.toString());
          console.log(json);
          if (json.type === "enBatteries") {
            WebRTCStore.enBatteries = json.enBatteries;
          }
        });

        window.addEventListener("sync-to-TruthReceiver", () => {
          project.largeString = JSON.stringify(ProjectStore);
          // console.log(peer.destroyed);
          if (peer && !peer.destroyed && peer.send) {
            peer.send(JSON.stringify(project));
          }
        });
      }
    });
  });

  return () => {
    socket.dispose();
  };
};

export function WebRTCData({ project }) {
  useEffect(() => {
    return makeReceiverLogic({ project: project });
  });

  return <div></div>;
}
