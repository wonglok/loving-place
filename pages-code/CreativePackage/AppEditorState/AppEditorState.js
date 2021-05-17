import { useEffect, useState } from "react";

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

    onChangeKeyRenderUI: (key) => {
      let [st, setSt] = useState(0);
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
      }, [key, st]);
    },
    notifyKeyChange: (key) => {
      window.dispatchEvent(
        new CustomEvent(`${___NameSpaceID}-${key}`, { detail: {} })
      );
    },
    // onChangeAny: (key, func) => {
    //   useEffect(() => {
    //     let evName = `${___NameSpaceID}`;
    //     let hh = () => {
    //       func(myObject);
    //     };

    //     window.addEventListener(`${evName}`, hh);
    //     return () => {
    //       window.removeEventListener(`${evName}`, hh);
    //     };
    //   }, []);
    // },
  };

  let setupArray = (array, key, Utils) => {
    array.getItemByID =
      array.getItemByID ||
      ((_id) => {
        let result = array.find((a) => a._id === _id);
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

export const AutoSave = makeSimpleShallowStore({
  //
  inc: 0,
  //
  latestSnaptime: 0,
  //
  trackingJSON: "",
});

export const RenderTrigger = makeSimpleShallowStore({
  renderConnection: 0,
  frame: 0,
});

export const ProjectStore = makeSimpleShallowStore({
  blockers: [],
  ports: [],
  connections: [],
  pickers: [],
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
