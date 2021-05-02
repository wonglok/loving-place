import { useState } from "@hookstate/core";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Stage,
  Layer,
  Shape,
  Circle,
  Group,

  //
  // Path,
  // Ellipse,
  // Arrow,
  // Text,
  // Rect,
  // Rect,
} from "react-konva";
import KonvaJS from "konva";

import {
  HandState,
  loadAsyncDemoData,
  Nodes,
  Connections,
  getID,
  resetCursor,
  addNode,
  useLoop,
} from "../NodeState/NodeState";

KonvaJS.pixelRatio =
  typeof window !== "undefined" && window.devicePixelRatio > 1 ? 1.5 : 1.0;

const Edge = ({ layer, id, name1, name2 }) => {
  const hand = useState(HandState);
  let nodeOne = layer.findOne(`#${name1}`);
  let nodeTwo = layer.findOne(`#${name2}`);

  if (!nodeOne || (name2 !== "mouse" && !nodeTwo)) {
    return <Group></Group>;
  }

  let node1 = nodeOne.getPosition();
  let node2;

  if (name2 === "mouse") {
    node2 = hand.mouse.get();
  } else {
    node2 = nodeTwo.getPosition();
  }

  let x1 = node1.x;
  let y1 = node1.y;

  let x2 = node2.x;
  let y2 = node2.y;

  let whichLine = Math.abs(y2 - y1) >= Math.abs(x2 - x1);

  let p1;
  let p2;

  if (!whichLine) {
    p1 = { x: (node1.x + node2.x) / 2, y: node1.y };
    p2 = { x: (node1.x + node2.x) / 2, y: node2.y };
  } else {
    p1 = { y: (node1.y + node2.y) / 2, x: node1.x };
    p2 = { y: (node1.y + node2.y) / 2, x: node2.x };
  }

  return (
    <>
      <Shape
        id={id}
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(node1.x, node1.y);
          context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, node2.x, node2.y);
          //
          // (!) Konva specific method, it is very important
          context.rect(0, 0, shape.getAttr("width"), shape.getAttr("height"));

          // automatically fill shape from props and draw hit region
          context.fillStrokeShape(shape);

          // context.fillStrokeShape(shape);
        }}
        stroke="grey"
        strokeWidth={1}
      />
    </>
  );
};

