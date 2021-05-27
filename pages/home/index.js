import { createState, useState } from "@hookstate/core";
import { useEffect, useRef, useState as useReactState } from "react";
import * as RT from "../../pages-code/api/realtime";
import { useRouter } from "next/router";
import { Project, ProjectAPI } from "../../pages-code/api/Project";
import { StackedLayout } from "../../pages-code/Layouts/StackedLayout";
import copy from "copy-to-clipboard";
// import sdk from "@stackblitz/sdk";

const ProjectsState = createState([]);
const PopupRemove = createState(false);

function PopupUI({ popState, children }) {
  const pop = useState(popState);
  return pop.value ? (
    <>
      <div
        onClick={() => {
          popState.set(false);
        }}
        className="fixed cursor-not-allowed z-10 top-0 left-0 flex items-center justify-center w-screen h-screen bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg"
      >
        <div
          className="bg-white p-5 cursor-default rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div>{children}</div>
        </div>
      </div>

      <div
        className="fixed z-10 top-0 right-0 p-3 cursor-pointer"
        onClick={() => {
          popState.set(false);
        }}
      >
        <svg
          className="cursor-pointer"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          onClick={() => {
            popState.set(false);
          }}
        >
          <path
            fill="white"
            d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"
          />
        </svg>
      </div>
    </>
  ) : null;
}

