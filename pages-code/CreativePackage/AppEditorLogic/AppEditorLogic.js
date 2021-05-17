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

export const addPicker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newPickerTitleName,
    pickers: [],
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
