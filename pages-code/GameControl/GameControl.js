import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Me } from "../AppState/AppState";

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

  useEffect(() => {
    loops.current = [];
    camera.far = 1000000;
    camera.near = 0.1;
    camera.updateProjectionMatrix();

    const MapControls = require("three/examples/jsm/controls/OrbitControls")
      .MapControls;
    let mapContrtols = new MapControls(camera, gl.domElement);

    // mapContrtols.object.position.x = 0;
    // mapContrtols.object.position.y = 350;
    // mapContrtols.object.position.z = 350;

    mapContrtols.minDistance = 100;
    mapContrtols.maxDistance = 800;

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
      onLoop(() => {
        // mapContrtols.object.position.x = 0 + group.position.x;
        // mapContrtols.object.position.y = 150 + group.position.y;
        // mapContrtols.object.position.z = 150 + group.position.z;

        mapContrtols.object.position.add(Me.velocity);
        mapContrtols.target.x = group.position.x;
        mapContrtols.target.y = group.position.y;
        mapContrtols.target.z = group.position.z;
      });

      // let headPoint = new Vector3();
      // onLoop(() => {
      //   head.updateMatrixWorld();
      //   headPoint.setFromMatrixPosition(head.matrixWorld);
      //   mapContrtols.object.position.x = 0 + headPoint.x;
      //   mapContrtols.object.position.y = 0 + headPoint.y;
      //   mapContrtols.object.position.z = 0 + headPoint.z;
      // });
    });

    return () => {
      mapContrtols.dispose();
    };
  }, []);

  useEffect(() => {
    camera.position.copy(Me.position);
    camera.position.y += 150;
    camera.position.z += 150;
  });

  return <group></group>;
};
