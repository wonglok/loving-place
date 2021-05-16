import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Hand } from "../AppEditorState/AppEditorState";
import { Blocker } from "../Blocker/Blocker";

function TempBlocker() {
  return (
    <Blocker
      isTemp={true}
      blocker={{ _id: "temp", position: [0, 0, 0] }}
    ></Blocker>
  );
}

export function TempAdd() {
  Hand.onChangeKeyRenderUI("addMode");

  return (
    <>
      {/*  */}
      {Hand.addMode === "addItem" && <TempBlocker></TempBlocker>}
    </>
  );
}
