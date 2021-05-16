import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlocker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: "",
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

export const addConnection = () => {
  //

  console.log(123);
};
