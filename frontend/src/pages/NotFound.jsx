import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Sunlink Power</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-green opacity-20">404</h1>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              <FiHome className="text-xl" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline inline-flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="text-xl" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">You might be interested in:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/browse" className="text-primary-green hover:text-primary-green/80 font-medium">
                Browse Products
              </Link>
              <Link to="/contact" className="text-primary-green hover:text-primary-green/80 font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
