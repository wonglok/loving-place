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
    loops.current = [];
    camera.far = 100000;
    camera.near = 0.1;
    camera.updateProjectionMatrix();

    const MapControls = require("three/examples/jsm/controls/OrbitControls")
      .MapControls;
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
        return scene.getObjectByName("myself");
      }),
      ready(async () => {
        let myself = await ready(() => {
          return scene.getObjectByName("myself");
        });
        return myself.getObjectByName("mixamorigHips");
      }),
    ]).then(([group, lookAt]) => {
      //
      onLoop(() => {
        // mapContrtols.target.x = lookAt.position.x;
        // mapContrtols.target.y = lookAt.position.y;
        // mapContrtols.target.z = lookAt.position.z;

        lookAt.getWorldPosition(mapContrtols.target);

        mapContrtols.object.position.x = mapContrtols.target.x;
        mapContrtols.object.position.y = mapContrtols.target.y + zoom.current.y;
        mapContrtols.object.position.z = mapContrtols.target.z + zoom.current.z;

        if (camera.needsUpdate) {
          camera.updateMatrixWorld();
        }
      });
    });

    return () => {
      mapContrtols.dispose();
    };
  }, []);

  return <group></group>;
};
