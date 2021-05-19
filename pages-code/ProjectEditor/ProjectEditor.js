import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Project } from "../../pages-code/api/Project";
import { AuthState } from "../api/realtime";
// import { Konva } from "./Konva";

import { NodeExplorer } from "../../pages-code/CreativePackage";

export function ProjectEditorRoot() {
  let [proj, setProject] = useState(null);
  let { query } = useRouter();

  useEffect(async () => {
    if (!query.projectID) {
      return;
    }

    try {
      let newItem = await Project.getOneOfMine({ _id: query.projectID });
      if (newItem) {
        setProject(newItem);
      } else {
        setProject(false);
      }
    } catch (e) {
      setProject(false);
      console.log(e);
    }
  }, [query.projectID]);

  if (proj === null) {
    return <div>Loading</div>;
  } else if (proj === false) {
    return <div>Failed Loading Project Data</div>;
  } else {
    return <ProjectEditorProtected project={proj}></ProjectEditorProtected>;
  }
}

export const ProjectEditorProtected = ({ project }) => {
  // const proj = useState(project);

  return (
    <div className={"h-full w-full"}>
      {/* {proj._id.get()} */}
      {/* <OrbitGraph project={proj}></OrbitGraph> */}
      {/* <Konva project={proj.value}></Konva> */}
      {/* <div>{JSON.stringify(proj.value)}</div> */}
      <NodeExplorer project={project}></NodeExplorer>
    </div>
  );
};

// export function ProjectEditorRoot() {
//   const router = useRouter();

//   const loggedin = useState(null);

//   useEffect(async () => {
//     AuthState.isLoggedInResolveBoolean().then((value) => {
//       loggedin.set(value);

//       if (value === false) {
//         router.push("/login");
//       }
//     });
//   }, []);

//   if (loggedin.value === null) {
//     return <div>Checking Login</div>;
//   }

//   if (loggedin.value === true) {
//     return <ProjectEditorLoader></ProjectEditorLoader>;
//   }

//   if (loggedin.value === false) {
//     return <div>Cannot Access Page</div>;
//   }
// }
