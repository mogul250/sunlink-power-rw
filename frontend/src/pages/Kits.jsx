import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import KitCard from '../components/browse/KitCard';
import { kitAPI } from '../services/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Kits = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const quickKits = [
    { name: 'Agri Solar', path: '/kit/agri-solar' },
    { name: 'Solar EV Station', path: '/kit/solar-ev-station' },
  ];

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await kitAPI.getAll();
      setKits(response.data.data || []);
    } catch (err) {
      setError('Failed to load kits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredKits = kits.filter((kit) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      kit.name.toLowerCase().includes(search) ||
      kit.description?.toLowerCase().includes(search);

    if (!matchesSearch) return false;
    if (activeFilter === 'featured') return Boolean(kit.is_featured);
    if (activeFilter === 'available') return kit.stock_status !== 'out_of_stock';

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading kits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white py-10 md:py-12">
        <div className="container-custom">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Complete Systems</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-heading font-bold text-gray-950">
                Solar kits
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Pre-configured systems with matched components for faster selection.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickKits.map((kit) => (
                <Link
                  key={kit.path}
                  to={kit.path}
                  className="border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary-200 hover:text-primary"
                >
                  {kit.name}
                </Link>
              ))}
              <a
                href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I'm%20interested%20in%20solar%20kits"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Custom Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-10 md:py-14">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search kits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 bg-white py-3 pl-12 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary'
              }`}
            >
              All Kits ({filteredKits.length})
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-4 py-2 font-semibold transition ${
                activeFilter === 'featured'
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`px-4 py-2 font-semibold transition ${
                activeFilter === 'available'
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary'
              }`}
            >
              Available
            </button>
          </div>
        </div>

        {error && (
          <div className="py-16 text-center">
            <div className="mb-4 text-red-600">{error}</div>
            <button onClick={fetchKits} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}

        <div id="kits" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredKits.length > 0 ? (
            filteredKits.map((kit) => <KitCard key={kit.id} kit={kit} />)
          ) : (
            <div className="col-span-full py-16 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">No kits found</h3>
              <p className="mx-auto mb-8 max-w-md text-gray-600">
                {searchTerm ? 'Try a different search term or clear the filters.' : 'No kits available right now.'}
              </p>
              <Link to="/browse" className="btn btn-primary">
                Browse Products Instead
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 border border-gray-200 bg-white p-6 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-950">Need a configured kit?</h2>
            <p className="mt-2 text-gray-600">
              Send your load requirements, usage hours, and destination country.
            </p>
          </div>
          <a
            href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%20need%20a%20configured%20solar%20kit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-5 md:mt-0"
          >
            Request Configuration
          </a>
        </div>
      </div>
    </div>
  );
};

export default Kits;
