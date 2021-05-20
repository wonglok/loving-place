import moment from "moment";
import { makePublicRouterInstance } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { ProjectBackupAPI } from "../../../pages-code/api/ProjectBackup.js";
import {
  ProjectBackupStore,
  ProjectStore,
} from "../AppEditorState/AppEditorState.js";
function LeftEntry({ children }) {
  return (
    <>
      {/* <!-- left --> */}
      <div className="flex flex-row-reverse md:contents">
        <div className="bg-white border-gray-500 border text-gray-800 col-start-1 col-end-5 p-4 rounded-xl my-8 ml-auto shadow-md">
          {/* <h3 className="font-semibold text-lg mb-1">Lorem ipsum</h3>
          <p className="leading-tight text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi,
            quaerat?
          </p> */}
          {children}
        </div>
        <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
          <div className="h-full w-6 flex items-center justify-center">
            <div className="h-full w-1 bg-gray-800 pointer-events-none"></div>
          </div>
          <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-500 shadow"></div>
        </div>
      </div>
    </>
  );
}

function RightEntry({ children }) {
  return (
    <>
      {/* <!-- right --> */}
      <div className="flex md:contents">
        <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
          <div className="h-full w-6 flex items-center justify-center">
            <div className="h-full w-1 bg-gray-800 pointer-events-none"></div>
          </div>
          <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-gray-500 shadow"></div>
        </div>
        <div className="bg-white border-gray-500 border text-gray-800 col-start-6 col-end-10 p-4 rounded-xl my-8 mr-auto shadow-md">
          {/* <h3 className="font-semibold text-lg mb-1">Lorem ipsum</h3>
          <p className="leading-tight text-justify">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae,
            facilis.
          </p> */}
          {children}
        </div>
      </div>
    </>
  );
}

function Entry({ direction = "right", children }) {
  if (direction === "left") {
    return <LeftEntry>{children}</LeftEntry>;
  } else if (direction === "right") {
    return <RightEntry>{children}</RightEntry>;
  }
}

function BackupEntry({ backup }) {
  let date = moment(backup.created_at).format("MMMM Do YYYY, h:mm:ss a");
  let relativeTime = moment(backup.created_at).fromNow();

  return (
    <Entry direction={"left"}>
      <h3 className="font-semibold text-lg mb-1">{date}</h3>
      <div className="text-xs mb-4">{relativeTime}</div>
      <div className="text-xs mb-5">
        <button
          className="underline text-red-500 mr-3"
          onClick={async () => {
            ProjectBackupStore.snaps.removeItem(backup);
            ProjectBackupAPI.removeMine({ object: backup });
          }}
        >
          Remove
        </button>
        {/*  */}
        <button
          className="underline text-blue-500 mr-3"
          onClick={async () => {
            let newItem = await ProjectBackupAPI.updateMine({
              object: backup,
            });
            console.log(newItem);
          }}
        >
          Update Note
        </button>
      </div>
      <textarea
        className="leading-tight text-gray-700 border-gray-300 border p-4 rounded-xl "
        defaultValue={backup.note}
        onInput={(ev) => {
          backup.note = ev.target.value;
        }}
      ></textarea>
    </Entry>
  );
}

function CreateBackup() {
  let [note, setNote] = useState("regular backup");
  let date = moment().format("MMMM Do YYYY, h:mm:ss a");

  let createItem = useCallback(async () => {
    console.log(note);
    let newItem = await ProjectBackupAPI.create({
      note,
      projectID: ProjectStore._id,
      largeString: JSON.stringify(ProjectStore),
    });
    ProjectBackupStore.snaps.addItem(newItem);
  }, [note]);

  return (
    <Entry direction="right">
      <h3 className="font-semibold text-lg mb-1">Create new backup</h3>
      <h3 className="text-xs mb-4">{date}</h3>
      <div className="text-xs mb-5">
        <button className="underline text-blue-500 mr-3" onClick={createItem}>
          Save
        </button>
      </div>
      <textarea
        className="leading-tight text-gray-700 border-gray-300 border p-4 rounded-xl "
        value={note}
        onInput={(ev) => {
          setNote(ev.target.value);
        }}
        placeholder={"regular backup"}
      ></textarea>
    </Entry>
  );
}

function BacupLoader() {
  ProjectBackupStore.makeKeyReactive("snaps");
  useEffect(() => {
    if (ProjectStore._id) {
      ProjectBackupAPI.listMine({ projectID: ProjectStore._id }).then((v) => {
        ProjectBackupStore.snaps = [];
        v.forEach((ee) => {
          ProjectBackupStore.snaps.addItem(ee);
        });
      });
    }
  }, [ProjectStore._id]);

  return (
    <div className="flex flex-col md:grid grid-cols-9 mx-auto text-green-50">
      <CreateBackup></CreateBackup>
      {ProjectBackupStore.snaps
        .slice()
        .sort((a, b) => {
          let ta = new Date(a.created_at).getTime();
          let tb = new Date(b.created_at).getTime();

          if (ta > tb) {
            return -1;
          } else if (ta < tb) {
            return 1;
          } else {
            return 0;
          }
        })
        .map((e) => {
          return <BackupEntry key={e._id} backup={e}></BackupEntry>;
        })}
    </div>
  );
}

export function Timeline() {
  return (
    <div className="mx-6">
      <BacupLoader></BacupLoader>
    </div>
  );
}
