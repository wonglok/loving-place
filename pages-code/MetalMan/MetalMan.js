import { useState } from "@hookstate/core";
import { useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { AnimationMixer } from "three";
import { Object3D } from "three";
import { Me } from "../AppState/AppState";

export function MetalManModel() {
  let me = useRef(null);
  let subStatus = useState(Me.status);
  let mixer = useRef(new AnimationMixer());
  let actions = useRef({});

  const { FBXLoader } = require("three/examples/jsm/loaders/FBXLoader");
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/avatar/metalman.glb");

  const stayIdle = useLoader(FBXLoader, "/avatar-actions/idle.fbx");
  const runningAction = useLoader(FBXLoader, "/avatar-actions/running.fbx");

  const internalLoop = useRef([]);
  const onLoop = (v) => internalLoop.current.push(v);

  useEffect(() => {
    actions.current.stayIdle =
      actions.current.stayIdle ||
      mixer.current.clipAction(stayIdle.animations[0], me.current);
    actions.current.runningAction =
      actions.current.runningAction ||
      mixer.current.clipAction(runningAction.animations[0], me.current);

    if (subStatus.value === "ready") {
      actions.current.stayIdle.reset();
      actions.current.stayIdle.repetitions = Infinity;
      actions.current.stayIdle.play();

      actions.current.runningAction.reset();
      actions.current.runningAction.fadeOut(0.2);
      actions.current.runningAction.play();
    } else {
      actions.current.runningAction.reset();
      actions.current.runningAction.repetitions = Infinity;
      actions.current.runningAction.play();

      actions.current.stayIdle.reset();
      actions.current.stayIdle.fadeOut(0.2);
      actions.current.stayIdle.play();
    }

    return () => {};
  }, [subStatus.get()]);

  useFrame(({}, dt) => {
    mixer.current.update(dt);
  });

  useFrame(() => {
    internalLoop.current.forEach((e) => e());
  });

  useEffect(() => {
    internalLoop.current = [];

    let group = me.current;
    let current = group.position.clone();
    let vel = group.position.clone();
    let tempLooker = new Object3D();

    onLoop(() => {
      //

      me.current.position.copy(Me.position);

      let diff = current.copy(Me.goingTo).sub(group.position);

      if (diff.length() > 2 && Me.status.value === "running") {
        vel.copy(diff).normalize().multiplyScalar(3.5);
        Me.velocity.copy(vel);
        Me.position.add(vel);

        tempLooker.position.copy(group.position);
        tempLooker.lookAt(Me.goingTo);

        group.quaternion.slerp(tempLooker.quaternion, 0.25);
      } else {
        if (Me.status.value === "running") {
          Me.status.set("ready");
        }
      }
    });

    //
  }, []);

  return (
    <>
      <group name={"myself"} ref={me} dispose={null}>
        <group rotation={[0, 0, 0]} position-y={1} scale={0.5}>
          <primitive object={nodes["mixamorigHips"]} />
          <skinnedMesh
            receiveShadow
            castShadow
            geometry={nodes["metalman"].geometry}
            skeleton={nodes["metalman"].skeleton}
          >
            <meshStandardMaterial
              skinning={true}
              metalness={0.9}
              roughness={0.1}
            ></meshStandardMaterial>
          </skinnedMesh>
        </group>
      </group>
    </>
  );
}

export function MetalMan() {
  return (
    <>
      <Suspense fallback={null}>
        <MetalManModel></MetalManModel>
      </Suspense>
    </>
  );
}
