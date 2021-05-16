import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, Vector3 } from "three";
// import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { Hand } from "../AppEditorState/AppEditorState";

export function BridgeLine() {
  const { LineMaterial } = require("three/examples/jsm/lines/LineMaterial");
  const { LineGeometry } = require("three/examples/jsm/lines/LineGeometry");
  const {
    LineSegmentsGeometry,
  } = require("three/examples/jsm/lines/LineSegmentsGeometry");
  const { Line2 } = require("three/examples/jsm/lines/Line2");

  const { gl, scene } = useThree();

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

  // const line =

  let works = useRef({});

  const mesh = useMemo(() => {
    let floorPt = new Vector3().fromArray(Hand.floor);
    let getGeo = ({ a, b }) => {
      const curvePts = new CatmullRomCurve3(
        [
          new Vector3(a.x, a.y, a.z),
          new Vector3(a.x, a.y + 100, a.z),
          new Vector3(b.x, b.y + 100, b.z),
          new Vector3(b.x, b.y, b.z),
        ],
        false
      );

      const lineGeo = new LineSegmentsGeometry();
      let pos = [];
      let count = 100;
      let temp = new Vector3();
      for (let i = 0; i < count; i++) {
        curvePts.getPointAt((i / count) % 1, temp);
        if (isNaN(temp.x)) {
          temp.x = 0.0;
        }
        if (isNaN(temp.y)) {
          temp.y = 0.0;
        }
        if (isNaN(temp.z)) {
          temp.z = 0.0;
        }
        pos.push(temp.x, temp.y, temp.z);
      }
      lineGeo.setPositions(pos);
      return lineGeo;
    };

    floorPt.set(1, 1, 1);
    let currentPos = new Vector3(1, 1, 1);
    let lineGeo = getGeo({ a: floorPt, b: currentPos });

    const mesh = new Line2(lineGeo, lineMat);
    mesh.computeLineDistances();

    // Hand.pickupPort;
    let needsUpdate = false;
    Hand.onEventChangeKey("floor", () => {
      if (
        !(
          floorPt.x === Hand.floor[0] &&
          floorPt.y === Hand.floor[1] &&
          floorPt.z === Hand.floor[2]
        )
      ) {
        needsUpdate = true;
      }
    });

    let port = Hand.pickupPort;
    Hand.onEventChangeKey("pickupPort", () => {
      port = Hand.pickupPort;
      needsUpdate = true;
    });

    works.current.updateLine = () => {
      if (needsUpdate) {
        if (port) {
          let antenna = scene.getObjectByName(port._id);
          antenna.getWorldPosition(currentPos);

          floorPt.x = Hand.floor[0];
          floorPt.y = 0;
          floorPt.z = Hand.floor[2];

          let lineGeo = getGeo({ a: floorPt, b: currentPos });
          mesh.geometry = lineGeo;
          mesh.computeLineDistances();
        }
      }
    };

    return mesh;
  }, [lineMat, works.current]);

  useFrame(() => {
    Object.values(works.current).forEach((w) => w());
  });

  return (
    <group>
      <primitive object={mesh}></primitive>
    </group>
  );
}
