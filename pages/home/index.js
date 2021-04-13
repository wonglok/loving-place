import { createState, useState } from "@hookstate/core";
import { useEffect } from "react";
import * as RT from "../../pages-code/api/realtime";
import { useRouter } from "next/router";
import Link from "next/link";
import { Project } from "../../pages-code/api/Project";
import { StackedLayout } from "../../pages-code/Layouts/StackedLayout";

const ProjectsState = createState([]);

export default function HomePagee() {
  const router = useRouter();

  const loggedin = useState(null);

  useEffect(async () => {
    RT.AuthState.isLoggedIn().then((value) => {
      loggedin.set(value);

      if (value === false) {
        router.push("/");
      }
    });
  }, []);

  if (loggedin.value === null) {
    return <div>Checking Login</div>;
  }

  if (loggedin.value === true) {
    return <HomePageInternal></HomePageInternal>;
  }

  if (loggedin.value === false) {
    return <div>Cannot Access Page</div>;
  }
}

export function HomePageInternal() {
  const router = useRouter();

  useEffect(async () => {
    // let result = await Project.create({
    //   displayName: "my first project",
    // });
    // console.log(result);

    return () => {};
  });

  return (
    <StackedLayout title={"Home"}>
      <div className="">
        <CreateProject></CreateProject>
        <ProjectsInTable></ProjectsInTable>
      </div>
    </StackedLayout>
  );
}

export function CreateProject() {
  const projects = useState(ProjectsState);
  const title = useState("My Project Title");
  const errMsg = useState("");

  const addProject = async () => {
    let newProject = await Project.create({
      displayName: title.get(),
    });

    projects.set((e) => {
      e.unshift(newProject);
      return e;
    });
    title.set("");
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        value={title.value}
        onInput={(e) => {
          title.set(e.target.value);
        }}
        onKeyDown={(ev) => {
          if (ev.code === "Enter") {
            addProject();
          }
        }}
        className="p-2 px-4 bg-gray-100 rounded-lg mr-3 placeholder-gray-400"
        placeholder="My New Project Title"
      ></input>

      <button
        className="p-2 px-4 bg-gray-600 text-white rounded-lg mr-3"
        onClick={() => {
          addProject();
        }}
      >
        Add Project
      </button>
      <div className={"py-2 px-4 text-red-500"}>{errMsg.get()}</div>
    </div>
  );
}

function TableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Published
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          DisplayName & Slug
        </th>

        <th
          scope="col"
          className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Rename
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
}

function TableRecord({ project }) {
  let loadingStatus = useState("ready");
  let row = useState(JSON.parse(JSON.stringify(project)));

  let updateObject = async ({ object }) => {
    try {
      loadingStatus.set("loading");
      let updated = await Project.updateMine({ object });
      row.set(updated);
      loadingStatus.set("ready");
    } catch (e) {
      loadingStatus.set("ready");
    }

    return;
  };

  //
  // projects
  //
  return (
    <tr>
      <td className="px-4 py-4 whitespace-nowrap">
        {row.value.published ? (
          <span
            onClick={() => {
              row.set((r) => {
                r.published = !r.published;

                return r;
              });

              updateObject({ object: row.value });
            }}
            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
          >
            Active
          </span>
        ) : (
          <span
            onClick={() => {
              row.set((r) => {
                r.published = !r.published;
                return r;
              });

              updateObject({ object: row.value });
            }}
            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
          >
            Private
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-wrap">
        <div className="text-base text-gray-900">{row.value.displayName}</div>
        <div className="text-xs text-gray-500">{row.value.slug}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <input
            type="text"
            value={row.value.displayName}
            onInput={(ev) => {
              row.set((r) => {
                r.displayName = ev.target.value;
                return r;
              });
            }}
            onKeyDown={(ev) => {
              if (ev.code === "Enter") {
                console.log(row.value);
                updateObject({ object: row.value });
              }
            }}
            className="p-2 px-4 bg-gray-100 rounded-lg mr-3 text-sm placeholder-gray-400"
            placeholder="My New Project Title"
          ></input>

          <button
            className="p-2 px-4 text-sm text-white bg-green-500 rounded-lg mr-3"
            onClick={() => {
              updateObject({ object: row.value });
            }}
          >
            {loadingStatus.value === "ready" ? "Rename" : "Loading..."}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-wrap flex items-center">
        <button
          className="p-2 px-4 text-sm text-yellow-600 border-yellow-600 border rounded-lg mr-3"
          onClick={() => {}}
        >
          Preview
        </button>
        <button
          className="p-2 px-4 text-sm text-blue-600 bg-blue-100 border-blue-600 border rounded-lg mr-3"
          onClick={() => {}}
        >
          Edit
        </button>
        <button
          className="p-2 px-4 text-sm text-red-600 bg-red-100 border-red-600 border rounded-lg mr-3"
          onClick={() => {}}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

function ProjectTable() {
  let projects = useState(ProjectsState);
  return (
    <table className={"min-w-full divide-y divide-gray-200"}>
      <TableHeader></TableHeader>
      <tbody>
        {projects.value.map((e) => {
          return <TableRecord project={e} key={e._id}></TableRecord>;
        })}
      </tbody>
    </table>
  );
}

function ProjectsInTable() {
  let projects = useState(ProjectsState);
  let pageAt = useState(0);
  let search = useState("");

  let loadProject = async () => {
    let result = await Project.listMine({
      search: search.get(),
      perPage: 120,
      pageAt: pageAt.get(),
    });

    projects.set(result);
  };
  useEffect(async () => {
    loadProject();
  }, [pageAt.value]);

  return (
    <div>
      <h1 className="text-3xl font-bold">My Projects</h1>
      <div className="mb-3 py-2 flex items-center">
        <input
          type="text"
          value={search.value}
          onInput={(e) => {
            search.set(e.target.value);
          }}
          onKeyDown={(ev) => {
            if (ev.code === "Enter") {
              pageAt.set(0);
              loadProject();
            }
          }}
          className="p-2 px-4 bg-gray-100 rounded-lg mr-3 placeholder-gray-400"
          placeholder="My New Project Title"
        ></input>

        <button
          className="p-2 px-4 text-white bg-green-500 rounded-lg mr-3"
          onClick={() => {
            pageAt.set(0);
            loadProject();
          }}
        >
          Search Project
        </button>

        <button
          className={
            "p-2 px-4 border hover:shadow-inner hover:bg-gray-50 border-gray-400 text-white rounded-lg mr-3"
          }
          onClick={() => {
            pageAt.set((at) => {
              let ans = at - 1;
              if (ans < 0) {
                ans = 0;
              }
              return ans;
            });
          }}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
          </svg>
        </button>
        <button
          className={
            "p-2 px-4 border hover:shadow-inner hover:bg-gray-50 border-gray-400 text-gray-600 rounded-lg mr-3"
          }
        >
          {pageAt.get()}
        </button>
        <button
          className={
            "p-2 px-4 border hover:shadow-inner hover:bg-gray-50 border-gray-400 text-white rounded-lg mr-3"
          }
          onClick={() => {
            pageAt.set((at) => at + 1);
          }}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
          </svg>
        </button>
      </div>

      <ProjectTable projects={projects}></ProjectTable>

      {/* <pre>{JSON.stringify(projects.value, null, "  ")}</pre> */}
    </div>
  );
}
