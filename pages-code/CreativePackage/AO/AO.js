export function AO({ children }) {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="w-10/12 mx-auto overflow-scroll">{children}</div>
    </div>
  );
}
