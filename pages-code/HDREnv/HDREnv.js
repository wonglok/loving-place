import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PMREMGenerator, TextureLoader } from "three";

export function HDREnv() {
  // let RGBELoader = require("three/examples/jsm/loaders/RGBELoader.js")
  //   .RGBELoader;
  let url = `/hdr/adams_place_bridge_1k.png`;
  let { scene, gl } = useThree();

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    let loader = new TextureLoader();
    // loader.setDataType(UnsignedByteType);
    loader.load(url, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;
    });

    return () => {
      scene.environment = null;
      scene.background = null;
    };
  }, []);

  return <group></group>;
}
