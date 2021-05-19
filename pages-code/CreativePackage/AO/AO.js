import { useEffect, useState } from "react";
import { Hand } from "../AppEditorState/AppEditorState";

export function AO({ children }) {
  let [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    let hh = () => {
      //
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", hh);
    return () => {
      window.removeEventListener("resize", hh);
    };
  }, []);

  return (
    <>
      <div
        className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center cursor-pointer z-10"
        onClick={() => {
          Hand.overlay = "";
        }}
      ></div>

      {size && (
        <div
          className="fadeIn block lg:block absolute bg-white lg:rounded-2xl overflow-scroll transition-opacity opacity-100 z-10"
          style={
            size[0] <= 500
              ? {
                  top: "calc(0px)",
                  left: "calc(0%)",
                  width: "calc(100% - 0% * 2)",
                  height: "calc(100% - 0% * 2)",
                }
              : {
                  top: "calc(10%)",
                  left: "calc(20%)",
                  width: "calc(100% - 20% * 2)",
                  height: "calc(100% - 10% * 2)",
                }
          }
        >
          {children}
        </div>
      )}

      <div
        className="fadeIn absolute top-0 right-0 bg-white p-3 rounded-full m-2 cursor-pointer  shadow-lg  z-10"
        onClick={() => {
          Hand.overlay = "";
        }}
      >
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z" />
        </svg>
      </div>
    </>
  );
}
