/* the world: each chapter's set stands at its own station along one long studio floor, and the camera travels from
   station to station (camera.js). A station is an offset in frame px from chapter 1's; a set's poses are written in
   its own frame, as designed, and moved to its station with at(). The stations step along in multiples of the floor
   grid (150 px), so the floor patches under them line up. Chapters 1 and 2 share the first station. */
export var STATION = [
  [0, 0, 0],          // 1 Pack
  [0, 0, 0],          // 2 Drop: the same place, the burst comes out of the pouch
  [2400, 0, -450],    // 3 Host
  [4800, 0, -1050],   // 4 Protect
  [7200, 0, -300],    // 5 Update
  [9600, 0, -1200]    // 6 Ship
];
// a pose ({ x, y, z, ... } in a station's frame) moved to chapter i's station
export function at(i, pose) {
  var s = STATION[i], o = Object.assign({}, pose);
  o.x = (o.x || 0) + s[0]; o.y = (o.y || 0) + s[1]; o.z = (o.z || 0) + s[2];
  return o;
}
// the same for a single point
export function atPoint(i, x, y, z) { var s = STATION[i]; return [x + s[0], y + s[1], (z || 0) + s[2]]; }
// the camera's travel between rests eases like this (and so do the things that travel with it): smoothstep, still
// only right at the rests and otherwise close to the scroll's own pace (smootherstep lagged at both ends, then rushed)
export function travel(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
