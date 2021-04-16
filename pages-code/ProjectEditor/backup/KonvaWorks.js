import React from "react";
import { Stage, Layer, Shape, Circle, Arrow, Text, Rect } from "react-konva";

const BLUE_DEFAULTS = {
  x: 100,
  y: 200,
  fill: "blue",
  width: 30,
  height: 30,
  draggable: true,
};

const RED_DEFAULTS = {
  x: 400,
  y: 400,
  fill: "red",
  width: 30,
  height: 30,
  draggable: true,
};

const GREEN_DEFAULTS = {
  x: 400,
  y: 50,
  fill: "green",
  width: 30,
  height: 30,
  draggable: true,
};

const Edge = ({ node1, node2 }) => {
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

export function EffectNode() {
  return <Rect x={20} y={50} width={100} height={100} fill="red"></Rect>;
}

export const Konva = () => {
  const [blueNode, updateBlueNode] = React.useState(BLUE_DEFAULTS);
  const [redNode, updateRedNode] = React.useState(RED_DEFAULTS);
  const [greenNode, updateGreenNode] = React.useState(GREEN_DEFAULTS);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {/* <Text text="Drag any node to see connections change" /> */}
        <Edge node1={blueNode} node2={redNode} />
        <Edge node1={blueNode} node2={greenNode} />

        <EffectNode></EffectNode>

        <Circle
          {...blueNode}
          onDragMove={(e) => {
            updateBlueNode((node) => {
              return { ...node, ...e.target.position() };
            });
          }}
        />
        <Circle
          {...redNode}
          onDragEnd={() => {
            console.log("end");
          }}
          onDragMove={(e) => {
            updateRedNode({ ...redNode, ...e.target.position() });
          }}
        />
        <Circle
          {...greenNode}
          onDragMove={(e) => {
            updateGreenNode({ ...greenNode, ...e.target.position() });
          }}
        />
      </Layer>
    </Stage>
  );
};
