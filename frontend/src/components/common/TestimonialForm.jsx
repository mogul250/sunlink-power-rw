import { useState } from 'react';
import { FiStar, FiUpload, FiSend } from 'react-icons/fi';
import { testimonialAPI } from '../../services/api';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    country: '',
    content: '',
    rating: 5,
    video_url: ''
  });
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (beforeImage) data.append('before_image', beforeImage);
      if (afterImage) data.append('after_image', afterImage);

      await testimonialAPI.create(data);
      
      setMessage({ type: 'success', text: 'Thank you! Your review has been submitted for approval.' });
      setFormData({ client_name: '', country: '', content: '', rating: 5, video_url: '' });
      setBeforeImage(null);
      setAfterImage(null);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit review. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">Share Your Experience</h3>
      
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              required
              className="input-field w-full border p-2 rounded"
              value={formData.client_name}
              onChange={e => setFormData({...formData, client_name: e.target.value})}
            />
          </div>
          <div>
            <label className="label">Country</label>
            <input
              type="text"
              required
              className="input-field w-full border p-2 rounded"
              value={formData.country}
              onChange={e => setFormData({...formData, country: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="label mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({...formData, rating: star})}
                className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <FiStar className="fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Your Review</label>
          <textarea
            required
            rows="4"
            className="input-field w-full border p-2 rounded"
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label mb-2 block">Before Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setBeforeImage(e.target.files[0])} className="text-sm text-gray-500"/>
          </div>
          <div>
            <label className="label mb-2 block">After Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setAfterImage(e.target.files[0])} className="text-sm text-gray-500"/>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <FiSend />
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm;