import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppLink } from '../../services/api';

const WhatsAppButton = ({ productName = null, className = '' }) => {
  const handleClick = () => {
    const link = productName
      ? generateWhatsAppLink(productName)
      : 'https://wa.me/+250781676857?text=Hi%20Sunlink%2C%20I%27m%20interested%20in%20your%20solar%20products';

    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center whatsapp-float group ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9 group-hover:scale-110 transition-transform" />

      {/* Tooltip */}
      <div className="absolute right-full mr-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </button>
  );
};

export default WhatsAppButton;
