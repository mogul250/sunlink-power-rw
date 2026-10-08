import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { categoryAPI } from '../services/api';
import { getImageUrl } from '../services/imageUtils';
import ProductCard from '../components/browse/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const CategoryDetail = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getBySlug(slug);
      setCategory(response.data.data);
      setProducts(response.data.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load category');
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
          <ErrorMessage message={error} onRetry={fetchCategory} />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <Link to="/browse" className="btn btn-primary">
            Browse Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - Sunlink Power</title>
        <meta name="description" content={category.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <section 
          className="relative border-b border-gray-200 bg-white py-10 md:py-12"
          style={{
            backgroundImage: category.image_url ? `url(${getImageUrl(category.image_url)})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {category.image_url && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35" />
          )}
          <div className="container-custom relative">
            <nav className={`flex items-center gap-2 text-sm mb-6 ${category.image_url ? 'text-white/80' : 'text-gray-500'}`}>
              <Link to="/" className={`transition-colors ${category.image_url ? 'hover:text-white' : 'hover:text-primary'}`}>Home</Link>
              <span>/</span>
              <Link to="/browse" className={`transition-colors ${category.image_url ? 'hover:text-white' : 'hover:text-primary'}`}>Products</Link>
              <span>/</span>
              <span className={`font-medium ${category.image_url ? 'text-white' : 'text-gray-900'}`}>{category.name}</span>
            </nav>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className={`text-3xl md:text-5xl font-heading font-bold ${category.image_url ? 'text-white' : 'text-gray-950'}`}>
                  {category.name}
                </h1>
                {category.description && (
                  <p className={`mt-4 text-lg max-w-2xl line-clamp-2 ${category.image_url ? 'text-white/90' : 'text-gray-600'}`}>
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/browse"
                  className={`btn btn-sm ${category.image_url ? 'border border-white/25 bg-white/10 text-white hover:bg-white hover:text-gray-950' : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}`}
                >
                  All Categories
                </Link>
                <Link
                  to="/kits"
                  className="btn btn-primary btn-sm"
                >
                  Complete Kits
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-10 md:py-14">
          <div className="container-custom">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">
                  No products found in this category yet.
                </p>
                <Link to="/browse" className="btn btn-primary">
                  Browse Other Categories
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                  <h2 className="text-2xl font-heading font-bold text-gray-950">
                    Available Products
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {products.length} {products.length === 1 ? 'product' : 'products'} available
                  </p>
                  </div>
                  <a
                    href={`https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%20am%20interested%20in%20${encodeURIComponent(category.name)}%20products`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-fit"
                  >
                    Ask About This Category
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryDetail;
