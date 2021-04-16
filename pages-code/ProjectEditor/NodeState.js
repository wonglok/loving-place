import { createState } from "@hookstate/core";

export const getID = function () {
  return (
    "_" +
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9)
  );
};

export const HandState = createState({
  birthPlace: { x: 0, y: 0 },
  mode: "ready",
  isDown: false,
  mouse: { x: 0, y: 0 },
  pickup: false,
  dropdown: false,
});

export const resetCursor = () => {
  HandState.merge({
    birthPlace: { x: 0, y: 0 },
    mode: "ready",
    isDown: false,
    mouse: { x: 0, y: 0 },
    pickup: false,
    dropdown: false,
  });
};

export const Nodes = createState([]);

export const Connections = createState([]);

export const addNode = ({
  at = {
    x: Math.floor(HandState.birthPlace.x.get()),
    y: Math.floor(HandState.birthPlace.y.get()),
  },
}) => {
  let temp = {
    _id: getID(),
    x: at.x,
    y: at.y,

    inputs: [
      //
      { _id: getID(), type: "input" },
      { _id: getID(), type: "input" },
      { _id: getID(), type: "input" },
    ],
    outputs: [
      //
      { _id: getID(), type: "output" },
      { _id: getID(), type: "output" },
      { _id: getID(), type: "output" },
    ],
  };

  //
  Nodes.merge([temp]);

  return temp;
};

export const loadAsyncDemoData = () => {
  Nodes.set([]);
  let timers = [];
  for (let i = 0; i < 5; i++) {
    let timer = setTimeout(() => {
      let data = {
        _id: getID(),
        x: 100 + i * 100,
        y: 100,

        inputs: [
          //
          { _id: getID(), type: "input" },
          { _id: getID(), type: "input" },
          { _id: getID(), type: "input" },
        ],
        outputs: [
          //
          { _id: getID(), type: "output" },
          { _id: getID(), type: "output" },
          { _id: getID(), type: "output" },
        ],
      };
      Nodes.merge([data]);
    }, 500 * i);

    timers.push(timer);
  }

  return () => {
    Nodes.set([]);
    timers.forEach(clearTimeout);
  };
};
