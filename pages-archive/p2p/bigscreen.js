import { createContext, lazy, useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import {
  EnvConfig,
  LambdaClient,
  LoggedInContent,
} from "../../pages-code/api/realtime";
import NetworkApp from "./NetworkApp";

let Internal = {};

export const NetworkContext = createContext(Internal);

export default function Lambda() {
  let [ready, setReady] = useState(false);

  useEffect(() => {
    let clean = () => {};

    Internal.isInit = window.location.hash === "#1";
    Internal.roomID = "party-room-default";
    Internal.userID = "Sender";

    let socket = new LambdaClient({
      url: EnvConfig.ws,
    });

    let p2p = new SimplePeer({
      initiator: Internal.isInit,
      trickle: false,
    });
    p2p.on("signal", (signal) => {
      p2p.signalSend = signal;
    });

    socket.on("latest-clients", (e) => {
      console.log("latst-clients", e);
    });

    socket.send({
      action: "join-room",
      roomID: Internal.roomID,
      userID: Internal.userID,
    });

    socket.on("join-room", (e) => {
      Internal.myConnID = e.connectionID;

      setReady(NetworkContext);
    });

    Internal.socket = socket;
    Internal.p2p = p2p;

    //
    clean = () => {
      console.log("clean");
      socket.dispose();
      p2p.destroy();
    };

    return () => {
      clean();
    };
  }, []);

  return (
    <LoggedInContent>
      {ready && <NetworkApp CTX={ready}></NetworkApp>}
    </LoggedInContent>
  );
}
