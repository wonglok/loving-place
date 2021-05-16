import { AO } from "../AO/AO";
import { addBlockerTemp } from "../AppEditorLogic/AppEditorLogic";
import { Hand } from "../AppEditorState/AppEditorState";

export function AOCCore() {
  //

  return (
    <AO>
      <div className="h-16 w-full  bg-yellow-200 flex items-center">
        <div className="mx-4 text-2xl">Create</div>
      </div>
      <div className={"mx-4 mt-4"}>
        <div>
          <img
            className="w-10/12 mx-auto lg:w-1/2 lg:mx-0 rounded-2xl cursor-pointer"
            src="/scene-items/mynewmodule.png"
            onClick={() => {
              // ProjectStore.blockers.addItem({
              //   _id: getID(),
              // });
              // queryCanvasState((state) => {
              //   console.log(state);
              // });
              addBlockerTemp();
              Hand.overlay = "";
              //
            }}
          />
        </div>
      </div>
    </AO>
  );
}
