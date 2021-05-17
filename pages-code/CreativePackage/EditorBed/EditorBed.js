import { Plane, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { useEffect } from "react";
import { Color, Fog, RepeatWrapping } from "three";
import { addBlocker, addPicker } from "../AppEditorLogic/AppEditorLogic";
import { Hand } from "../AppEditorState/AppEditorState";
import { SharedEnvURL, useMatCapEnvMap } from "../BuildingList/BuildingList";

export function MatArmmor() {
  let aoMap = useTexture(
    "/substance/rough-metal/Sci-fi_Armor_001_ambientOcclusion.jpg"
  );
  let roughnessMap = useTexture(
    "/substance/rough-metal/Sci-fi_Armor_001_roughness.jpg"
  );
  let displacementMap = useTexture(
    "/substance/rough-metal/Sci-fi_Armor_001_height.png"
  );
  let baseMap = useTexture(
    "/substance/rough-metal/Sci-fi_Armor_001_basecolor.jpg"
  );
  let normalMap = useTexture(
    "/substance/rough-metal/Sci-fi_Armor_001_normal.jpg"
  );
  let envMap = useMatCapEnvMap(SharedEnvURL);

  let makeRepeat = (mapTex) => {
    mapTex.repeat.set(35, 35);
    mapTex.wrapS = RepeatWrapping;
    mapTex.wrapT = RepeatWrapping;
  };

  makeRepeat(displacementMap);
  makeRepeat(roughnessMap);
  makeRepeat(baseMap);
  makeRepeat(aoMap);
  makeRepeat(normalMap);

  return (
    <meshStandardMaterial
      roughness={0.3}
      metalness={0.9}
      envMap={envMap}
      envMapIntensity={5}
      // aoMap={aoMap}
      // aoMapIntensity={4}
      normalMap={normalMap}
    ></meshStandardMaterial>
  );
}

export function EditorBed() {
  let { scene, gl } = useThree();
  let baseColor = new Color("#5c5c5c").offsetHSL(0, 0, 0.3);

  useEffect(() => {
    scene.background = baseColor;
    scene.fog = new Fog(baseColor, 0.1, 30000);

    let hh = (ev) => {
      ev.preventDefault();
    };
    gl.domElement.addEventListener("touchstart", hh, { passive: false });
    gl.domElement.addEventListener("touchmove", hh, { passive: false });
    return () => {
      gl.domElement.removeEventListener("touchstart", hh, { passive: false });
      gl.domElement.removeEventListener("touchmove", hh, { passive: false });
      //
    };
  }, []);

  // Hand.onChangeKey("addMode", () => {
  //   if (Hand.addMode === "add-connection") {
  //     scene.background = new Color("#5c5c5c").offsetHSL(0.0, 0.0, 0.35);
  //   } else if (Hand.addMode === "add-blocker") {
  //     scene.background = new Color("#5c5c5c").offsetHSL(0.0, 0.0, 0.35);
  //   } else if (Hand.addMode === "ready") {
  //     scene.background = baseColor;
  //   }
  // });
  let time = 0;
  useFrame((st, dt) => {
    time += dt;
    if (Hand.addMode === "add-connection") {
      scene.background = new Color("#5c5c5c").offsetHSL(
        0.0,
        0.0,
        0.35 + Math.sin(time * 10.0) * 0.05
      );
    } else if (Hand.addMode === "add-blocker") {
      scene.background = new Color("#5c5c5c").offsetHSL(
        0.0,
        0.0,
        0.35 + Math.sin(time * 10.0) * 0.05
      );
    } else if (Hand.addMode === "ready") {
      scene.background = baseColor;
    }
  });

  return (
    <group>
      <Suspense
        fallback={
          <gridHelper
            position-y={-1}
            args={[10000, 50, "white", "white"]}
          ></gridHelper>
        }
      >
        <Plane
          name="app-floor"
          rotation-x={Math.PI * -0.5}
          args={[10000, 10000, 1, 1]}
          onPointerDown={() => {}}
          onPointerMove={(ev) => {
            Hand.floor = ev.point.toArray();
          }}
          onPointerUp={({ point }) => {
            Hand.mode = "ready";
            Hand.pickup = false;

            if (Hand.addMode === "add-blocker") {
              Hand.addMode = "ready";
              Hand.tooltip = "ready";
              addBlocker({ point });
            }

            if (Hand.addMode === "add-picker") {
              Hand.addMode = "ready";
              Hand.tooltip = "ready";
              addPicker({ point });
            }

            if (Hand.addMode === "add-connection") {
              Hand.pickupPort = false;
              Hand.releasePort = false;
              Hand.addMode = "ready";
            }
          }}
        >
          <MatArmmor attach="material"></MatArmmor>
          {/* <shaderMaterial
          fragmentShader={`
            void main (void) {
              discard;
            }
        `}
        ></shaderMaterial> */}
        </Plane>
      </Suspense>

      {/*  */}
    </group>
  );
}

//
