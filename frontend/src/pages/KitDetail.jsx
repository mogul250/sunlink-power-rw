import { Fragment, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getImageUrl } from '../services/imageUtils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import WhatsAppButton from '../components/common/WhatsAppButton';

const SpecificationRows = ({ values }) => Object.entries(values).map(([key, value]) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <Fragment key={key}>
        <tr className="bg-gray-50">
          <th colSpan="2" className="px-3 py-2 text-left text-xs font-bold uppercase text-gray-700">
            {key.replace(/_/g, ' ')}
          </th>
        </tr>
        <SpecificationRows values={value} />
      </Fragment>
    );
  }

  return (
    <tr key={key} className="border-t border-gray-100">
      <td className="w-2/5 border-r border-gray-100 px-3 py-2 font-medium capitalize text-gray-500">
        {key.replace(/_/g, ' ')}
      </td>
      <td className="px-3 py-2 text-gray-900">{Array.isArray(value) ? value.join(', ') : String(value)}</td>
    </tr>
  );
});

const KitDetail = () => {
  const { slug } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState({ type: 'image', url: null });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchKit();
  }, [slug]);

  const fetchKit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/kits/${slug}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setKit(data.data);
      setActiveMedia({ type: 'image', url: data.data.image_url });
    } catch (err) {
      setError(err.message || 'Failed to load kit');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container-custom">
          <ErrorMessage message={error} onRetry={fetchKit} />
        </div>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kit Not Found</h2>
          <Link to="/browse" className="btn btn-primary">
            Browse Kits
          </Link>
        </div>
      </div>
    );
  }

  const technicalSpecs = typeof kit.technical_specs === 'string'
    ? JSON.parse(kit.technical_specs)
    : kit.technical_specs;

  return (
    <>
      <Helmet>
        <title>{kit.name} - Sunlink Power</title>
        <meta name="description" content={kit.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/kits" className="hover:text-primary transition-colors">Kits</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{kit.name}</span>
          </nav>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">{kit.name}</h1>
            <span className={`inline-block px-2.5 py-0.5 text-xs font-medium border ${
              kit.stock_status === 'in_stock' ? 'bg-green-50 text-green-700 border-green-200' :
              kit.stock_status === 'out_of_stock' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}>
              {kit.stock_status === 'in_stock' ? 'In Stock' :
               kit.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Pre-order'}
            </span>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-12">
          {/* Image Gallery (Left Side) */}
          <div className="lg:col-span-3 flex flex-row gap-2 h-[350px] md:h-[450px]">
            {/* Thumbnail Gallery (Vertical Scroll on Left) */}
            {((kit.gallery_images && kit.gallery_images.length > 0)) && (
              <div className="w-14 sm:w-16 lg:w-20 flex-shrink-0 relative">
                <div className="absolute inset-0 overflow-y-auto scrollbar-thin flex flex-col gap-2 pr-1 pb-1">
                  <button
                    onClick={() => setActiveMedia({ type: 'image', url: kit.image_url })}
                    className={`aspect-square w-full border-2 transition-colors flex-shrink-0 ${activeMedia.type === 'image' && activeMedia.url === kit.image_url ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={getImageUrl(kit.image_url)} alt="Main" className="w-full h-full object-cover" />
                  </button>
                  {kit.gallery_images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveMedia({ type: 'image', url: img.image_url })}
                      className={`aspect-square w-full border-2 transition-colors flex-shrink-0 ${activeMedia.type === 'image' && activeMedia.url === img.image_url ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={getImageUrl(img.image_url)} alt="Gallery" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 bg-white border border-gray-200 p-2 flex items-center justify-center relative min-h-[300px]">
              <img src={getImageUrl(activeMedia.url || kit.image_url)} alt={kit.name} className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Kit Header Info (Right Side) */}
          <div className="lg:col-span-2 flex flex-col">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{kit.description}</p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/+8618617384878?text=Hi%20Sunlink,%20I'm%20interested%20in%20the%20${encodeURIComponent(kit.name)}%20kit`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-4 h-4" /> WhatsApp Inquiry
              </a>
              <button className="btn btn-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 flex items-center justify-center gap-2">
                <FiMessageCircle className="w-4 h-4" /> Request Quote
              </button>
            </div>
          </div>
        </div>

          {/* Included Products */}
          {kit.products && kit.products.length > 0 && (
            <div className="mb-12 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Included Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {kit.products.map((product, index) => (
                  <Link
                    key={index}
                    to={`/product/${product.id}`}
                    className="group block bg-white border border-gray-200 p-3 hover:border-primary transition-colors flex flex-col h-full"
                  >
                    <div className="aspect-square bg-gray-50 mb-3 p-2 flex items-center justify-center">
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-tight flex-grow">
                      {product.name}
                    </h3>
                    {product.model_name && (
                      <p className="mt-2 text-xs font-semibold text-[#094fa4]">
                        {product.model_name}{product.model_code ? ` - ${product.model_code}` : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 font-medium">Qty: {product.quantity || 1}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {technicalSpecs && Object.keys(technicalSpecs).length > 0 && (
            <div className="mb-12 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Technical Specifications</h2>
              <div className="overflow-x-auto border border-gray-200 bg-white">
                <table className="w-full min-w-[560px] text-xs sm:text-sm">
                  <tbody>
                    <SpecificationRows values={technicalSpecs} />
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Specifications Tables */}
          {kit.products && kit.products.some(p => p.metadata) && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Component Specifications</h2>
              <div className="space-y-6">
                {kit.products.filter(p => p.metadata).map((product, index) => (
                  <div key={index} className="border border-gray-200 bg-white">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{product.name}</h3>
                      <span className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                        Qty: {product.quantity || 1}
                      </span>
                    </div>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium text-gray-500 capitalize w-1/3 sm:w-1/4 border-r border-gray-100">
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KitDetail;
