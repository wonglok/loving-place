import { createState, useState } from "@hookstate/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Project } from "../../pages-code/api/Project";

const ProjectState = createState(null);
// const SnapshotsState = createState([]);

export default function ProjectEditorRootPage() {
  return typeof "window" !== "undefined" ? (
    <ProjectEditorRoot></ProjectEditorRoot>
  ) : null;
}

function ProjectEditorRoot() {
  let proj = useState(ProjectState);
  let { query } = useRouter();

  useEffect(async () => {
    let newItem = await Project.getOneOfMine({ _id: query.projectID });
    ProjectState.set(newItem);
  }, [query.projectID, proj.value?._id]);

  return (
    <div className={"h-full w-full bg-gray-100"}>
      {JSON.stringify(proj.value)}
    </div>
  );
}
