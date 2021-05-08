import { useContext, useEffect, useState } from "react";
import { NetworkContext } from "./bigscreen";

export default function NetworkApp() {
  let [canEdit, setCanEdit] = useState(false);
  let { socket, p2p, myConnID, roomID, userID } = useContext(NetworkContext);

  useEffect(() => {
    socket.on("signal", ({ signal, senderConnID }) => {
      console.log(p2p.initiator, signal, senderConnID);
      if (senderConnID !== myConnID) {
        p2p.signal(signal);
      }
    });

    // if we already got message then ... sent it to others
    if (p2p.signalSend) {
      socket.send({
        action: "signal",
        roomID,
        userID,
        senderConnID: myConnID,
        signal: p2p.signalSend,
      });
    }

    p2p.on("signal", (signal) => {
      socket.send({
        action: "signal",
        roomID,
        userID,
        senderConnID: myConnID,
        signal: signal,
      });
    });

    p2p.on("connect", () => {
      console.log("CONNECT");
      p2p.send("whatever" + Math.random());
      setCanEdit(true);
    });

    p2p.on("data", (data) => {
      console.log("data: " + data);
    });
  }, []);

  return (
    <div>
      {canEdit ? (
        <button
          className="bg-blue-200 p-3"
          onClick={() => {
            p2p.send(`wahaha from ${myConnID}`);
          }}
        >
          Send Data
        </button>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
}

//
