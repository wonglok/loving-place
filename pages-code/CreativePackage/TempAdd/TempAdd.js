import { Hand, makeSimpleShallowStore } from "../AppEditorState/AppEditorState";
import { Blocker } from "../Blocker/Blocker";
import { BridgeLine } from "../BridgeLine/BridgeLine";

function TempBlocker() {
  let temp = makeSimpleShallowStore({ _id: "temp", position: [0, 0, 0] });

  return <Blocker isTemp={true} blocker={temp}></Blocker>;
}
function TempBridgeLine() {
  return <BridgeLine></BridgeLine>;
}

export function TempAdd() {
  Hand.onChangeKeyRenderUI("addMode");
  return (
    <>
      {/*  */}
      {/*  */}
      {Hand.addMode === "add-blocker" && <TempBlocker></TempBlocker>}
      {Hand.addMode === "add-connection" && <TempBridgeLine></TempBridgeLine>}
    </>
  );
}
