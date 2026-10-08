import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import CategoryCard from '../components/browse/CategoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Browse = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Browse Products - Sunlink Power</title>
        <meta
          name="description"
          content="Browse our complete range of solar products including panels, inverters, batteries, and complete solar kits for homes and businesses."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Catalog Header */}
        <section className="border-b border-gray-200 bg-white py-10 md:py-12">
          <div className="container-custom">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Product Catalog</p>
                <h1 className="mt-3 text-3xl md:text-5xl font-heading font-bold text-gray-950">
                  Browse solar categories
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  Go directly to the product family you need.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/kits" className="btn btn-primary btn-sm">View Complete Kits</Link>
                <a
                  href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%20need%20help%20choosing%20solar%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 btn-sm"
                >
                  Ask for Help
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-10 md:py-14">
          <div className="container-custom">
            {loading ? (
              <LoadingSpinner size="lg" className="py-20" />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchCategories} />
            ) : categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No categories found</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-950">
                      Product Categories
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {categories.length} categories available
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-primary-200 hover:text-primary"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-950 py-12">
          <div className="container-custom flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                Not sure which category fits?
              </h2>
              <p className="mt-3 text-white/70">
                Send your load, budget, and destination country. We will guide you to the right products.
              </p>
            </div>
            <a
              href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%20need%20help%20choosing%20the%20right%20solar%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-gray-950 hover:bg-gray-100"
            >
              Chat with Expert
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Browse;
