import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiBox, FiCheck, FiCheckCircle, FiImage, FiLayers, FiLoader, FiMapPin, FiSave, FiUploadCloud, FiX, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { projectAPI, productAPI, kitAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import ProjectLocationPicker from '../../components/admin/ProjectLocationPicker';
import SearchableSelect from '../../components/common/SearchableSelect';
import { applicationSectors } from '../../data/applicationSectors';

const empty = { title: '', category: '', application_sector: '', description: '', location_name: '', latitude: '', longitude: '', products: [], kits: [], images: [] };
const sectors = applicationSectors.map(sector => sector.title);
const categories = ['Solar power system', 'Solar water pumping', 'Solar street lighting', 'Energy storage', 'EV charging'];
const acceptedImages = 'image/jpeg,image/png,image/webp,image/gif';
const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10';

function SectionHeading({ icon: Icon, title, description, badge }) {
  return <div className="mb-6 flex items-start gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-gray-900">{title}</h2>{badge && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{badge}</span>}</div><p className="mt-1 text-sm leading-5 text-gray-500">{description}</p></div>
  </div>;
}

function ImageUpload({ label, description, multiple = false, onFiles, compact = false }) {
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  return <div
    onDragOver={event => { event.preventDefault(); setDragging(true); }}
    onDragLeave={() => setDragging(false)}
    onDrop={event => { event.preventDefault(); setDragging(false); onFiles(Array.from(event.dataTransfer.files)); }}
    className={`relative rounded-xl border-2 border-dashed transition ${dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-gray-50/70 hover:border-primary-300 hover:bg-primary-50/40'}`}
  >
    <input ref={input} type="file" multiple={multiple} accept={acceptedImages} aria-label={label} className="sr-only" onChange={event => { onFiles(Array.from(event.target.files)); event.target.value = ''; }} />
    <button type="button" onClick={() => input.current?.click()} className={`flex w-full flex-col items-center justify-center px-4 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl ${compact ? 'py-5' : 'py-8'}`}>
      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm"><FiUploadCloud className="h-5 w-5" /></span>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <span className="mt-1 text-xs text-gray-500">{description}</span>
      <span className="mt-3 text-xs font-medium text-primary-600">Browse files or drag &amp; drop</span>
    </button>
  </div>;
}

function ImageTile({ src, alt, onRemove }) {
  return <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
    <button type="button" onClick={onRemove} aria-label={`Remove ${alt}`} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-primary-500"><FiX className="h-4 w-4" /></button>
  </div>;
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [products, setProducts] = useState([]);
  const [kits, setKits] = useState([]);
  const [main, setMain] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [mainPreview, setMainPreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => { if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [error]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    setError('');
    setForm(empty);
    setMain(null);
    setGallery([]);
    Promise.all([
      productAPI.getAll({ limit: 5000 }),
      kitAPI.getAll({ limit: 5000 }),
      id ? projectAPI.getById(id) : Promise.resolve(null),
    ]).then(([p, k, project]) => {
      if (!active) return;
      setProducts(p.data.data || []);
      setKits(k.data.data || []);
      if (project) setForm(project.data.data);
    }).catch(e => {
      if (active) { setLoadFailed(true); setError(e.response?.data?.message || 'Could not load the project form. Please refresh and try again.'); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    const url = main ? URL.createObjectURL(main) : '';
    setMainPreview(url);
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [main]);

  useEffect(() => {
    const previews = gallery.map(file => ({ file, url: URL.createObjectURL(file) }));
    setGalleryPreviews(previews);
    return () => previews.forEach(preview => URL.revokeObjectURL(preview.url));
  }, [gallery]);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const galleryCount = form.images.length + gallery.length;
  const cover = mainPreview || (form.image_url ? getImageUrl(form.image_url) : '');
  const locationSelected = form.latitude !== '' && form.longitude !== '' && Number.isFinite(Number(form.latitude)) && Number.isFinite(Number(form.longitude)) && Math.abs(Number(form.latitude)) <= 90 && Math.abs(Number(form.longitude)) <= 180;

  const chooseImages = (files, isGallery = false) => {
    if (saving) return;
    if (!files.length) return;
    if (files.some(file => !acceptedImages.split(',').includes(file.type) || file.size > 10 * 1024 * 1024)) {
      setError('Choose JPG, PNG, WebP or GIF images, up to 10MB each.');
      return;
    }
    if (isGallery && galleryCount + files.length > 10) {
      setError('Your gallery can contain up to 10 images. Remove an image before adding more.');
      return;
    }
    setError('');
    if (isGallery) setGallery(current => [...current, ...files]);
    else setMain(files[0]);
  };

  const addLinkedItem = (key, items, itemId) => {
    const item = items.find(candidate => String(candidate.id) === itemId);
    if (item) setForm(current => ({ ...current, [key]: [...current[key], item] }));
  };

  const submit = async event => {
    event.preventDefault();
    if (saving || loadFailed) return;
    setError('');
    if (!main && !form.image_url) return setError('Add a cover image for your project.');
    if (galleryCount < 1 || galleryCount > 10) return setError('Add between 1 and 10 gallery images.');
    setSaving(true);
    try {
      const data = new FormData();
      for (const key of ['title', 'category', 'application_sector', 'description', 'location_name', 'latitude', 'longitude']) data.append(key, form[key]);
      data.append('product_ids', JSON.stringify(form.products.map(p => p.id)));
      data.append('kit_ids', JSON.stringify(form.kits.map(k => k.id)));
      data.append('retained_image_ids', JSON.stringify(form.images.map(image => image.id)));
      if (main) data.append('image', main);
      gallery.forEach(file => data.append('gallery_images', file));
      if (id) await projectAPI.update(id, data);
      else await projectAPI.create(data);
      navigate('/admin/projects');
    } catch (e) {
      setError(e.response?.data?.message || 'Could not save the project. Please try again.');
    } finally { setSaving(false); }
  };

  const SaveIcon = saving ? FiLoader : FiSave;
  const saveLabel = saving ? 'Saving project...' : id ? 'Save changes' : 'Create project';

  return <div className="mx-auto max-w-6xl pb-6">
    <Link to="/admin/projects" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600"><FiArrowLeft className="h-4 w-4" /> All projects</Link>
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-600">Project showcase</p><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{id ? 'Edit project' : 'Create a new project'}</h1><p className="mt-2 text-sm text-gray-500">Share the places, people and solar solutions behind our impact.</p></div>
      <div className="flex shrink-0 items-center gap-3"><Link to="/admin/projects" className="btn btn-ghost btn-sm border border-gray-200 bg-white">Cancel</Link><button type="submit" form="project-form" disabled={loading || saving || loadFailed} className="btn btn-primary btn-sm gap-2"><SaveIcon className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />{saveLabel}</button></div>
    </div>

    {error && <div ref={errorRef} role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><span>{error}</span></div>}
    {loading ? <div role="status" aria-label="Loading project form" className="grid animate-pulse gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="h-96 rounded-xl border border-gray-200 bg-white p-6"><div className="mb-8 h-5 w-40 rounded bg-gray-100" /><div className="h-12 rounded bg-gray-100" /><div className="mt-5 h-32 rounded bg-gray-100" /></div><div className="h-80 rounded-xl bg-gray-200" /></div> : !loadFailed && <form id="project-form" onSubmit={submit}>
      <fieldset disabled={saving} className="min-w-0 disabled:opacity-75">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading icon={FiFileText} title="Project details" description="Give your project a name and tell its story." />
              <div className="space-y-5">
                <div><label htmlFor="project-title" className="label">Project title <span className="text-red-500">*</span></label><input id="project-title" required maxLength={200} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Solar installation at Juba Community School" className={inputClass} /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><label htmlFor="project-category" className="label">Category <span className="text-red-500">*</span></label><input id="project-category" required maxLength={100} list="project-categories" value={form.category} onChange={e => update('category', e.target.value)} placeholder="Select or enter a category" className={inputClass} /><datalist id="project-categories">{categories.map(category => <option key={category} value={category} />)}</datalist></div>
                  <div><label htmlFor="project-sector" className="label">Application sector <span className="text-red-500">*</span></label><select id="project-sector" required value={sectors.includes(form.application_sector) ? form.application_sector : ''} onChange={e => update('application_sector', e.target.value)} className={inputClass}><option value="" disabled>Select an application sector</option>{sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}</select></div>
                </div>
                <div><label htmlFor="project-description" className="label">Project description <span className="text-red-500">*</span></label><textarea id="project-description" required rows={5} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the installation, the challenge it addressed and the difference it makes." className={`${inputClass} resize-y`} /><p className="mt-2 text-xs text-gray-400">This story appears on the public project page.</p></div>
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading icon={FiMapPin} title="Project location" description="Put your project on the map." />
              <div className="mb-5"><label htmlFor="project-location" className="label">Location name <span className="text-red-500">*</span></label><input id="project-location" required maxLength={200} value={form.location_name} onChange={e => update('location_name', e.target.value)} placeholder="e.g. Juba, South Sudan" className={inputClass} /></div>
              <ProjectLocationPicker latitude={form.latitude} longitude={form.longitude} onChange={(latitude, longitude) => setForm(current => ({ ...current, latitude, longitude }))} />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">{['latitude', 'longitude'].map(key => <div key={key}><label htmlFor={`project-${key}`} className="label">{key === 'latitude' ? 'Latitude' : 'Longitude'} <span className="text-red-500">*</span></label><input id={`project-${key}`} required type="number" step="any" min={key === 'latitude' ? -90 : -180} max={key === 'latitude' ? 90 : 180} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={key === 'latitude' ? '4.8500000' : '31.6000000'} className={`${inputClass} font-mono`} /></div>)}</div>
              {locationSelected && <p className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-700"><FiCheckCircle className="h-4 w-4" /> Project location selected</p>}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading icon={FiImage} title="Project gallery" description="Show the installation from every angle. Add 1–10 photos." badge={`${galleryCount}/10 photos`} />
              {(form.images.length > 0 || galleryPreviews.length > 0) && <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.images.map((image, index) => <ImageTile key={image.id} src={getImageUrl(image.image_url)} alt={`existing gallery photo ${index + 1}`} onRemove={() => update('images', form.images.filter(item => item.id !== image.id))} />)}
                {galleryPreviews.map((preview, index) => <ImageTile key={preview.url} src={preview.url} alt={`new gallery photo ${index + 1}`} onRemove={() => setGallery(current => current.filter((_, i) => i !== index))} />)}
              </div>}
              {galleryCount < 10 && <ImageUpload multiple label={galleryCount ? 'Add more photos' : 'Upload gallery photos'} description="JPG, PNG, WebP or GIF · Up to 10MB per photo" onFiles={files => chooseImages(files, true)} compact={galleryCount > 0} />}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <SectionHeading icon={FiLayers} title="Products & kits" description="Help visitors explore the solutions used in this project." badge="Optional" />
              <div className="grid gap-6 sm:grid-cols-2">{[['products', products, 'Products', FiBox], ['kits', kits, 'Kits', FiLayers]].map(([key, items, label, Icon]) => <div key={key}>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"><Icon className="h-4 w-4 text-gray-400" />{label}<span className="ml-auto text-xs text-gray-400">{form[key].length} linked</span></p>
                <SearchableSelect options={items.filter(item => !form[key].some(selected => selected.id === item.id))} value="" onChange={itemId => addLinkedItem(key, items, itemId)} placeholder={`Search and add ${key}...`} emptyMessage={`No more ${key} available`} />
                <div className="mt-3 space-y-2">{form[key].map(item => <div key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                  {item.image_url ? <img src={getImageUrl(item.image_url)} alt="" className="h-9 w-9 shrink-0 rounded-md bg-white object-contain" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-gray-400"><Icon className="h-4 w-4" /></span>}
                  <span className="min-w-0 flex-1 break-words text-xs font-medium text-gray-700">{item.name}</span><button type="button" aria-label={`Unlink ${item.name}`} onClick={() => update(key, form[key].filter(selected => selected.id !== item.id))} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"><FiX className="h-4 w-4" /></button>
                </div>)}</div>
              </div>)}</div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-6">
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <SectionHeading icon={FiImage} title="Cover image" description="The first impression of your project." badge="Required" />
              {cover && <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-100"><img src={cover} alt="Project cover preview" className="aspect-[4/3] w-full object-cover" />{main && <button type="button" aria-label="Remove new cover image" onClick={() => setMain(null)} className="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-700 shadow hover:text-red-600"><FiX className="h-4 w-4" /></button>}</div>}
              <ImageUpload label={cover ? 'Replace cover image' : 'Upload a cover image'} description="JPG, PNG, WebP or GIF · Up to 10MB" onFiles={files => chooseImages(files)} compact={Boolean(cover)} />
              <p className="mt-3 text-xs leading-5 text-gray-400">Choose a clear, landscape photo of the completed installation.</p>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="text-sm font-semibold text-gray-900">Landing page preview</h2><span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">Live preview</span></div>
              {cover ? <img src={cover} alt="Landing page card preview" className="aspect-[16/10] w-full object-cover" /> : <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"><FiImage className="h-10 w-10 text-gray-300" /></div>}
              <div className="p-5"><p className="mb-2 text-xs font-semibold text-primary-600">{form.category || 'Project category'} · {form.application_sector || 'Sector'}</p><h3 className="break-words text-base font-bold text-gray-900">{form.title || 'Your project title'}</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400"><FiMapPin className="h-3 w-3 shrink-0" />{form.location_name || 'Project location'}</p><p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-gray-500">{form.description || 'Your project story will appear here. Add details to bring the installation to life.'}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary-600">View Project <FiArrowRight /></span></div>
            </section>

            <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-5"><p className="mb-3 text-sm font-semibold text-gray-900">Ready to share?</p><div className="space-y-2.5">{[
              ['Project details', [form.title, form.category, form.application_sector, form.description].every(value => value.trim())],
              ['Location selected', Boolean(form.location_name.trim()) && locationSelected],
              ['Cover image added', Boolean(cover)],
              ['Gallery photos added', galleryCount > 0],
            ].map(([label, complete]) => <div key={label} className="flex items-center gap-2 text-xs text-gray-600"><span className={`flex h-4 w-4 items-center justify-center rounded-full ${complete ? 'bg-primary-600 text-white' : 'border border-gray-300 bg-white'}`}>{complete && <FiCheck className="h-3 w-3" />}</span>{label}</div>)}</div><p className="mt-4 border-t border-primary-100 pt-3 text-xs leading-5 text-gray-500">Saved projects appear in “Real Projects. Real Impact.” on the home page.</p></div>
          </aside>
        </div>
        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-gray-500">Fields marked <span className="text-red-500">*</span> are required.</p><div className="flex items-center justify-end gap-3"><Link to="/admin/projects" className="btn btn-ghost btn-sm">Cancel</Link><button type="submit" disabled={saving} className="btn btn-primary gap-2"><SaveIcon className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />{saveLabel}</button></div></div>
      </fieldset>
    </form>}
  </div>;
}
