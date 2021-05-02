import React, { useEffect, useRef, useState } from "react";
// Default SortableJS
import Sortable from "sortablejs";
import { html, render } from "lit-html";

export const decorateNode = ({ newList, data }) => {
  let deocration = document.createElement("li");

  deocration.className = `drag handle p-3 border m-3`;

  deocration.innerHTML = `
    ${data.name} - ${data.id}
  `;

  newList.appendChild(deocration);
};

export const buildTree = ({ mounter, children, onClean }) => {
  let newList = document.createElement("ul");
  newList.className = `pl-5 drag handle`;

  //
  children.forEach((eachOne) => {
    decorateNode({ data: eachOne, newList });
    if (eachOne.children && eachOne.children.length > 0) {
      buildTree({ mounter: newList, children: eachOne.children, onClean });
    }
  });

  var sortable = new Sortable(newList, {
    group: "apple", // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
    sort: true, // sorting inside list
    draggable: ".drag",
    handle: ".handle",
    filter: ".ignore",
  });
  onClean(() => {
    sortable.destroy();
  });
  //

  //
  mounter.appendChild(newList);
  onClean(() => {
    newList.remove();
  });
};

export const initSystem = ({ root, children }) => {
  let cleans = [];
  let onClean = (v) => cleans.push(v);

  let mounter = root;
  let newList = document.createElement("div");
  buildTree({ mounter: newList, children, onClean });
  mounter.appendChild(newList);
  onClean(() => {
    newList.remove();
  });

  return () => {
    cleans.forEach((c) => c());
  };
};

export const SortableUI = ({}) => {
  const ref = useRef();

  useEffect(() => {
    let children = [
      { id: 0, name: "0" },
      { id: 1, name: "1" },
      {
        id: 2,
        name: "hasKids",
        children: [
          { id: 3, name: "wahaha3" },
          { id: 4, name: "wahaha4" },
          { id: 5, name: "wahaha5" },
          { id: 6, name: "wahaha6" },
        ],
      },
      {
        id: 7,
        name: "hasKids",
        children: [
          { id: 8, name: "wahaha3" },
          { id: 9, name: "wahaha4" },
          { id: 10, name: "wahaha5" },
          { id: 11, name: "wahaha6" },
        ],
      },
    ];

    let clean = initSystem({ root: ref.current, children });
    return clean;
  });
  return (
    <div>
      <button onClick={() => {}}>add</button>

      <div ref={ref} className={"draggble"}></div>
    </div>
  );
};

// sortablejs
