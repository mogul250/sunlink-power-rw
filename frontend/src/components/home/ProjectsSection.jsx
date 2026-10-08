import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { projectAPI } from '../../services/api';
const ProjectsMap = lazy(() => import('../projects/ProjectsMap'));

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [request, setRequest] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError(false);
    projectAPI.getAll().then(response => { if (active) setProjects(response.data.data || []); })
      .catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);
  return <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-28 border-t border-gray-100 bg-[#f7f9fc] py-12 md:py-16"><div className="container-custom">
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#094fa4]">Our projects</p><h2 id="projects-heading" className="text-3xl font-bold text-gray-950 md:text-4xl">Explore Our Projects on the Map.</h2></div><p className="max-w-md text-sm leading-6 text-gray-500">Explore where our solar solutions are making a difference. Select a pin to discover the project.</p></div>
    {loading ? <div role="status" aria-label="Loading project map" className="h-[380px] animate-pulse rounded-xl border border-gray-200 bg-gray-200/60 md:h-[500px]" /> : error ? <div role="alert" className="rounded-xl border bg-white p-10 text-center"><p className="text-sm text-gray-500">Project locations are temporarily unavailable.</p><button type="button" onClick={() => setRequest(current => current + 1)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600"><FiRefreshCw /> Try again</button></div> : <Suspense fallback={<div role="status" aria-label="Loading map" className="h-[380px] animate-pulse rounded-xl bg-gray-200/60 md:h-[500px]" />}><ProjectsMap projects={projects} /></Suspense>}
    <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row"><p className="flex items-center gap-2 text-xs text-gray-500"><FiMapPin className="h-4 w-4 text-primary-600" />{!loading && !error && !projects.length ? 'Our first project story is coming soon.' : 'Discover the story behind each installation.'}</p><Link to="/projects" className="btn btn-primary gap-2 text-sm">Browse projects <FiArrowRight className="h-4 w-4" /></Link></div>
  </div></section>;
}
