import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
// import { Me } from "../AppState/AppState";
import { usePinch, useWheel } from "react-use-gesture";

function ready(fn) {
  return new Promise((resolve) => {
    let tt = setInterval(async () => {
      let ans = await fn();
      if (ans) {
        clearInterval(tt);
        resolve(ans);
      }
    });
  });
}

export const OrbitGraphControls = () => {
  const { camera, gl, scene } = useThree();
  const loops = useRef([]);
  const onLoop = (v) => loops.current.push(v);
  useFrame(() => {
    loops.current.forEach((e) => e());
  });
  const worldScale = 0.4;
  const minLimit = 500 * worldScale;
  const maxLimit = 1500 * worldScale;
  const ratio = 1;
  const zoom = useRef(
    new Vector3(0, 1000 * worldScale, 1000 * worldScale * ratio)
  );

  useWheel(
    (state) => {
      let deltaY = state.vxvy[1] * 3;

      if (zoom.current.z >= minLimit * ratio) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY * ratio;
      } else {
        zoom.current.y = minLimit;
        zoom.current.z = minLimit * ratio;
      }

      if (zoom.current.z <= maxLimit * ratio) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY * ratio;
      } else {
        zoom.current.y = maxLimit;
        zoom.current.z = maxLimit * ratio;
      }

      camera.needsUpdate = true;
    },
    { domTarget: gl.domElement, eventOptions: { passive: false } }
  );

  usePinch(
    (state) => {
      if (zoom.current.length() / maxLimit <= 0.9) {
        state.event.preventDefault();
      }

      let deltaY = state.vdva[0] * -3;

      if (zoom.current.z > minLimit * ratio) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY * ratio;
      } else {
        zoom.current.y = minLimit;
        zoom.current.z = minLimit * ratio;
      }

      if (zoom.current.z < maxLimit * ratio) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY * ratio;
      } else {
        zoom.current.y = maxLimit;
        zoom.current.z = maxLimit * ratio;
      }

      camera.needsUpdate = true;
    },
    { domTarget: gl.domElement, eventOptions: { passive: false } }
  );

  useEffect(() => {
    camera.far = 100000;
    camera.near = 0.2;
    camera.fov = 90;
    camera.focus = 1;
    camera.updateProjectionMatrix();

    const {
      MapControls,
    } = require("three/examples/jsm/controls/OrbitControls");
    //
    const mapContrtols = new MapControls(camera, gl.domElement);

    mapContrtols.minDistance = minLimit;
    mapContrtols.maxDistance = maxLimit;

    mapContrtols.screenSpacePanning = false;
    mapContrtols.enablePan = true;
    mapContrtols.enableZoom = false;
    mapContrtols.enableDamping = true;
    mapContrtols.enableRotate = false;

    //
    onLoop(() => {
      mapContrtols.object.position.x = mapContrtols.target.x;

      // let posZ = Math.pow(
      //   zoom.current.length() - zoom.current.z,
      //   zoom.current.length() / maxLimit
      // );
      // let posY = Math.pow(
      //   zoom.current.length() - zoom.current.y,
      //   zoom.current.length() / maxLimit
      // );
      mapContrtols.object.position.y =
        mapContrtols.target.y + zoom.current.y * 1.0; // + posY * 20.0;

      mapContrtols.object.position.z =
        mapContrtols.target.z + zoom.current.z * 0.5; // + 0.0 * posZ;

      mapContrtols.update();
    });

    return () => {
      loops.current = [];
      mapContrtols.dispose();
    };
  }, []);

  return <group></group>;
};