export function EffectNode({
  node,
  onClickConnector = () => {},
  onEndDrag = () => {},
}) {
  let showText = useState(false);
  const nodes = useState(Nodes);
  const basenode = useState(node);

  let ballRadius = 70;
  let orbitRadius = ballRadius / 2 + ballRadius / 4;
  let ioRadius = ballRadius * 0.3;
  let distributionAngle = 120;

  const getPort = useCallback(
    ({ node, total = 1, port = 0, type = "input" }) => {
      let ioBaseAngle = type === "input" ? Math.PI * 3 : Math.PI * 2;

      if (node.isHorizontal) {
        ioBaseAngle -= Math.PI * 0.5;
      }

      let disturbutionIndex = (total - 1) / -2 + port;

      let factor;
      if (node.isHorizontal) {
        factor = 1;
        if (type === "input") {
          factor = -1;
        }
      } else {
        factor = -1;
        if (type === "output") {
          factor = 1;
        }
      }

      let x =
        node.x +
        orbitRadius *
          Math.sin(
            ioBaseAngle +
              factor * ((disturbutionIndex * distributionAngle) / 180)
          );

      let y =
        node.y +
        orbitRadius *
          Math.cos(
            ioBaseAngle +
              factor * ((disturbutionIndex * distributionAngle) / 180)
          );

      return {
        x,
        y,
      };
    },
    []
  );

  let inputs = basenode.inputs.get();
  let outputs = basenode.outputs.get();

  let latest = { x: 0, y: 0, didChange: false };
  useLoop(() => {
    if (latest.didChange) {
      basenode.merge({
        x: Math.floor(latest.x),
        y: Math.floor(latest.y),
      });
    }
  });

  return (
    <Group>
      {/* <Circle
        onMouseOver={() => {
          document.body.style.cursor = "move";
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "";
        }}
        x={basenode.x.get()}
        y={basenode.y.get()}
        width={ballRadius}
        height={ballRadius}
        fill="blue"
        draggable={true}
        onDragMove={(e) => {
          let pt = e.target.position();

          basenode.merge({
            x: Math.floor(pt.x),
            y: Math.floor(pt.y),
          });
        }}
        onDragEnd={() => {
          onEndDrag({
            node: basenode.get(),
          });
        }}
        onClick={(ev) => {
          basenode.set((node) => {
            node.isHorizontal = !node.isHorizontal;
            return node;
          });
          nodes.set((s) => s);
        }}
        fill={"grey"}
      /> */}

      <Circle
        onMouseEnter={() => {
          document.body.style.cursor = "move";
          showText.set(true);
        }}
        onMouseLeave={() => {
          showText.set(false);
          document.body.style.cursor = "";
        }}
        onMouseOver={() => {
          showText.set(true);
        }}
        x={basenode.x.get()}
        y={basenode.y.get()}
        width={ballRadius}
        height={ballRadius}
        fill="blue"
        draggable={true}
        onDragMove={(e) => {
          latest = e.target.position();
          latest.didChange = true;
        }}
        onDragEnd={() => {
          onEndDrag({
            node: basenode.get(),
          });
        }}
        onClick={() => {
          basenode.set((node) => {
            node.isHorizontal = !node.isHorizontal;
            return node;
          });
          nodes.set((s) => s);
        }}
        fill={"grey"}
      />

      {inputs.map((p, i) => {
        let pos = getPort({
          id: p._id,
          node: basenode.get(),
          total: inputs.length,
          port: i,
          type: "input",
        });
        return (
          <Group key={p._id}>
            <Circle
              onMouseOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onMouseLeave={() => {
                document.body.style.cursor = "";
              }}
              onClick={() => {
                onClickConnector({
                  node: basenode.get(),
                  connector: p,
                  connectorIDX: i,
                  type: "input",
                });
              }}
              id={p._id}
              x={pos.x}
              y={pos.y}
              width={ioRadius}
              height={ioRadius}
              fill="lime"
            />
            {/* {showText.get() ? (
              <Text
                onMouseOver={() => {
                  document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = "";
                }}
                onClick={() => {
                  onClickConnector({
                    node: basenode.get(),
                    connector: p,
                    connectorIDX: i,
                    type: "input",
                  });
                }}
                align="center"
                fontSize={10}
                x={pos.x - ioRadius * 0.2}
                y={pos.y - ioRadius * 0.2}
                text={i}
              ></Text>
            ) : null} */}
          </Group>
        );
      })}

      {outputs.map((p, i) => {
        let pos = getPort({
          id: p._id,
          node: basenode.get(),
          total: outputs.length,
          port: i,
          type: "output",
        });
        return (
          <Group key={p._id}>
            <Circle
              onMouseOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onMouseLeave={() => {
                document.body.style.cursor = "";
              }}
              onClick={(ev) => {
                // ev.cancelBubble();
                onClickConnector({
                  node: basenode.get(),
                  connector: p,
                  connectorIDX: i,
                  type: "output",
                });
              }}
              id={p._id}
              x={pos.x}
              y={pos.y}
              width={ioRadius}
              height={ioRadius}
              fill="cyan"
            ></Circle>
            {/* {showText.get() ? (
              <Text
                onMouseOver={() => {
                  document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = "";
                }}
                onClick={(ev) => {
                  // ev.cancelBubble();
                  onClickConnector({
                    node: basenode.get(),
                    connector: p,
                    connectorIDX: i,
                    type: "output",
                  });
                }}
                align="center"
                fontSize={10}
                x={pos.x - ioRadius * 0.2}
                y={pos.y - ioRadius * 0.2}
                text={i}
              ></Text>
            ) : null} */}
          </Group>
        );
      })}
    </Group>
  );
}

