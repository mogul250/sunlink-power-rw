export function projectCoordinates(project) {
  const { latitude, longitude } = project;
  if (latitude == null || longitude == null || String(latitude).trim() === '' || String(longitude).trim() === '') return null;
  const point = [Number(latitude), Number(longitude)];
  return point.every(Number.isFinite) && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180 ? point : null;
}

export function nearbyProjects(projects, userLocation, radiusKm) {
  const radians = degrees => degrees * Math.PI / 180;
  return projects.flatMap(project => {
    const point = projectCoordinates(project);
    if (!point) return [];
    const dLat = radians(point[0] - userLocation[0]);
    const dLng = radians(point[1] - userLocation[1]);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(userLocation[0])) * Math.cos(radians(point[0])) * Math.sin(dLng / 2) ** 2;
    const distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(Math.min(1, a)), Math.sqrt(Math.max(0, 1 - a)));
    return distanceKm <= radiusKm ? [{ ...project, distanceKm }] : [];
  }).sort((first, second) => first.distanceKm - second.distanceKm);
}
