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

fetch("http://localhost:3333/project?action=get-one-of-published", {
  headers: {
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6",
    // "access-control-allow-origin": "http://localhost:3000",
    "cache-control": "no-cache",
    "content-type": "application/json;charset=UTF-8",
    pragma: "no-cache",
    "sec-ch-ua":
      '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
  },
  referrer: "http://localhost:3000/",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({ _id: "609f0ac72a5e721c6831168c" }),
  method: "POST",
  mode: "cors",
  credentials: "omit",
});

*/
