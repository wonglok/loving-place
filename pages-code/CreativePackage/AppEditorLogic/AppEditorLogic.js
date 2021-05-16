import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlockerTemp = () => {
  Hand.addMode = "addBlocker";
};

export const addBlocker = ({ point }) => {
  Hand.floor = { x: 0, y: 0, z: 0 };

  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: "",
  };

  ProjectStore.blockers.addItem(newObj);
};
