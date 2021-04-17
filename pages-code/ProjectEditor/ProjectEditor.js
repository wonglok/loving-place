import { createState, useState } from "@hookstate/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Project } from "../../pages-code/api/Project";
import { AuthState } from "../api/realtime";
// import { Konva } from "./Konva";
import { OrbitGraph } from "../OrbitGraph/OrbitGraph";

export const ProjectState = createState(null);

export function ProjectEditorRoot() {
  let proj = useState(ProjectState);
  let { query } = useRouter();

  useEffect(async () => {
    let newItem = await Project.getOneOfMine({ _id: query.projectID });
    ProjectState.set(newItem);
  }, [query.projectID, proj.value?._id]);

  return proj.value ? (
    <ProjectEditorProtected project={proj}></ProjectEditorProtected>
  ) : null;
}

export const ProjectEditorProtected = ({ project }) => {
  const proj = useState(project);

  return (
    <div className={"h-full w-full bg-gray-100"}>
      <OrbitGraph project={proj}></OrbitGraph>
      {/* <Konva project={proj.value}></Konva> */}
      {/* <div>{JSON.stringify(proj.value)}</div> */}
    </div>
  );
};

export default function HomePagee() {
  const router = useRouter();

  const loggedin = useState(null);

  useEffect(async () => {
    AuthState.isLoggedIn().then((value) => {
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
