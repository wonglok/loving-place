import { useEffect, useState } from "react";
import { P2PMesh } from "./P2PMesh";

export default function OneChannel() {
  let [, setUI] = useState(0);
  let [api, setAPI] = useState(false);
  useEffect(() => {
    //
    let meshP2P = new P2PMesh({
      renderUI: () => {
        setUI((s) => s + 1);
      },
    });

    setAPI(meshP2P);
  }, []);
  return (
    <div>
      {api && (
        <div>
          {api.peerList.map((p) => {
            return (
              <div key={p.infoSocket.connectionID}>
                {p.infoSocket.connectionID} Cansend?{" "}
                {p.canSend ? "can send" : "cannot send"}
                {p.error ? JSON.stringify(p.error) : "cannot send"}
              </div>
            );
          })}
          {/*  */}
          {/* 123 */}
        </div>
      )}
    </div>
  );
}
