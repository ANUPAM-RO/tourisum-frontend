import * as THREE from 'three';

type Ring = [number, number][];
export interface StateFeature {
  type: 'Feature';
  properties: { st_nm: string };
  geometry: { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] };
}
export interface StatesGeoJSON {
  type: 'FeatureCollection';
  features: StateFeature[];
}

// Centre of mainland India; longitudes are scaled by cos(lat) so the country isn't stretched sideways.
const CENTER_LON = 82.8;
const CENTER_LAT = 22.6;
const SCALE = 0.13;
const LON_FACTOR = Math.cos((CENTER_LAT * Math.PI) / 180) * SCALE;

export const STATE_DEPTH = 0.08;

export function project(lon: number, lat: number): [number, number] {
  return [(lon - CENTER_LON) * LON_FACTOR, (lat - CENTER_LAT) * SCALE];
}

/** Same slug rule as the database, e.g. "Jammu and Kashmir" → "jammu-and-kashmir". */
export const slugify = (name: string) =>
  name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const polygonsOf = (f: StateFeature): Ring[][] =>
  f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;

const toPoints = (ring: Ring) => ring.map(([lon, lat]) => new THREE.Vector2(...project(lon, lat)));

/** Extruded state shape (outer rings with holes). */
export function stateGeometry(f: StateFeature) {
  const shapes = polygonsOf(f).map(([outer, ...holes]) => {
    const shape = new THREE.Shape(toPoints(outer));
    shape.holes = holes.map((h) => new THREE.Path(toPoints(h)));
    return shape;
  });
  return new THREE.ExtrudeGeometry(shapes, { depth: STATE_DEPTH, bevelEnabled: false });
}

/** Border lines drawn on the top face of the state. */
export function borderGeometry(f: StateFeature) {
  const positions: number[] = [];
  for (const rings of polygonsOf(f)) {
    for (const ring of rings) {
      for (let i = 0; i < ring.length - 1; i++) {
        const [x1, y1] = project(...ring[i]);
        const [x2, y2] = project(...ring[i + 1]);
        positions.push(x1, y1, STATE_DEPTH + 0.002, x2, y2, STATE_DEPTH + 0.002);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/** Distance from the map centre, used to stagger the intro animation outward. */
export function centroidDistance(f: StateFeature) {
  const outer = polygonsOf(f)[0][0];
  let sx = 0;
  let sy = 0;
  for (const [lon, lat] of outer) {
    const [x, y] = project(lon, lat);
    sx += x;
    sy += y;
  }
  return Math.hypot(sx / outer.length, sy / outer.length);
}
