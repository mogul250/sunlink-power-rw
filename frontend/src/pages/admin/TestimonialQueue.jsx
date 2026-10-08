import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiEye, FiTrash2 } from 'react-icons/fi';
import { testimonialAPI } from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUtils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const TestimonialQueue = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialAPI.getAll();
      setTestimonials(response.data.data || []);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Testimonials error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await testimonialAPI.approve(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, is_approved: true } : t
      ));
    } catch (err) {
      console.error('Error approving testimonial:', err);
      alert('Failed to approve testimonial');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await testimonialAPI.delete(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Failed to delete testimonial');
    }
  };

  const pendingTestimonials = testimonials.filter(t => !t.is_approved);
  const approvedTestimonials = testimonials.filter(t => t.is_approved);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTestimonials} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
        <div className="text-sm text-gray-500">
          {pendingTestimonials.length} pending reviews
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Reviews ({pendingTestimonials.length})
          </h2>
        </div>

        {pendingTestimonials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>All testimonials have been reviewed!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {testimonial.client_name}
                      </h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {testimonial.country}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{testimonial.content}</p>

                    {(testimonial.before_image_url || testimonial.after_image_url) && (
                      <div className="flex gap-4 mb-4">
                        {testimonial.before_image_url && (
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">Before</p>
                            <img
                              src={getImageUrl(testimonial.before_image_url)}
                              alt="Before"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        {testimonial.after_image_url && (
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">After</p>
                            <img
                              src={getImageUrl(testimonial.after_image_url)}
                              alt="After"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {testimonial.video_url && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Video Testimonial</p>
                        <a
                          href={testimonial.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark underline"
                        >
                          View Video
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(testimonial.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(testimonial.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Testimonials */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Approved Testimonials ({approvedTestimonials.length})
          </h2>
        </div>

        {approvedTestimonials.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No approved testimonials yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {approvedTestimonials.slice(0, 5).map((testimonial) => (
              <div key={testimonial.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {testimonial.client_name}
                      </h3>
                      <p className="text-sm text-gray-500">{testimonial.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleReject(testimonial.id)}
                      className="text-red-600 hover:text-blue-800 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-3 line-clamp-2">{testimonial.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialQueue;
