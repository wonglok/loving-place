import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlockerTemp = () => {
  // queryCanvasState(({ raycaster, mouse, camera, scene }) => {
  //   raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  //   let floor = scene.getObjectByName("app-floor");
  //   if (floor) {
  //     raycaster.intersectObject(floor);
  //     // let newItem = {
  //     //   _id: getID(),
  //     //   x:
  //     // }
  //   } else {
  //     console.error("cannot find app-floor");
  //   }
  //   //
  //   // ProjectStore.blockers.addItem(newItem)
  // });

  Hand.addMode = "addItem";
};

export const addBlocker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
  };
  ProjectStore.blockers.addItem(newObj);
};
