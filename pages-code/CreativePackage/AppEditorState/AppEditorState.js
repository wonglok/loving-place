import { useEffect, useState } from "react";
import localforage from "localforage";
export const getID = function () {
  return (
    "_" +
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9)
  );
};

export const onEvent = function (ev, fnc) {
  useEffect(() => {
    window.addEventListener(ev, fnc);
    return () => {
      window.removeEventListener(ev, fnc);
    };
  }, []);
};

export const makeSimpleShallowStore = (myObject = {}) => {
  let ___NameSpaceID = getID();
  let Utils = {
    exportJSON: () => {
      return JSON.parse(JSON.stringify(myObject));
    },
    getNameSpcaeID: () => {
      return ___NameSpaceID;
    },
    onEventChangeKey: (key, func) => {
      let evName = `${___NameSpaceID}`;
      let hh = () => {
        func(myObject[key]);
      };

      window.addEventListener(`${evName}-${key}`, hh);
      return () => {
        window.removeEventListener(`${evName}-${key}`, hh);
      };
    },
    onChangeKey: (key, func) => {
      useEffect(() => {
        let evName = `${___NameSpaceID}`;
        let hh = () => {
          func(myObject[key]);
        };

        window.addEventListener(`${evName}-${key}`, hh);
        return () => {
          window.removeEventListener(`${evName}-${key}`, hh);
        };
      }, []);
    },

    makeKeyReactive: (key) => {
      let [, setSt] = useState(0);
      useEffect(() => {
        let evName = `${___NameSpaceID}`;

        let hh = () => {
          setSt((s) => {
            return s + 1;
          });
        };

        window.addEventListener(`${evName}-${key}`, hh);
        return () => {
          window.removeEventListener(`${evName}-${key}`, hh);
        };
      }, []);
    },
    notifyKeyChange: (key) => {
      window.dispatchEvent(
        new CustomEvent(`${___NameSpaceID}-${key}`, { detail: {} })
      );
    },
  };

  let setupArray = (array, key, Utils) => {
    array.getItemByID =
      array.getItemByID ||
      ((_id) => {
        let result = array.find((a) => a._id === _id);
        return result;
      });

    array.getItemIndexByID =
      array.getItemIndexByID ||
      ((_id) => {
        let result = array.findIndex((a) => a._id === _id);
        return result;
      });

    array.addItem =
      array.addItem ||
      ((item) => {
        let api = makeSimpleShallowStore(item);
        array.push(api);

        let ns = Utils.getNameSpcaeID();
        window.dispatchEvent(new CustomEvent(`${ns}-${key}`, { detail: {} }));

        return api;
      });

    array.removeItem =
      array.removeItem ||
      ((item) => {
        //
        let idx = array.findIndex((a) => a._id === item._id);

        if (idx !== -1) {
          array.splice(idx, 1);
          let ns = Utils.getNameSpcaeID();
          window.dispatchEvent(new CustomEvent(`${ns}-${key}`, { detail: {} }));
        } else {
          console.log(`item not found: ${item._id}`);
        }
      });
  };

  Object.keys(myObject).forEach((kn) => {
    let val = myObject[kn];
    if (val instanceof Array) {
      setupArray(val, kn, Utils);
    }
  });

  let proxy = new Proxy(myObject, {
    get: (o, k) => {
      //
      if (Utils[k]) {
        return Utils[k];
      }

      return o[k];
    },
    set: (o, key, val) => {
      if (val instanceof Array) {
        setupArray(val, key, Utils);
      }

      o[key] = val;

      window.dispatchEvent(
        new CustomEvent(`${___NameSpaceID}-${key}`, { detail: {} })
      );

      return true;
    },
  });

  return proxy;
};

let DBCache = new Map();

let obtainDB = (projectID) => {
  if (DBCache.has(projectID)) {
    return DBCache.get(projectID);
  }

  var store = localforage.createInstance({
    name: "SnapsOfProjectID_" + projectID,
  });
  DBCache.set(projectID, store);
  return store;
};

export const Hand = makeSimpleShallowStore({
  _isDown: false,
  _moved: 0,

  addMode: "ready",
  newModuleTitleName: "my new code",
  newPickerTitleName: "my new code",

  pickupPort: false,
  releasePort: false,

  mode: "ready",
  floor: [0, 0, 0],

  overlay: "overlay",
  currentBlockerID: false,
  currentPickerID: false,

  tooltip: "ready",
});

export const AutoSaver = makeSimpleShallowStore({
  showNeedsSave: "saved",
});

export const LocalStoreDB = (v) => obtainDB(v);

export const RenderTrigger = makeSimpleShallowStore({
  renderConnection: 0,
  frame: 0,
});

export const ProjectStore = makeSimpleShallowStore({
  _id: "",
  blockers: [],
  ports: [],
  connections: [],
  pickers: [],
});

export const ProjectBackupStore = makeSimpleShallowStore({
  snaps: [],
});

export const TempData = {
  canvasState: false,
};

export const provdeCanvasState = (State) => {
  TempData.canvasState = State;
};

export const queryCanvasState = (fnc) => {
  let tt = setInterval(() => {
    let obj = TempData.canvasState;
    if (obj) {
      clearInterval(tt);
      fnc(obj);
      TempData.canvasState = false;
    }
  });
};

//
