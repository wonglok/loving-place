import { useGLTF, useTexture } from "@react-three/drei";
import { useGraph, useThree } from "@react-three/fiber";

import { useMemo } from "react";
import {
  // EquirectangularReflectionMapping,
  PMREMGenerator,
  // TextureLoader,
} from "three";

let Cache = new Map();

let getFistGeo = (scene) => {
  let res = false;

  scene.traverse((item) => {
    if (item.geometry && !res) {
      res = item.geometry;
    }
  });

  return res;
};

export function useEnvMap(url = `/hdr/adams_place_bridge_1k.png`) {
  let { gl } = useThree();
  let texture = useTexture(url);

  let output = useMemo(() => {
    if (Cache.has(url)) {
      return Cache.get(url);
    }

    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    let res = pmremGenerator.fromEquirectangular(texture).texture;

    Cache.set(url, res);

    return res;
  }, [texture.uuid]);

  return output;
}

export function MainTower({ ...props }) {
  let envMap = useEnvMap("/hdr/pexels-faik-akmd-1025469.jpg");
  let glb = useGLTF("/fixed-buildings/main-tower.glb");
  return (
    <group rotation-y={Math.PI * 0.5}>
      <mesh
        {...props}
        scale={0.02}
        geometry={getFistGeo(glb.scene)}
        rotation-x={Math.PI * 0.5}
      >
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.2}
          envMap={envMap}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}

export function CodeBuilding({ ...props }) {
  let envMap = useEnvMap("/hdr/pexels-faik-akmd-1025469.jpg");
  let glb = useGLTF("/fixed-buildings/small-tower.glb");

  return (
    <group position-x={-10 * 0.0} rotation-y={Math.PI * -0.5}>
      <mesh
        {...props}
        scale={0.02}
        geometry={getFistGeo(glb.scene)}
        rotation-x={Math.PI * 0.5}
      >
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.2}
          envMap={envMap}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}

export function Antenna({ ...props }) {
  let envMap = useEnvMap("/hdr/pexels-faik-akmd-1025469.jpg");
  let glb = useGLTF("/fixed-buildings/antenna-4.glb");

  return (
    <group rotation-y={Math.PI * 0.5}>
      <mesh
        {...props}
        scale={0.015}
        geometry={getFistGeo(glb.scene)}
        rotation-x={Math.PI * 0.5}
      >
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.2}
          envMap={envMap}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}

export function EditBlock({ ...props }) {
  let envMap = useEnvMap("/hdr/pexels-faik-akmd-1025469.jpg");

  let glb = useGLTF("/fixed-buildings/edit-building.glb");
  console.log(glb);
  return (
    <group rotation-y={Math.PI * -0.5}>
      <mesh
        {...props}
        scale={0.05}
        geometry={getFistGeo(glb.scene)}
        rotation-x={Math.PI * 0.5}
      >
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.2}
          envMap={envMap}
        ></meshStandardMaterial>
      </mesh>
    </group>
  );
}
