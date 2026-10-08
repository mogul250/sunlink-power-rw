import { Link } from 'react-router-dom';
import { FiEye, FiZap, FiAward } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppLink } from '../../services/api';
import { getImageUrl } from '../../services/imageUtils';

const ProductCard = ({ product }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const link = generateWhatsAppLink(product.name);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(product.image_url) || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category_name && (
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            {product.category_name}
          </span>
        )}

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-heading font-bold text-gray-900 mt-2 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          {product.wattage && (
            <div className="flex items-center gap-1">
              <FiZap className="w-4 h-4 text-primary" />
              <span>{product.wattage}</span>
            </div>
          )}
          {product.warranty_info && (
            <div className="flex items-center gap-1">
              <FiAward className="w-4 h-4 text-secondary" />
              <span className="text-xs">{product.warranty_info.split(',')[0]}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 w-full">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-outline py-1.5 px-1 text-xs flex items-center justify-center gap-1 w-full h-full"
          >
            <FiEye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Details</span>
          </Link>
          <button
            onClick={handleWhatsAppClick}
            className="btn bg-green-500 hover:bg-green-600 text-white py-1.5 px-1 text-xs flex items-center justify-center gap-1 w-full h-full"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
