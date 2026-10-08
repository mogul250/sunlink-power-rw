import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';
import { categoryAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await categoryAPI.getById(id);
      const data = res.data.data;
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
      });
      if (data.image_url) setCurrentImage(data.image_url);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load category' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('description', formData.description);
      if (imageFile) data.append('image', imageFile);

      if (id) {
        await categoryAPI.update(id, data);
        setMessage({ type: 'success', text: 'Category updated successfully' });
      } else {
        await categoryAPI.create(data);
        setMessage({ type: 'success', text: 'Category created successfully' });
        navigate('/admin/categories');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{id ? 'Edit Category' : 'Add Category'}</h1>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="label">Category Name</label>
          <input
            type="text"
            required
            className="input-field w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Slug (URL-friendly name)</label>
          <input
            type="text"
            required
            className="input-field w-full border p-2 rounded"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            rows="3"
            className="input-field w-full border p-2 rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="label mb-2 block">Category Image</label>
          {currentImage && <img src={getImageUrl(currentImage)} alt="Current" className="h-20 w-20 object-cover rounded mb-2" />}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500"/>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-2">
          <FiSave /> {loading ? 'Saving...' : (id ? 'Update Category' : 'Create Category')}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;