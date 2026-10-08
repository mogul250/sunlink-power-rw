import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCrosshair, FiLoader, FiMapPin, FiX } from 'react-icons/fi';
import { nearbyProjects, projectCoordinates } from '../../utils/projectLocations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getImageUrl } from '../../services/imageUtils';

export default function ProjectsMap({ projects }) {
  const container = useRef(null);
  const navigate = useNavigate();
  const [tilesFailed, setTilesFailed] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(50);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const locationRequest = useRef(0);
  const nearby = useMemo(() => userLocation ? nearbyProjects(projects, userLocation, radiusKm) : [], [projects, userLocation, radiusKm]);
  const visibleProjects = userLocation ? nearby : projects;
  useEffect(() => () => { locationRequest.current += 1; }, []);
  const locate = () => {
    if (!navigator.geolocation) { setLocationError('Your browser does not support location sharing. You can browse all projects instead.'); return; }
    if (!window.isSecureContext) { setLocationError('Location sharing requires a secure HTTPS connection. You can browse all projects instead.'); return; }
    const request = ++locationRequest.current;
    setLocating(true); setLocationError('');
    navigator.geolocation.getCurrentPosition(position => {
      if (request !== locationRequest.current) return;
      setUserLocation([position.coords.latitude, position.coords.longitude]); setLocating(false);
    }, error => {
      if (request !== locationRequest.current) return;
      setLocating(false);
      setLocationError(error.code === 1 ? 'Location permission was denied. Allow location access in your browser and try again.' : error.code === 3 ? 'Finding your location took too long. Please try again.' : 'Your location is unavailable. Please try again.');
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
  };
  const showAll = () => { locationRequest.current += 1; setLocating(false); setUserLocation(null); setLocationError(''); };
  useEffect(() => {
    const map = L.map(container.current, {
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      zoomControl: true,
    }).setView([3, 24], 4);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.on('tileerror', () => setTilesFailed(true));
    const locations = [];
    visibleProjects.forEach(project => {
      const location = projectCoordinates(project);
      if (!location) return;
      locations.push(location);
      const popup = document.createElement('div'); popup.style.width = '220px';
      if (project.image_url) {
        const image = document.createElement('img'); image.src = getImageUrl(project.image_url); image.alt = project.title;
        image.style.cssText = 'width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:10px'; popup.append(image);
      }
      const title = document.createElement('strong'); title.textContent = project.title; title.style.cssText = 'display:block;font-size:14px;line-height:1.5'; popup.append(title);
      const locationName = document.createElement('p'); locationName.textContent = project.location_name; locationName.style.cssText = 'font-size:12px;color:#64748b;margin:6px 0'; popup.append(locationName);
      if (userLocation) { const distance = document.createElement('p'); distance.textContent = project.distanceKm < 1 ? 'Less than 1 km away' : project.distanceKm.toFixed(1) + ' km away'; distance.style.cssText = 'font-size:12px;color:#059669;margin:6px 0'; popup.append(distance); }
      const link = document.createElement('a'); link.href = `/projects/${project.id}`; link.textContent = 'View project →'; link.style.cssText = 'color:#059669;font-weight:600;font-size:12px';
      link.addEventListener('click', event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); navigate(link.getAttribute('href')); } }); popup.append(link);
      // The logo sits inside the white center; the pointed tip marks the coordinates.
      const icon = L.divIcon({
        className: '',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="54" viewBox="0 0 56 72" aria-hidden="true" style="display:block;overflow:visible">
          <defs>
            <linearGradient id="project-pin-gradient-${project.id}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#b5f56b" />
              <stop offset="100%" stop-color="#4fc747" />
            </linearGradient>
            <clipPath id="project-pin-logo-${project.id}"><circle cx="28" cy="27" r="17" /></clipPath>
          </defs>
          <ellipse cx="28" cy="69" rx="12" ry="3" fill="#000" opacity="0.18" />
          <path d="M28 68C22 61 2 43 2 27a26 26 0 0 1 52 0c0 16-20 34-26 41Z" fill="url(#project-pin-gradient-${project.id})" />
          <circle cx="28" cy="27" r="19" fill="white" />
          <image href="${import.meta.env.BASE_URL}icon.png" x="13" y="11" width="30" height="32" preserveAspectRatio="xMidYMid meet" clip-path="url(#project-pin-logo-${project.id})" />
        </svg>`,
        iconSize: [42, 54],
        iconAnchor: [21, 51],
        popupAnchor: [0, -48],
      });
      L.marker(location, { icon, title: project.title, alt: project.title }).addTo(map).bindPopup(popup);
    });
    if (userLocation) {
      const radius = L.circle(userLocation, { radius: radiusKm * 1000, color: '#2563eb', weight: 1, fillOpacity: 0.05 }).addTo(map);
      const userIcon = L.divIcon({ className: '', html: '<span style="display:block;width:18px;height:18px;border:3px solid white;border-radius:50%;background:#2563eb;box-shadow:0 0 0 5px #2563eb33"></span>', iconSize: [18,18], iconAnchor: [9,9] });
      L.marker(userLocation, { icon: userIcon, title: 'Your location', alt: 'Your location', zIndexOffset: 1000 }).addTo(map).bindPopup('Your location');
      map.fitBounds(radius.getBounds(), { padding: [24,24], maxZoom: 12 });
    } else if (locations.length) map.fitBounds(L.latLngBounds(locations), { padding: [50,50], maxZoom: 12 });
    const resize = new ResizeObserver(() => map.invalidateSize()); resize.observe(container.current);
    return () => { resize.disconnect(); map.remove(); };
  }, [visibleProjects, userLocation, radiusKm, navigate]);
  return <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-3 sm:p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-gray-600"><FiMapPin className="h-4 w-4 text-primary-600" />{userLocation ? 'Projects near your location' : 'Explore our project locations'}</p>
      <div className="flex flex-wrap items-center gap-2">
        {userLocation && <><select aria-label="Nearby project radius" value={radiusKm} onChange={event => setRadiusKm(Number(event.target.value))} className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-600">{[25,50,100,250].map(radius => <option key={radius} value={radius}>Within {radius} km</option>)}</select><button type="button" onClick={showAll} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50"><FiX /> Show all</button></>}
        <button type="button" onClick={locate} disabled={locating} className="btn btn-primary btn-sm gap-2 text-xs">{locating ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiCrosshair className="h-4 w-4" />}{locating ? 'Finding your location...' : userLocation ? 'Update my location' : 'See nearby projects'}</button>
      </div>
    </div>
    {locationError && <p role="alert" className="border-b border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">{locationError}</p>}
    <div className="relative"><div ref={container} style={{ touchAction: 'none' }} aria-label="Map of Sunlink project locations" className="relative z-0 h-[380px] w-full md:h-[500px]" />{tilesFailed && <p role="status" className="absolute bottom-8 left-3 right-3 z-10 rounded-lg bg-white/95 p-3 text-xs text-gray-600 shadow">Map imagery is unavailable. You can still browse projects below.</p>}</div>
    {userLocation && <div className="border-t border-gray-100 p-4"><p role="status" className="mb-3 text-xs font-medium text-gray-600">{nearby.length ? nearby.length + ' ' + (nearby.length === 1 ? 'project' : 'projects') + ' within ' + radiusKm + ' km ? nearest first' : 'No projects within ' + radiusKm + ' km. Try a wider radius or show all projects.'}</p>{nearby.length > 0 && <div className="max-h-48 space-y-2 overflow-y-auto">{nearby.map(project => <Link key={project.id} to={`/projects/${project.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition hover:bg-primary-50"><span className="min-w-0"><span className="block truncate text-sm font-medium text-gray-800">{project.title}</span><span className="text-xs text-gray-500">{project.location_name}</span></span><span className="shrink-0 text-xs font-semibold text-primary-600">{project.distanceKm < 1 ? '< 1 km' : project.distanceKm.toFixed(1) + ' km'}</span></Link>)}</div>}<p className="mt-3 text-[11px] text-gray-400">Distances are measured in a straight line. Your location is used only in this browser session.</p></div>}
  </div>;
}
