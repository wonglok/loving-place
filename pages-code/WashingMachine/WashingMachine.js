import { useEffect, useRef } from "react";
import { LovingAPI } from "../api/LovingAPI";

export default function WashingMachine() {
  const ref = useRef(null);

  useEffect(() => {
    //
    let api = new LovingAPI({
      mounter3D: ref.current,
      loader: require.context("./codes", true, /\.js$/),
      projectID: "",
    });

    return () => {
      api.clean();
    };
  }, [ref.current]);

  return (
    <group ref={ref}>
      <mesh>
        <boxBufferGeometry args={[2, 2, 2]}></boxBufferGeometry>
        <meshStandardMaterial color={"white"}></meshStandardMaterial>
      </mesh>
    </group>
  );
}

//

//

//

//
