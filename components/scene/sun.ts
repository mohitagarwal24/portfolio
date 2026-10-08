import { Vector3 } from "three";

/** Live world-space sun direction, written by the CameraRig and read by every lit material. */
export const sunDirection = new Vector3(0.42, 0.16, -1).normalize();
