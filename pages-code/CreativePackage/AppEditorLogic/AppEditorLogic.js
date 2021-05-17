import { get } from "sortablejs";
import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlocker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newModuleTitleName,
  };

  let makePort = (type = "input") => {
    return {
      _id: getID(),
      type,
      blockerID: newObj._id,
    };
  };

  ProjectStore.blockers.addItem(newObj);

  ProjectStore.ports.addItem(makePort("input"));
  ProjectStore.ports.addItem(makePort("input"));
  ProjectStore.ports.addItem(makePort("input"));
  ProjectStore.ports.addItem(makePort("input"));
  ProjectStore.ports.addItem(makePort("input"));

  ProjectStore.ports.addItem(makePort("output"));
  ProjectStore.ports.addItem(makePort("output"));
  ProjectStore.ports.addItem(makePort("output"));
  ProjectStore.ports.addItem(makePort("output"));
  ProjectStore.ports.addItem(makePort("output"));
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
