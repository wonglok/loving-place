import { createState } from "@hookstate/core";
import { useEffect, useState } from "react";

export const getID = function () {
  return (
    "_" +
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9)
  );
};

let makeSimpleShallowStore = (init = {}) => {
  let Self = {
    _id: getID(),

    ...init,
    onEventChangeKey: (key, func) => {
      let evName = `${Self._id}`;
      let hh = () => {
        func(Self[key]);
      };

      window.addEventListener(`${evName}-${key}`, hh);
      return () => {
        window.removeEventListener(`${evName}-${key}`, hh);
      };
    },
    onChangeKey: (key, func) => {
      useEffect(() => {
        let evName = `${Self._id}`;
        let hh = () => {
          func(Self[key]);
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
        let evName = `${Self._id}`;

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
    onChangeAny: (key, func) => {
      useEffect(() => {
        let evName = `${Self._id}`;
        let hh = () => {
          func(Self);
        };

        window.addEventListener(`${evName}`, hh);
        return () => {
          window.removeEventListener(`${evName}`, hh);
        };
      }, []);
    },
  };

  return new Proxy(Self, {
    get: (o, k) => {
      return o[k];
    },
    set: (o, key, val) => {
      o[key] = val;

      window.dispatchEvent(
        new CustomEvent(`${Self._id}-${key}`, { detail: {} })
      );

      if (key.indexOf("_") === 0) {
      } else {
        window.dispatchEvent(new CustomEvent(`${Self._id}`, { detail: {} }));
      }

      return true;
    },
  });
};

export const Hand = makeSimpleShallowStore({
  _isDown: false,
  _moved: 0,

  mode: "ready",
  floor: { x: 0, y: 0, z: 0 },
  overlay: "overlay",
});

export const ProjectState = createState({
  current: false,
});

export const makeDragger = () => {
  return {};
};
