import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiDownload, FiMessageCircle, FiPlay } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import { getImageUrl } from '../services/imageUtils';
import { getYoutubeInfo } from '../utils/media';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProductCard from '../components/browse/ProductCard';
import ProductSpecificationTable from '../components/product/ProductSpecificationTable';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState({ type: 'image', url: null });
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getById(id);
      const productData = response.data.data;
      setProduct(productData);
      setActiveMedia({ type: 'image', url: productData.image_url });

      // Fetch related products from the same category
      if (productData.category_name) {
        const slug = productData.category_slug || productData.category_name.toLowerCase().replace(/\s+/g, '-');
        try {
          const catResponse = await categoryAPI.getBySlug(slug);
          const catProducts = catResponse.data.data.products || [];
          setRelatedProducts(catProducts.filter(p => p.id !== productData.id).slice(0, 4));
        } catch (err) {
          console.error('Failed to fetch related products', err);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message={error} onRetry={fetchProduct} /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const videoInfo = getYoutubeInfo(product.video_url);

  return (
    <>
      <Helmet>
        <title>{product.name} - Sunlink Power</title>
        <meta name="description" content={product.description} />
        <meta property="og:image" content={getImageUrl(product.image)} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-[90rem] px-3 sm:px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/browse" className="hover:text-primary transition-colors">Products</Link>
            {product.category_name && (
              <>
                <span className="text-gray-400">/</span>
                <Link to={`/category/${product.category_slug || product.category_name.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-600 hover:text-primary transition-colors">
                  {product.category_name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{product.name}</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Image Gallery */}
              <div className="bg-white h-full p-3 pr-1.5 lg:p-4 lg:pr-2 flex flex-row gap-2 lg:col-span-3">
                {/* Thumbnail Gallery (Vertical Scroll on Left) */}
                {((product.gallery_images && product.gallery_images.length > 0) || videoInfo) && (
                  <div className="w-14 sm:w-16 lg:w-20 flex-shrink-0 relative">
                    <div className="absolute inset-0 overflow-y-auto scrollbar-thin flex flex-col gap-2 pr-1 pb-1">
                      {/* Main Image Thumbnail */}
                      <button 
                        onClick={() => setActiveMedia({ type: 'image', url: product.image_url })}
                        className={`aspect-square w-full rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${activeMedia.type === 'image' && activeMedia.url === product.image_url ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
                      >
                        <img src={getImageUrl(product.image_url)} alt="Main" className="w-full h-full object-contain bg-white p-1" />
                      </button>
                      {/* Gallery Thumbnails */}
                      {product.gallery_images?.map((img) => (
                        <button 
                          key={img.id}
                          onClick={() => setActiveMedia({ type: 'image', url: img.image_url })}
                          className={`aspect-square w-full rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${activeMedia.type === 'image' && activeMedia.url === img.image_url ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
                        >
                          <img src={getImageUrl(img.image_url)} alt="Gallery" className="w-full h-full object-contain bg-white p-1" />
                        </button>
                      ))}
                      {/* Video Thumbnail */}
                      {videoInfo && (
                        <button 
                          onClick={() => setActiveMedia({ type: 'video', url: videoInfo.embedUrl })}
                          className={`aspect-square w-full rounded-lg overflow-hidden border-2 transition-colors relative flex-shrink-0 ${activeMedia.type === 'video' ? 'border-primary' : 'border-transparent hover:border-gray-200'}`}
                        >
                          <img src={`https://img.youtube.com/vi/${videoInfo.id}/0.jpg`} alt="Video Thumbnail" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <FiPlay className="text-white w-6 h-6" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-1 bg-gray-50 border border-gray-100 overflow-hidden relative rounded-xl flex h-[320px] items-center justify-center sm:h-[440px] lg:h-[560px]">
                  {activeMedia.type === 'video' ? (
                    <iframe
                      src={activeMedia.url}
                      title={product.name}
                      className="w-full aspect-video rounded-lg shadow-sm"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img src={getImageUrl(activeMedia.url || product.image_url)} alt={product.name} className="h-full w-full object-contain p-2" />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 pl-1.5 lg:p-4 lg:pl-2 lg:col-span-2">
                <div className="mb-1 text-xs text-primary font-medium uppercase tracking-wider">{product.category_name}</div>
                <h1 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Key Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {product.wattage && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="text-[11px] text-gray-500 mb-0.5 uppercase tracking-wide">Power Output</div>
                      <div className="text-xs font-semibold text-gray-900">{product.wattage}</div>
                    </div>
                  )}
                  {product.warranty_info && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="text-[11px] text-gray-500 mb-0.5 uppercase tracking-wide">Warranty</div>
                      <div className="text-xs font-semibold text-gray-900">{product.warranty_info}</div>
                    </div>
                  )}
                  {product.battery_type && product.battery_type !== 'N/A' && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="text-[11px] text-gray-500 mb-0.5 uppercase tracking-wide">Battery Type</div>
                      <div className="text-xs font-semibold text-gray-900">{product.battery_type}</div>
                    </div>
                  )}
                  {product.durability_rating && (
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div className="text-[11px] text-gray-500 mb-0.5 uppercase tracking-wide">Durability</div>
                      <div className="text-xs font-semibold text-gray-900">{product.durability_rating}</div>
                    </div>
                  )}
                </div>

                {product.models?.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 text-[11px] font-semibold uppercase text-gray-500">Available models</div>
                    <div className="flex flex-wrap gap-2">
                      {product.models.map((model) => (
                        <span key={model.id} className="border border-[#094fa4]/25 bg-[#094fa4]/5 px-2.5 py-1 text-xs font-semibold text-[#073b7a]">
                          {model.nominal_power || model.display_name || model.model_code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-gray-600 text-sm mb-5 leading-relaxed">{product.description}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <a 
                    href={`https://wa.me/+8618617384878?text=Hi%20Sunlink,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap"
                  >
                    <FiMessageCircle /> Inquire on WhatsApp
                  </a>
                  {product.manual_pdf_url && (
                    <a 
                      href={getImageUrl(product.manual_pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap"
                    >
                      <FiDownload /> Download Manual
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            {product.models?.length > 0 && product.specifications?.length > 0 ? (
              <div className="border-t border-gray-100 bg-gray-50 p-2 sm:p-3 lg:p-4">
                <h2 className="mb-3 text-lg font-heading font-bold text-gray-900">Technical Specifications</h2>
                <ProductSpecificationTable models={product.models} specifications={product.specifications} />
              </div>
            ) : product.metadata && (
              <div className="border-t border-gray-100 p-3 lg:p-4 bg-gray-50">
                <h2 className="text-lg font-heading font-bold text-gray-900 mb-3">Technical Specifications</h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-3xl">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-bold text-gray-500 capitalize w-1/3">
                            {key.replace(/_/g, ' ')}
                          </td>
                          <td className="px-3 py-2 text-gray-900">
                            {Array.isArray(value) ? value.join(', ') : value.toString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* You Might Also Like Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 lg:mt-16">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
