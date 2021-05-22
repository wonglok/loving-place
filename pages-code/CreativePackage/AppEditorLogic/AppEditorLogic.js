import { get } from "sortablejs";
import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlocker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newModuleTitleName,
  };

  let makePort = (type = "input", idx) => {
    return {
      _id: getID(),
      type,
      idx,
      blockerID: newObj._id,
    };
  };

  ProjectStore.blockers.addItem(newObj);

  ProjectStore.ports.addItem(makePort("input", 0));
  ProjectStore.ports.addItem(makePort("input", 1));
  ProjectStore.ports.addItem(makePort("input", 2));
  ProjectStore.ports.addItem(makePort("input", 3));
  ProjectStore.ports.addItem(makePort("input", 4));

  ProjectStore.ports.addItem(makePort("output", 0));
  ProjectStore.ports.addItem(makePort("output", 1));
  ProjectStore.ports.addItem(makePort("output", 2));
  ProjectStore.ports.addItem(makePort("output", 3));
  ProjectStore.ports.addItem(makePort("output", 4));
};

export const getTextInput = (title = "text0") => {
  return {
    _id: getID(),
    type: "text",
    title,
    value: "",
  };
};
export const getColorPicker = (title = "color0") => {
  return {
    _id: getID(),
    type: "hex",
    title,
    value: "#ffffff",
  };
};
export const getSlider = (title = "slder0") => {
  return {
    _id: getID(),
    type: "float",
    title,
    value: 0,
  };
};
export const getSliderVec4 = (title = "vec4slider0") => {
  return {
    _id: getID(),
    type: "vec4",
    title,
    value: [1, 1, 1, 1],
  };
};

export const addPicker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newPickerTitleName,
    pickers: [
      getTextInput("text1"),
      getTextInput("text2"),
      getColorPicker("color1"),
      getColorPicker("color2"),
      getColorPicker("color3"),
      getSlider("slider1"),
      getSlider("slider2"),
      getSliderVec4("vec4slider1"),
      getSliderVec4("vec4slider2"),
    ],
  };

  ProjectStore.pickers.addItem(newObj);
};

export const addConnection = () => {
  if (Hand.pickupPort && Hand.releasePort) {
    if (Hand.pickupPort.type !== Hand.releasePort.type) {
      if (Hand.pickupPort.blockerID !== Hand.releasePort.blockerID) {
        let io = [Hand.pickupPort, Hand.releasePort];
        let newConn = {
          _id: getID(),
          // input:
          input: io.find((e) => e.type === "input"),
          output: io.find((e) => e.type === "output"),
        };

        ProjectStore.connections.addItem(newConn);
        console.log("add-connection", Hand.pickupPort, Hand.releasePort);
      }
    }
  }
};
