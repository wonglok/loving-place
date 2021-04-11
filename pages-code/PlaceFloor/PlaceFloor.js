import { useState } from "@hookstate/core";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Me } from "../AppState/AppState";

export function PlaceFloor() {
  const isDownRef = useRef(false);
  const destinationRef = useRef(false);
  const floorRef = useRef(false);

  useFrame(({ mouse, camera, raycaster }, dt) => {
    if (destinationRef.current) {
      destinationRef.current.position.x = Me.goingTo.x;
      destinationRef.current.position.z = Me.goingTo.z;
      destinationRef.current.position.y = Me.goingTo.y + 10;
      destinationRef.current.rotation.x = Math.PI * -0.5;
      destinationRef.current.rotation.z =
        window.performance.now() * 0.001 * 2.5;
      destinationRef.current.material.opacity =
        Me.status.value === "running" ? 1 : 0;

      if (isDownRef.current && Me.status.value === "ready") {
        Me.status.set("running");
      }

      if (isDownRef.current) {
        raycaster.setFromCamera(mouse, camera);
        let res = raycaster.intersectObject(floorRef.current);
        let result = res[0];
        if (result) {
          Me.goingTo.x = result.point.x;
          Me.goingTo.y = result.point.y;
          Me.goingTo.z = result.point.z;
        }
      }
    }
  });

  return (
    <group>
      <gridHelper args={[10000, 50]} position-y={1}></gridHelper>
      <mesh
        ref={floorRef}
        rotation-x={-0.5 * Math.PI}
        onPointerDown={(event) => {
          isDownRef.current = true;
          Me.goingTo.x = event.point.x;
          Me.goingTo.y = event.point.y;
          Me.goingTo.z = event.point.z;
          Me.status.set("running");
        }}
        onPointerUp={(event) => {
          isDownRef.current = false;
          Me.status.set("running");
        }}
        onPointerLeave={() => {
          isDownRef.current = false;
        }}
      >
        <planeBufferGeometry args={[10000, 10000, 1, 1]}></planeBufferGeometry>
        <meshBasicMaterial color={"#444"}></meshBasicMaterial>
      </mesh>

      <mesh ref={destinationRef}>
        {/* <torusBufferGeometry args={[8, 1.5, 12, 80]}></torusBufferGeometry> */}
        <icosahedronBufferGeometry args={[10, 0]}></icosahedronBufferGeometry>
        <meshStandardMaterial
          color="white"
          transparent={true}
          flatShading={true}
          metalness={0.9}
          roughness={0.1}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}