import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  CircleBufferGeometry,
  PlaneBufferGeometry,
  TorusBufferGeometry,
  Vector3,
} from "three";
import { LineStuff } from "./LineStuff";
import { Mini } from "./Mini";

export function LineDrop() {
  const ref = useRef(null);
  const engine = useRef(null);

  const { gl, scene, camera } = useThree();

  useEffect(() => {
    let mini = new Mini({
      name: "LineDrop",
      window,
      domElement: gl.domElement,
    });

    mini.set("scene", scene);
    mini.set("camera", camera);

    let floor = new TorusBufferGeometry(50, 10, 20, 60);
    floor.rotateX(-0.5 * Math.PI);
    floor.translate(0, 25, 0);

    new LineStuff(mini, {
      name: "floor",
      baseGeometry: floor,
      scale: 10,
      position: new Vector3(0.0, 0.0, 0.0),
    });

    mini.ready.floor.then((e) => {
      e.hide();
      e.run({ delay: 500 });
    });

    engine.current = mini;
    return () => {
      mini.clean();
    };
  }, []);

  useFrame(() => {
    engine.current.work();
  });

  return <group ref={ref}></group>;
}

//
