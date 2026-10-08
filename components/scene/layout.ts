import { Vector3 } from "three";

// World layout. Distances are compressed for drama, not to scale.
export const EARTH_R = 2;
export const MOON = { position: new Vector3(-9, 2.5, -34), radius: 0.55 };
export const MARS = { position: new Vector3(16, -3, -92), radius: 1.3 };
export const BELT = { center: new Vector3(0, 0, -165), depth: 70 };

type Keyframe = { pos: Vector3; target: Vector3; sun: Vector3 };

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
const near = (body: Vector3, x: number, y: number, z: number) => body.clone().add(v(x, y, z));

/** One keyframe per waypoint in lib/journey.ts. `sun` is the light direction for that stop. */
export const KEYFRAMES: Keyframe[] = [
  // LEO: Earth's limb across the lower frame, sun rising behind it.
  { pos: v(0, 1.4, 4.6), target: v(0, 2.44, 0), sun: v(0.35, 0.03, -1).normalize() },
  // GEO: the full globe on the right, terminator across it.
  { pos: v(4.5, 1.6, 13.5), target: v(-4, 0.2, 0), sun: v(-0.55, 0.25, 0.8).normalize() },
  // Moon on the right of the timeline.
  { pos: near(MOON.position, -1.4, 0.35, 3.4), target: near(MOON.position, -0.6, 0.2, 0), sun: v(0.8, 0.3, 0.55).normalize() },
  // Mars high on the right, above the mission cards.
  { pos: near(MARS.position, -4.5, -2.4, 11), target: near(MARS.position, -3.2, -2.4, 0), sun: v(0.75, 0.35, 0.5).normalize() },
  // Inside the asteroid belt.
  { pos: v(0, 0.3, -128), target: v(0, -0.6, -170), sun: v(0.6, 0.5, 0.4).normalize() },
  // Deep space, looking back at Earth: a pale, half-lit dot right of centre.
  { pos: v(2.5, 1.5, -240), target: v(62, -6.9, 0), sun: v(-0.5, 0.3, -0.8).normalize() },
];

/** Portrait screens have a narrow horizontal view, so subjects are re-aimed to stay in frame. */
export const PORTRAIT_TARGETS: Vector3[] = [
  v(0, 3.05, 0), // limb sits lower, below the hero copy
  v(0, -1.2, 0), // globe in the upper half
  near(MOON.position, 0, -0.6, 0),
  near(MARS.position, 0, -1.2, 0),
  v(0, -0.6, -170),
  v(-18.5, -61.5, 0), // pale dot high and left, label to its right
];
