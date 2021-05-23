import { getID, Hand, ProjectStore } from "../AppEditorState/AppEditorState";

export const addBlocker = ({ point }) => {
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newModuleTitleName,
  };

  let makePort = (type = "input", idx) => {
    return {
      _id: getID(),
      type,
      idx,
      blockerID: newObj._id,
    };
  };

  ProjectStore.blockers.addItem(newObj);

  ProjectStore.ports.addItem(makePort("input", 0));
  ProjectStore.ports.addItem(makePort("input", 1));
  ProjectStore.ports.addItem(makePort("input", 2));
  ProjectStore.ports.addItem(makePort("input", 3));
  ProjectStore.ports.addItem(makePort("input", 4));

  ProjectStore.ports.addItem(makePort("output", 0));
  ProjectStore.ports.addItem(makePort("output", 1));
  ProjectStore.ports.addItem(makePort("output", 2));
  ProjectStore.ports.addItem(makePort("output", 3));
  ProjectStore.ports.addItem(makePort("output", 4));
};

export const getTextInput = (title = "text0", value = "") => {
  return {
    _id: getID(),
    type: "text",
    title,
    value,
  };
};

export const getCodeInput = (title = "text0", value = "") => {
  return {
    _id: getID(),
    type: "code",
    title,
    value,
  };
};

export const getColorPicker = (title = "color0", value = "#ffffff") => {
  return {
    _id: getID(),
    type: "hex",
    title,
    value,
  };
};
export const getSlider = (title = "slder0", value = 0) => {
  return {
    _id: getID(),
    type: "float",
    title,
    value,
  };
};
export const getSliderVec4 = (title = "vec4slider0", value = [1, 1, 1, 1]) => {
  return {
    _id: getID(),
    type: "vec4",
    title,
    value,
  };
};

export const addPicker = ({ point }) => {
  // standard material
  let newObj = {
    _id: getID(),
    position: [point.x, point.y, point.z],
    title: Hand.newPickerTitleName,
    pickers: [
      getColorPicker("color", "#ffffff"),
      getColorPicker("emissive", "#000000"),

      getSlider("opacity"),
      getSlider("metalness"),
      getSlider("roughness"),
      getSlider("envMapIntensity"),
      getSlider("refractionRatio"),

      getTextInput("map"),
      getTextInput("normalMap"),
      getTextInput("metalnessMap"),
      getTextInput("roughnesMap"),

      getSliderVec4("directionXYZW"),
      getSliderVec4("speedXYZW"),

      getCodeInput("vertexShaderHeaderMarker", "#include <uv_pars_vertex>"),
      getCodeInput(
        "vertexShaderHeader",
        `
#ifdef USE_UV
  #ifdef UVS_VERTEX_ONLY
    vec2 vUv;
  #else
    varying vec2 vUv;
  #endif
  uniform mat3 uvTransform;
#endif

`.trim()
      ),
      getCodeInput(
        "vertexShaderNormalBodyMarker",
        "#include <defaultnormal_vertex>"
      ),
      getCodeInput(
        "vertexShaderNormalBody",
        `
vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
  // this is in lieu of a per-instance normal-matrix
  // shear transforms in the instance matrix are not supported
  mat3 m = mat3( instanceMatrix );
  transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
  transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
  transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
  vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
  #ifdef FLIP_SIDED
    transformedTangent = - transformedTangent;
  #endif
#endif
`.trim()
      ),
      getCodeInput("vertexShaderPositionBodyMarker", "#include <begin_vertex>"),
      getCodeInput(
        "vertexShaderPositionBody",
        `vec3 transformed = vec3( position );`
      ),

      getCodeInput("fragmentShaderHeaderMarker", "#include <uv_pars_fragment>"),
      getCodeInput(
        "fragmentShaderHeader",
        `
#if ( defined( USE_UV ) && ! defined( UVS_VERTEX_ONLY ) )
  varying vec2 vUv;
#endif
      `.trim()
      ),
      getCodeInput(
        "fragmentShaderBodyMarker",
        "gl_FragColor = vec4( outgoingLight, diffuseColor.a );"
      ),
      getCodeInput(
        "fragmentShaderBody",
        `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`
      ),
    ],
  };

  ProjectStore.pickers.addItem(newObj);
};

export const addConnection = () => {
  if (Hand.pickupPort && Hand.releasePort) {
    if (Hand.pickupPort.type !== Hand.releasePort.type) {
      if (Hand.pickupPort.blockerID !== Hand.releasePort.blockerID) {
        let io = [Hand.pickupPort, Hand.releasePort];
        let newConn = {
          _id: getID(),
          // input:
          input: io.find((e) => e.type === "input"),
          output: io.find((e) => e.type === "output"),
        };

        ProjectStore.connections.addItem(newConn);
        console.log("add-connection", Hand.pickupPort, Hand.releasePort);
      }
    }
  }
};
