import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { kitAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const KitList = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kitAPI.getAll();
      setKits(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load kits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this kit?')) return;

    try {
      await kitAPI.delete(id);
      setKits(kits.filter(kit => kit.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete kit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchKits} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kits Management</h1>
        <Link to="/admin/kits/new" className="btn btn-primary flex items-center gap-2">
          <FiPlus /> Create Kit
        </Link>
      </div>

      {kits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 mb-4">No kits found</p>
          <Link to="/admin/kits/new" className="btn btn-primary">
            Create First Kit
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kit Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : kits.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No kits found
                  </td>
                </tr>
              ) : (
                kits.map((kit) => (
                  <tr key={kit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        {kit.image_url && (
                          <img src={getImageUrl(kit.image_url)} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{kit.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{kit.slug}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {kit.products_count || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        kit.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                        kit.stock_status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {kit.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/kits/edit/${kit.id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(kit.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KitList;
