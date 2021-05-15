import { Icosahedron, Octahedron, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color, DoubleSide, Vector3 } from "three";
import { getID, Hand } from "../AppEditorState/AppEditorState";

export function FloatingVertically({ children }) {
  const floating = useRef();
  let time = 0;
  useFrame((st, dt) => {
    time += dt;
    floating.current.position.y = 5 + Math.sin(time) * 5;
  });
  return <group ref={floating}>{children}</group>;
}

export function Blocker({ blocker }) {
  let scale = 5.123;
  let size = [25 * scale, 5 * scale, 25 * scale];
  let blockerGroup = useRef(null);
  let blockerMesh = useRef(null);

  let inputMesh = useRef(null);
  let outputMesh = useRef(null);

  useEffect(() => {
    if (blockerGroup.current) {
      blockerGroup.current.userData.position = blocker.position;
      blockerGroup.current.position.fromArray(blocker.position);
    }
  }, [blocker._id]);

  Hand.onChangeKey("mode", (hand) => {
    console.log("hand", hand);
  });

  Hand.onChangeKey("floor", () => {
    if (
      (Hand.mode === "pickup" || Hand.mode === "moving") &&
      Hand.pickup === blockerGroup.current.uuid
    ) {
      blockerGroup.current.userData.position = Hand.floor;
    }
  });

  let tempo = new Vector3();
  useFrame(() => {
    if (blockerGroup.current) {
      if (blockerGroup.current.userData.position) {
        tempo.fromArray(blockerGroup.current.userData.position);
        blockerGroup.current.position.lerp(tempo, 0.35);
      }
    }
  });

  let cursor = (v) => {
    document.body.style.cursor = v;
  };

  return (
    <group>
      <group ref={blockerGroup}>
        <RoundedBox
          ref={blockerMesh}
          args={size}
          radius={2 * scale}
          smoothness={2}
          //
          //
          onPointerDown={(ev) => {
            Hand._moved = 0;

            Hand.mode = "pickup";
            Hand.pickup = blockerGroup.current.uuid;
            blockerMesh.current.material.color = new Color("#ffffff").offsetHSL(
              0,
              0,
              -0.2
            );
            Hand.floor = ev.point.toArray();
            Hand.floor[1] = 0;
          }}
          onPointerMove={(ev) => {
            Hand._moved++;
            Hand.mode = "moving";
            Hand.floor = ev.point.toArray();
            Hand.floor[1] = 0;
            let { eventObject } = ev;
            eventObject.material.color = new Color("#ffffff").offsetHSL(
              0,
              0,
              -0.3
            );
          }}
          onPointerUp={(ev) => {
            Hand.mode = "ready";
            Hand.pickup = false;
            blockerMesh.current.material.color = new Color("#ffffff");
            Hand._moved = 0;
          }}
          onPointerEnter={({ eventObject }) => {
            cursor("move");
            eventObject.material.color = new Color("#ffffff").offsetHSL(
              0,
              0.2,
              0.2
            );
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
        >
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            flatShading={true}
          ></meshStandardMaterial>
        </RoundedBox>

        <RoundedBox
          ref={inputMesh}
          position-x={[size[0] * -0.7]}
          args={[size[0] * 0.2, size[1], size[2]]}
          radius={2 * scale}
          smoothness={2}
          //
          //
          onPointerDown={() => {
            Hand._moved = 0;
          }}
          onPointerMove={() => {
            Hand._moved++;
          }}
          onPointerUp={(ev) => {
            if (Hand._moved <= 10) {
            }

            Hand._moved = 0;
          }}
          onPointerEnter={({ eventObject }) => {
            cursor("pointer");
            eventObject.material.color = new Color("lime");
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
        >
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            flatShading={true}
          ></meshStandardMaterial>

          <FloatingVertically>
            <Text
              color={"#1256de"}
              fontSize={10}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={"left"}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              anchorX="center"
              anchorY="middle"
              position-z={size[2] * -0.5}
              position-y={20}
              rotation-x={Math.PI * -0.25}
              outlineWidth={1}
              outlineColor="#ffffff"
            >
              Input
            </Text>
          </FloatingVertically>
        </RoundedBox>

        <RoundedBox
          ref={inputMesh}
          position-x={[size[0] * 0.7]}
          args={[size[0] * 0.2, size[1], size[2]]}
          radius={2 * scale}
          smoothness={2}
          //
          //

          onPointerEnter={({ eventObject }) => {
            cursor("pointer");
            eventObject.material.color = new Color("cyan");
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
          onPointerDown={() => {
            Hand._isDown = true;
            Hand._moved = 0;
          }}
          onPointerMove={() => {
            if (Hand._isDown) Hand._moved++;
          }}
          onPointerUp={(ev) => {
            Hand._isDown = false;
            if (Hand._moved <= 10) {
              console.log("click edit");
            }

            Hand._moved = 0;
          }}
        >
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            flatShading={true}
          ></meshStandardMaterial>

          <FloatingVertically>
            <Text
              color={"#1256de"}
              fontSize={10}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={"left"}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              anchorX="center"
              anchorY="middle"
              position-z={size[2] * -0.5}
              position-y={20}
              rotation-x={Math.PI * -0.25}
              outlineWidth={1}
              outlineColor="#ffffff"
            >
              Output
            </Text>
          </FloatingVertically>
        </RoundedBox>

        <RoundedBox
          ref={inputMesh}
          position-z={[size[0] * 0.7]}
          args={[size[0] * 0.5, size[1], size[2] * 0.2]}
          radius={2 * scale}
          smoothness={2}
          //
          //
          onPointerEnter={({ eventObject }) => {
            cursor("pointer");
            eventObject.material.color = new Color("#ffffff").offsetHSL(
              0,
              0,
              -0.3
            );
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
          onPointerDown={() => {
            Hand._isDown = true;
            Hand._moved = 0;
          }}
          onPointerMove={() => {
            if (Hand._isDown) Hand._moved++;
          }}
          onPointerUp={(ev) => {
            Hand._isDown = false;
            if (Hand._moved <= 10) {
              console.log("click edit");
            }

            Hand._moved = 0;
          }}
        >
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            flatShading={true}
          ></meshStandardMaterial>

          <FloatingVertically>
            <Text
              color={"#1256de"}
              fontSize={10}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={"left"}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              anchorX="center"
              anchorY="middle"
              position-z={size[2] * -0.1}
              position-y={20}
              rotation-x={Math.PI * -0.25}
              outlineWidth={1}
              outlineColor="#ffffff"
            >
              Edit
            </Text>
          </FloatingVertically>
        </RoundedBox>

        <FloatingVertically>
          <Text
            color={"#1256de"}
            fontSize={10}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign={"left"}
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
            position-z={size[2] * 0.0}
            position-y={20}
            rotation-x={Math.PI * -0.3}
            outlineWidth={1}
            outlineColor="#ffffff"
          >
            My New Module
          </Text>
        </FloatingVertically>
      </group>
    </group>
  );
}
