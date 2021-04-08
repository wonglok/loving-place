import { createState } from "@hookstate/core";
import { Vector3 } from "three";

export const Me = {
  status: createState("ready"),
  goingTo: new Vector3(0, 0, 0),
  position: new Vector3(0, 0, 0),
  velocity: new Vector3(0, 0, 0),
};
