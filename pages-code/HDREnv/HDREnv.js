import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { sRGBEncoding } from "three";
import { PMREMGenerator, TextureLoader, Color } from "three";
import { ShaderCubeChrome } from "../ShaderCubeChrome/ShaderCubeChrome";

export function HDREnv() {
  // let RGBELoader = require("three/examples/jsm/loaders/RGBELoader.js")
  //   .RGBELoader;
  // let url = `/hdr/adams_place_bridge_1k.png`;
  // let url = `/hdr/paul_lobe_haus_4k_compressed_2.jpeg`;
  let url = `/hdr/bubble-center-large.jpg`;
  // let url = `/hdr/pexels-alex-andrews-816608.jpg`;
  let { scene, gl } = useThree();
  // let chroma = new ShaderCubeChrome({ res: 128, renderer: gl });
  // useEffect((state, dt) => {
  //   chroma.compute({ time: dt });
  //   scene.environment = chroma.out.envMap;
  // }, []);

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    let loader = new TextureLoader();
    // loader.setDataType(UnsignedByteType);
    loader.load(url, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      envMap.encoding = sRGBEncoding;
      scene.environment = envMap;

      scene.background = new Color("#888");
    });

    return () => {
      scene.environment = null;
      // scene.background = null;
    };
  }, []);

  return <group></group>;
}
