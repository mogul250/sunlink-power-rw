import { useState, useEffect } from 'react';
import { FiBox, FiList, FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { productAPI, categoryAPI, testimonialAPI } from '../../services/adminApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    testimonials: 0,
    pendingTestimonials: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, testimonialsRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
        testimonialAPI.getAll()
      ]);

      const testimonialsData = testimonialsRes.data.data || [];
      const pendingTestimonials = testimonialsData.filter(t => !t.is_approved).length;

      setStats({
        products: productsRes.data.data ? productsRes.data.data.length : productsRes.data.count,
        categories: categoriesRes.data.data ? categoriesRes.data.data.length : categoriesRes.data.length,
        testimonials: testimonialsData.length,
        pendingTestimonials
      });
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: FiBox,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: FiList,
      color: 'bg-green-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingTestimonials,
      icon: FiTrendingUp,
      color: 'bg-blue-500',
      change: stats.pendingTestimonials > 0 ? 'Needs Review' : 'All Approved',
      changeType: stats.pendingTestimonials > 0 ? 'warning' : 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardStats} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, Admin
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' && (
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                )}
                {stat.changeType === 'negative' && (
                  <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiBox className="w-5 h-5 mr-2" />
            Add New Product
          </a>
          <a
            href="/admin/categories/new"
            className="flex items-center justify-center px-4 py-3 bg-secondary-teal text-white rounded-lg hover:bg-secondary-teal-dark transition-colors"
          >
            <FiList className="w-5 h-5 mr-2" />
            Add New Category
          </a>
          <a
            href="/admin/testimonials"
            className="flex items-center justify-center px-4 py-3 bg-accent-yellow text-gray-900 rounded-lg hover:bg-accent-yellow-dark transition-colors"
          >
            <FiUsers className="w-5 h-5 mr-2" />
            Review Testimonials
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Activity tracking coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
