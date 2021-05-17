import { useGLTF, useTexture, Sphere, Box } from "@react-three/drei";
import { useGraph, useThree } from "@react-three/fiber";

import { memo, useMemo } from "react";
import {
  // EquirectangularReflectionMapping,
  PMREMGenerator,
  Vector3,
  // TextureLoader,
} from "three";
import { ImageEnvMap } from "../ImageEnvMap/ImageEnvMap";

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

export function useEnvMapFromEquirectangular(url = `/hdr/bubble.png`) {
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

export function useMatCapEnvMap(url) {
  let { gl, scene } = useThree();

  let texture = useTexture(url);

  let matcapEnvMap = useMemo(() => {
    if (Cache.has(url)) {
      return Cache.get(url);
    }

    let stuff = new ImageEnvMap({ renderer: gl, url, scene, texture });

    Cache.set(url, stuff.envMap);
    return stuff.envMap;
  }, [url]);

  //

  return matcapEnvMap;
}

export const Building = "/hdr/bubble-center.jpg";
export const SharedEnvURL = "/hdr/bubble-center-small.jpg";

const useEnvMap = (url) => {
  return useMatCapEnvMap(url);
};

export function MainTower({ ...props }) {
  let envMap = useEnvMap(Building);
  let glb = useGLTF("/fixed-buildings/main-tower.glb");

  let firstGeo = getFistGeo(glb.scene);
  firstGeo.computeBoundingBox();
  let rect = firstGeo.boundingBox.max.clone().sub(firstGeo.boundingBox.min);
  rect.multiplyScalar(0.02);
  rect.applyAxisAngle(new Vector3(1, 0, 0), Math.PI * 0.5);

  return (
    <group rotation-y={Math.PI * 0.5}>
      <Box
        {...props}
        args={[rect.x, rect.y, rect.z]}
        position-y={rect.y * -0.5}
      >
        <shaderMaterial
          fragmentShader={`
            void main (void) {
              discard;
            }
          `}
        ></shaderMaterial>
      </Box>

      <mesh scale={0.02} geometry={firstGeo} rotation-x={Math.PI * 0.5}>
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
  let envMap = useEnvMap(Building);
  let glb = useGLTF("/fixed-buildings/small-tower.glb");

  let firstGeo = getFistGeo(glb.scene);
  firstGeo.computeBoundingBox();
  let rect = firstGeo.boundingBox.max.clone().sub(firstGeo.boundingBox.min);
  rect.multiplyScalar(0.02);
  rect.applyAxisAngle(new Vector3(1, 0, 0), Math.PI * 0.5);

  return (
    <group position-x={-10 * 0.0} rotation-y={Math.PI * -0.5}>
      <Box
        {...props}
        args={[rect.x, rect.y * 0.5, rect.z]}
        position-y={rect.y * -0.25}
      >
        <shaderMaterial
          fragmentShader={
            /* glsl */ `
            void main (void) {
              discard;
            }
          `
          }
        ></shaderMaterial>
      </Box>
      <mesh
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
  let envMap = useEnvMap(Building);
  let glb = useGLTF("/fixed-buildings/antenna-4.glb");

  return (
    <group rotation-y={Math.PI * 0.5}>
      <mesh
        {...props}
        scale={0.0125}
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
  let envMap = useEnvMap(Building);

  let glb = useGLTF("/fixed-buildings/edit-building.glb");
  // console.log(glb);
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
