import { useEffect, useMemo, useRef, useState } from "react";
import { AO } from "../AO/AO";
import { Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export function Overlays() {
  Hand.onChangeKeyRenderUI("overlay");
  Hand.onChangeKeyRenderUI("tooltip");
  Hand.onChangeKeyRenderUI("addMode");

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
      {Hand.tooltip === "add-blocker" && (
        <Tooltip>Tap on Floor to Create Item</Tooltip>
      )}
      {Hand.addMode === "add-connection" && (
        <Tooltip>
          <span>Drag to input output connect</span>
        </Tooltip>
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
  let [inputVal, setInput] = useState("my-new-codename");
  Hand.newModuleTitleName = inputVal;
  return (
    <AO>
      <div className="h-16 w-full  bg-yellow-200 flex items-center">
        <div className="mx-4 text-2xl ">Create Items</div>
      </div>
      <div className={"mx-4 mt-4 mb-4"}>
        <div className=" ">
          <div className="inline-block  ">
            <img className="rounded-2xl h-60" src="/scene-items/blocker.png" />

            <input
              type="text"
              className="py-3 my-2 text-2xl placeholder-gray-600 w-full broder-b border-dashed border-gray-600 border-b"
              placeholder={"myname-myNewModule-codename"}
              value={inputVal}
              onInput={(ev) => {
                setInput(ev.target.value);
                Hand.newModuleTitleName = ev.target.value;
                // ProjectStore.notifyKeyChange("blockers");
              }}
            />
            <div className="text-center">
              <button
                className="p-3 m-3 bg-yellow-500 text-white rounded-xl shadow-lg hover:shadow-2xl"
                onClick={() => {
                  Hand.addMode = "add-blocker";
                  Hand.tooltip = "add-blocker";
                  Hand.overlay = "";
                }}
              >
                Create JS Code Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </AO>
  );
}

function RemoveConfirm({ blocker }) {
  let [name, setName] = useState("");
  return (
    <div>
      <div className={"px-4 pt-4 pb-4  cursor-pointer"}>
        <div className="  text-2xl text-black ">Remove Code Block</div>
        <div className={"  text-sm text-red-500  "}>
          {/*  */}
          Type in the code name{" "}
          <span className="bg-red-200 py-1 px-2 rounded-md  inline-block">
            {blocker.title}
          </span>{" "}
          to confirm removal
        </div>

        <input
          type="text"
          className="py-3 my-3 text-2xl placeholder-gray-600 w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
          placeholder={"mymodule-mycodename"}
          value={name}
          onInput={(ev) => {
            setName(ev.target.value);
            // ProjectStore.notifyKeyChange("blockers");
          }}
        />

        <button
          className={
            name !== blocker.title
              ? "bg-gray-500 text-white p-3 rounded-xl"
              : "bg-red-500 text-white p-3 rounded-xl"
          }
          disabled={name !== blocker.title}
          onClick={() => {
            //

            setTimeout(() => {
              let ports = ProjectStore.ports.filter(
                (e) => e.blockerID === blocker._id
              );

              let connections = ProjectStore.connections.filter((e) => {
                return (
                  e.input.blockerID === blocker._id ||
                  e.output.blockerID === blocker._id
                );
              });

              ports.forEach((pp) => {
                ProjectStore.ports.removeItem(pp);
              });

              connections.forEach((cc) => {
                ProjectStore.connections.removeItem(cc);
              });

              ProjectStore.blockers.removeItem(blocker);

              Hand.overlay = "overlay";
            });
          }}
        >
          {name !== blocker.title
            ? "Type to Confirm Removal"
            : "Comfirm Removal"}
        </button>

        {/*  */}

        {/* {JSON.stringify(blocker)} */}
      </div>
      <hr></hr>
    </div>
  );
}

function ConnectionInfo({ connection }) {
  let inputBlock = ProjectStore.blockers.getItemByID(
    connection.input.blockerID
  );
  let outputBlock = ProjectStore.blockers.getItemByID(
    connection.output.blockerID
  );
  inputBlock.onChangeKeyRenderUI("title");
  outputBlock.onChangeKeyRenderUI("title");

  return (
    <>
      <td className={"p-3"}>
        From Input: {inputBlock.title || "untitled"} - To Output:{" "}
        {outputBlock.title || "untitled"}
      </td>
      <td>
        <button
          onClick={() => {
            if (window.confirm("remove?")) {
              ProjectStore.connections.removeItem(connection);
            }
          }}
        >
          Remove
        </button>
      </td>
    </>
  );
}

function RemoveConnection() {
  ProjectStore.onChangeKeyRenderUI("connections");

  return (
    <div>
      <div className={"mx-4 mt-4 mb-4"}>
        <div className="  text-2xl">Remove Connections</div>
        <div className="  text-sm text-gray-500">
          You can remove connections of this module.
        </div>
        <table>
          <tbody>
            {ProjectStore.connections.map((e) => {
              return (
                <tr key={e._id}>
                  <ConnectionInfo connection={e}></ConnectionInfo>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <hr></hr>
    </div>
  );
}

export function AOEditBlocker() {
  let blocker = useMemo(() => {
    return ProjectStore.blockers.getItemByID(Hand.currentBlockerID);
  }, [Hand.currentBlockerID]);
  blocker.onChangeKeyRenderUI("title");

  return (
    <AO>
      <div className="h-16 w-full  bg-indigo-200 flex items-center">
        <div className="mx-4 text-2xl">Edit JS Code Block</div>
      </div>
      <div className={"mx-4 mt-4 mb-4"}>
        <div className="  text-2xl">Change code name</div>
        <div className="  text-sm text-gray-500">
          This name is mapped to JS modules in your project.
        </div>

        <input
          type="text"
          className="py-3 my-3 text-2xl placeholder-gray-600 w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
          placeholder={"mymodule-mycodename"}
          value={blocker.title}
          onInput={(ev) => {
            blocker.title = ev.target.value;
            // ProjectStore.notifyKeyChange("blockers");
          }}
        />

        {/* {JSON.stringify(blocker)} */}
      </div>
      <hr></hr>
      <RemoveConnection blocker={blocker}></RemoveConnection>
      <RemoveConfirm blocker={blocker}></RemoveConfirm>
    </AO>
  );
}
