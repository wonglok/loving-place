import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Color, Vector3 } from "three";
import { Hand } from "../AppEditorState/AppEditorState";
import { FloatingVertically } from "../Blocker/Blocker";
import { EditBlock, PickerBuilding } from "../BuildingList/BuildingList";

export function Picker({ isTemp, picker }) {
  let pickerGroup = useRef(null);
  let scale = 5.123;
  let size = [25 * scale, 5 * scale, 25 * scale];

  let cursor = (v) => {
    document.body.style.cursor = v;
  };

  useEffect(() => {
    if (pickerGroup.current) {
      pickerGroup.current.userData.position = picker.position;
      pickerGroup.current.position.fromArray(picker.position);
      pickerGroup.current.visible = true;
    }
  }, [picker._id]);

  Hand.onChangeKey("floor", () => {
    if (pickerGroup.current) {
      if (
        (Hand.mode === "pickup" || Hand.mode === "moving") &&
        Hand.pickup === pickerGroup.current.uuid
      ) {
        pickerGroup.current.userData.position = Hand.floor;
      }
    }
  });

  let tempo = new Vector3();
  useFrame(() => {
    if (pickerGroup.current) {
      if (isTemp && Hand.addMode === "add-picker") {
        pickerGroup.current.userData.position = Hand.floor;
      }

      if (pickerGroup.current.userData.position) {
        tempo.fromArray(pickerGroup.current.userData.position);
        pickerGroup.current.position.lerp(tempo, 0.35);
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <group>
        <group ref={pickerGroup}>
          <group>
            <PickerBuilding
              onPointerDown={(ev) => {
                Hand._moved = 0;
                Hand._isDown = true;

                Hand.mode = "pickup";
                Hand.pickup = pickerGroup.current.uuid;
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

                picker.position = ev.point.toArray();

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
            ></PickerBuilding>
          </group>

          <group position-z={[size[0] * 0.7]}>
            <EditBlock
              onPointerEnter={({ eventObject }) => {
                cursor("pointer");
                // eventObject.material.color = new Color("silver");
              }}
              onPointerLeave={({ eventObject }) => {
                cursor("auto");
                // eventObject.material.color = new Color("#ffffff");
              }}
              onPointerDown={({ eventObject }) => {
                Hand._isDown = true;
                Hand._moved = 0;
                // eventObject.material.color = new Color("grey");
              }}
              onPointerMove={() => {
                if (Hand._isDown) {
                  Hand._moved++;
                }
              }}
              onPointerUp={({ eventObject }) => {
                Hand._isDown = false;
                if (Hand._moved <= 10) {
                  Hand.currentPickerID = picker._id;
                  Hand.overlay = "edit-picker";
                  console.log("edit picker");
                }
                Hand._moved = 0;
                // eventObject.material.color = new Color("white");
              }}
            ></EditBlock>
          </group>
          <FloatingVertically>
            {/* // */}
            {/*  */}

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
              Edit {picker.title ? "\n\n" + picker.title : ""}
            </Text>
          </FloatingVertically>
        </group>
      </group>
    </Suspense>
  );
}