export const Konva = () => {
  const layerRef = useRef(null);
  const stageRef = useRef(null);
  const nodes = useState(Nodes);
  const connections = useState(Connections);
  const hand = useState(HandState);

  useEffect(() => {
    let clean = loadAsyncDemoData();
    return () => {
      clean();
    };
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(nodes.value.map((e) => [e.x, e.y])));
  }, [nodes.value]);

  const onZoom = useCallback((e) => {
    e.evt.preventDefault();

    let scaleBy = 1.025;
    let stage = stageRef.current;
    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale = -e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();

    syncBirthPlace();
  }, []);

  const onResetScale = () => {
    let stage = stageRef.current;
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw();

    syncBirthPlace();
  };

  const getPortInfo = (port) => {
    let portsStat = [];

    connections.get().forEach((e) => {
      portsStat.push(e.portA, e.portB);
    });

    return {
      relatedConnections: connections.get().filter((conn) => {
        return conn.portA._id === port._id || conn.portB._id === port._id;
      }),
      isConnected: portsStat.some((p) => p._id === port._id),
    };
  };

  const onClickConnector = (ev) => {
    let info = getPortInfo(ev.connector);
    if (hand.mode.get() === "ready") {
      if (info.isConnected) {
        let conns = JSON.parse(JSON.stringify(connections.get()));

        info.relatedConnections.forEach((related) => {
          let idx = conns.findIndex((e) => e._id === related._id);
          conns.splice(idx, 1);
        });

        connections.set(conns);
      } else {
        hand.merge({
          pickup: JSON.parse(JSON.stringify(ev)),
          mode: "connector",
        });
      }
    } else if (hand.mode.get() === "connector") {
      if (!info.isConnected) {
        let proposedConnection = {
          _id: getID(),
          portA: JSON.parse(JSON.stringify(hand.pickup.connector.get())),
          portB: JSON.parse(JSON.stringify(ev.connector)),
        };

        //
        let connAType = proposedConnection.portA.type;
        let connBType = proposedConnection.portB.type;

        // console.log(connAType, connBType);

        if (connAType !== connBType) {
          // add connection
          connections.merge([proposedConnection]);
          resetCursor();
        } else {
          resetCursor();
        }
      } else {
        resetCursor();
      }
    }
  };

  const onClickStage = (ev) => {
    let stage = stageRef.current;
    if (ev.target === stage) {
      if (hand.mode.get() === "connector") {
        let node = addNode({ at: hand.mouse.get() });
        let portA = hand.pickup.connector.get();

        if (portA.type === "output") {
          let proposedConnection = {
            _id: getID(),
            portA: JSON.parse(JSON.stringify(portA)),
            portB: JSON.parse(JSON.stringify(node.inputs[0])),
          };

          connections.merge([proposedConnection]);
        } else {
          let proposedConnection = {
            _id: getID(),
            portA: JSON.parse(JSON.stringify(node.outputs[0])),
            portB: JSON.parse(JSON.stringify(portA)),
          };

          connections.merge([proposedConnection]);
        }

        resetCursor();
      } else {
      }
    }
  };

  const onEndDrag = (ev) => {
    nodes.set((st) => {
      return st.map((n) => {
        if (n._id === ev.node._id) {
          return ev.node;
        }
        return n;
      });
    });
  };

  let syncBirthPlace = () => {
    let stage = stageRef.current;
    if (stage) {
      let newPos = stage.position();
      let scaleX = stage.scaleX();
      let scaleY = stage.scaleY();
      hand.birthPlace.x.set(
        -newPos.x / scaleX + window.innerWidth / 2 / scaleX
      );
      hand.birthPlace.y.set(
        -newPos.y / scaleY + window.innerHeight / 2 / scaleY
      );
    }
  };

  useEffect(() => {
    syncBirthPlace();
  }, []);

  return (
    <div className="h-full w-full relative">
      <Stage
        draggable={true}
        ref={stageRef}
        onWheel={onZoom}
        width={window.innerWidth}
        height={window.innerHeight}
        onDragEnd={() => {
          syncBirthPlace();
        }}
        onMouseMove={(ev) => {
          if (ev.target === stageRef.current) {
            if (hand.mode.get() === "connector") {
              document.body.style.cursor = "crosshair";
            }
          }

          let stage = stageRef.current;
          if (stage) {
            let pos = stage.getPointerPosition();
            let offset = stage.getPosition();
            let scaleX = stage.scaleX();
            let scaleY = stage.scaleY();

            hand.merge({
              mouse: {
                x: pos.x / scaleX - offset.x / scaleX,
                y: pos.y / scaleY - offset.y / scaleY,
              },
            });

            syncBirthPlace();
          }
        }}
        onClick={onClickStage}
      >
        <Layer ref={layerRef}>
          {hand.mode.get() === "connector" && layerRef.current && (
            <Edge
              id={"hand"}
              layer={layerRef.current}
              name1={hand.pickup.connector._id.get()}
              name2={"mouse"}
            />
          )}

          {layerRef.current &&
            connections.get().map((conn) => {
              return (
                <Edge
                  id={conn._id}
                  layer={layerRef.current}
                  key={"connector" + conn._id}
                  name1={conn.portA._id}
                  name2={conn.portB._id}
                />
              );
            })}

          {nodes.get().map((node, i) => {
            return (
              <EffectNode
                key={node._id}
                onEndDrag={onEndDrag}
                onClickConnector={onClickConnector}
                node={JSON.parse(JSON.stringify(node))}
              ></EffectNode>
            );
          })}
        </Layer>
      </Stage>

      <div className="absolute top-0 right-0">
        <button
          className={
            "px-2 py-1 m-1 text-xs backdrop-filter backdrop-blur-lg border border-black"
          }
          onClick={() => {
            addNode({});
          }}
        >
          Add Node
        </button>

        <button
          className={
            "px-2 py-1 m-1 text-xs backdrop-filter backdrop-blur-lg border border-black"
          }
          onClick={() => {
            onResetScale();
          }}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};
