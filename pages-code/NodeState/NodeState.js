import { createState } from "@hookstate/core";
import { useEffect } from "react";

export const getID = function () {
  return (
    "_" +
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9)
  );
};

export const HandState = createState({
  birthPlace: { x: 0, y: 0, z: 0 },
  mode: "ready",
  isDown: false,
  mouse: { x: 0, y: 0 },
  pickup: false,
  dropdown: false,
});

export const resetCursor = () => {
  HandState.merge({
    birthPlace: { x: 0, y: 0, z: 0 },
    mode: "ready",
    isDown: false,
    mouse: { x: 0, y: 0 },
    pickup: false,
    dropdown: false,
  });
};

export const Nodes = createState([]);
export const Connections = createState([]);
export const OverlayState = createState("closed");
export const ToolbarState = createState("closed");

export const addNode = ({
  at = {
    x: Math.floor(HandState.birthPlace.x.get()),
    y: Math.floor(HandState.birthPlace.y.get()),
    z: Math.floor(HandState.birthPlace.z.get()),
  },
}) => {
  //
  let newNode = {
    _id: getID(),
    //
    x: at.x,
    y: at.y,
    z: at.z,

    inputs: [
      { _id: getID(), type: "input" },
      { _id: getID(), type: "input" },
      { _id: getID(), type: "input" },
    ],
    outputs: [
      { _id: getID(), type: "output" },
      { _id: getID(), type: "output" },
      { _id: getID(), type: "output" },
    ],
  };

  //
  Nodes.merge([newNode]);

  return newNode;
};

export const loadAsyncDemoData = () => {
  Nodes.set([]);
  let timers = [];

  for (let i = 0; i < 5; i++) {
    let timer = setTimeout(() => {
      addNode({
        at: { x: 0, y: i * 100, z: 0 },
      });
    }, 500 * i);
    timers.push(timer);
  }

  return () => {
    Nodes.set([]);
    timers.forEach(clearTimeout);
  };
};

export function useLoop(loopFnc) {
  useEffect(() => {
    let rAFID = 0;
    let h = () => {
      rAFID = requestAnimationFrame(h);
      loopFnc();
    };
    rAFID = requestAnimationFrame(h);
    return () => {
      cancelAnimationFrame(rAFID);
    };
  });
}
