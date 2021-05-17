import {
  WebGLCubeRenderTarget,
  Camera,
  Scene,
  Mesh,
  PlaneBufferGeometry,
  ShaderMaterial,
  BackSide,
  NoBlending,
  BoxBufferGeometry,
  CubeCamera,
  LinearMipmapLinearFilter,
  CubeReflectionMapping,
} from "three";
// import { Vector2, MeshBasicMaterial, DoubleSide, RGBFormat, LinearFilter, WebGLRenderTarget, CubeRefractionMapping, CubeReflectionMapping, EquirectangularReflectionMapping } from 'three'
import {
  Vector2,
  MeshBasicMaterial,
  DoubleSide,
  WebGLRenderTarget,
} from "three";
class CustomWebGLCubeRenderTarget extends WebGLCubeRenderTarget {
  constructor(width, height, options) {
    super(width, height, options);
    this.ok = true;
  }

  setup(renderer, texture) {
    this.texture.type = texture.type;
    this.texture.format = texture.format;
    this.texture.encoding = texture.encoding;

    var scene = new Scene();

    var shader = {
      uniforms: {
        tEquirect: { value: null },
      },

      vertexShader: `
        varying vec3 vWorldDirection;
        vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
          return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
        }
        void main() {
          vWorldDirection = transformDirection( position, modelMatrix );
          #include <begin_vertex>
          #include <project_vertex>
        }
      `,

      fragmentShader: `
        uniform sampler2D tEquirect;
        varying vec3 vWorldDirection;
        #define RECIPROCAL_PI 0.31830988618
        #define RECIPROCAL_PI2 0.15915494
        void main() {
          vec3 direction = normalize( vWorldDirection );
          vec2 sampleUV;
          sampleUV.y = asin( clamp( direction.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
          sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;
          gl_FragColor = texture2D( tEquirect, sampleUV );
        }
      `,
    };

    let {
      cloneUniforms,
    } = require("three/src/renderers/shaders/UniformsUtils.js");

    var material = new ShaderMaterial({
      type: "CubemapFromEquirect",
      uniforms: cloneUniforms(shader.uniforms),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: BackSide,
      blending: NoBlending,
    });

    material.uniforms.tEquirect.value = texture;

    var mesh = new Mesh(new BoxBufferGeometry(5, 5, 5), material);
    scene.add(mesh);

    var camera = new CubeCamera(1, 10, this);

    camera.renderTarget = this;
    camera.renderTarget.texture.name = "CubeCameraTexture";

    camera.update(renderer, scene);

    this.compute = () => {
      camera.update(renderer, scene);
    };

    // mesh.geometry.dispose()
    // mesh.material.dispose()
  }
}

export class ImageEnvMap {
  constructor({ renderer, res = 128, texture }) {
    this.renderer = renderer;
    this.texture = texture;
    this.resX = res;
    this.renderTargetCube = new CustomWebGLCubeRenderTarget(this.resX, {
      minFilter: LinearMipmapLinearFilter,
      generateMipmaps: true,
    });
    this.renderTargetPlane = new WebGLRenderTarget(this.resX, this.resX, {
      minFilter: LinearMipmapLinearFilter,
      generateMipmaps: true,
    });
    this.camera = new Camera();
    this.scene = new Scene();
    this.geo = new PlaneBufferGeometry(2, 2, 2, 2);
    let uniforms = {
      time: {
        value: 0,
      },
      resolution: {
        value: new Vector2(this.resX, this.resX),
      },
      matCap: {
        value: null,
      },
    };

    this.mat = new ShaderMaterial({
      side: DoubleSide,
      transparent: true,
      uniforms,
      vertexShader: `
        precision highp float;
        varying vec2 vUv;
        // varying vec3 vViewPosition;
        // varying vec3 vNormal;
        void main (void) {
          vUv = uv;
          gl_Position = vec4( position, 1.0 );

          // vec4 myMvPosition = modelViewMatrix * vec4(position, 1.0);
          // vViewPosition = -myMvPosition.xyz;
          // vNormal = normal;
        }
      `,
      fragmentShader: `
        #include <common>
        // uniform vec2 resolution;
        // uniform float time;
        varying vec2 vUv;

        uniform sampler2D matCap;

        // varying vec3 vViewPosition;
        // varying vec3 vNormal;


        // const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );
        // float noise ( in vec2 p ) {
        //   return sin(p.x)*sin(p.y);
        // }
        // float fbm4( vec2 p ) {
        //     float f = 0.0;
        //     f += 0.5000 * noise( p ); p = m * p * 2.02;
        //     f += 0.2500 * noise( p ); p = m * p * 2.03;
        //     f += 0.1250 * noise( p ); p = m * p * 2.01;
        //     f += 0.0625 * noise( p );
        //     return f / 0.9375;
        // }
        // float fbm6( vec2 p ) {
        //     float f = 0.0;
        //     f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
        //     f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
        //     f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
        //     f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
        //     f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
        //     f += 0.015625*(0.5+0.5*noise( p ));
        //     return f/0.96875;
        // }
        // float pattern (vec2 p) {
        //   float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
        //   return abs(vout);
        // }

        void main (void) {
          // vec2 uv = gl_FragCoord.xy / resolution.xy;
          // gl_FragColor = vec4(vec3(
          //   1.0 - pattern(uv * 13.333 + -0.2 * cos(time * 0.1)),
          //   1.0 - pattern(uv * 13.333 + 0.0 * cos(time * 0.1)),
          //   1.0 - pattern(uv * 13.333 + 0.2 * cos(time * 0.1))
          // ), 1.0);

          // vec3 viewDir = normalize( vViewPosition );
          // vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
          // vec3 y = cross( viewDir, x );
          // vec2 uv = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
          // vec4 matcapColor = texture2D( matCap, uv );

          vec4 matcapColor = texture2D( matCap, vUv );

          gl_FragColor = matcapColor;
        }
      `,
    });

    // this.renderTargetPlane.texture.mapping = EquirectangularReflectionMapping
    // this.renderTargetCube.texture.mapping = CubeRefractionMapping
    // this.renderTargetCube.texture.mapping = CubeReflectionMapping;

    this.renderTargetCube.setup(renderer, this.renderTargetPlane.texture);

    this.onComputeCube = () => {
      uniforms.time.value = window.performance.now() * 0.001;
      let camera = this.camera;
      let renderer = this.renderer;
      let scene = this.scene;

      // let renderTarget = this.renderTarget
      // var generateMipmaps = renderTargetCube.texture.generateMipmaps
      // renderTargetCube.texture.generateMipmaps = false

      renderer.setRenderTarget(this.renderTargetPlane);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);

      this.renderTargetCube.compute();
    };

    this.plane = new Mesh(this.geo, this.mat);

    this.scene.add(this.plane);
    this.envMap = this.renderTargetCube.texture;

    this.matCap = this.texture;
  }

  set matCap(v) {
    this.mat.uniforms.matCap.value = v;
    this.onComputeCube();
  }
  get matCap() {
    return this.mat.uniforms.matCap.value;
  }
}
