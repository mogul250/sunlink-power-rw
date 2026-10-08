import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: 'Solar Panels', path: '/category/solar-panels' },
      { name: 'Inverters', path: '/category/inverters' },
      { name: 'Batteries', path: '/category/batteries' },
      { name: 'Solar Kits', path: '/category/solar-kits' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Testimonials', path: '/#testimonials' },
      { name: 'Distributor Program', path: '/distributor' },
    ],
    support: [
      { name: 'Manuals Library', path: '/manuals' },
      { name: 'Installation Guide', path: '/installation' },
      { name: 'Warranty Info', path: '/warranty' },
      { name: 'FAQ', path: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img className="w-[180px] h-auto object-contain group-hover:scale-105 transition-transform bg-white rounded-lg px-2 py-1" src={logo} alt="Sunlink Power" />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Leading supplier of high-quality solar products across Rwanda.
              We provide reliable, affordable renewable energy solutions for homes and businesses.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="https://www.google.com/maps?q=-1.895731806755066,30.053661346435547&z=17&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white font-semibold hover:text-primary transition-colors flex-1"
                >
                  Karuruma, Gasabo, Kigali, Rwanda
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+250788894329" className="hover:text-primary transition-colors">
                  +250-788-894-329
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@sunlink-power.com" className="hover:text-primary transition-colors">
                  info@sunlink-power.com
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-white font-heading font-semibold text-lg mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest products and offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Sunlink Power. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
