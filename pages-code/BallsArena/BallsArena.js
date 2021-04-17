import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { OctahedronBufferGeometry } from "three";
// import { ShaderCubeChrome } from "../ShaderCubeChrome/ShaderCubeChrome";
//
function Floating({ height = 10, wavyness = 10, rotationY = 1, children }) {
  let ref = useRef();

  useFrame(({}, dt) => {
    if (ref.current) {
      ref.current.timer = ref.current.timer || 0;
      ref.current.timer += dt;
      ref.current.position.y = height + wavyness * Math.sin(ref.current.timer);
      ref.current.rotation.y = ref.current.timer * rotationY;
    }
  });

  return <group ref={ref}>{children}</group>;
}

function Orbiting({ offsetRotationY = 0, children }) {
  let ref = useRef();

  useFrame(({}, dt) => {
    if (ref.current) {
      ref.current.timer = ref.current.timer || 0;
      ref.current.timer += dt;
      ref.current.rotation.y = ref.current.timer + offsetRotationY;
    }
  });

  return <group ref={ref}>{children}</group>;
}

let Cache = {};
// const useChroma = () => {
//   const { gl } = useThree();
//   Cache.chroma =
//     Cache.chroma || new ShaderCubeChrome({ renderer: gl, res: 128 });
//   let time = 0;
//   useFrame((state, dt) => {
//     time += dt;
//     Cache.chroma.compute({ time });
//   });

//   return Cache.chroma;
// };

const useGlassBall = ({ radius = 35 }) => {
  Cache.octahedron =
    Cache.octahedron || new OctahedronBufferGeometry(radius, 1);
  return Cache.octahedron;
};

const useCrystalBall = ({ radius = 35 }) => {
  if (!Cache.crystal) {
    Cache.crystal = new OctahedronBufferGeometry(radius * 0.2, 0);
    Cache.crystal.scale(1, 2.0, 1);
  }
  return Cache.crystal;
};

export function OneBall() {
  const radius = 30;
  const airGap = 25;

  // const chroma = useChroma();
  const mainGeo = useGlassBall({ radius });
  const crystalGeo = useCrystalBall({ radius });

  const limeMat = useMemo(() => {
    return (
      <meshStandardMaterial
        color={"lime"}
        transparent={true}
        // envMap={chroma.out.envMap}
        metalness={1.0}
        roughness={0.25}
        flatShading={true}
      ></meshStandardMaterial>
    );
  }, []);

  return (
    <group>
      <Floating height={airGap + radius} rotationY={-2} wavyness={radius * 0.5}>
        <mesh
          //
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          //
          onPointerLeave={() => {
            document.body.style.cursor = "";
          }}
          //
          scale-y={1.0}
          geometry={mainGeo}
        >
          <meshStandardMaterial
            color={"cyan"}
            transparent={true}
            // envMap={chroma.out.envMap}
            flatShading={true}
            metalness={1.0}
            roughness={0.25}
          ></meshStandardMaterial>
        </mesh>

        <Orbiting offsetRotationY={((Math.PI * 2) / 3) * 1}>
          <mesh geometry={crystalGeo} position-x={radius + radius * 0.3}>
            {limeMat}
          </mesh>
        </Orbiting>
        <Orbiting offsetRotationY={((Math.PI * 2) / 3) * 2}>
          <mesh geometry={crystalGeo} position-x={radius + radius * 0.3}>
            {limeMat}
          </mesh>
        </Orbiting>
        <Orbiting offsetRotationY={((Math.PI * 2) / 3) * 3.0}>
          <mesh geometry={crystalGeo} position-x={radius + radius * 0.3}>
            {limeMat}
          </mesh>
        </Orbiting>
      </Floating>
    </group>
  );
}

export function BallsArena() {
  //

  //
  return (
    <group>
      <group position-x={0}>
        <OneBall></OneBall>
      </group>
      <group position-x={120}>
        <OneBall></OneBall>
      </group>
      <group position-x={240}>
        <OneBall></OneBall>
      </group>
      <group position-x={360}>
        <OneBall></OneBall>
      </group>
    </group>
  );
}