export default function HomePagee() {
  const router = useRouter();

  const loggedin = useState(null);

  useEffect(async () => {
    RT.AuthState.isLoggedInResolveBoolean().then((value) => {
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

function RemoveItemPopup() {
  const [slug, setSlug] = useReactState("");
  const config = useState(PopupRemove);

  return (
    <PopupUI popState={config}>
      <h1 className=" text-2xl font-bold mb-6">Do you want to remove item?</h1>
      <div className="px-4 bg-gray-200 py-4 whitespace-nowrap max-w-xs overflow-x-auto">
        <div className="text-base text-gray-900">
          {config.value?.object?.displayName}
        </div>
        <div className="text-xs text-gray-500">
          {config.value?.object?.slug}
        </div>
      </div>
      <div className="px-4 bg-gray-200 pb-4 whitespace-nowrap max-w-xs overflow-x-auto">
        <div className="text-base text-gray-900">
          <span className="text-xs text-red-600">
            Plase enter the slug to confirm removal.
            <br />"{config.value?.object?.slug}"
            <br />
            <br />
          </span>
          <div>
            <input
              value={slug}
              onInput={(ev) => {
                //
                setSlug(ev.target.value);
              }}
            ></input>
          </div>
        </div>
      </div>
      <div>
        <button
          className="p-2 px-4 m-3 text-sm text-grey-600 bg-grey-100 border-grey-600 border rounded-lg mr-3"
          onClick={() => {
            config.value.cancel();
          }}
        >
          Cancel
        </button>

        <span
          style={{ opacity: slug === config.value?.object?.slug ? 1.0 : 0.4 }}
        >
          <button
            className="p-2 px-4 m-3 text-sm text-red-600 bg-red-100 border-red-600 border rounded-lg mr-3"
            onClick={() => {
              if (slug === config.value?.object?.slug) {
                config.value.confirm();
              }
            }}
          >
            Remove
          </button>
        </span>
      </div>
    </PopupUI>
  );
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
        <h1 className="text-4xl mb-5">Create new Project</h1>

        <CreateEmptyProject></CreateEmptyProject>
        <h1 className="text-4xl mb-5">Create Project from Templates</h1>

        <TemplateSection></TemplateSection>

        <ProjectsInTable></ProjectsInTable>
        <RemoveItemPopup></RemoveItemPopup>
      </div>
    </StackedLayout>
  );
}

function SimpleWebGLStarter() {
  const refPreviewBox = useRef();
  const [status, setStatus] = useReactState("ready");
  const projects = useState(ProjectsState);
  // const [projectJSONString, setProjectJSON] = useReactState("");

  const addProject = async () => {
    try {
      setStatus("creating");
      let newProject = await Project.create({
        displayName: "nextjs-starter",
      });

      setStatus("templating");

      let template = await Project.getTemplateCode({
        // production template
        _id: "60a6ebc7d80d490008f8ab95",
      }).catch((e) => {
        console.log(e);

        // fallback to cache
        return {
          published: true,
          displayName: "encloud-template-nextjs",
          _id: "60a6ebc7d80d490008f8ab95",
          username: "wonglok831",
          userID: "609b49ad59f39c00098c34ea",
          slug: "encloud-template-nextjs",
          created_at: "2021-05-20T23:07:51.465Z",
          updated_at: "2021-05-27T02:31:42.702Z",
          __v: 0,
          largeString:
            '{"_id":"60a6ebc7d80d490008f8ab95","blockers":[{"_id":"_3t5xs1ff71m297xsba","position":[225.1904773223522,-0.000001220703197191142,4.078623450698803],"title":"demo.plane"},{"_id":"_129m8jqpaz8v1r3lzw","position":[574.0255800058212,-9.610988275081548e-16,4.328404321431947],"title":"demo.sweet"},{"_id":"_xyco7tly0675hmz5ip","position":[927.3608198868295,-0.000001220703140347723,-3.229549711242844],"title":"noodle.main"}],"ports":[{"_id":"_mhmyeendbd4o8fa1ro","type":"input","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_q2ycc50q1ucs4f9o9q","type":"input","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ozd23z5qresgggrz3r","type":"input","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_avsez3ymam81g7h25w","type":"input","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_5xghxiw252kuiye7fb","type":"input","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_ljixqp7nj3kny8dgbz","type":"output","idx":1,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_u16smodxl4ckgmmluh","type":"output","idx":2,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_soamjj1qrfkdbtr7tn","type":"output","idx":3,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_4nh7b4sx43zoxubs8a","type":"output","idx":4,"blockerID":"_3t5xs1ff71m297xsba"},{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ew5otaq3oo0j4mozdf","type":"input","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_isle7qkkuq3ux6lp9n","type":"input","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_ckr15blt1i0579yh1o","type":"input","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_9ibtts3ofwstsr9yf5","type":"input","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_w1l0flt2vqsotdsuh4","type":"output","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_8kprxvylyob2ycxqhl","type":"output","idx":1,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_vz6ot3rnzjzr0moma1","type":"output","idx":2,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_uvj35cypedomsec1cm","type":"output","idx":3,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_p5bc3xn2x0zbsxrcpp","type":"output","idx":4,"blockerID":"_129m8jqpaz8v1r3lzw"},{"_id":"_tee3f0ojsnpf3awgys","type":"input","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_ul30rkwx88tm7pkoqd","type":"input","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_fb1ztds2al12o0hyy7","type":"input","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_k5n3zaeunzzzumng39","type":"input","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_hrr93z755r7j9xjgpv","type":"input","idx":4,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_j2os2vew2ttoi8ah99","type":"output","idx":0,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_knhqk6z0wjcle42pet","type":"output","idx":1,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_4dfpqtho79575t6e8c","type":"output","idx":2,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_0uucr4ky6q87323uzt","type":"output","idx":3,"blockerID":"_xyco7tly0675hmz5ip"},{"_id":"_8rfa2mzo0faiewmwhd","type":"output","idx":4,"blockerID":"_xyco7tly0675hmz5ip"}],"connections":[{"_id":"_xbz9uc42vf7idzqo7o","input":{"_id":"_muiwdmf8t4zhvouafp","type":"input","idx":0,"blockerID":"_129m8jqpaz8v1r3lzw"},"output":{"_id":"_24whgtq7il2nxm984b","type":"output","idx":0,"blockerID":"_3t5xs1ff71m297xsba"}}],"pickers":[]}',
        };
      });

      setStatus("preparing");

      let newLargeString = template.largeString.replace(
        template._id,
        newProject._id
      );

      newProject.largeString = newLargeString;

      await ProjectAPI.updateMine({ object: newProject });

      projects.set((e) => {
        e.unshift(newProject);
        return e;
      });

      // setProjectJSON(JSON.stringify(newProject));

      setStatus("finished");

      // let vm = await sdk.embedProjectId(
      //   refPreviewBox.current,
      //   "encloud-stackblitz-nextjs"
      // );
      // vm.applyFsDiff({
      //   destroy: ["pages-data/project.json"],
      //   create: {
      //     "pages-data/project.json": projectJSONString,
      //   },
      // });
    } catch (e) {
      setStatus("error");

      setTimeout(() => {
        setStatus("ready");
      }, 3000);
      console.log(e);
    }
  };

  //

  return (
    <div>
      {status === "ready" && (
        <div
          onClick={addProject}
          className=" rounded-lg my-3 mr-3 p-3 text-white bg-blue-500 inline-block cursor-pointer"
        >
          NextJS + ThreeJS Starter
        </div>
      )}
      {status === "creating" && (
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-yellow-500 inline-block">
          Creating....
        </div>
      )}
      {status === "templating" && (
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-yellow-500 inline-block">
          Templating....
        </div>
      )}

      {status === "preparing" && (
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-orange-500 inline-block">
          Preparing....
        </div>
      )}
      {status === "finished" && (
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-green-500 inline-block">
          Done! Please check out the items below.
        </div>
      )}
      {status === "error" && (
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-red-500 inline-block">
          Error
        </div>
      )}

      <div className="" ref={refPreviewBox}></div>
    </div>
  );
}

export function TemplateSection() {
  return (
    <div className="">
      <div className="mb-5">
        <SimpleWebGLStarter></SimpleWebGLStarter>
      </div>
      <div className="mb-5">
        <DownloadCode></DownloadCode>
      </div>
    </div>
  );
}

function DownloadCode() {
  return (
    <div>
      <div className="text-4xl ">Download Project Code Starter Pack</div>
      <a
        href="https://github.com/wonglok/encloud-template-nextjs"
        target="_blank"
      >
        <div className=" rounded-lg my-3 mr-3 p-3 text-white bg-green-500 inline-block cursor-pointer">
          Download from Github
        </div>
      </a>
    </div>
  );
}

export function CreateEmptyProject() {
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
        Add Empty Project
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
          className="w-96 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
  let router = useRouter();
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

  let onRemove = async ({ object }) => {
    PopupRemove.set(() => {
      return {
        object,
        cancel: () => {
          PopupRemove.set(false);
        },
        confirm: async () => {
          try {
            await Project.removeMine({ object });
            ProjectsState.set((p) => {
              let idx = p.findIndex((e) => e._id === object._id);
              p.splice(idx, 1);
              return p;
            });
          } catch (e) {}
          PopupRemove.set(false);
        },
      };
    });
  };

  let onEdit = ({ object }) => {
    router.push(`/project-editor/${object._id}`);
    // window.location.assign(`/project-editor/${object._id}`);
  };
  let onCopyJSON = ({ object }) => {
    Project.getOneOfMine({ _id: object._id }).then((data) => {
      copy(JSON.stringify(data, null, "  "));
      window.alert("Project JSON Copied");
    });
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

      <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-x-auto">
        <div className="text-base text-gray-900">{row.value.displayName}</div>
        <div className="text-xs text-gray-500">@{row.value.slug}</div>
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
            className="p-2 px-4 w-52 bg-gray-100 rounded-lg mr-3 text-sm placeholder-gray-400"
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
          onClick={() => {
            onCopyJSON({ object: row.value });
          }}
        >
          Copy Project JSON
        </button>
        <button
          className="p-2 px-4 text-sm text-blue-600 bg-blue-100 border-blue-600 border rounded-lg mr-3"
          onClick={() => {
            //
            onEdit({ object: row.value });
          }}
        >
          Edit
        </button>
        <button
          className="p-2 px-4 text-sm text-red-600 bg-red-100 border-red-600 border rounded-lg mr-3"
          onClick={() => {
            onRemove({ object: row.value });
          }}
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
    <div className={"w-full overflow-x-scroll"}>
      <table className={"divide-y divide-gray-200 "}>
        <TableHeader></TableHeader>
        <tbody>
          {projects.value.map((e) => {
            return <TableRecord project={e} key={e._id}></TableRecord>;
          })}
        </tbody>
      </table>
    </div>
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
    <div className="">
      <h1 className="text-3xl mb-5">My Projects</h1>
      {/*  */}
      <div className="mb-3 py-2 flex items-center overflow-x-auto">
        {/*  */}
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
            pageAt.set((at) => {
              let ans = at + 1;
              if (ProjectsState.get().length === 0) {
                ans = at;
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
            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
          </svg>
        </button>
      </div>

      <ProjectTable projects={projects}></ProjectTable>

      {/* <pre>{JSON.stringify(projects.value, null, "  ")}</pre> */}
    </div>
  );
}
