import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowUpRight, FiEdit2, FiFolder, FiGlobe, FiLayers, FiLoader, FiMapPin, FiPlus, FiRefreshCw, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { projectAPI } from '../../services/adminApi';
import ProjectImage from '../../components/projects/ProjectImage';

function ProjectActions({ project, deleting, onDelete }) {
  return <div className="flex items-center gap-1">
    <Link to={`/projects/${project.id}`} title="View project" aria-label={`View ${project.title}`} className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600"><FiArrowUpRight className="h-4 w-4" /></Link>
    <Link to={`/admin/projects/edit/${project.id}`} title="Edit project" aria-label={`Edit ${project.title}`} className="rounded-lg p-2 text-gray-400 transition hover:bg-primary-50 hover:text-primary-600"><FiEdit2 className="h-4 w-4" /></Link>
    <button type="button" disabled={deleting} onClick={() => onDelete(project)} title="Delete project" aria-label={`Delete ${project.title}`} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40">{deleting ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiTrash2 className="h-4 w-4" />}</button>
  </div>;
}

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(0);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    projectAPI.getAll().then(response => { if (active) setProjects(response.data.data || []); })
      .catch(e => { if (active) setError(e.response?.data?.message || 'Could not load projects. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);

  const remove = async project => {
    if (!window.confirm(`Delete “${project.title}”? This removes it from the home page.`)) return;
    setDeleting(project.id);
    setDeleteError('');
    try {
      await projectAPI.delete(project.id);
      setProjects(current => current.filter(item => item.id !== project.id));
    } catch (e) { setDeleteError(e.response?.data?.message || 'Could not delete this project. Please try again.'); }
    finally { setDeleting(null); }
  };

  const sectors = [...new Set(projects.map(project => project.application_sector).filter(Boolean))].sort();
  const locations = new Set(projects.map(project => project.location_name?.trim().toLowerCase()).filter(Boolean)).size;
  const query = search.trim().toLowerCase();
  const filtered = projects.filter(project => (!sector || project.application_sector === sector) && (!query || [project.title, project.category, project.application_sector, project.location_name].some(value => value?.toLowerCase().includes(query))));
  const clearFilters = () => { setSearch(''); setSector(''); };
  const count = value => loading || error ? '—' : value;

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-600">Project showcase</p><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Projects</h1><p className="mt-2 text-sm text-gray-500">Manage the installations featured on your home page.</p></div>
      <Link to="/admin/projects/new" className="btn btn-primary w-fit gap-2 text-sm"><FiPlus className="h-4 w-4" /> Add project</Link>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">{[
      ['Total projects', count(projects.length), FiFolder, 'bg-primary-50 text-primary-600'],
      ['Application sectors', count(sectors.length), FiLayers, 'bg-blue-50 text-blue-600'],
      ['Project locations', count(locations), FiGlobe, 'bg-amber-50 text-amber-600'],
    ].map(([label, value, Icon, color]) => <div key={label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><div><p className="text-xs font-medium text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold leading-none text-gray-900">{value}</p></div></div>)}</div>

    {deleteError && <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><FiAlertCircle className="h-5 w-5 shrink-0" />{deleteError}</div>}

    <section aria-label="Project list" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative w-full sm:max-w-md"><FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type="search" aria-label="Search projects" placeholder="Search projects, categories or locations..." value={search} onChange={event => setSearch(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10" /></div>
        <div className="flex items-center gap-2"><select aria-label="Filter by application sector" value={sector} onChange={event => setSector(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-primary-500 sm:w-48"><option value="">All sectors</option>{[...new Set([...sectors, ...(sector ? [sector] : [])])].map(value => <option key={value} value={value}>{value}</option>)}</select><button type="button" disabled={loading} onClick={() => setRequest(current => current + 1)} title="Refresh projects" aria-label="Refresh projects" className="rounded-lg border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"><FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button></div>
      </div>

      {loading ? <div role="status" aria-label="Loading projects" className="divide-y divide-gray-100">{[0, 1, 2, 3].map(index => <div key={index} aria-hidden="true" className="flex items-center gap-4 p-5"><div className="h-16 w-24 shrink-0 animate-pulse rounded-lg bg-gray-100" /><div className="flex-1 space-y-3"><div className="h-4 w-2/3 max-w-xs animate-pulse rounded bg-gray-100" /><div className="h-3 w-1/3 max-w-40 animate-pulse rounded bg-gray-100" /></div><div className="hidden h-6 w-24 animate-pulse rounded bg-gray-100 sm:block" /></div>)}</div> : error ? <div role="alert" className="flex flex-col items-center px-6 py-16 text-center"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"><FiAlertCircle className="h-6 w-6" /></span><h2 className="text-lg font-semibold text-gray-900">Unable to load projects</h2><p className="mt-2 max-w-md text-sm text-gray-500">{error}</p><button type="button" onClick={() => setRequest(current => current + 1)} className="btn btn-outline btn-sm mt-5 gap-2"><FiRefreshCw className="h-4 w-4" /> Try again</button></div> : !projects.length ? <div className="flex flex-col items-center px-6 py-16 text-center"><span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><FiFolder className="h-7 w-7" /></span><h2 className="text-xl font-semibold text-gray-900">Your project showcase starts here</h2><p className="mt-3 max-w-md text-sm leading-6 text-gray-500">Add photos, a location and a story to share your first installation with visitors.</p><Link to="/admin/projects/new" className="btn btn-primary mt-6 gap-2 text-sm"><FiPlus className="h-4 w-4" /> Create your first project</Link></div> : !filtered.length ? <div className="flex flex-col items-center px-6 py-14 text-center"><FiSearch className="mb-4 h-7 w-7 text-gray-300" /><h2 className="text-lg font-semibold text-gray-900">No matching projects</h2><p className="mt-2 text-sm text-gray-500">Try another title, location or sector.</p><button type="button" onClick={clearFilters} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600"><FiX className="h-4 w-4" /> Clear filters</button></div> : <>
        <div className="divide-y divide-gray-100 md:hidden">{filtered.map(project => <article key={project.id} className="p-4"><div className="flex items-start gap-3"><Link to={`/admin/projects/edit/${project.id}`} aria-label={`Edit ${project.title}`} className="shrink-0"><ProjectImage src={project.image_url} alt={project.title} className="h-20 w-24 rounded-lg" /></Link><div className="min-w-0"><Link to={`/admin/projects/edit/${project.id}`} className="line-clamp-2 break-words text-sm font-semibold text-gray-900 hover:text-primary-600">{project.title}</Link><p className="mt-1 truncate text-xs text-gray-500">{project.category}</p><span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">{project.application_sector}</span></div></div><div className="mt-3 flex items-center justify-between gap-2"><p className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500"><FiMapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{project.location_name}</span></p><ProjectActions project={project} deleting={deleting === project.id} onDelete={remove} /></div></article>)}</div>
        <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th scope="col" className="px-6 py-4">Project</th><th scope="col" className="px-4 py-4">Sector</th><th scope="col" className="px-4 py-4">Location</th><th scope="col" className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map(project => <tr key={project.id} className="transition hover:bg-gray-50/70"><td className="px-6 py-5"><Link to={`/admin/projects/edit/${project.id}`} className="group flex items-center gap-4"><ProjectImage src={project.image_url} alt="" className="h-16 w-24 shrink-0 rounded-lg" /><div className="min-w-0 max-w-xs"><span className="line-clamp-2 break-words font-semibold text-gray-900 group-hover:text-primary-600">{project.title}</span><p className="mt-1 text-xs text-gray-400">{project.category}</p></div></Link></td><td className="px-4 py-5"><span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{project.application_sector}</span></td><td className="px-4 py-5"><span className="flex max-w-48 items-start gap-1.5 text-xs leading-5 text-gray-500"><FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />{project.location_name}</span></td><td className="px-6 py-5"><div className="flex justify-end"><ProjectActions project={project} deleting={deleting === project.id} onDelete={remove} /></div></td></tr>)}</tbody></table></div>
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3"><p className="text-xs text-gray-400">Showing {filtered.length} of {projects.length} projects</p>{(search || sector) && <button type="button" onClick={clearFilters} className="text-xs font-medium text-primary-600 hover:underline">Clear filters</button>}</div>
      </>}
    </section>
  </div>;
}
