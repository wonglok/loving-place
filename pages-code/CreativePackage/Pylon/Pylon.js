import { Text } from "@react-three/drei";
import { useFrame, useGraph, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Color, MeshStandardMaterial } from "three";
import { Hand } from "../AppEditorState/AppEditorState";
import { FloatingVertically } from "../Blocker/Blocker";
// import { BLOOM_SCENE } from "../OrbitGraph/OrbitGraph";
// import { ShaderCubeChrome } from "../ShaderCubeChrome/ShaderCubeChrome";
//

function Floating({
  height = 10,
  rX = 5,
  wavy = 10,
  rotationY = 1,
  floatingOffset = 0,
  children,
}) {
  let ref = useRef();
  let seedRand = Math.random();
  useFrame(({}, dt) => {
    if (ref.current) {
      ref.current.timer = ref.current.timer || 0;
      ref.current.timer += dt;
      ref.current.position.y =
        height + wavy * Math.sin(ref.current.timer + floatingOffset);
      ref.current.rotation.y = ref.current.timer * rotationY;
      ref.current.rotation.z =
        ((Math.cos(ref.current.timer + seedRand) * rX) / 180) * Math.PI;
    }
  });

  return <group ref={ref}>{children}</group>;
}

function Orbiting({
  orbitRadius = 30,
  orbitSpeed = 1,
  offsetRotationY = 0,
  children,
}) {
  let ref = useRef();

  useFrame(({}, dt) => {
    if (ref.current) {
      ref.current.timer = ref.current.timer || 0;
      ref.current.timer += dt * orbitSpeed;
      ref.current.rotation.y = ref.current.timer + offsetRotationY;
    }
  });

  return (
    <group ref={ref}>
      <group position-x={orbitRadius}>{children}</group>
    </group>
  );
}

/*
let url = [
    "/crystal/shard-works-1.glb",
    "/crystal/shard-works-2.glb",
    "/crystal/shard-works-3.glb",
  ];
*/

