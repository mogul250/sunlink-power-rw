import { useEffect, useMemo, useState } from 'react';
import { FiDownload, FiEdit2, FiFilm, FiFolderPlus, FiSearch, FiTrash2, FiUpload } from 'react-icons/fi';
import { categoryAPI, kitAPI, productAPI, resourceAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import SearchableSelect from '../../components/common/SearchableSelect';

const initialForm = {
  mode: 'create',
  id: null,
  title: '',
  description: '',
  resource_type: 'file',
  youtube_url: '',
  relation_type: 'standalone',
  relation_id: '',
  is_featured: false,
  files: []
};

const ResourceManager = () => {
  const [form, setForm] = useState(initialForm);
  const [resources, setResources] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourceRes, productRes, categoryRes, kitRes] = await Promise.all([
        resourceAPI.getAll(),
        productAPI.getAll({ limit: 5000, offset: 0 }),
        categoryAPI.getAll(),
        kitAPI.getAll({ limit: 5000, offset: 0 })
      ]);

      setResources(resourceRes.data.data || []);
      setProducts(productRes.data.data || []);
      setCategories(categoryRes.data.data || []);
      setKits(kitRes.data.data || []);
    } catch (error) {
      console.error('Failed to load resources page data', error);
      alert('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const relationOptions = useMemo(() => ({
    product: products,
    category: categories,
    kit: kits
  }), [products, categories, kits]);

  const filteredResources = resources.filter((resource) => {
    const query = searchTerm.toLowerCase();
    return (
      resource.title?.toLowerCase().includes(query) ||
      resource.relation_name?.toLowerCase().includes(query) ||
      resource.relation_type?.toLowerCase().includes(query)
    );
  });

  const buildFormData = () => {
    const formData = new FormData();
    if (form.title.trim()) formData.append('title', form.title.trim());
    formData.append('description', form.description);
    formData.append('is_featured', form.is_featured ? 'true' : 'false');

    if (form.resource_type === 'video') {
      formData.append('youtube_url', form.youtube_url.trim());
    } else {
      Array.from(form.files || []).forEach((file) => {
        formData.append('files', file);
      });
    }

    if (form.relation_type === 'product') {
      formData.append('product_id', form.relation_id);
    }
    if (form.relation_type === 'category') {
      formData.append('category_id', form.relation_id);
    }
    if (form.relation_type === 'kit') {
      formData.append('kit_id', form.relation_id);
    }

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.resource_type === 'video' && !form.youtube_url.trim()) {
      alert('Please provide a YouTube link');
      return;
    }

    if (form.resource_type === 'file' && (!form.files || form.files.length === 0) && form.mode === 'create') {
      alert('Please choose at least one file to upload');
      return;
    }

    if (form.relation_type !== 'standalone' && !form.relation_id) {
      alert('Please choose the related product, category, or kit');
      return;
    }

    try {
      setSaving(true);
      const formData = buildFormData();

      if (form.mode === 'edit' && form.id) {
        await resourceAPI.update(form.id, formData);
      } else {
        await resourceAPI.create(formData);
      }

      setForm(initialForm);
      await loadData();
    } catch (error) {
      console.error('Failed to save resource', error);
      alert(error.response?.data?.message || 'Failed to save resource');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resource) => {
    const relation_type = resource.product_id
      ? 'product'
      : resource.category_id
      ? 'category'
      : resource.kit_id
      ? 'kit'
      : 'standalone';

    setForm({
      mode: 'edit',
      id: resource.id,
      title: resource.title || '',
      description: resource.description || '',
      resource_type: resource.resource_type,
      youtube_url: resource.youtube_url || '',
      relation_type,
      relation_id: resource.product_id || resource.category_id || resource.kit_id || '',
      is_featured: Boolean(resource.is_featured),
      files: []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;

    try {
      await resourceAPI.delete(id);
      setResources((current) => current.filter((resource) => resource.id !== id));
    } catch (error) {
      console.error('Failed to delete resource', error);
      alert('Failed to delete resource');
    }
  };

  const currentRelationOptions = relationOptions[form.relation_type] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resources & Videos</h1>
        <p className="mt-1 text-gray-600">
          Upload downloadable files, add YouTube links, and choose whether each item is standalone or linked to a product, category, or kit.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            {form.resource_type === 'video' ? <FiFilm className="h-5 w-5 text-primary" /> : <FiFolderPlus className="h-5 w-5 text-primary" />}
            <h2 className="text-lg font-bold text-gray-900">{form.mode === 'edit' ? 'Edit resource' : 'Add new resource'}</h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Resource type</label>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
                  value={form.resource_type}
                  onChange={(event) => setForm((current) => ({ ...current, resource_type: event.target.value, files: [], youtube_url: '' }))}
                >
                  <option value="file">Download file</option>
                  <option value="video">YouTube video</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Related to</label>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
                  value={form.relation_type}
                  onChange={(event) => setForm((current) => ({ ...current, relation_type: event.target.value, relation_id: '' }))}
                >
                  <option value="standalone">Standalone resource</option>
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="kit">Kit</option>
                </select>
              </div>
            </div>

            {form.relation_type !== 'standalone' && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Choose item</label>
                <SearchableSelect
                  options={currentRelationOptions}
                  value={form.relation_id}
                  onChange={(selectedValue) => setForm((current) => ({ ...current, relation_id: selectedValue }))}
                  placeholder={`Search ${form.relation_type}s`}
                  emptyMessage={`No matching ${form.relation_type}s`}
                  getOptionLabel={(item) => item.name}
                  getOptionDescription={(item) => item.category_name || item.slug || ''}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Title {form.resource_type === 'file' ? '(optional for multiple files)' : ''}
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder={form.resource_type === 'video' ? 'Installation walkthrough' : '2026 Solar Product Catalogue'}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                rows="4"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Short description shown on the downloads page"
              />
            </div>

            {form.resource_type === 'video' ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">YouTube link</label>
                <input
                  type="url"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-primary"
                  value={form.youtube_url}
                  onChange={(event) => setForm((current) => ({ ...current, youtube_url: event.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Files</label>
                <input
                  type="file"
                  multiple={form.mode !== 'edit'}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white"
                  onChange={(event) => setForm((current) => ({ ...current, files: Array.from(event.target.files || []) }))}
                />
                <p className="mt-2 text-xs text-gray-500">
                  PDFs, documents, spreadsheets, and presentations are supported. In edit mode you can replace the current file with one new file.
                </p>
              </div>
            )}

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) => setForm((current) => ({ ...current, is_featured: event.target.checked }))}
              />
              <div>
                <div className="font-semibold text-gray-900">Featured on home page</div>
                <div className="text-sm text-gray-500">Featured videos appear on the home page below the hero banner.</div>
              </div>
            </label>

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="btn btn-primary inline-flex items-center gap-2">
                {form.resource_type === 'video' ? <FiFilm /> : <FiUpload />}
                {saving ? 'Saving...' : form.mode === 'edit' ? 'Update resource' : 'Save resource'}
              </button>
              {form.mode === 'edit' && (
                <button type="button" className="btn bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setForm(initialForm)}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="relative max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Linked to</th>
                  <th className="px-5 py-4">Featured</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">Loading resources...</td></tr>
                ) : filteredResources.length === 0 ? (
                  <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-500">No resources found</td></tr>
                ) : (
                  filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900">{resource.title}</div>
                        {resource.description && <div className="mt-1 text-sm text-gray-500 line-clamp-2">{resource.description}</div>}
                      </td>
                      <td className="px-5 py-4 text-gray-600 capitalize">{resource.resource_type}</td>
                      <td className="px-5 py-4 text-gray-600 capitalize">
                        {resource.relation_type === 'standalone' ? 'Standalone' : `${resource.relation_type}: ${resource.relation_name}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${resource.is_featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {resource.is_featured ? 'Featured' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => handleEdit(resource)} className="rounded-lg p-2 text-gray-400 transition hover:bg-primary/5 hover:text-primary">
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          {resource.file_url && (
                            <a
                              href={getImageUrl(resource.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                              <FiDownload className="h-5 w-5" />
                            </a>
                          )}
                          <button type="button" onClick={() => handleDelete(resource.id)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceManager;
