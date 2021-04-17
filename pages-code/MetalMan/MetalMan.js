import { useState } from "@hookstate/core";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { AnimationMixer, Group, SkinnedMesh } from "three";
import { Object3D } from "three";
import { Me } from "../AppState/AppState";

export function MetalManModel() {
  let me = useRef(new Group());
  let subStatus = useState(Me.status);
  let mixer = useRef(new AnimationMixer());
  let ActionsMap = useRef({});
  let { scene } = useThree();

  const { FBXLoader } = require("three/examples/jsm/loaders/FBXLoader");
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/avatar/metalman.glb");

  const stayIdle = useLoader(FBXLoader, "/avatar-actions/idle.fbx");
  const runningAction = useLoader(FBXLoader, "/avatar-actions/running.fbx");

  const internalLoop = useRef([]);
  const onLoop = (v) => internalLoop.current.push(v);

  useEffect(() => {
    ActionsMap.current.stayIdle = mixer.current.clipAction(
      stayIdle.animations[0],
      me.current
    );
    ActionsMap.current.runningAction = mixer.current.clipAction(
      runningAction.animations[0],
      me.current
    );

    if (subStatus.value === "ready") {
      ActionsMap.current.stayIdle.reset();
      ActionsMap.current.stayIdle.repetitions = Infinity;
      ActionsMap.current.stayIdle.play();

      ActionsMap.current.runningAction.reset();
      ActionsMap.current.runningAction.fadeOut(0.2);
      ActionsMap.current.runningAction.play();
    } else {
      ActionsMap.current.runningAction.reset();
      ActionsMap.current.runningAction.repetitions = Infinity;
      ActionsMap.current.runningAction.play();

      ActionsMap.current.stayIdle.reset();
      ActionsMap.current.stayIdle.fadeOut(0.2);
      ActionsMap.current.stayIdle.play();
    }

    return () => {
      mixer.current.stopAllAction();
      if (mixer.current && stayIdle?.animations[0]) {
        mixer.current.uncacheClip(stayIdle.animations[0], me.current);
      }

      if (mixer.current && runningAction?.animations[0]) {
        mixer.current.uncacheClip(runningAction.animations[0], me.current);
      }
    };
  });

  useEffect(() => {
    internalLoop.current = [];
    let group = me.current;
    scene.add(group);
    group.name = "myself";
    let subgroup = new Group();
    group.add(subgroup);
    subgroup.position.y = 1;
    subgroup.scale.set(0.5, 0.5, 0.5);
    subgroup.add(nodes["mixamorigHips"]);
    subgroup.add(nodes["metalman"]);

    nodes["metalman"].material.skinning = true;
    nodes["metalman"].material.metalness = 0.9;
    nodes["metalman"].material.roughness = 0.1;

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

  useFrame(() => {
    internalLoop.current.forEach((e) => e());
  });
  useFrame(({}, dt) => {
    mixer.current.update(dt);
  });

  return <group></group>;
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
