import { useEffect, useMemo, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { AO } from "../AO/AO";
import {
  getColorPicker,
  getSlider,
  getSliderVec4,
  getTextInput,
} from "../AppEditorLogic/AppEditorLogic";
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
        <Tooltip>Tap on Floor to Create Code Block</Tooltip>
      )}

      {Hand.tooltip === "add-picker" && (
        <Tooltip>Tap on Floor to Create Picker</Tooltip>
      )}

      {Hand.addMode === "add-connection" && (
        <Tooltip>
          <span>Drag to input output connect</span>
        </Tooltip>
      )}

      {Hand.overlay === "core" && <AOCore></AOCore>}
      {Hand.overlay === "edit-blocker" && <AOEditBlocker></AOEditBlocker>}
      {Hand.overlay === "edit-picker" && <AOEditPicker></AOEditPicker>}
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

function CreateJS() {
  let [inputVal, setInput] = useState("myCodeModule");
  Hand.newModuleTitleName = inputVal;
  return (
    <div className={"mx-4 mt-4 mb-4"}>
      <div className=" flex">
        <div className="block w-full">
          <input
            autoFocus={true}
            type="text"
            className="py-3 my-2 text-2xl placeholder-gray-300 appearance-none rounded-none w-full broder-b border-dashed border-gray-600 border-b"
            placeholder={"myModule"}
            value={inputVal}
            onInput={(ev) => {
              setInput(ev.target.value);
              Hand.newModuleTitleName = ev.target.value;
              // ProjectStore.notifyKeyChange("blockers");
            }}
          />
          <div className="text-left">
            <button
              className="p-3 my-3 bg-yellow-500 text-white rounded-xl shadow-lg hover:shadow-2xl"
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
  );
}
function CreatePicker() {
  let [inputVal, setInput] = useState("myPicker");
  Hand.newPickerTitleName = inputVal;
  return (
    <div className={"mx-4 mt-4 mb-4"}>
      <div className=" flex">
        <div className="block w-full">
          <input
            type="text"
            className="py-3 my-2 text-2xl placeholder-gray-300 appearance-none rounded-none w-full broder-b border-dashed border-gray-600 border-b"
            placeholder={"myPicker"}
            value={inputVal}
            onInput={(ev) => {
              setInput(ev.target.value);
              Hand.newPickerTitleName = ev.target.value;
              // ProjectStore.notifyKeyChange("blockers");
            }}
          />
          <div className="text-left">
            <button
              className="p-3 my-3 bg-yellow-500 text-white rounded-xl shadow-lg hover:shadow-2xl"
              onClick={() => {
                Hand.addMode = "add-picker";
                Hand.tooltip = "add-picker";
                Hand.overlay = "";
              }}
            >
              Create Color Pickers and etc...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AOCore() {
  return (
    <AO>
      <div className="h-16 w-full  bg-yellow-200 flex items-center">
        <div className="mx-4 text-2xl ">Create Items</div>
      </div>
      <CreateJS></CreateJS>
      <CreatePicker></CreatePicker>
    </AO>
  );
}

function RemoveBlockerConfirm({ blocker }) {
  let [name, setName] = useState("");
  return (
    <div>
      <div className={"px-4 pt-4 pb-4 "}>
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
          className="py-3 my-3 text-2xl placeholder-gray-300 appearance-none rounded-none w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
          placeholder={blocker.title}
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
          className="p-2 m-2 text-red-500 border-red-500 border rounded-lg text-xs"
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
          className="py-3 my-3 text-2xl placeholder-gray-300 appearance-none rounded-none w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
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
      <RemoveBlockerConfirm blocker={blocker}></RemoveBlockerConfirm>
    </AO>
  );
}

function RemovePickerConfirm({ picker }) {
  let [name, setName] = useState("");
  return (
    <div>
      <div className={"px-4 pt-4 pb-4 "}>
        <div className="  text-2xl text-black ">Remove Picker</div>
        <div className={"  text-sm text-red-500  "}>
          {/*  */}
          Type in the picker name{" "}
          <span className="bg-red-200 py-1 px-2 rounded-md inline-block">
            {picker.title}
          </span>{" "}
          to confirm removal
        </div>

        <input
          type="text"
          className="py-3 my-3 text-2xl placeholder-gray-300 appearance-none rounded-none w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
          placeholder={picker.title}
          value={name}
          onInput={(ev) => {
            setName(ev.target.value);
            // ProjectStore.notifyKeyChange("pickers");
          }}
        />

        <button
          className={
            name !== picker.title
              ? "bg-gray-500 text-white p-3 rounded-xl"
              : "bg-red-500 text-white p-3 rounded-xl"
          }
          disabled={name !== picker.title}
          onClick={() => {
            //

            setTimeout(() => {
              ProjectStore.pickers.removeItem(picker);

              Hand.overlay = "overlay";
            });
          }}
        >
          {name !== picker.title
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

function TitleEdit({ info, picker }) {
  let [title, setTitle] = useState(info.title);
  return (
    <div>
      <input
        value={title}
        onInput={(ev) => {
          info.title = ev.target.value;
          setTitle(ev.target.value);
        }}
        className={
          " appearance-none rounded-none border-b border-dashed border-black mb-3 w-36"
        }
      ></input>
      <div
        onClick={() => {
          picker.pickers.removeItem(info);
        }}
        className="inline-block text-xs text-red-500 p-1 m-1 border border-red-500 rounded-md cursor-pointer hover:bg-red-200"
      >
        Remove
      </div>
    </div>
  );
}

function ColorPickerEdit({ info, picker }) {
  let [val, setVal] = useState(info.value);
  return (
    <div className="m-1">
      <TitleEdit picker={picker} info={info}></TitleEdit>
      <ChromePicker
        color={val}
        onChange={(v) => {
          info.value = v.hex;
          setVal(v.hex);
        }}
      ></ChromePicker>
    </div>
  );
}

function TextPickerEdit({ info, picker }) {
  let [val, setVal] = useState(info.value);
  return (
    <div className="m-1 w-full">
      <TitleEdit picker={picker} info={info}></TitleEdit>
      <div>
        <textarea
          value={val}
          onInput={(ev) => {
            info.value = ev.target.value;
            setVal(ev.target.value);
          }}
          className={" border p-3 border-dashed border-black w-10/12"}
        ></textarea>
      </div>
    </div>
  );
}

function FloatPickerEdit({ info, picker }) {
  let [val, setVal] = useState(info.value);
  return (
    <div className="m-1 w-full">
      <TitleEdit picker={picker} info={info}></TitleEdit>
      <div>
        <input
          type="range"
          min={-100}
          max={100}
          step={0.1}
          value={val}
          onInput={(ev) => {
            info.value = Number(ev.target.value);
            setVal(Number(ev.target.value));
          }}
          className={" border-b border-dashed border-black mb-3 w-10/12"}
        ></input>
      </div>
    </div>
  );
}

function Vec4PickerEdit({ info, picker }) {
  let pickAtIdx = ({ idx }) => {
    let [val, setVal] = useState(info.value[idx]);
    return (
      <input
        type="range"
        min={-100}
        max={100}
        step={0.1}
        value={val}
        onInput={(ev) => {
          info.value[idx] = Number(ev.target.value);
          setVal(Number(ev.target.value));
        }}
        className={" border-b border-dashed border-black mb-3 w-10/12"}
      ></input>
    );
  };
  return (
    <div className="m-1 w-full">
      <TitleEdit picker={picker} info={info}></TitleEdit>
      <div>
        <div className="text-sm  text-gray-400">vec4[0]:</div>
        <div className="">{pickAtIdx({ idx: 0 })}</div>
      </div>
      <div>
        <div className="text-sm  text-gray-400">vec4[1]:</div>
        <div className="">{pickAtIdx({ idx: 1 })}</div>
      </div>
      <div>
        <div className="text-sm  text-gray-400">vec4[2]:</div>
        <div className="">{pickAtIdx({ idx: 2 })}</div>
      </div>
      <div>
        <div className="text-sm  text-gray-400">vec4[3]:</div>
        <div className="">{pickAtIdx({ idx: 3 })}</div>
      </div>
    </div>
  );
}

function AddNewPickers({ picker }) {
  return (
    <div>
      <button
        onClick={() => {
          picker.pickers.addItem(getColorPicker("text0"));
        }}
        className="p-3 m-2 border rounded-lg bg-blue-100"
      >
        + Color Picker
      </button>
      <button
        onClick={() => {
          picker.pickers.addItem(getSlider("slider0"));
        }}
        className="p-3 m-2 border rounded-lg bg-blue-100"
      >
        + Number Slider
      </button>
      <button
        onClick={() => {
          picker.pickers.addItem(getTextInput("text0"));
        }}
        className="p-3 m-2 border rounded-lg bg-blue-100"
      >
        + TextArea
      </button>
      <button
        onClick={() => {
          picker.pickers.addItem(getSliderVec4("vec4slider0"));
        }}
        className="p-3 m-2 border rounded-lg bg-blue-100"
      >
        + Vector4
      </button>
    </div>
  );
}

function UserTunes({ picker }) {
  let pickers = picker.pickers;
  picker.onChangeKeyRenderUI("pickers");
  let hexList = pickers.filter((e) => e.type === "hex");
  let floatList = pickers.filter((e) => e.type === "float");
  let textList = pickers.filter((e) => e.type === "text");
  let vec4List = pickers.filter((e) => e.type === "vec4");

  return (
    <div className="mx-4 mt-4 mb-4 ">
      <AddNewPickers picker={picker}></AddNewPickers>
      <div className="flex flex-wrap">
        {hexList.map((i) => {
          return (
            <ColorPickerEdit
              key={i._id}
              picker={picker}
              info={i}
            ></ColorPickerEdit>
          );
        })}
      </div>
      <div className="">
        {floatList.map((i) => {
          return (
            <FloatPickerEdit
              key={i._id}
              picker={picker}
              info={i}
            ></FloatPickerEdit>
          );
        })}
      </div>

      <div className="">
        {textList.map((i) => {
          return (
            <TextPickerEdit
              key={i._id}
              picker={picker}
              info={i}
            ></TextPickerEdit>
          );
        })}
      </div>
      <div className="">
        {vec4List.map((i) => {
          return (
            <Vec4PickerEdit
              key={i._id}
              picker={picker}
              info={i}
            ></Vec4PickerEdit>
          );
        })}
      </div>
    </div>
  );
}

export function AOEditPicker() {
  let picker = useMemo(() => {
    return ProjectStore.pickers.getItemByID(Hand.currentPickerID);
  }, [Hand.currentPickerID]);
  picker.onChangeKeyRenderUI("title");

  return (
    <AO>
      <div className="h-16 w-full  bg-indigo-200 flex items-center">
        <div className="mx-4 text-2xl">Edit Color Pickers / Animation</div>
      </div>
      <div className={"mx-4 mt-4 mb-4"}>
        <div className="  text-2xl">Change code name</div>
        <div className="  text-sm text-gray-500">
          This name is mapped to JS modules in your project.
        </div>

        <input
          type="text"
          className="py-3 my-3 text-2xl placeholder-gray-300 appearance-none rounded-none w-full lg:w-1/2 border-dashed border-b-2 border-gray-600"
          placeholder={"mymodule-mycodename"}
          value={picker.title}
          onInput={(ev) => {
            picker.title = ev.target.value;
            // ProjectStore.notifyKeyChange("pickers");
          }}
        />

        {/* {JSON.stringify(picker)} */}
      </div>
      <hr></hr>
      <UserTunes picker={picker}></UserTunes>
      <RemovePickerConfirm picker={picker}></RemovePickerConfirm>
    </AO>
  );
}
