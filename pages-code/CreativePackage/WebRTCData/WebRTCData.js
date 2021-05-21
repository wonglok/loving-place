import { useEffect } from "react";
import SimplePeer from "simple-peer";
import { AuthState, EnvConfig, LambdaClient } from "../../api/realtime";
import {
  makeSimpleShallowStore,
  ProjectStore,
} from "../AppEditorState/AppEditorState";

let WebRTCStore = makeSimpleShallowStore({
  //
  socket: false,
  clients: [],
});

let makeReceiverLogic = ({ project }) => {
  let projectID = project._id;

  let socket = new LambdaClient({
    url: EnvConfig.ws,
  });
  WebRTCStore.socket = socket;

  let user = AuthState.user.get();

  socket.send({
    action: "join-room",
    roomID: projectID,
    userID: `TruthProvider`,
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
          console.log("connecrted!!! on encloud");
          // peer.send("wagahahahaha from encloud");
          window.dispatchEvent(new CustomEvent("sync-to-TruthConsumer", {}));
        });

        window.addEventListener("sync-to-TruthConsumer", () => {
          project.largeString = JSON.stringify(ProjectStore);
          console.log(peer.destroyed);
          if (!peer.destroyed && peer.send) {
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
