// import { ShaderChunk } from 'three/src/renderers/shaders/ShaderLib'
// import { CanvasPaintTexture2D } from '../../Reusable/CanvasPaintTexture'

import {
  BoxBufferGeometry,
  Camera,
  CubeCamera,
  DoubleSide,
  LinearMipmapLinearFilter,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  RGBFormat,
  SphereBufferGeometry,
  sRGBEncoding,
  WebGLCubeRenderTarget,
  WebGLRenderTarget,
} from "three";
import { Scene, Mesh, ShaderMaterial, TextureLoader } from "three";

// let glsl = (v, ...args) => {
//   let str = "";
//   v.forEach((e, i) => {
//     str += e + (args[i] || "");
//   });
//   return str;
// };

export class MatCapEnvMap {
  constructor({ url, renderer, scene }) {
    this.url = url;
    this.renderer = renderer;
    this.worldScene = scene;

    this.cubeTarget = new WebGLCubeRenderTarget(5122, {
      format: RGBFormat,
    });
    this.envMap = this.cubeTarget.texture;

    new TextureLoader().load(url, (texture) => {
      texture.encoding = sRGBEncoding;
      this.setup(texture);
    });
  }

  setup(texture) {
    var internalScene = new Scene();

    var shader = {
      uniforms: {
        matCap: { value: texture },
      },

      vertexShader: /* glsl */ `
        varying vec3 vViewPosition;
        varying vec3 vNormal;

        void main() {
          vec4 myMvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -myMvPosition.xyz;
          // vViewPosition = cameraPosition.xyz;
          vNormal = normal;

          gl_Position = projectionMatrix * myMvPosition;
        }
      `,

      fragmentShader: /* glsl */ `
        uniform sampler2D matCap;

        varying vec3 vViewPosition;
        varying vec3 vNormal;

        void main() {
          vec3 viewDir = normalize( vViewPosition );
          vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
          vec3 y = cross( viewDir, x );
          vec2 uv = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
          vec4 matcapColor = texture2D( matCap, uv );

          gl_FragColor = matcapColor;
        }
      `,
      side: DoubleSide,
    };

    const cubeRenderTarget = this.cubeTarget;

    const cubeCamera = new CubeCamera(1, 100, cubeRenderTarget);

    internalScene.add(cubeCamera);

    var cubeMesh = new Mesh(
      new BoxBufferGeometry(2, 2, 2),
      new ShaderMaterial(shader)
    );
    cubeMesh.rotation.x = Math.PI * -1;
    internalScene.add(cubeMesh);

    cubeCamera.update(this.renderer, internalScene);

    // preview
    var cubeMesh2 = new Mesh(
      new SphereBufferGeometry(200, 32, 32),
      new MeshStandardMaterial({
        envMap: cubeRenderTarget.texture,
        side: DoubleSide,
        metalness: 1,
        roughness: 0,
      })
    );
    cubeMesh2.name = "test";

    this.worldScene.add(cubeMesh2);
    cubeMesh2.position.x = 200;

    // mesh.geometry.dispose()
    // mesh.material.dispose()
  }
}
