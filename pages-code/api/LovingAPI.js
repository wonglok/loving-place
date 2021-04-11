//

export class LovingAPI {
  // https://www.npmjs.com/package/js-tree-list
  constructor({ mounter3D, loader, projectID }) {
    console.log(projectID);
    this.files = [];

    function getFilesData(r, array) {
      r.keys().forEach((key) => {
        array.push({
          filepath: key,
          ...r(key),
        });
      });
    }

    getFilesData(loader, this.files);

    console.log(this.files, mounter3D);

    this.clean = () => {
      console.log("clean");
    };
  }
}

//
// Serverside is better because we can make a template market place
//

//
// drag the logic file to canvas
//

// logic file
// export const codename = 'root'
// export const inputs = [{ name: 'system' }, { name: 'position' }]
// export const outputs = [{ name: 'system' }, { name: 'position' }]
// export const logic = async function (core) { }

// core.i2
// core.o2

// core.i1.pulse({ a: 123 })
// core.i1.stream(() => {})

// i = inpiut
// o = output

// let stuff = await core.i1.ready
// let stuff = await core.i2.ready

//
//
//
//

// social gallery front end
// creative tools backend
// connector to nextjs codebase

// Feature List
// Works with NextJS
// Works on mobile preview and desktop vscode
// auto buildTimemCache
// document JSON export
// Graph Editor with sub graph
// Code Report
// Push based Realtime Refresh
// intermediate inspector for Procedral toolset
// Graph and sub graph
// simple io
// core.set('myname', value)
// core.ready.myname

// core.i1 = input port 1
// core.o2 = output port 2
// core.i1.stream(() => {
// })
// core.onLoop(() => {})
// core.onClean(() => {})
//
// REST + WS API

// procedral drag and drop to make simple computations
// loving.place
//

// https://github.com/mrdoob/three.js/blob/master/examples/misc_boxselection.html
// https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_drag.html
//
