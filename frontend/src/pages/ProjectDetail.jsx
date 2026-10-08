import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiAlertCircle, FiArrowLeft, FiArrowUpRight, FiBox, FiChevronLeft, FiChevronRight, FiExternalLink, FiFileText, FiGrid, FiImage, FiLayers, FiMapPin, FiMaximize2, FiRefreshCw, FiTag } from 'react-icons/fi';
import { projectAPI } from '../services/api';
import { getImageUrl } from '../services/imageUtils';
import ProjectImage from '../components/projects/ProjectImage';

function SectionHeading({ icon: Icon, title, children }) {
  return <div className="mb-4 flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Icon className="h-4 w-4" /></span><h2 className="text-base font-semibold text-gray-900">{title}</h2></div>
    {children}
  </div>;
}

function ItemCard({ item, type }) {
  const [failed, setFailed] = useState(false);
  const Icon = type === 'products' ? FiBox : FiLayers;
  return <Link to={type === 'products' ? `/product/${item.id}` : `/kit/${item.slug}`} className="group min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-primary-200 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
    <div className="flex h-44 items-center justify-center border-b border-gray-100 bg-gray-50/70 p-4 sm:h-48">
      {item.image_url && !failed ? <img src={getImageUrl(item.image_url)} alt={item.name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105" /> : <Icon className="h-9 w-9 text-gray-300" aria-hidden="true" />}
    </div>
    <div className="min-w-0 p-3.5"><h3 title={item.name} className="truncate text-sm font-semibold text-gray-900">{item.name}</h3><span className="mt-2 flex items-center justify-between text-xs font-medium text-primary-600">{type === 'products' ? 'View product' : 'View kit'}<FiArrowUpRight className="h-3.5 w-3.5" /></span></div>
  </Link>;
}

const panel = 'min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(0);
  const galleryRef = useRef(null);
  const scrollGallery = direction => {
    const gallery = galleryRef.current;
    if (gallery) gallery.scrollBy({ left: direction * (gallery.firstElementChild?.getBoundingClientRect().width + 12 || gallery.clientWidth * 0.8), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    projectAPI.getById(id).then(response => { if (active) setProject(response.data.data); })
      .catch(e => { if (active) setError(e.response?.status === 404 ? 'Project not found.' : 'Could not load this project. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, request]);

  const coordinates = project ? `${project.latitude},${project.longitude}` : '';
  const images = project?.images || [];

  return <div className="bg-gray-100 py-6 md:py-8">
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      <Link to="/projects" className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-primary-600"><FiArrowLeft className="h-3.5 w-3.5" /> Back to projects</Link>
      {loading ? <div role="status" aria-label="Loading project" className="space-y-4"><div aria-hidden="true" className={`${panel} animate-pulse`}><div className="mb-3 h-5 w-1/2 rounded bg-gray-100" /><div className="mb-4 h-3 w-1/3 rounded bg-gray-100" /><div className="h-72 rounded-lg bg-gray-100" /></div><div aria-hidden="true" className="space-y-4"><div className="h-48 animate-pulse rounded-xl bg-white" /><div className="h-48 animate-pulse rounded-xl bg-white" /></div></div> : error ? <div role="alert" className={`${panel} flex flex-col items-center py-12 text-center`}><span className="mb-3 rounded-xl bg-red-50 p-3 text-red-500"><FiAlertCircle className="h-5 w-5" /></span><h1 className="text-lg font-semibold text-gray-900">{error}</h1><button type="button" onClick={() => setRequest(current => current + 1)} className="btn btn-outline btn-sm mt-4 gap-2"><FiRefreshCw className="h-4 w-4" /> Try again</button></div> : project && <>
        <Helmet><title>{project.title} | Sunlink Power</title></Helmet>
        <div className="space-y-4">
          <header className={`${panel} overflow-hidden`}>
            <div className="mb-3 flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"><FiGrid className="h-3 w-3" />{project.application_sector}</span><span className="inline-flex items-center gap-1.5 text-xs text-gray-500"><FiTag className="h-3 w-3" />{project.category}</span></div>
            <h1 className="break-words text-xl font-bold leading-snug text-gray-900 md:text-2xl">{project.title}</h1>
            <p className="mb-4 mt-2 flex items-center gap-1.5 text-xs text-gray-500"><FiMapPin className="h-3.5 w-3.5 shrink-0 text-primary-600" />{project.location_name}</p>
            <ProjectImage src={project.image_url} alt={project.title} loading="eager" className="h-56 w-full rounded-lg sm:h-72 md:h-[360px]" />
          </header>

          <div className="space-y-4">
            <section className={panel}><SectionHeading icon={FiFileText} title="Project overview" /><p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">{project.description}</p></section>
            <section className={panel}>
              <SectionHeading icon={FiMapPin} title="Project location"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`} target="_blank" rel="noreferrer" title="Open location in Google Maps" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700">Open map <FiExternalLink className="h-3.5 w-3.5" /></a></SectionHeading>
              <p className="mb-3 text-xs text-gray-500">{project.location_name}</p>
              <iframe title={`${project.title} location`} src={`https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&z=14&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full rounded-lg border-0 md:h-96" allowFullScreen />
            </section>
          </div>

          {images.length > 0 && <section className={panel}>
            <SectionHeading icon={FiImage} title="Project gallery"><div className="flex items-center gap-2"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>{images.length > 1 && <><button type="button" onClick={() => scrollGallery(-1)} aria-label="Scroll gallery left" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-primary-50 hover:text-primary-600"><FiChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => scrollGallery(1)} aria-label="Scroll gallery right" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-primary-50 hover:text-primary-600"><FiChevronRight className="h-4 w-4" /></button></>}</div></SectionHeading>
            <div ref={galleryRef} role="region" aria-label="Project photo gallery" tabIndex={0} className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain rounded-lg pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{images.map((image, index) => <a key={image.id} href={getImageUrl(image.image_url)} target="_blank" rel="noreferrer" aria-label={`Open project photo ${index + 1} in full size`} className="group relative w-[88%] shrink-0 snap-start overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset sm:w-[70%] lg:w-[48%]">
              <ProjectImage src={image.image_url} alt={`${project.title} — photo ${index + 1}`} className="h-64 w-full sm:h-80 lg:h-[420px]" />
              <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[11px] font-medium text-white">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-gray-600 shadow-sm transition group-hover:bg-primary-600 group-hover:text-white"><FiMaximize2 className="h-4 w-4" /></span>
            </a>)}</div>
          </section>}

          {[['products', 'Products used', FiBox], ['kits', 'Related kits', FiLayers]].map(([key, title, Icon]) => project[key]?.length > 0 && <section key={key} className={panel}>
            <SectionHeading icon={Icon} title={title}><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">{project[key].length} {project[key].length === 1 ? 'item' : 'items'}</span></SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{project[key].map(item => <ItemCard key={item.id} item={item} type={key} />)}</div>
          </section>)}
        </div>
      </>}
    </div>
  </div>;
}
