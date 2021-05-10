import { createContext, useContext, useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import { EnvConfig, LambdaClient } from "../../pages-code/api/realtime";

let Internal = {
  roomID: "roomID",
  userID: "userID",
  myConnID: false,
  socket: false,
  clients: [],
  peers: {},
  apis: {},
};

export const RPCContext = createContext(Internal);

function EachPeer({ peer }) {
  let { socket, myConnID, peers, apis, clients, roomID, userID } = useContext(
    RPCContext
  );
  let [p2pAPI, setAPI] = useState(false);
  let [, setReload] = useState(0);
  useEffect(() => {
    let myself = clients.find((e) => e.connectionID === myConnID);
    if (!myself) {
      return;
    }
    if (!peer) {
      return;
    }

    let initiator = myself.onlineTime > peer.onlineTime;

    let p2p = (peers[peer.connectionID] = new SimplePeer({
      trickle: false,
      initiator,
    }));

    p2p.on("signal", (signal) => {
      if (p2p.destroyed) {
        console.log("destroyed trying to send signal", signal);
        return;
      }

      socket.send({
        action: "signal",
        roomID,
        userID,
        signal,

        initiator,
        myself,
        peer,
      });
    });

    //

    socket.on("signal", (ev) => {
      if (p2p.destroyed) {
        return;
      }

      if (ev.initiator && !initiator) {
        if (ev.peer.connectionID === myself.connectionID) {
          if (ev.signal.type === "offer" && !p2p.isShaken) {
            p2p.signal(ev.signal);
            p2p.isShaken = true;
          }
        }
      }
      if (!ev.initiator && initiator) {
        if (ev.myself.connectionID === peer.connectionID) {
          if (ev.signal.type === "answer" && !p2p.isConnected) {
            p2p.signal(ev.signal);
            p2p.isConnected = true;
          }
        }
      }

      // if (!initiator && ev.myself.connectionID === myself.connectionID) {
      //   if (ev.signal.type === "offer") {
      //     p2p.signal(ev.signal);
      //   }
      // } else if (initiator && ev.myself.connectionID === myself.connectionID) {
      //   if (ev.signal.type === "offer") {
      //     p2p.signal(ev.signal);
      //   }
      // }
      // let senderIsInit = ev.initiator;
      // if (senderIsInit) {
      //   // p2p.signal(ev.signal);
      // }
      // // if (ev.peer.connectionID === peer.connectionID) {
      // //   p2p.signal(ev.signal);
      // // }
    });

    p2p.on("connect", () => {
      console.log(
        `connected! myself: ${myself.connectionID} peer: ${peer.connectionID}`
      );
      p2p.send(
        `connected! myself: ${myself.connectionID} peer: ${peer.connectionID}`
      );
      setAPI(p2p);
      apis[myself.connectionID] = p2p;
    });

    p2p.on("data", (str) => {
      console.log(`received: ${str}`);
    });

    p2p.on("close", () => {
      socket.send({
        action: "heartbeat",
        roomID: Internal.roomID,
      });
      delete apis[myself.connectionID];
      setAPI(false);
    });

    p2p.on("error", () => {
      socket.send({
        action: "heartbeat",
        roomID: Internal.roomID,
      });
      delete apis[myself.connectionID];
      setAPI(false);
    });

    return () => {
      socket.send({
        action: "heartbeat",
        roomID: Internal.roomID,
      });
      delete apis[myself.connectionID];
      p2p.removeAllListeners("error");
      p2p.removeAllListeners("close");
      p2p.removeAllListeners("data");
      p2p.removeAllListeners("connect");
      p2p.removeAllListeners("signal");
      p2p.destroy();
    };
  }, []);

  return (
    <div>
      {peer.connectionID}
      {p2pAPI ? (
        <div className="text-green-500 inline-block">connected</div>
      ) : (
        <div className={"text-red-500 inline-block"}>offline</div>
      )}
      {p2pAPI ? (
        <div className="inline-block">
          <button
            className={"p-3"}
            onClick={() => {
              p2pAPI.send(
                `connected! myself: ${myConnID} peer: ${
                  peer.connectionID
                } ${Math.random()}`
              );
            }}
          >
            Send
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

function RPCApp() {
  let { socket, myConnID } = useContext(RPCContext);

  console.log(myConnID);
  let [, setReload] = useState(0);
  useEffect(() => {
    socket.on("latest-clients", (e) => {
      Internal.clients = e.clients;
      setReload((s) => s + 1);
    });
  }, []);

  return (
    <div>
      Myself: {myConnID}
      {Internal.clients
        .filter((c) => c.connectionID !== myConnID)
        .map((peer) => {
          return (
            <div key={peer.connectionID}>
              <EachPeer peer={peer}></EachPeer>
            </div>
          );
        })}
    </div>
  );
}

export default function RPC() {
  let [ready, setReady] = useState(false);
  //
  useEffect(() => {
    let socket = new LambdaClient({ url: EnvConfig.ws });
    Internal.socket = socket;
    Internal.roomID = "MyPartyRoom";
    Internal.userID = "MyUnknownUserID";

    socket.on("join-room", (e) => {
      Internal.myConnID = e.connectionID;
      setReady(true);
    });

    socket.send({
      action: "join-room",
      roomID: Internal.roomID,
      userID: Internal.userID,
    });

    // setInterval(() => {
    //   socket.send({
    //     action: "heartbeat",
    //     roomID: Internal.roomID,
    //   });
    // }, 1000 * 3);
  }, []);

  return (
    <RPCContext.Provider value={Internal}>
      {ready && <RPCApp></RPCApp>}
    </RPCContext.Provider>
  );
}
