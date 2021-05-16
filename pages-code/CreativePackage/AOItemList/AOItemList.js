import { useEffect } from "react";
import { AO } from "../AO/AO";
import { addBlockerTemp } from "../AppEditorLogic/AppEditorLogic";
import { Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export function Overlays() {
  Hand.onChangeKeyRenderUI("overlay");
  Hand.onChangeKeyRenderUI("tooltip");

  useEffect(() => {
    let hh = ({ key }) => {
      if (key === "Escape") {
        Hand.overlay = "";
      }
    };
    window.addEventListener("keydown", hh);
    return () => {
      window.removeEventListener("keydown", hh);
    };
  });
  return (
    <>
      {/*  */}
      {Hand.tooltip === "code-block" && (
        <Tooltip>Top on Floor to Create Item</Tooltip>
      )}
      {Hand.overlay === "core" && <AOCore></AOCore>}
      {Hand.overlay === "edit-blocker" && <AOEditBlocker></AOEditBlocker>}
      {/*  */}
    </>
  );
}

function Tooltip({ children }) {
  return (
    <div className=" absolute top-0 left-0 h-16 w-full  bg-yellow-200 flex items-center justify-center">
      <div className="mx-4 text-2xl text-center ">{children}</div>
    </div>
  );
}

export function AOCore() {
  //

  return (
    <AO>
      <div className="h-16 w-full  bg-yellow-200 flex items-center">
        <div className="mx-4 text-2xl ">Create Items</div>
      </div>
      <div className={"mx-4 mt-4 mb-4"}>
        <div className=" ">
          <div className="inline-block w-10/12 mx-auto lg:w-1/2 lg:mx-0 ">
            <img
              className="rounded-2xl cursor-pointer"
              src="/scene-items/blocker.png"
              onClick={() => {
                addBlockerTemp();
                Hand.overlay = "";
                Hand.tooltip = "code-block";
                setTimeout(() => {
                  Hand.tooltip = "ready";
                }, 3000);
                //
              }}
            />
            <div className="text-center">JS Code Block</div>
          </div>
        </div>
      </div>
    </AO>
  );
}

export function AOEditBlocker() {
  let blocker = ProjectStore.blockers.getItemByID(Hand.currentBlockerID);
  blocker.onChangeKeyRenderUI("title");
  return (
    <AO>
      <div className="h-16 w-full  bg-indigo-200 flex items-center">
        <div className="mx-4 text-2xl">Edit Code Block</div>
      </div>
      <div className={"mx-4 mt-4"}>
        <div className=" ">Change name</div>
        <input
          type="text"
          placeholder={"my-title-name"}
          value={blocker.title}
          onInput={(ev) => {
            blocker.title = ev.target.value;
            // ProjectStore.notifyKeyChange("blockers");
          }}
        />

        {JSON.stringify(blocker)}
      </div>
    </AO>
  );
}
