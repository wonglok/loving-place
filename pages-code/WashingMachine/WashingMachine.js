import { useEffect, useRef } from "react";

export default function WashingMachine() {
  const ref = useRef(null);

  useEffect(() => {
    return () => {};
  }, [ref.current]);

  return <group ref={ref}></group>;
}

//

//

//

//
