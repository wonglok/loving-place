import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MapControls } from "three-stdlib";
import { Hand } from "../AppEditorState/AppEditorState";
export function EditorControls() {
  let { camera, gl } = useThree();
  let works = useRef({});
  useEffect(() => {
    let ctrl = new MapControls(camera, gl.domElement);
    works.current.mapctrl = () => {
      ctrl.update();
    };
    ctrl.enablePan = true;
    ctrl.enableRotate = false;
    ctrl.enableDamping = true;
    ctrl.screenSpacePanning = false;

    ctrl.maxDistance = 5000;
    ctrl.minDistance = 200;

    camera.near = 0.1;
    camera.far = 10000;

    camera.position.x = 0;
    camera.position.y = 300;
    camera.position.z = 125;

    camera.updateProjectionMatrix();
    camera.updateMatrix();

    let cleanMode = Hand.onEventChangeKey("mode", () => {
      if (Hand.mode === "pickup" || Hand.mode === "moving") {
        ctrl.enabled = false;
      } else {
        ctrl.enabled = true;
      }
    });

    return () => {
      cleanMode();
      ctrl.dispose();
    };
  }, [works.current]);

  useFrame((st, dt) => {
    Object.values(works.current).forEach((e) => e(st, dt));
  });

  return <group></group>;
}
