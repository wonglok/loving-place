import { Hand, makeSimpleShallowStore } from "../AppEditorState/AppEditorState";
import { Blocker } from "../Blocker/Blocker";

function TempBlocker() {
  let temp = makeSimpleShallowStore({ _id: "temp", position: [0, 0, 0] });

  return <Blocker isTemp={true} blocker={temp}></Blocker>;
}

export function TempAdd() {
  Hand.onChangeKeyRenderUI("addMode");
  return (
    <>
      {/*  */}
      {/*  */}
      {Hand.addMode === "addBlocker" && <TempBlocker></TempBlocker>}
    </>
  );
}
