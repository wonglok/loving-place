import { useEffect, useState } from "react";
import { ProjectAPI } from "../pages-code/api/Project";
import { makeSimpleShallowStore } from "../pages-code/CreativePackage/AppEditorState/AppEditorState.js";
export const Temp = makeSimpleShallowStore({
  input: "",
});

export default function TestAPI() {
  return (
    <div>
      <input
        className="bg-red-200"
        onInput={(ev) => {
          Temp.input = ev.target.value;
        }}
      ></input>

      <button
        onClick={async () => {
          let ans = ProjectAPI.getOneOfPublished({ _id: Temp.input });
          ans.then(console.log);
        }}
      >
        submit
      </button>
    </div>
  );
}

/*

fetch("https://prod-rest.realtime.effectnode.com//project?action=get-one-of-published", {
  headers: {
    "content-type": "application/json;charset=UTF-8",
  },
  body: JSON.stringify({ _id: "609f60f7272b4b00095b633d" }),
  method: "POST",
  mode: "cors",
}).then(r => r.json()).then(v => console.log(v));

*/
