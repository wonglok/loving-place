import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { CatmullRomCurve3, Color, Vector3 } from "three";
import { LineSegmentsGeometry } from "three-stdlib";

export function BridgeLine() {
  const { LineMaterial } = require("three/examples/jsm/lines/LineMaterial");
  const { LineGeometry } = require("three/examples/jsm/lines/LineGeometry");
  const { Line2 } = require("three/examples/jsm/lines/Line2");

  const { gl } = useThree();

  const line2 = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(-100, 0, 100),
      new Vector3(-50, 50, 50),
      new Vector3(50, 100, 50),
      new Vector3(59, -59, 59),
      new Vector3(100, 0, 100),
    ]);

    const points = curve.getPoints(100);
    console.log(points);

    const geometry = new LineSegmentsGeometry();
    let pos = [];
    let count = 100;
    let temp = new Vector3();
    for (let i = 0; i < count; i++) {
      curve.getPointAt(i / count, temp);
      pos.push(temp.x, temp.y, temp.z);
    }
    geometry.setPositions(pos);

    const material = new LineMaterial({
      transparent: true,
      color: new Color("#00ffff"),
      linewidth: 0.0015,
      opacity: 1.0,
      dashed: true,
      vertexColors: false,
    });

    const line2 = new Line2(geometry, material);
    line2.computeLineDistances();

    // useFrame(() => {
    //   material.resolution.set(gl.width, gl.height);
    // });

    return line2;
  });

  return (
    <group>
      <primitive object={line2}></primitive>
    </group>
  );
}
