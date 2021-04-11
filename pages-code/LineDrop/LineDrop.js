import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { PlaneBufferGeometry, Vector3 } from "three";
import { LineStuff } from "./LineStuff";
import { Mini } from "./Mini";

export function LineDropInternal() {
  const ref = useRef(null);
  const engine = useRef(null);

  const { gl, scene, camera } = useThree();
  // const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  // const { nodes } = useLoader(GLTFLoader, "/avatar/metalman.glb");

  useEffect(() => {
    let mini = new Mini({
      name: "LineDrop",
      window,
      domElement: gl.domElement,
    });

    mini.set("scene", scene);
    mini.set("camera", camera);

    // let floor = new TorusBufferGeometry(50, 10, 20, 60);
    let floor = new PlaneBufferGeometry(500, 500, 100, 100);
    floor.rotateX(-0.5 * Math.PI);
    floor.translate(0, 25, 0);

    // let metalmanGeo = nodes.metalman.geometry.clone();
    // metalmanGeo.scale(0.5, 0.5, 0.5);
    // metalmanGeo.rotateX(0.5 * Math.PI);

    new LineStuff(mini, {
      name: "floor",
      baseGeometry: floor,
      scale: 10,
      position: new Vector3(0.0, 0.0, 0.0),
    });

    mini.ready.floor.then((e) => {
      e.hide();
      e.run({ delay: 0 });

      setTimeout(() => {
        e.fadeOut({
          delay: 0,
          done: () => {
            mini.ready.scene.then((s) => {
              s.remove(e.mesh);
            });
          },
        });
      }, 3000);
    });

    // new LineStuff(mini, {
    //   name: "character",
    //   baseGeometry: metalmanGeo,
    //   scale: 10,
    //   position: new Vector3(0.0, 0.0, 0.0),
    // });

    // mini.ready.character.then((e) => {
    //   e.hide();
    //   e.run({ delay: 0 });

    //   setTimeout(() => {
    //     e.fadeOut({
    //       delay: 0,
    //       done: () => {
    //         mini.ready.scene.then((s) => {
    //           s.remove(e.mesh);
    //         });
    //       },
    //     });
    //   }, 3000);
    // });

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

export function LineDrop() {
  return (
    <Suspense fallback={null}>
      <LineDropInternal></LineDropInternal>
    </Suspense>
  );
}

//

//

//
