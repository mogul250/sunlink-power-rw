import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getImageUrl } from '../../services/imageUtils';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(category.image_url) || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        
        {/* Category Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-heading font-bold text-white">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {category.description || 'Explore our range of high-quality products'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            View Products
          </span>
          <div className="w-9 h-9 bg-primary-50 flex items-center justify-center group-hover:bg-primary transition-all">
            <FiArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
