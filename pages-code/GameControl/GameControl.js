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

export const GameControl = () => {
  const { camera, gl, scene } = useThree();
  const loops = useRef([]);
  const onLoop = (v) => loops.current.push(v);
  useFrame(() => {
    loops.current.forEach((e) => e());
  });
  const minLimit = 50;
  const maxLimit = 500;
  const zoom = useRef(new Vector3(0, 125, 125));

  useWheel(
    (state) => {
      let deltaY = state.vxvy[1] * 3;

      if (zoom.current.z > minLimit) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = minLimit;
        zoom.current.z = minLimit;
      }

      if (zoom.current.z < maxLimit) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = maxLimit;
        zoom.current.z = maxLimit;
      }

      camera.needsUpdate = true;
    },
    { domTarget: gl.domElement, eventOptions: { passive: false } }
  );

  usePinch(
    (state) => {
      let deltaY = state.vdva[0] * -3;

      if (zoom.current.z > minLimit) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = minLimit;
        zoom.current.z = minLimit;
      }

      if (zoom.current.z < maxLimit) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = maxLimit;
        zoom.current.z = maxLimit;
      }

      camera.needsUpdate = true;
    },
    { domTarget: gl.domElement, eventOptions: { passive: false } }
  );

  useEffect(() => {
    camera.far = 100000;
    camera.near = 0.1;
    camera.updateProjectionMatrix();

    const MapControls =
      require("three/examples/jsm/controls/OrbitControls").MapControls;
    let mapContrtols = new MapControls(camera, gl.domElement);

    mapContrtols.minDistance = minLimit;
    mapContrtols.maxDistance = maxLimit;

    mapContrtols.screenSpacePanning = false;
    mapContrtols.enablePan = false;
    mapContrtols.enableZoom = true;
    mapContrtols.enableDamping = true;
    mapContrtols.enableRotate = false;

    onLoop(() => {
      mapContrtols.update();
    });

    Promise.all([
      ready(async () => {
        try {
          return scene.getObjectByName("myself");
        } catch (e) {}
      }),
      ready(async () => {
        let myself = await ready(() => {
          try {
            return scene.getObjectByName("myself");
          } catch (e) {}
        });
        try {
          return myself.getObjectByName("mixamorigHips");
        } catch (e) {}
      }),
    ]).then(([group, lookAt]) => {
      //
      onLoop(() => {
        // mapContrtols.target.x = lookAt.position.x;
        // mapContrtols.target.y = lookAt.position.y;
        // mapContrtols.target.z = lookAt.position.z;

        lookAt.getWorldPosition(mapContrtols.target);

        mapContrtols.object.position.x = mapContrtols.target.x;
        mapContrtols.object.position.y =
          mapContrtols.target.y + zoom.current.y * 1;
        mapContrtols.object.position.z =
          mapContrtols.target.z + zoom.current.z * 1;

        if (camera.needsUpdate) {
          camera.updateMatrixWorld();
        }
      });
    });

    return () => {
      loops.current = [];
      mapContrtols.dispose();
    };
  }, []);

  return <group></group>;
};
