import SimplePeer from "simple-peer";
import { EnvConfig, LambdaClient } from "../../pages-code/api/realtime";

//
export class P2PClient {
  constructor({ p2pMesh, infoSocket, myself }) {
    //
    let { socket, roomID, userID } = (this.p2pMesh = p2pMesh);

    this.infoSocket = infoSocket;
    this.myself = myself;

    this.initiator = myself.onlineTime > infoSocket.onlineTime;

    let p2p = new SimplePeer({
      trickle: false,
      initiator: this.initiator,
    });
    this.p2p = p2p;

    p2p.on("signal", (signal) => {
      if (p2p.destroyed) {
        console.log("destroyed trying to send signal", signal);
        return;
      }
      this.signal = signal;
    });

    let sendSignal = (signal) => {
      socket.send({
        action: "signal",
        roomID,
        userID,
        signal,

        initiator: this.initiator,
        myself,
        peer: infoSocket,
      });
    };

    if (this.initiator) {
      let sendOfferTimer = setInterval(() => {
        if (this.signal) {
          clearInterval(sendOfferTimer);
          sendSignal(this.signal);
        }
      });
    }

    p2p.on("connect", () => {
      console.log("connected", myself.connectionID, infoSocket.connectionID);
      this.canSend = true;
      this.p2pMesh.renderUI();
    });

    p2p.on("close", () => {
      console.log("close");
    });
    p2p.on("error", (err) => {
      console.log("error");
      this.error = err;
      this.p2pMesh.renderUI();
    });

    let sendOfferTimer = setInterval(() => {
      if (this.p2p.destroyed) {
        clearInterval(sendOfferTimer);
        this.p2pMesh.renderUI();
      }
    });

    socket.on("signal", (ev) => {
      if (ev.initiator && !this.initiator) {
        if (ev.peer.connectionID === myself.connectionID) {
          if (ev.signal.type === "offer" && !p2p.isShaken) {
            p2p.signal(ev.signal);
            p2p.isShaken = true;

            //
            let sendOfferTimer = setInterval(() => {
              if (this.signal) {
                clearInterval(sendOfferTimer);
                sendSignal(this.signal);
              }
            });
          }
        }
      }

      if (!ev.initiator && this.initiator) {
        if (ev.myself.connectionID === infoSocket.connectionID) {
          if (ev.signal.type === "answer" && !p2p.isConnected) {
            p2p.signal(ev.signal);
            p2p.isConnected = true;
          }
        }
      }
    });

    console.log("created p2pnode");
  }
}

export class P2PMesh {
  constructor({
    roomID = "myRoomID",
    userID = "myRandomUserID",
    renderUI = () => {},
  }) {
    this.myConnID = "";
    this.myself = false;
    this.clientList = [];
    this.scanList = [];
    this.peerList = [];
    this.roomID = roomID;
    this.userID = userID;
    this.renderUI = renderUI;

    let socket = new LambdaClient({ url: EnvConfig.ws });
    this.socket = socket;

    socket.send({
      action: "join-room",
      roomID: this.roomID,
      userID: this.userID,
    });

    socket.on("latest-clients", (e) => {
      this.clientList = e.clients;
      this.myConnID = e.connectionID;
      this.myself = this.clientList.find(
        (e) => e.connectionID === this.myConnID
      );
      this.scanList = this.clientList.filter(
        (e) => e.connectionID !== this.myConnID
      );

      this.syncClients();
    });

    this.removeScan = () => {};

    this.syncClients = () => {
      //----
      this.scanList.forEach((infoSocket) => {
        console.log(infoSocket);

        if (
          !this.peerList
            .map((e) => e.infoSocket.connectionID)
            .includes(infoSocket.connectionID)
        ) {
          let p2pClient = new P2PClient({
            infoSocket,
            p2pMesh: this,
            myself: this.myself,
          });
          this.peerList.push(p2pClient);
        }
      });
      //----
    };
  }
}
