import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Color, OctahedronBufferGeometry } from "three";
import { BLOOM_SCENE } from "../OrbitGraph/OrbitGraph";
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

function Orbiting({ orbitRadius = 30, offsetRotationY = 0, children }) {
  let ref = useRef();

  useFrame(({}, dt) => {
    if (ref.current) {
      ref.current.timer = ref.current.timer || 0;
      ref.current.timer += dt;
      ref.current.rotation.y = ref.current.timer + offsetRotationY;
    }
  });

  return (
    <group ref={ref}>
      <group position-x={orbitRadius}>{children}</group>
    </group>
  );
}

export function CrystalInternal({ color = "#00ffff" }) {
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/crystal/crystal2.glb");
  const crystalCloned = useMemo(() => {
    let cloned = nodes["Crystal_Rock4"].clone();
    cloned.material = cloned.material.clone();
    cloned.material.emissive = new Color(color);
    cloned.material.metalness = 0.0;
    cloned.material.emissiveIntensity = 10;
    cloned.layers.enable(BLOOM_SCENE);
    return cloned;
  }, []);

  return <primitive object={crystalCloned}></primitive>;
}

export function Crystal() {
  const radius = 10;

  return (
    <Suspense fallback={null}>
      <Floating height={radius} rotationY={-2} wavyness={radius * 0.5}>
        <group scale={3}>
          <CrystalInternal color="cyan"></CrystalInternal>
        </group>
      </Floating>

      <Orbiting
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 1}
      >
        <Floating height={radius} rotationY={5} wavyness={radius}>
          <CrystalInternal color={"lime"}></CrystalInternal>
        </Floating>
      </Orbiting>
      <Orbiting
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 2}
      >
        <Floating height={radius} rotationY={5} wavyness={radius}>
          <CrystalInternal color={"lime"}></CrystalInternal>
        </Floating>
      </Orbiting>
      <Orbiting
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 3}
      >
        <Floating height={radius} rotationY={5} wavyness={radius}>
          <CrystalInternal color={"lime"}></CrystalInternal>
        </Floating>
      </Orbiting>
    </Suspense>
  );
}

export function BallsArena() {
  //

  //
  return (
    <group>
      <group position-x={0}>
        <Crystal></Crystal>
      </group>
      <group position-x={120}>
        <Crystal></Crystal>
      </group>
      <group position-x={240}>
        <Crystal></Crystal>
      </group>
      <group position-x={360}>
        <Crystal></Crystal>
      </group>
    </group>
  );
}
