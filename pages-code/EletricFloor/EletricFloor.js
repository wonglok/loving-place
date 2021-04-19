import { useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { sRGBEncoding } from "three";
import { RepeatWrapping, TextureLoader, Vector2 } from "three";
import { HandState } from "../NodeState/NodeState";

export function EletricFloor() {
  return (
    <Suspense fallback={null}>
      <EletricFloorInternal></EletricFloorInternal>
    </Suspense>
  );
}

export function EletricFloorInternal() {
  const url = "/texture/curl.jpg";
  const texture = useLoader(TextureLoader, url);

  const size = new Vector2();
  const { gl } = useThree();
  const shader = useRef(null);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    texture.needsUpdate = true;
    texture.encoding = sRGBEncoding;
    texture.updateMatrix();

    shader.current.needsUpdate = true;

    gl.getSize(size);
  }, [url]);

  return (
    <group>
      {/* <gridHelper args={[10000, 100]} position-y={2}></gridHelper> */}

      <mesh
        position-y={0}
        rotation-x={-0.5 * Math.PI}
        onPointerDown={() => {
          HandState.movedAmount.set(0);
          HandState.isDown.set(true);
        }}
        onPointerUp={() => {
          HandState.isDown.set(false);
          if (HandState.movedAmount.get() < 10) {
            // this is click
          }
        }}
        onPointerLeave={() => {
          HandState.isDown.set(false);
        }}
        onPointerMove={() => {
          HandState.movedAmount.set((m) => m + 1);
        }}
      >
        <planeBufferGeometry args={[10000, 10000, 1, 1]}></planeBufferGeometry>
        <shaderMaterial
          ref={shader}
          uniforms={{
            screen: {
              value: size,
            },
            tex: {
              value: texture,
            },
          }}
          transparent={true}
          vertexShader={
            /* glsl */ `
              varying vec2 vUv;
              varying vec3 vPos;

              void main (void) {

                vUv = uv;
                vPos = position;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `
          }
          fragmentShader={
            /* glsl */ `
              uniform vec2 screen;
              varying vec2 vUv;
              varying vec3 vPos;
              uniform sampler2D tex;

              void main (void) {
                vec4 texColor = texture2D(tex, vUv * 45.0);
                gl_FragColor = texColor;

                // float thickness = 0.01;
                // float bands = 1.0 / 100.0;
                // vec4 floorColor = vec4(0.3, 0.3, 0.3, 1.0);
                // vec4 lineColor = vec4(vec3(1.0, 1.0, 1.0) * 0.4, 1.0);
                // if(fract(vUv.x / bands + thickness * 1.0) * 0.5 < thickness || fract(vUv.y / bands + thickness * 1.0) * 0.5 < thickness) {
                //   gl_FragColor = vec4(texColor.r);
                // }
                // else {
                //   gl_FragColor = vec4(texColor.r * 0.8, texColor.r * 0.8, texColor.r * 0.8, texColor.r);
                // }

                // float avg = (texColor.r + texColor.g + texColor.b) / 3.0;
                // float satuation = avg;
                // gl_FragColor = vec4(
                //   pow(texColor.r, satuation),
                //   pow(texColor.g, satuation),
                //   pow(texColor.b, satuation),
                //   1.0
                // );
              }
            `
          }
        ></shaderMaterial>
      </mesh>
    </group>
  );
}
