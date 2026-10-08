import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiArrowUpRight, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { projectAPI } from '../services/api';
import { applicationSectors } from '../data/applicationSectors';
import ProjectImage from '../components/projects/ProjectImage';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [request, setRequest] = useState(0);
  const [sector, setSector] = useState('');
  const [visible, setVisible] = useState(12);
  useEffect(() => {
    let active = true; setLoading(true); setError(false);
    projectAPI.getAll().then(response => { if (active) setProjects(response.data.data || []); })
      .catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);
  const filtered = projects.filter(project => !sector || project.application_sector === sector);
  return <div className="bg-gray-100 py-8 md:py-12"><Helmet><title>Our Projects | Sunlink Power</title></Helmet><div className="container-custom">
    <Link to="/#projects" className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-primary-600"><FiArrowLeft /> Back to project map</Link>
    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Our projects</h1><p className="mb-6 mt-2 text-sm text-gray-500">Discover our installations and the solar solutions behind them.</p>
    <div className="mb-6 flex flex-wrap gap-2">{['', ...applicationSectors.map(item => item.title)].map(value => <button key={value} type="button" onClick={() => { setSector(value); setVisible(12); }} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${sector === value ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300'}`}>{value || 'All projects'}</button>)}</div>
    {loading ? <div role="status" aria-label="Loading projects" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map(index => <div key={index} className="h-80 animate-pulse rounded-xl bg-white" />)}</div> : error ? <div role="alert" className="rounded-xl border bg-white p-10 text-center"><p className="text-sm text-gray-500">Could not load projects.</p><button type="button" onClick={() => setRequest(current => current + 1)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600"><FiRefreshCw /> Try again</button></div> : !filtered.length ? <div className="rounded-xl border border-dashed bg-white p-12 text-center"><h2 className="text-lg font-semibold text-gray-900">{sector ? 'No projects in this sector yet' : 'Our project stories are coming soon'}</h2><p className="mt-2 text-sm text-gray-500">Explore another sector or talk to us about your next installation.</p></div> : <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0, visible).map(project => <Link key={project.id} to={`/projects/${project.id}`} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md">
        <div className="relative"><ProjectImage src={project.image_url} alt={project.title} className="h-56 w-full" /><span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-700">{project.application_sector}</span></div>
        <div className="flex flex-1 flex-col p-5"><p className="mb-2 text-xs font-semibold text-primary-600">{project.category}</p><h2 className="line-clamp-2 break-words text-lg font-bold text-gray-900">{project.title}</h2><p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500"><FiMapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{project.location_name}</span></p><p className="mb-5 mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{project.description}</p><span className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-primary-600">View project <FiArrowUpRight className="h-4 w-4" /></span></div>
      </Link>)}</div>
      {filtered.length > visible && <div className="mt-6 text-center"><button type="button" onClick={() => setVisible(current => current + 12)} className="btn btn-outline btn-sm">Show more projects</button></div>}
    </>}
  </div></div>;
}
