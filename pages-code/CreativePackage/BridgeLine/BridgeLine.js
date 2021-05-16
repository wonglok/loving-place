import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { CatmullRomCurve3, Color, Vector3 } from "three";

export function BridgeLine() {
  const { LineMaterial } = require("three/examples/jsm/lines/LineMaterial");
  const { LineGeometry } = require("three/examples/jsm/lines/LineGeometry");
  const { Line2 } = require("three/examples/jsm/lines/Line2");

  const { gl } = useThree();

  const lineMat = useMemo(() => {
    const material = new LineMaterial({
      transparent: true,
      color: new Color("#00ffff"),
      linewidth: 0.0015,
      opacity: 1.0,
      dashed: true,
      vertexColors: false,
    });

    return material;
  }, []);

  const lineGeo = useMemo(() => {
    const curvePts = new CatmullRomCurve3([
      new Vector3(-100, 0, 100),
      new Vector3(-50, 50, 50),
      new Vector3(50, 100, 50),
      new Vector3(59, -59, 59),
      new Vector3(100, 0, 100),
    ]);

    const lineGeo = new LineGeometry();
    let pos = [];
    let count = 101;
    let temp = new Vector3();
    for (let i = 0; i < count; i++) {
      curvePts.getPointAt(i / count, temp);
      pos.push(temp.x, temp.y, temp.z);
    }
    lineGeo.setPositions(pos);

    return lineGeo;
  }, [lineMat]);

  const lineMesh = useMemo(() => {
    const mesh = new Line2(lineGeo, lineMat);
    mesh.computeLineDistances();
    return mesh;
  }, [lineGeo, lineMat]);

  return (
    <group>
      <primitive object={lineMesh}></primitive>
    </group>
  );
}
