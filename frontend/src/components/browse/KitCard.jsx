import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getImageUrl } from '../../services/imageUtils';

const KitCard = ({ kit }) => {
  return (
    <Link
      to={`/kit/${kit.slug}`}
      className="group block overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(kit.image_url) || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600'}
          alt={kit.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Kit Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-heading font-bold text-white">
            {kit.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {kit.description || 'Explore this complete solar kit package'}
        </p>
        
        {(kit.products || kit.products_count !== undefined) && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
            {kit.products ? kit.products.length : kit.products_count} {(kit.products ? kit.products.length : kit.products_count) === 1 ? 'item' : 'items'} included
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            View Kit
          </span>
          <div className="w-9 h-9 bg-primary-50 flex items-center justify-center group-hover:bg-primary transition-all">
            <FiArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default KitCard;
