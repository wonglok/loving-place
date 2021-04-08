import { Me } from "../AppState/AppState";
export function PlaceFloor() {
  return (
    <group>
      <gridHelper args={[10000, 100]} position-y={1}></gridHelper>
      <mesh
        rotation-x={-0.5 * Math.PI}
        onPointerUp={(event) => {
          Me.goingTo.x = event.point.x;
          Me.goingTo.y = event.point.y;
          Me.goingTo.z = event.point.z;
          Me.status.set("running");
        }}
        onClick={(event) => {
          Me.goingTo.x = event.point.x;
          Me.goingTo.y = event.point.y;
          Me.goingTo.z = event.point.z;
          Me.status.set("running");
        }}
      >
        <planeBufferGeometry args={[10000, 10000, 10000]}></planeBufferGeometry>
        <meshBasicMaterial color={"#444"}></meshBasicMaterial>
      </mesh>
    </group>
  );
}
