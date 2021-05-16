import { Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Color, Fog } from "three";
import { addBlocker } from "../AppEditorLogic/AppEditorLogic";
import { Hand } from "../AppEditorState/AppEditorState";

export function EditorBed() {
  let { scene, gl } = useThree();

  useEffect(() => {
    let baseColor = new Color("#5c5c5c").offsetHSL(0, 0, 0.3);
    scene.background = baseColor;
    scene.fog = new Fog(baseColor, 0.1, 10000);

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

  return (
    <group>
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

          if (Hand.addMode === "addItem") {
            Hand.addMode = "";
            addBlocker({ point });
          }
        }}
      >
        <shaderMaterial
          fragmentShader={`
            void main (void) {
              discard;
            }
        `}
        ></shaderMaterial>
      </Plane>
      <gridHelper
        position-y={0}
        args={[10000, 50, "white", "white"]}
      ></gridHelper>
    </group>
  );
}

//
