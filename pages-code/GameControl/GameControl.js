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
  const zoom = useRef(new Vector3(0, 150, 150));

  useWheel(
    (state) => {
      let deltaY = state.vxvy[1] * 1;

      if (zoom.current.z > 150) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = 150;
        zoom.current.z = 150;
      }

      if (zoom.current.z < 340) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = 340;
        zoom.current.z = 340;
      }
    },
    { domTarget: gl.domElement, eventOptions: { passive: false } }
  );

  usePinch(
    (state) => {
      let deltaY = state.vdva[0] * -1;

      if (zoom.current.z > 150) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = 150;
        zoom.current.z = 150;
      }

      if (zoom.current.z < 340) {
        zoom.current.y += deltaY;
        zoom.current.z += deltaY;
      } else {
        zoom.current.y = 340;
        zoom.current.z = 340;
      }
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

    mapContrtols.minDistance = 120;
    mapContrtols.maxDistance = 340;

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
        return myself.getObjectByName("mixamorigHead");
      }),
    ]).then(([group]) => {
      //
      onLoop(() => {
        mapContrtols.target.x = group.position.x;
        mapContrtols.target.y = group.position.y;
        mapContrtols.target.z = group.position.z;

        mapContrtols.object.position.x = mapContrtols.target.x;
        mapContrtols.object.position.y = mapContrtols.target.y + zoom.current.y;
        mapContrtols.object.position.z = mapContrtols.target.z + zoom.current.z;
      });
    });

    return () => {
      mapContrtols.dispose();
    };
  }, []);

  return <group></group>;
};