export function ShardLargeOne({ color = "#00ffff" }) {
  const { OBJLoader } = require("three/examples/jsm/loaders/OBJLoader");
  const arr = [
    // "/crystal/shard3.obj",
    // "/crystal/shard4.obj",
    "/crystal/shard5.obj",
  ];
  const obj = useLoader(OBJLoader, arr[Math.floor(arr.length * Math.random())]);
  const { nodes } = useGraph(obj);
  const time = useRef({ value: 0 });
  const crystalCloned = useMemo(() => {
    let cloned = nodes["Icosphere"].clone();
    cloned.material = new MeshStandardMaterial({
      color: new Color(color).offsetHSL(0, 0, -0.5),
      emissive: new Color(color).offsetHSL(0, 0, -0.7),
    });
    cloned.material.onBeforeCompile = (node) => {
      console.log(node);
      node.uniforms.time = time.current;

      node.vertexShader = node.vertexShader.replace(
        `#include <clipping_planes_pars_vertex>`,
        `#include <clipping_planes_pars_vertex>

        varying vec2 vUv;
        `
      );
      node.vertexShader = node.vertexShader.replace(
        `#include <fog_vertex>`,
        `
        #include <fog_vertex>
        vUv = uv;
      `
      );

      node.fragmentShader = node.fragmentShader.replace(
        `#include <clipping_planes_pars_fragment>`,
        /* glsl */ `
        #include <clipping_planes_pars_fragment>

        uniform float time;
        varying vec2 vUv;

        const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

        float noise( in vec2 p ) {
          return sin(p.x)*sin(p.y);
        }

        float fbm4( vec2 p ) {
            float f = 0.0;
            f += 0.5000 * noise( p ); p = m * p * 2.02;
            f += 0.2500 * noise( p ); p = m * p * 2.03;
            f += 0.1250 * noise( p ); p = m * p * 2.01;
            f += 0.0625 * noise( p );
            return f / 0.9375;
        }

        float fbm6( vec2 p ) {
            float f = 0.0;
            f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
            f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
            f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
            f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
            f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
            f += 0.015625*(0.5 + 0.5 * noise( p ));
            return f/0.96875;
        }

        float pattern (vec2 p) {
          float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
          return abs(vout);
        }

      `
      );

      node.fragmentShader = node.fragmentShader.replace(
        `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
        /* glsl */ `
        outgoingLight += mix(outgoingLight, vec3(
          pattern(vUv.xy * 5.0123 + -0.3 * cos(time * 0.05)),
          pattern(vUv.xy * 5.0123 +  0.0 * cos(time * 0.05)),
          pattern(vUv.xy * 5.0123 +  0.3 * cos(time * 0.05))
        ), 0.125);
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      `
      );
    };

    cloned.material.metalness = 1;
    cloned.material.roughness = 0.1;
    // cloned.layers.enable(BLOOM_SCENE);

    return cloned;
  }, []);

  useFrame((state, dt) => {
    crystalCloned.tt = crystalCloned.tt || 0;
    crystalCloned.tt += dt * 0.5;
    time.current.value += dt;
  });

  return (
    <group scale={[7, 8, 7]}>
      {/* <primitive
        object={crystalCloned}
      ></primitive> */}

      <mesh
        onPointerEnter={({ eventObject }) => {
          document.body.style.cursor = "pointer";
          crystalCloned.material.color = new Color(color).offsetHSL(0, 0, -0.3);
        }}
        onPointerLeave={({ eventObject }) => {
          crystalCloned.material.color = new Color(color).offsetHSL(0, 0, -0.5);
          document.body.style.cursor = "";
        }}
        onPointerDown={({ eventObject }) => {
          Hand._isDown = true;
          Hand._moved = 0;
          crystalCloned.material.color = new Color(color).offsetHSL(0, 0, -0.3);
        }}
        onPointerMove={() => {
          if (Hand._isDown) {
            Hand._moved++;
          }
        }}
        onPointerUp={({ eventObject }) => {
          crystalCloned.material.color = new Color(color).offsetHSL(0, 0, -0.5);
          if (Hand._moved < 10) {
            Hand.overlay = "core";
          }
          Hand._moved = 0;
        }}
        geometry={crystalCloned.geometry}
        material={crystalCloned.material}
      ></mesh>
    </group>
  );
}

export function SmallShardThree({ color = "#00ffff" }) {
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/crystal/shard-works-2.glb");
  const crystalCloned = useMemo(() => {
    let cloned = nodes["shard"].clone();
    cloned.material = cloned.material.clone();
    cloned.material.color = new Color(color);
    // cloned.material.
    cloned.material.metalness = 1;
    cloned.material.roughness = 0.1;

    // cloned.layers.enable(BLOOM_SCENE);
    return cloned;
  }, []);

  useFrame((state, dt) => {
    crystalCloned.tt = crystalCloned.tt || 0;
    crystalCloned.tt += dt * 0.5;
  });

  return (
    <group scale={[6, 7, 6]}>
      <primitive object={crystalCloned}></primitive>
    </group>
  );
}

export function SmallShardTwo({ color = "#00ffff" }) {
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/crystal/shard-works-2.glb");
  const crystalCloned = useMemo(() => {
    let cloned = nodes["shard"].clone();
    cloned.material = cloned.material.clone();
    cloned.material.color = new Color(color);
    // cloned.material.
    cloned.material.metalness = 1;
    cloned.material.roughness = 0.1;

    // cloned.layers.enable(BLOOM_SCENE);
    return cloned;
  }, []);

  useFrame((state, dt) => {
    crystalCloned.tt = crystalCloned.tt || 0;
    crystalCloned.tt += dt * 0.5;
  });

  return (
    <group scale={[6, 7, 6]}>
      <primitive object={crystalCloned}></primitive>
    </group>
  );
}

export function SmallShardOne({ color = "#00ffff" }) {
  const { GLTFLoader } = require("three/examples/jsm/loaders/GLTFLoader");
  const { nodes } = useLoader(GLTFLoader, "/crystal/shard-works-1.glb");

  const crystalCloned = useMemo(() => {
    let cloned = nodes["Icosphere"].clone();
    cloned.material = cloned.material.clone();
    cloned.material.color = new Color(color);
    // cloned.material.
    cloned.material.metalness = 1;
    cloned.material.roughness = 0.1;

    // cloned.layers.enable(BLOOM_SCENE);
    return cloned;
  }, []);

  // const randSeed = Math.random();

  useFrame((state, dt) => {
    crystalCloned.tt = crystalCloned.tt || 0;
    crystalCloned.tt += dt * 0.5;

    // crystalCloned.material.color;

    // crystalCloned.material.emissiveIntensity =
    //   Math.sin(crystalCloned.tt + randSeed * Math.PI) *
    //     Math.sin(crystalCloned.tt + randSeed * Math.PI) *
    //     10 +
    //   2;
  });

  return (
    <group scale={[6, 7, 6]}>
      <primitive object={crystalCloned}></primitive>
    </group>
  );
}

export function Pylon({ color = "cyan" }) {
  const radius = 13;

  return (
    <Suspense fallback={null}>
      <Floating
        floatingOffset={0.0 * Math.PI}
        height={radius}
        rotationY={-0.5}
        wavy={radius * 0.8}
      >
        <group scale={3}>
          <ShardLargeOne
            color={new Color(color).offsetHSL(0, 0.0, 0.05)}
          ></ShardLargeOne>

          {/* <CrystalInternal
            color={new Color(color).offsetHSL(0, 0.0, 0.05)}
          ></CrystalInternal> */}
        </group>
      </Floating>

      <Orbiting
        orbitSpeed={0.1}
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 1}
      >
        <Floating
          floatingOffset={0.1 * Math.PI * 2}
          height={radius}
          rotationY={0.1}
          wavy={radius}
        >
          <group rotation-x={0.2}>
            <SmallShardTwo
              color={new Color(color).offsetHSL(0.03 + 0.01, 0, -0.45)}
            ></SmallShardTwo>
          </group>
        </Floating>
      </Orbiting>

      <Orbiting
        orbitSpeed={0.1}
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 2}
      >
        <Floating
          floatingOffset={0.2 * Math.PI * 2}
          height={radius}
          rotationY={0.1}
          wavy={radius}
        >
          <group rotation-x={0.2}>
            <SmallShardThree
              color={new Color(color).offsetHSL(0.03 + 0.02, 0, -0.45)}
            ></SmallShardThree>
          </group>
        </Floating>
      </Orbiting>

      <Orbiting
        orbitSpeed={0.1}
        orbitRadius={radius + radius * 2.5}
        offsetRotationY={((Math.PI * 2) / 3) * 3}
      >
        <Floating
          floatingOffset={0.3 * Math.PI * 2}
          height={radius}
          rotationY={0.1}
          wavy={radius}
        >
          <group rotation-x={0.2}>
            <SmallShardOne
              color={new Color(color).offsetHSL(0.03 + 0.03, 0, -0.45)}
            ></SmallShardOne>
          </group>
        </Floating>
      </Orbiting>

      {/* <mesh
      // onPointerDown={() => {
      //   EditorHandState.movedAmount.set(0);
      //   EditorHandState.isDown.set(true);
      // }}
      // onPointerUp={() => {
      //   EditorHandState.isDown.set(false);
      //   if (EditorHandState.movedAmount.get() < 10) {
      //     // this is click
      //   }
      // }}
      // onPointerLeave={() => {
      //   document.body.style.cursor = "";
      //   EditorHandState.isDown.set(false);
      // }}
      // onPointerMove={() => {
      //   document.body.style.cursor = "move";
      //   EditorHandState.movedAmount.set((m) => m + 1);
      // }}
      >
        <boxBufferGeometry
          args={[radius * 9, radius * 21, radius * 9]}
        ></boxBufferGeometry>

        <meshBasicMaterial
          opacity={0.5}
          color={"gray"}
          transparent={true}
          side={DoubleSide}
          onBeforeCompile={(node) => {
            node.fragmentShader = `
              void main(void) {
                discard;
              }
            `;
          }}
        ></meshBasicMaterial>
      </mesh> */}

      <FloatingVertically>
        <Text
          color={"#1256de"}
          fontSize={10}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={"left"}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          textAlign={"center"}
          position-z={80}
          position-y={50}
          rotation-x={Math.PI * -0.3}
          outlineWidth={1}
          outlineColor="#ffffff"
        >
          {"Crystal Core\n\n" + "Click to Start"}
        </Text>
      </FloatingVertically>
    </Suspense>
  );
}
