import { useState } from "@hookstate/core";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
// import { GameControl } from "../GameControl/GameControl";
import { HDREnv } from "../HDREnv/HDREnv";
import { LineDrop } from "../LineDrop/LineDrop";
import { OrbitGraphControls } from "../OrbitGraphControls/OrbitGraphControls";
// import { MetalMan } from "../MetalMan/MetalMan";
import { EletricFloor } from "../EletricFloor/EletricFloor";
import { OverlayState, ToolbarState } from "../NodeState/NodeState";
import { BallsArena } from "../BallsArena/BallsArena";
import { Layers, MeshBasicMaterial, ShaderMaterial, Vector2 } from "three";
import { sRGBEncoding } from "three";
export const ENTIRE_SCENE = 0;
export const BLOOM_SCENE = 1;

// import { getGPUTier } from "detect-gpu";
// import { Physics } from "@react-three/cannon";
// import WashingMachine from "../WashingMachine/WashingMachine";
// import * as RT from "../api/realtime";

// import {
//   EffectComposer,
//   DepthOfField,
//   Bloom,
//   Noise,
//   Vignette,
// } from "@react-three/postprocessing";

export function PostProcessing() {
  let { gl, size, scene, camera } = useThree();
  //
  let {
    // baseRTT,
    //
    bloomComposer,
    finalComposer,
  } = useMemo(() => {
    let {
      EffectComposer,
    } = require("three/examples/jsm/postprocessing/EffectComposer");

    // let baseRTT = new WebGLRenderTarget(size.width, size.height, {
    //   encoding: sRGBEncoding,
    // });

    let bloomComposer = new EffectComposer(gl);
    bloomComposer.renderToScreen = false;
    let sizeV2 = new Vector2(window.innerWidth, window.innerHeight);

    let {
      RenderPass,
    } = require("three/examples/jsm/postprocessing/RenderPass");
    let renderPass = new RenderPass(scene, camera);
    bloomComposer.addPass(renderPass);

    let {
      UnrealBloomPass,
    } = require("three/examples/jsm/postprocessing/UnrealBloomPass.js");
    let unrealPass = new UnrealBloomPass(sizeV2, 1.5, 0.6, 0.5);
    unrealPass.renderToScreen = true;
    unrealPass.strength = 1.0;
    unrealPass.threshold = 0.5;
    unrealPass.radius = 1.0;
    unrealPass.setSize(size.width, size.height);

    bloomComposer.addPass(unrealPass);

    //

    const finalComposer = new EffectComposer(gl);
    finalComposer.addPass(renderPass);
    finalComposer.renderToScreen = true;

    bloomComposer.renderTarget2.texture.encoding = sRGBEncoding;
    bloomComposer.renderTarget1.texture.encoding = sRGBEncoding;
    finalComposer.renderTarget2.texture.encoding = sRGBEncoding;
    finalComposer.renderTarget1.texture.encoding = sRGBEncoding;

    let {
      ShaderPass,
    } = require("three/examples/jsm/postprocessing/ShaderPass.js");
    // let bloomTexture = {
    //   value: bloomComposer.renderTarget2.texture,
    // };
    const finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: {
            value: bloomComposer.renderTarget2.texture,
          },
        },
        vertexShader: /* glsl */ `
        varying vec2 vUv;

          void main() {

            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

          }

        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;

          varying vec2 vUv;

          void main() {

            gl_FragColor = ( texture2D( baseTexture, vUv ) * 1.0 + 1.0 * texture2D( bloomTexture, vUv ) );

          }
        `,
        defines: {},
      }),
      "baseTexture"
    );
    //

    finalPass.needsSwap = true;
    finalComposer.addPass(finalPass);

    window.addEventListener(
      "resize",
      () => {
        gl.getSize(sizeV2);
        bloomComposer.setSize(sizeV2.x, sizeV2.y);
        finalComposer.setSize(sizeV2.x, sizeV2.y);

        const dpr = gl.getPixelRatio();
        if (dpr >= 1.75) {
          dpr = 1.75;
        }

        bloomComposer.setPixelRatio(dpr * 0.5);
        finalComposer.setPixelRatio(dpr);
      },
      false
    );

    window.dispatchEvent(new CustomEvent("resize"));

    return {
      bloomComposer,
      finalComposer,
    };
  }, []);

  // let materials = {};
  const darkMaterial = new MeshBasicMaterial({ color: "black" });

  const bloomLayer = new Layers();
  bloomLayer.set(BLOOM_SCENE);

  let cacheMap = new Map();
  function darkenNonBloomed(obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      // materials[obj.uuid] = obj.material;
      cacheMap.set(obj.uuid, obj.material);
      obj.material = darkMaterial;
    }
  }

  function restoreMaterial(obj) {
    if (cacheMap.has(obj.uuid)) {
      obj.material = cacheMap.get(obj.uuid);
      cacheMap.delete(obj.uuid);
    }
    // if (materials[obj.uuid]) {
    //   obj.material = materials[obj.uuid];
    //   delete materials[obj.uuid];
    // }
  }

  useFrame(({}, dt) => {
    //
    scene.traverse(darkenNonBloomed);
    bloomComposer.render(dt);
    scene.traverse(restoreMaterial);
    //
    finalComposer.render(dt);
  }, 1);

  return <group></group>;
}

export function OrbitGraph() {
  const overlay = useState(OverlayState);
  const toolbar = useState(ToolbarState);
  const dpr = useState(1.0);

  useEffect(async () => {
    let val = window.devicePixelRatio || 1.0;

    if (val >= 1.5) {
      val = 1.5;
    }

    dpr.set(val);
    // setTimeout(async () => {
    //   const gpuTier = await getGPUTier();
    //   alert(JSON.stringify(gpuTier));
    // }, 1000);
  }, []);

  return (
    <div className={"h-full w-full relative"}>
      <Canvas
        className={"h-full w-full absolute top-0 left-0"}
        dpr={dpr.get()}
        antialias={true}
      >
        <ambientLight color={"white"} intensity={1}></ambientLight>

        <PostProcessing></PostProcessing>
        <EletricFloor></EletricFloor>
        <OrbitGraphControls></OrbitGraphControls>
        <HDREnv></HDREnv>
        <LineDrop></LineDrop>

        <BallsArena></BallsArena>
      </Canvas>

      {overlay.get() === "open" && (
        <div className={"h-full w-full absolute top-0 left-0"}>123</div>
      )}
      {toolbar.get() === "open" && (
        <div className={"h-full top-0 right-0"}>123</div>
      )}
    </div>
  );
}
