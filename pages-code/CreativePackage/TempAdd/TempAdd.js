import { useEffect, useState } from "react";
import { Hand, makeSimpleShallowStore } from "../AppEditorState/AppEditorState";
import { Blocker } from "../Blocker/Blocker";
import { BridgeLine } from "../BridgeLine/BridgeLine";
import { Picker } from "../Picker/Picker";

function TempBlocker() {
  let temp = makeSimpleShallowStore({ _id: "temp", position: [0, 0, 0] });

  return <Blocker isTemp={true} blocker={temp}></Blocker>;
}

function TempPicker() {
  let temp = makeSimpleShallowStore({ _id: "temp", position: [0, 0, 0] });

  return <Picker isTemp={true} picker={temp}></Picker>;
}

function TempBridgeLine() {
  return <BridgeLine></BridgeLine>;
}

export function TempAdd() {
  let [show, setShow] = useState(true);
  useEffect(() => {
    window.addEventListener("touchstart", () => {
      //
      setShow(false);
    });
  }, []);

  Hand.makeKeyReactive("addMode");
  return (
    <>
      {/*  */}
      {/*  */}
      <group visible={show}>
        {Hand.addMode === "add-picker" && <TempPicker></TempPicker>}
        {Hand.addMode === "add-blocker" && <TempBlocker></TempBlocker>}
      </group>

      {Hand.addMode === "add-connection" && <TempBridgeLine></TempBridgeLine>}
    </>
  );
}
