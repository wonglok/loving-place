import axios from "axios";

let isFunction = function (obj) {
  return typeof obj === "function" || false;
};

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  addEventListener(label, callback) {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(callback);
  }

  removeEventListener(label, callback) {
    let listeners = this.listeners.get(label);
    let index = 0;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        let a = () => {
          i = index;
          return i;
        };
        return isFunction(listener) && listener === callback ? a() : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }
    return false;
  }
  trigger(label, ...args) {
    let listeners = this.listeners.get(label);

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args);
      });
      return true;
    }
    return false;
  }
}

export class LambdaClient extends EventEmitter {
  constructor({ url, token }) {
    super();
    this.url = url;
    this.autoReconnectInterval = 5 * 1000;
    this.open();
  }

  get ready() {
    return this.ws.readyState === WebSocket.OPEN;
  }
  close() {
    try {
      this.ws.__disposed = true;
      this.ws.close();
      console.log("WebSocket: closed");
    } catch (e) {
      console.log(e);
    }
  }
  open() {
    this.ws = new WebSocket(this.url);
    this.ws.__disposed = false;

    this.ws.addEventListener("open", (e) => {
      if (this.ws.__disposed) {
        return;
      }
      console.log("WebSocket: opened");
    });

    this.ws.addEventListener("message", (evt) => {
      if (this.ws.__disposed) {
        return;
      }

      try {
        let response = JSON.parse(evt.data);
        if (response && response.inventory && response.inventory.inv) {
          delete response.inventory;
        }
        this.trigger(response.action, response);
      } catch (e) {
        console.log(e);
      }
    });

    this.ws.addEventListener("close", (e) => {
      if (this.ws.__disposed) {
        return;
      }

      switch (e.code) {
        case 1000: // CLOSE_NORMAL
          console.log("WebSocket: closed");
          break;
        default:
          // Abnormal closure
          this.reconnect(e);
          break;
      }
      this.onClose(e);
    });

    this.ws.addEventListener("error", (e) => {
      if (this.ws.__disposed) {
        return;
      }

      switch (e.code) {
        case "ECONNREFUSED":
          this.reconnect(e);
          break;
        default:
          this.onError(e);
          break;
      }
    });
  }

  onClose(e) {
    console.log(e);
  }
  onError(e) {
    console.log(e);
  }

  reconnect(e) {
    if (this.ws) {
      this.ws.__disposed = true;
    }
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);

    setTimeout(() => {
      console.log("WebSocketClient: reconnecting...");
      this.open();
    }, this.autoReconnectInterval);
  }

  ensureWS(fnc) {
    let tt = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        clearInterval(tt);
        fnc();
      }
    }, 0);
  }

  // api
  send(data) {
    this.ensureWS(() => {
      this.ws.send(JSON.stringify(data));
    });
  }

  on(event, handler) {
    this.addEventListener(event, handler);
  }

  once(event, handler) {
    let hh = (v) => {
      this.removeEventListener(event, v);
      handler(v);
    };
    this.addEventListener(event, hh);
  }

  off(event) {
    let arr = this.listeners.get(event) || [];
    arr.forEach((l) => {
      this.removeEventListener(event, l);
    });
  }

  offOne(event, handler) {
    this.removeEventListener(event, handler);
  }
}

let envs = {
  development: {
    rest: `http://localhost:3333`,
    ws: `ws://localhost:3333`,
  },
  production: {
    rest: `https://awbah4vhil.execute-api.us-west-2.amazonaws.com`,
    ws: `wss://lpminytf73.execute-api.us-west-2.amazonaws.com/production`,
  },
  staging: {
    rest: `https://ogvqtgaps5.execute-api.us-west-2.amazonaws.com`,
    ws: `wss://blwvywnbc6.execute-api.us-west-2.amazonaws.com/staging`,
  },
};

let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
}
if (process.env.NODE_ENV === "test") {
  mode = "staging";
}

console.log(process.env.NODE_ENV);

// deubg
// mode = "staging";

export const config = envs[mode];

const testRunBell = () => {
  let bell = new LambdaClient({
    url: config.ws,
  });

  let userID = "wonglok831";

  let joinRoomThen = async ({ roomID = "boradcast-public-room" }) => {
    return new Promise((resolve) => {
      bell.on("room-joined", (e) => {
        console.log("room joined", e);
        resolve({ roomID, userID });
      });

      bell.send({
        action: "join-room",
        roomID,
        userID,
      });
    });
  };

  let birthdayRoom = "birthday-party-room";

  joinRoomThen({ roomID: birthdayRoom }).then((e) => {
    bell.on("hello", (data) => {
      console.log("respone-of-hello", data);
    });

    bell.send({
      action: "hello",
      roomID: birthdayRoom,
      data: {
        userID,
        msg: "wahaahaha " + Math.random(),
      },
    });
  });

  console.log(bell);
};

export const checkError = (json) => {
  if (json.isError) {
    return Promise.reject(json.message);
  } else {
    return json;
  }
};

export const parseToJSON = (e) => {
  try {
    return e.json();
  } catch (e) {
    return Promise.reject("bad json");
  }
};

export const register = async ({ username, password, email }) => {
  let res = await axios({
    method: "POST",
    baseURL: config.rest,
    url: "/auth?action=register",
    data: {
      username,
      password,
      email,
    },
    headers: {
      "Access-Control-Allow-Origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const login = async ({ identity, password }) => {
  let res = await axios({
    method: "POST",
    baseURL: config.rest,
    url: "/auth?action=login",
    data: {
      identity,
      password,
    },
    headers: {
      "Access-Control-Allow-Origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

export const taken = async ({ identity }) => {
  let res = await axios({
    method: "POST",
    baseURL: config.rest,
    url: "/auth?action=taken",
    data: {
      identity,
    },
    headers: {
      "Access-Control-Allow-Origin": window.location.origin,
    },
    withCredentials: true,
  }).then(
    (res) => res.data,
    (e) => {
      return Promise.reject({
        message: e?.response?.data?.msg || "server error",
      });
    }
  );

  return res;
};

// export const testAuth = async () => {
//   try {
//     await taken({
//       identity: "tester4@gmail.com",
//     }).then(
//       async () => {
//         let { jwt, user } = await register({
//           username: "tester",
//           password: "testerabc+++",
//           email: "tester4@gmail.com",
//         });

//         console.log(jwt, user);

//         return { jwt, user };
//       },
//       async () => {
//         let { jwt, user } = await login({
//           identity: "tester",
//           password: "testerabc+++",
//         });

//         console.log(jwt, user);

//         return { jwt, user };
//       }
//     );
//   } catch (e) {
//     console.error(e.message);
//   }
// };
// testAuth();

// if (window) {
//   testAuth();
// }
