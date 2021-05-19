import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Project } from "../../pages-code/api/Project";
import { AuthState } from "../api/realtime";
// import { Konva } from "./Konva";

import { NodeExplorer } from "../../pages-code/CreativePackage";

export function ProjectEditorRoot() {
  let [proj, setProject] = useState(false);
  let { query } = useRouter();

  useEffect(async () => {
    let newItem = await Project.getOneOfMine({ _id: query.projectID });
    setProject(newItem);
  }, [query.projectID]);

  return proj ? (
    <ProjectEditorProtected project={proj}></ProjectEditorProtected>
  ) : null;
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

export default function HomePage() {
  const router = useRouter();

  const loggedin = useState(null);

  useEffect(async () => {
    AuthState.isLoggedInResolveBoolean().then((value) => {
      loggedin.set(value);

      if (value === false) {
        router.push("/login");
      }
    });
  }, []);

  if (loggedin.value === null) {
    return <div>Checking Login</div>;
  }

  if (loggedin.value === true) {
    return <ProjectEditorProtected></ProjectEditorProtected>;
  }

  if (loggedin.value === false) {
    return <div>Cannot Access Page</div>;
  }
}
