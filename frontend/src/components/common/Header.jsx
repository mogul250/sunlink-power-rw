import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import NavSearch from './NavSearch';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/browse' },
    { name: 'Kits', path: '/kits' },
    { name: 'Agri Solar', path: '/kit/agri-solar' },
    { name: 'Solar EV Station', path: '/kit/solar-charging-kit-482kwh-250kw-2x120kw-ev' },
    { name: 'Solar Lights', path: '/category/solar-street-lights' },
    { name: 'Downloads', path: '/resources' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const usesTransparentHeader = location.pathname === '/about';
  const isTransparent = usesTransparentHeader && !isScrolled && !isMenuOpen;

  return (
    <header
      className={`${usesTransparentHeader ? 'fixed inset-x-0' : 'sticky'} top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-black/20 text-white backdrop-blur-[2px] border-b border-white/10'
          : 'bg-white text-gray-900'
      }`}
    >
      <nav className="max-w-[86rem] mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between gap-4 h-16 xl:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              className={`w-[150px] sm:w-[170px] 2xl:w-[180px] h-auto object-contain group-hover:scale-105 transition-transform ${
                isTransparent ? 'drop-shadow-md' : ''
              }`}
              src={logo}
              alt="Sunlink Power"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex flex-1 items-center justify-center gap-5 2xl:gap-8 px-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 2xl:px-3 py-2 text-sm 2xl:text-base font-medium tracking-normal transition-colors relative group whitespace-nowrap ${
                  isTransparent
                    ? 'text-white hover:text-white'
                    : isActive(item.path)
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 transform origin-left transition-transform ${
                    isTransparent ? 'bg-white' : 'bg-primary'
                  } ${
                    isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <NavSearch isTransparent={isTransparent} />
            <a
              href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%27m%20interested%20in%20your%20solar%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm whitespace-nowrap"
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`xl:hidden p-2 rounded-lg transition-colors ${
              isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-gray-200 bg-white text-gray-900 animate-slide-down">
            <div className="mb-4 px-1">
              <NavSearch onNavigate={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://wa.me/+8618617384878?text=Hi%20Sunlink%2C%20I%27m%20interested%20in%20your%20solar%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
