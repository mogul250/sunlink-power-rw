import test from 'node:test';
import assert from 'node:assert/strict';
import { nearbyProjects, projectCoordinates } from '../../frontend/src/utils/projectLocations.js';

test('invalid coordinates are excluded and zero coordinates are valid', () => {
  for (const latitude of ['', ' ', null, 'invalid', 91]) assert.equal(projectCoordinates({ latitude, longitude: 0 }), null);
  assert.deepEqual(projectCoordinates({ latitude: '0', longitude: '0' }), [0, 0]);
});
test('nearby projects respect radius and sort by distance', () => {
  const projects = [{ id: 1, latitude: 0, longitude: 1 }, { id: 2, latitude: 0, longitude: 0.1 }, { id: 3, latitude: 0, longitude: 0 }, { id: 4, latitude: '', longitude: 0 }];
  const nearby = nearbyProjects(projects, [0, 0], 50);
  assert.deepEqual(nearby.map(project => project.id), [3, 2]);
  assert.ok(Math.abs(nearby[1].distanceKm - 11.1195) < 0.01);
  assert.deepEqual(nearbyProjects(projects, [0, 0], 250).map(project => project.id), [3, 2, 1]);
  assert.deepEqual(nearbyProjects(projects, [40, 40], 25), []);
});
test('nearby distance handles the date line', () => {
  const nearby = nearbyProjects([{ id: 1, latitude: 0, longitude: -179.9 }], [0, 179.9], 25);
  assert.equal(nearby.length, 1);
  assert.ok(nearby[0].distanceKm < 23);
});
