import { createState, useState } from "@hookstate/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Project } from "../../pages-code/api/Project";
import { Konva } from "./Konva";

export const ProjectState = createState(null);

export function ProjectEditorRoot() {
  let proj = useState(ProjectState);
  let { query } = useRouter();

  useEffect(async () => {
    let newItem = await Project.getOneOfMine({ _id: query.projectID });
    ProjectState.set(newItem);
  }, [query.projectID, proj.value?._id]);

  return proj.value ? <ProjectEditor project={proj}></ProjectEditor> : null;
}

export const ProjectEditor = ({ project }) => {
  const proj = useState(project);

  return (
    <div className={"h-full w-full bg-gray-100"}>
      <Konva project={proj.value}></Konva>
      {/* <div>{JSON.stringify(proj.value)}</div> */}
    </div>
  );
};
