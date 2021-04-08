import { useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Me } from "../AppState/AppState";

export function MetalManModel() {
  let me = useRef(null);
  let { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes, materials } = useLoader(GLTFLoader, "/avatar/metalman.glb");

  const internalLoop = useRef([]);
  const onLoop = (v) => internalLoop.current.push(v);
  useFrame(() => {
    internalLoop.current.forEach((e) => e());
  });

  useFrame(() => {
    me.current.position.copy(Me.position);
  });

  useEffect(() => {
    internalLoop.current = [];
    let group = me.current;
    let current = group.position.clone();
    let vel = group.position.clone();
    console.log(group);

    onLoop(() => {
      let diff = current.copy(Me.goingTo).sub(group.position);

      if (diff.length() > 1.5) {
        vel.copy(diff).normalize().multiplyScalar(3);
        Me.velocity.copy(vel);
        Me.position.add(vel);
      } else {
        if (Me.status.value === "running") {
          Me.status.set("ready");
          Me.velocity.set(0, 0, 0);
        }
      }
    });
  }, []);

  return (
    <>
      <group name={"myself"} ref={me}>
        <group rotation={[Math.PI * 0.5, 0, 0]} scale={0.5}>
          <primitive object={nodes["mixamorigHips"]} />
          <mesh
            receiveShadow
            castShadow
            geometry={nodes["metalman"].geometry}
            skeleton={nodes["metalman"].skeleton}
            material={materials[""]}
          ></mesh>
        </group>
      </group>
    </>
  );
}

export function MetalMan() {
  return (
    <>
      <Suspense fallback={null}>
        <group>
          <MetalManModel></MetalManModel>
        </group>
      </Suspense>
    </>
  );
}
