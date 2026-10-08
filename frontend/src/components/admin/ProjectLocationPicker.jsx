import { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiMousePointer } from 'react-icons/fi';
let mapsPromise;
function loadMaps() {
 if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
 if (!mapsPromise) mapsPromise = new Promise((resolve, reject) => {
  const script = document.createElement('script');
  const fail = message => { clearTimeout(timer); script.remove(); mapsPromise = null; reject(new Error(message)); };
  const timer = setTimeout(() => fail('Google Maps did not respond. Check your API key and connection.'), 20000);
  window.sunlinkMapsReady = () => { clearTimeout(timer); resolve(window.google.maps); };
  window.gm_authFailure = () => { const message = 'Google Maps authorization failed. Check the API key, enabled Maps JavaScript API and website restrictions.'; window.dispatchEvent(new CustomEvent('sunlink-map-error', { detail: message })); fail(message); };
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)}&callback=sunlinkMapsReady&loading=async`;
  script.onerror = () => fail('Could not load Google Maps. Check your connection and API key.');
  document.head.appendChild(script);
 });
 return mapsPromise;
}
export default function ProjectLocationPicker({ latitude, longitude, onChange }) {
 const container = useRef(null), map = useRef(null), pin = useRef(null), change = useRef(onChange);
 const [error, setError] = useState('');
 change.current = onChange;
 useEffect(() => {
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) { setError('Google Maps needs VITE_GOOGLE_MAPS_API_KEY configured. You can enter coordinates below.'); return; }
  let active = true, listener;
  const onMapError = event => setError(event.detail);
  window.addEventListener('sunlink-map-error', onMapError);
  loadMaps().then(maps => {
   if (!active) return;
   map.current = new maps.Map(container.current, { center: { lat: 4.85, lng: 31.6 }, zoom: 5, streetViewControl: false });
   pin.current = new maps.Marker({ map: map.current });
   if (latitude !== '' && longitude !== '') { const position = { lat: Number(latitude), lng: Number(longitude) }; pin.current.setPosition(position); map.current.setCenter(position); map.current.setZoom(12); }
   listener = map.current.addListener('click', event => { if (event.latLng) change.current(event.latLng.lat().toFixed(7), event.latLng.lng().toFixed(7)); });
  }).catch(e => { if (active) setError(e.message); });
  return () => { active = false; window.removeEventListener('sunlink-map-error', onMapError); listener?.remove(); pin.current?.setMap(null); map.current = null; };
 }, []);
 useEffect(() => {
  if (pin.current && latitude !== '' && longitude !== '' && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))) {
   const position = { lat: Number(latitude), lng: Number(longitude) }; pin.current.setPosition(position); map.current.panTo(position);
  }
 }, [latitude, longitude]);
 return <div>
  {error && <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-slate-50 p-6" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
   <div className="relative max-w-sm rounded-xl border border-white bg-white/95 p-5 text-center shadow-sm">
    <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600"><FiMapPin className="h-5 w-5" /></span>
    <p className="text-sm font-semibold text-gray-800">Set your project location</p>
    <p className="mt-2 text-xs leading-5 text-gray-500">The interactive map is unavailable. Enter the latitude and longitude below to place your project.</p>
    <details className="mt-3 text-left text-xs text-gray-500"><summary className="cursor-pointer text-center font-medium text-gray-400">Map connection details</summary><p role="alert" className="mt-2 break-words text-xs leading-5">{error}</p></details>
   </div>
  </div>}
  <div ref={container} className={error ? 'hidden' : 'h-80 overflow-hidden rounded-xl border border-gray-200 bg-gray-100'} />
  {!error && <p className="mt-3 flex items-center gap-2 text-xs text-gray-500"><FiMousePointer className="h-3.5 w-3.5 text-primary-600" /> Pan and zoom, then click to drop a pin at the project site.</p>}
 </div>;
}
