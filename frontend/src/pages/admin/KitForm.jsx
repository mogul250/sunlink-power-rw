import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX } from 'react-icons/fi';
import { kitAPI, productAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import SearchableSelect from '../../components/common/SearchableSelect';

const KitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    technical_specs: '{}',
    products: []
  });

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchKit();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await productAPI.getAll({ limit: 5000, offset: 0 });
      setAllProducts(res.data.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchKit = async () => {
    try {
      const res = await kitAPI.getById(id);
      const data = res.data.data;
      const technicalSpecs = typeof data.technical_specs === 'string'
        ? JSON.parse(data.technical_specs)
        : data.technical_specs;
      setFormData({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        technical_specs: JSON.stringify(technicalSpecs || {}, null, 2),
        products: data.products ? data.products.map(p => ({
          product_id: p.id,
          product_model_id: p.product_model_id || null,
          quantity: p.quantity || 1
        })) : []
      });
      if (data.image_url) setCurrentImage(data.image_url);
      if (data.gallery_images) setCurrentGallery(data.gallery_images);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load kit' });
    }
  };

  const handleAddProduct = (productId) => {
    const exists = formData.products.find(p => p.product_id === productId);
    if (!exists) {
      const product = allProducts.find((item) => item.id === productId);
      const defaultModel = product?.models?.find((model) => model.is_default) || product?.models?.[0];
      setFormData({
        ...formData,
        products: [...formData.products, { product_id: productId, product_model_id: defaultModel?.id || null, quantity: 1 }]
      });
    }
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.product_id !== productId)
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    setFormData({
      ...formData,
      products: formData.products.map(p =>
        p.product_id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
      )
    });
  };

  const handleModelChange = (productId, modelId) => {
    setFormData({
      ...formData,
      products: formData.products.map((product) => (
        product.product_id === productId ? { ...product, product_model_id: modelId ? parseInt(modelId) : null } : product
      )),
    });
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
      data.append('technical_specs', formData.technical_specs);
      data.append('products', JSON.stringify(formData.products));
      if (imageFile) data.append('image', imageFile);

      if (galleryFiles && galleryFiles.length > 0) {
        Array.from(galleryFiles).forEach((file) => {
          data.append('gallery_images', file);
        });
      }

      if (id) {
        await kitAPI.update(id, data);
        setMessage({ type: 'success', text: 'Kit updated successfully' });
        setTimeout(() => navigate('/admin/kits'), 1500);
      } else {
        await kitAPI.create(data);
        setMessage({ type: 'success', text: 'Kit created successfully' });
        setTimeout(() => navigate('/admin/kits'), 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const selectedProductIds = formData.products.map(p => p.product_id);
  const availableProducts = allProducts.filter(p => !selectedProductIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{id ? 'Edit Kit' : 'Create New Kit'}</h1>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Kit Name</label>
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
          <label className="label">Technical Specifications</label>
          <textarea
            rows="12"
            className="input-field w-full border p-2 rounded font-mono text-sm"
            value={formData.technical_specs}
            onChange={(e) => setFormData({ ...formData, technical_specs: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label mb-2 block">Main Kit Image</label>
            {currentImage && <img src={getImageUrl(currentImage)} alt="Current" className="h-20 w-20 object-cover rounded mb-2 border border-gray-200" />}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500"/>
          </div>

          <div>
            <label className="label mb-2 block">Gallery Images (Multiple)</label>
            {currentGallery && currentGallery.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {currentGallery.map((img) => (
                  <img key={img.id} src={getImageUrl(img.image_url)} alt="Gallery" className="h-20 w-20 object-cover rounded border border-gray-200" />
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="block w-full text-sm text-gray-500"/>
          </div>
        </div>

        {/* Products Selection */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Kit Products</h3>

          {/* Add Products */}
          <div className="mb-6">
            <label className="label mb-2">Add Products to Kit</label>
            <SearchableSelect
              disabled={productsLoading || availableProducts.length === 0}
              options={availableProducts}
              value=""
              onChange={(selectedValue) => {
                if (selectedValue) {
                  handleAddProduct(parseInt(selectedValue));
                }
              }}
              placeholder={
                productsLoading
                  ? 'Loading products...'
                  : availableProducts.length === 0
                  ? 'All products added'
                  : 'Search products to add'
              }
              emptyMessage="No matching products"
              getOptionLabel={(product) => product.name}
              getOptionDescription={(product) => product.category_name || ''}
            />
          </div>

          {/* Selected Products */}
          {formData.products.length > 0 ? (
            <div className="space-y-3">
              {formData.products.map((kitProduct) => {
                const product = allProducts.find(p => p.id === kitProduct.product_id);
                return (
                  <div key={kitProduct.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {product?.image_url && (
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="aspect-square w-12 shrink-0 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-sm text-gray-600">{product?.category_name}</p>
                      {product?.models?.length > 0 && (
                        <select
                          required
                          className="mt-2 w-full max-w-xs border bg-white p-1.5 text-sm"
                          value={kitProduct.product_model_id || ''}
                          onChange={(event) => handleModelChange(kitProduct.product_id, event.target.value)}
                        >
                          <option value="">Select exact model</option>
                          {product.models.map((model) => (
                            <option key={model.id} value={model.id}>{model.display_name || model.model_code} ({model.model_code})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        className="w-16 border rounded p-1 text-center"
                        value={kitProduct.quantity}
                        onChange={(e) => handleQuantityChange(kitProduct.product_id, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(kitProduct.product_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No products added yet</p>
          )}
        </div>

        <button type="submit" disabled={loading || formData.products.length === 0} className="btn btn-primary w-full flex items-center justify-center gap-2">
          <FiSave /> {loading ? 'Saving...' : (id ? 'Update Kit' : 'Create Kit')}
        </button>
      </form>
    </div>
  );
};

export default KitForm;
