import { Hand } from "../AppEditorState/AppEditorState";

export function AO({ children }) {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div
        className=" absolute top-0 right-0 bg-white p-3 rounded-full m-3 cursor-pointer"
        onClick={() => {
          Hand.overlay = "";
        }}
      >
        Close
      </div>
      <div className="w-10/12 mx-auto lg:w-8/12 bg-white rounded-2xl max-h-96 overflow-scroll">
        {children}
      </div>
    </div>
  );
}
