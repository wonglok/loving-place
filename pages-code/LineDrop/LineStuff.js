import {
  BoxBufferGeometry,
  FrontSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  MultiplyBlending,
  ShaderMaterial,
  SphereBufferGeometry,
  Vector3,
} from "three";
import anime from "animejs/lib/anime";
import { BLOOM_SCENE } from "../OrbitGraph/OrbitGraph.js";
// import { resample } from "@thi.ng/geom-resample";

export class LineStuff {
  constructor(
    mini,
    {
      name = "fall",
      position = new Vector3(),
      delay = 0.0,
      baseGeometry = new SphereBufferGeometry(3, 64, 64),
      scale = 1,
    }
  ) {
    this.mini = mini;
    this.scale = scale;
    return this.setup({
      name,
      position,
      delay,
      baseGeometry,
    });
  }

  //
  async setup({ name, position, delay, baseGeometry }) {
    // let onScene = (cb) => this.mini.get("scene").then((e) => cb(e));
    let unitSize = 0.075 * this.scale;
    let height = 2 * this.scale;
    let pGeo = new BoxBufferGeometry(unitSize, height, unitSize, 1, 1, 1);
    // pGeo = new PlaneBufferGeometry(unitSize, height);

    let iGeo = new InstancedBufferGeometry();
    iGeo.copy(pGeo);

    let count = baseGeometry.attributes.position.array.length / 3;
    iGeo.instanceCount = count;

    iGeo.setAttribute(
      "offsets",
      new InstancedBufferAttribute(
        new Float32Array([...baseGeometry.attributes.position.array]),
        3
      )
    );

    iGeo.setAttribute(
      "rand3",
      new InstancedBufferAttribute(
        new Float32Array(
          [...baseGeometry.attributes.position.array].map((e) => Math.random())
        ),
        3
      )
    );

    this.mini.onClean(() => {
      iGeo.dispose();
    });

    let progress = { value: 0 };
    let opacity = { value: 1 };

    let iMat = new ShaderMaterial({
      uniforms: {
        unitSize: { value: unitSize },
        initHeight: { value: height },
        progress,
        opacity,
      },
      transparent: true,
      side: FrontSide,
      vertexShader: require("./shaders/vlines.vert.js"),
      fragmentShader: require("./shaders/vlines.frag.js"),
    });

    let iMesh = new Mesh(iGeo, iMat);
    iMesh.layers.enable(BLOOM_SCENE);
    iMesh.frustumCulled = true;

    iMesh.position.copy(position);
    this.mesh = iMesh;

    // this.mini.onLoop(() => {
    //   iMesh.position.y =
    //     Math.sin(window.performance.now() * 0.001) * this.scale;
    // });

    this.mini.ready.scene.then((scene) => {
      scene.add(iMesh);
      this.mini.onClean(() => {
        scene.remove(iMesh);
      });
    });

    let current = false;
    let run = ({ done = () => {}, delay = 0 }) => {
      progress.value = 0.0;
      current = anime({
        targets: [progress],
        value: 1,
        easing: "easeOutSine", //"easeOutQuad",
        duration: 2000,
        delay,
        complete: () => {
          done();
        },
      });
    };

    let fadeOut = ({ done = () => {}, delay = 0 }) => {
      progress.value = 1.0;
      opacity.value = 1.0;
      current = anime({
        targets: [opacity, progress],
        value: 0,
        easing: "easeOutSine", //"easeOutQuad",
        duration: 1000,
        delay,
        complete: () => {
          done();
        },
      });
    };

    this.fadeOut = fadeOut;
    this.run = run;
    this.hide = () => {
      if (current) {
        current.pause();
      }
      progress.value = 0.0;
    };

    this.mini.set(name, this);

    return this;
  }
}
