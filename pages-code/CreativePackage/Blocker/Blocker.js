import {
  Icosahedron,
  Octahedron,
  RoundedBox,
  Sphere,
  Text,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { useEffect, useRef } from "react";
import { Color, DoubleSide, Vector3 } from "three";
import { addConnection } from "../AppEditorLogic/AppEditorLogic";
// import { addBlocker } from "../AppEditorLogic/AppEditorLogic";
import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";
import { Antenna, CodeBuilding, EditBlock } from "../BuildingList/BuildingList";

export function FloatingVertically({ children }) {
  const floating = useRef();
  let time = 0;
  useFrame((st, dt) => {
    time += dt;
    if (floating.current) {
      floating.current.position.y = 5 + Math.sin(time) * 5;
    }
  });
  return <group ref={floating}>{children}</group>;
}

export function SpinnerY({ children }) {
  const ref = useRef();
  let time = 0;
  useFrame((st, dt) => {
    time += dt;
    if (ref.current) {
      ref.current.rotation.y = time + Math.random() / 1000;
    }
  });

  return <group ref={ref}>{children}</group>;
}

export function Blocker({ blocker, isTemp }) {
  let scale = 5.123;
  let size = [25 * scale, 5 * scale, 25 * scale];
  let blockerGroup = useRef(null);
  let blockerMesh = useRef(null);

  let inputs = ProjectStore.ports.filter(
    (e) => e.blockerID === blocker._id && e.type === "input"
  );
  let outputs = ProjectStore.ports.filter(
    (e) => e.blockerID === blocker._id && e.type === "output"
  );

  useEffect(() => {
    if (blockerGroup.current) {
      blockerGroup.current.userData.position = blocker.position;
      blockerGroup.current.position.fromArray(blocker.position);
      blockerGroup.current.visible = true;
    }
  }, [blocker._id]);

  Hand.onChangeKey("floor", () => {
    if (blockerGroup.current) {
      if (
        (Hand.mode === "pickup" || Hand.mode === "moving") &&
        Hand.pickup === blockerGroup.current.uuid
      ) {
        blockerGroup.current.userData.position = Hand.floor;
      }
    }
  });

  let tempo = new Vector3();
  useFrame(() => {
    if (blockerGroup.current) {
      if (isTemp && Hand.addMode === "add-blocker") {
        blockerGroup.current.userData.position = Hand.floor;
      }

      if (blockerGroup.current.userData.position) {
        tempo.fromArray(blockerGroup.current.userData.position);
        blockerGroup.current.position.lerp(tempo, 0.35);
      }
    }
  });

  let cursor = (v) => {
    document.body.style.cursor = v;
  };

  let makePort = ({ port, type = "input", idx = 0 }) => {
    let io = type === "input" ? 1 : -1;

    return (
      <group
        key={port._id}
        scale={1.75}
        position-x={[size[0] * -0.75 * io]}
        position-z={[size[2] * -0.55 + idx * size[0] * 0.35]}
      >
        <Antenna
          name={port._id}
          onPointerDown={({ eventObject }) => {
            Hand._moved = 0;
            Hand._isDown = true;
            eventObject.material.color = new Color("lime");
            let did = false;

            // if (Hand.addMode === "ready" && !did) {
            //   did = true;
            //   Hand.pickupPort = port;
            //   Hand.addMode = "add-connection";
            // }

            if (Hand.addMode === "ready") {
              did = true;
              Hand.pickupPort = port;
              Hand.addMode = "add-connection";
            }
          }}
          //
          onPointerMove={() => {
            if (Hand._isDown) {
              Hand._moved++;
            }
          }}
          onPointerUp={({ eventObject }) => {
            let did = false;

            if (Hand.addMode === "add-connection") {
              did = true;
              Hand.releasePort = port;
              Hand.addMode = "ready";

              addConnection();
            }

            Hand._isDown = false;
            Hand._moved = 0;
            eventObject.material.color = new Color("#ffffff");
          }}
          onPointerEnter={({ eventObject }) => {
            cursor("pointer");
            eventObject.material.color = new Color("lime");
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
        ></Antenna>

        <Text
          color={"yellow"}
          fontSize={10}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={"left"}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          position-x={size[0] * 0.2 * -io}
          position-y={10}
          rotation-x={Math.PI * -0.25}
          outlineWidth={1}
          outlineColor="#000000"
        >
          {idx}
        </Text>
      </group>
    );
  };

  return (
    <group>
      <group ref={blockerGroup} visible={false}>
        <Suspense
          fallback={
            <RoundedBox
              ref={blockerMesh}
              args={size}
              radius={2 * scale}
              smoothness={2}
              //
              //
            >
              <meshStandardMaterial
                metalness={0.9}
                roughness={0.1}
                flatShading={true}
              ></meshStandardMaterial>
            </RoundedBox>
          }
        >
          <CodeBuilding
            onPointerDown={(ev) => {
              Hand._moved = 0;
              Hand._isDown = true;

              Hand.mode = "pickup";
              Hand.pickup = blockerGroup.current.uuid;
              ev.eventObject.material.color = new Color("#ffffff").offsetHSL(
                0,
                0,
                -0.2
              );
              Hand.floor = ev.point.toArray();
              Hand.floor[1] = 0;
            }}
            onPointerMove={(ev) => {
              if (Hand._isDown) {
                Hand._moved++;
              }
              Hand.mode = "moving";
              Hand.floor = ev.point.toArray();
              Hand.floor[1] = 0;
              let { eventObject } = ev;
              ev.eventObject.material.color = new Color("#ffffff").offsetHSL(
                0,
                0,
                -0.3
              );

              Hand.renderConnection = Hand.renderConnection + 1;
            }}
            onPointerUp={(ev) => {
              if (Hand._moved < 20) {
              }
              Hand.mode = "ready";
              Hand.pickup = false;
              Hand._isDown = true;
              ev.eventObject.material.color = new Color("#ffffff");
              Hand._moved = 0;

              blocker.position = ev.point.toArray();

              // ProjectStore.notifyChange("blockers");
              // console.log(blocker);
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
          ></CodeBuilding>

          {inputs.map((i, idx) => {
            return makePort({ type: "input", port: i, idx });
          })}

          {outputs.map((i, idx) => {
            return makePort({ type: "output", port: i, idx });
          })}

          {/*
          {makePort({ type: "input", port: 0 })}
          {makePort({ type: "input", port: 1 })}
          {makePort({ type: "input", port: 2 })}
          {makePort({ type: "input", port: 3 })}
          {makePort({ type: "input", port: 4 })}

          {makePort({ type: "output", port: 0 })}
          {makePort({ type: "output", port: 1 })}
          {makePort({ type: "output", port: 2 })}
          {makePort({ type: "output", port: 3 })}
          {makePort({ type: "output", port: 4 })} */}

          {/*
        <RoundedBox
          position-z={[size[0] * 0.7]}
          args={[size[0] * 0.5, size[1], size[2] * 0.2]}
          radius={2 * scale}
          smoothness={2}
          //
          //
          onPointerEnter={({ eventObject }) => {
            cursor("pointer");
            eventObject.material.color = new Color("silver");
          }}
          onPointerLeave={({ eventObject }) => {
            cursor("auto");
            eventObject.material.color = new Color("#ffffff");
          }}
          onPointerDown={({ eventObject }) => {
            Hand._isDown = true;
            Hand._moved = 0;
            eventObject.material.color = new Color("grey");
          }}
          onPointerMove={() => {
            if (Hand._isDown) Hand._moved++;
          }}
          onPointerUp={({ eventObject }) => {
            Hand._isDown = false;
            if (Hand._moved <= 10) {
              console.log("click edit");
            }
            eventObject.material.color = new Color("white");
            Hand._moved = 0;
          }}
        >
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            flatShading={true}
          ></meshStandardMaterial>
        </RoundedBox>

        */}

          {inputs && inputs.length > 0 && outputs && outputs.length > 0 && (
            <>
              <group position-z={[size[0] * 0.7]}>
                <EditBlock
                  onPointerEnter={({ eventObject }) => {
                    cursor("pointer");
                    eventObject.material.color = new Color("silver");
                  }}
                  onPointerLeave={({ eventObject }) => {
                    cursor("auto");
                    eventObject.material.color = new Color("#ffffff");
                  }}
                  onPointerDown={({ eventObject }) => {
                    Hand._isDown = true;
                    Hand._moved = 0;
                    eventObject.material.color = new Color("grey");
                  }}
                  onPointerMove={() => {
                    if (Hand._isDown) Hand._moved++;
                  }}
                  onPointerUp={({ eventObject }) => {
                    Hand._isDown = false;
                    if (Hand._moved <= 10) {
                      Hand.currentBlockerID = blocker._id;
                      Hand.overlay = "edit-blocker";
                    }
                    eventObject.material.color = new Color("white");
                    Hand._moved = 0;
                  }}
                ></EditBlock>
              </group>
              <RefreshText blocker={blocker} size={size}></RefreshText>
            </>
          )}

          {inputs && inputs.length > 0 && (
            <FloatingVertically>
              <Text
                color={"yellow"}
                fontSize={10}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign={"left"}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="middle"
                position-z={size[2] * 1.1}
                position-y={20}
                position-x={size[0] * -0.7}
                rotation-x={Math.PI * -0.25}
                outlineWidth={1}
                outlineColor="#000000"
              >
                Input
              </Text>
            </FloatingVertically>
          )}

          {inputs && inputs.length > 0 && (
            <FloatingVertically>
              <Text
                color={"yellow"}
                fontSize={10}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign={"left"}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="middle"
                position-z={size[2] * 1.1}
                position-y={20}
                position-x={size[0] * 0.7}
                rotation-x={Math.PI * -0.25}
                outlineWidth={1}
                outlineColor="#000000"
              >
                Output
              </Text>
            </FloatingVertically>
          )}

          {/* <FloatingVertically>
            <Text
              color={"yellow"}
              fontSize={10}
              maxWidth={200}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign={"left"}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              anchorX="center"
              anchorY="middle"
              position-z={size[2] * 0.75}
              position-y={20}
              rotation-x={Math.PI * -0.25}
              outlineWidth={1}
              outlineColor="#000000"
            >
              Edit
            </Text>
          </FloatingVertically> */}
        </Suspense>
      </group>
    </group>
  );
}

function RefreshText({ blocker, size }) {
  blocker.onChangeKeyRenderUI("title");

  return (
    <FloatingVertically>
      <Text
        color={"yellow"}
        fontSize={10}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign={"center"}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        position-z={size[2] * 1.1}
        // position-z={size[2] * 0.0}
        position-y={20}
        rotation-x={Math.PI * -0.25}
        outlineWidth={1}
        outlineColor="#000000"
      >
        Edit {blocker.title ? "\n\n" + blocker.title : ""}
      </Text>
    </FloatingVertically>
  );
}
