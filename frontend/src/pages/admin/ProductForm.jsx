import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { categoryAPI, productAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import ProductModelEditor from '../../components/admin/ProductModelEditor';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Main Product State matching schema.sql
  const [product, setProduct] = useState({
    name: '',
    category_id: '',
    description: '',
    wattage: '',
    durability_rating: '',
    battery_type: '',
    warranty_info: '',
    video_url: '',
  });

  // File States
  const [imageFile, setImageFile] = useState(null);
  const [manualFile, setManualFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentGallery, setCurrentGallery] = useState([]);

  // Metadata State (for JSON field)
  const [metadata, setMetadata] = useState([{ key: '', value: '' }]);
  const [hasModels, setHasModels] = useState(false);
  const [models, setModels] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getById(id);
      const data = res.data.data;
      
      setProduct({
        name: data.name,
        category_id: data.category_id,
        description: data.description || '',
        wattage: data.wattage || '',
        durability_rating: data.durability_rating || '',
        battery_type: data.battery_type || '',
        warranty_info: data.warranty_info || '',
        video_url: data.video_url || '',
      });

      if (data.image_url) setCurrentImage(data.image_url);
      if (data.gallery_images) setCurrentGallery(data.gallery_images);

      if (data.models?.length > 0) {
        const loadedModels = data.models.map((model) => ({ ...model, _key: model.model_code }));
        setHasModels(true);
        setModels(loadedModels);
        setSpecifications((data.specifications || []).map((specification) => ({
          ...specification,
          model_values: loadedModels.reduce((values, model) => {
            values[model._key] = specification.model_values?.[model.model_code] || '';
            return values;
          }, {}),
        })));
      }

      // Parse metadata object to array for form
      if (data.metadata && typeof data.metadata === 'object') {
        // @ts-ignore
        const metaArray = Object.entries(data.metadata).map(([key, value]) => ({
          key,
          value
        }));
        if (metaArray.length > 0) setMetadata(metaArray);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load product details' });
    } finally {
      setLoading(false);
    }
  };

  const handleMetadataChange = (index, field, value) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
  };

  const addMetadataField = () => {
    setMetadata([...metadata, { key: '', value: '' }]);
  };

  const removeMetadataField = (index) => {
    const newMetadata = metadata.filter((_, i) => i !== index);
    setMetadata(newMetadata);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      
      // Append basic fields
      Object.keys(product).forEach(key => {
        formData.append(key, product[key]);
      });

      // Append files
      if (imageFile) formData.append('image', imageFile);
      if (manualFile) formData.append('manual', manualFile);
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          formData.append('gallery_images', file);
        }
      }

      // Process and append metadata as JSON string
      const metadataObject = metadata.reduce((acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      }, {});
      formData.append('metadata', JSON.stringify(metadataObject));

      const modelPayload = hasModels
        ? models.filter((model) => model.model_code.trim()).map((model, index) => ({
            model_code: model.model_code.trim(),
            display_name: model.display_name || model.model_code.trim(),
            nominal_power: model.nominal_power,
            is_default: Boolean(model.is_default),
            sort_order: index,
          }))
        : [];
      const specificationPayload = hasModels
        ? specifications.filter((specification) => specification.label.trim()).map((specification, index) => ({
            section_name: specification.section_name || 'General',
            spec_key: specification.spec_key || specification.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
            label: specification.label.trim(),
            unit: specification.unit,
            value_mode: specification.value_mode,
            shared_value: specification.shared_value,
            model_values: specification.value_mode === 'custom'
              ? models.reduce((values, model) => {
                  if (model.model_code.trim()) values[model.model_code.trim()] = specification.model_values?.[model._key] || '';
                  return values;
                }, {})
              : null,
            sort_order: index,
          }))
        : [];
      formData.append('models', JSON.stringify(modelPayload));
      formData.append('specifications', JSON.stringify(specificationPayload));

      if (id) {
        await productAPI.update(id, formData);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await productAPI.create(formData);
        setMessage({ type: 'success', text: 'Product created successfully!' });
        // Optional: navigate to list or reset form
        navigate('/admin/products');
      }
      
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await productAPI.deleteImage(imageId);
      setCurrentGallery(currentGallery.filter(img => img.id !== imageId));
      setMessage({ type: 'success', text: 'Image deleted' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete image' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="label">Product Name</label>
            <input
              type="text"
              required
              className="input-field w-full border p-2 rounded"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              required
              className="input-field w-full border p-2 rounded"
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Technical Specs */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Wattage</label>
              <input
                type="text"
                className="input-field w-full border p-2 rounded"
                placeholder="e.g. 550W"
                value={product.wattage}
                onChange={(e) => setProduct({ ...product, wattage: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Battery Type</label>
              <input
                type="text"
                className="input-field w-full border p-2 rounded"
                placeholder="e.g. LiFePO4"
                value={product.battery_type}
                onChange={(e) => setProduct({ ...product, battery_type: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Durability Rating</label>
              <input
                type="text"
                className="input-field w-full border p-2 rounded"
                placeholder="e.g. 25 Years"
                value={product.durability_rating}
                onChange={(e) => setProduct({ ...product, durability_rating: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Warranty Info</label>
              <input
                type="text"
                className="input-field w-full border p-2 rounded"
                value={product.warranty_info}
                onChange={(e) => setProduct({ ...product, warranty_info: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Video URL */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Product Video</h3>
          <div>
            <label className="label">YouTube Video URL</label>
            <input
              type="url"
              className="input-field w-full border p-2 rounded"
              placeholder="https://www.youtube.com/watch?v=..."
              value={product.video_url}
              onChange={(e) => setProduct({ ...product, video_url: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea
            rows="4"
            className="input-field w-full border p-2 rounded"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>

        <div className="border-t pt-6">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-primary"
              checked={hasModels}
              onChange={(event) => setHasModels(event.target.checked)}
            />
            <span>
              <span className="block font-semibold text-gray-900">This product has multiple models</span>
              <span className="mt-1 block text-sm text-gray-500">Enable a comparison matrix with shared and model-specific specifications.</span>
            </span>
          </label>
        </div>

        {hasModels && (
          <div className="border-t pt-6">
            <ProductModelEditor
              models={models}
              setModels={setModels}
              specifications={specifications}
              setSpecifications={setSpecifications}
            />
          </div>
        )}

        {/* Dynamic Metadata (JSON) */}
        {!hasModels && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Additional Metadata</h3>
            <button type="button" onClick={addMetadataField} className="text-primary flex items-center gap-1 text-sm font-medium">
              <FiPlus /> Add Field
            </button>
          </div>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            {metadata.map((item, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Key (e.g. Efficiency)"
                  className="flex-1 border p-2 rounded text-sm"
                  value={item.key}
                  onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 21.5%)"
                  className="flex-1 border p-2 rounded text-sm"
                  value={item.value}
                  onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                />
                <button type="button" onClick={() => removeMetadataField(index)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* File Uploads */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Image */}
          <div>
            <label className="label mb-2 block">Main Product Image (Thumbnail)</label>
            {currentImage && (
              <div className="mb-2">
                <img src={getImageUrl(currentImage)} alt="Current" className="h-20 w-20 object-cover rounded border" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"/>
          </div>
          {/* Gallery Images */}
          <div>
            <label className="label mb-2 block">Additional Gallery Images</label>
            {currentGallery.length > 0 && (
              <div className="flex gap-2 mb-2">
                {currentGallery.map((img) => (
                  <div key={img.id} className="relative group">
                    <img src={getImageUrl(img.image_url)} alt="Gallery" className="h-20 w-20 object-cover rounded border" />
                    <button type="button" onClick={() => handleDeleteGalleryImage(img.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files))} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"/>
          </div>
          <div>
            <label className="label mb-2 block">Manual (PDF)</label>
            <input type="file" accept=".pdf" onChange={(e) => setManualFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"/>
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" disabled={loading} className="btn btn-primary w-full flex items-center justify-center gap-2">
            <FiSave /> {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
