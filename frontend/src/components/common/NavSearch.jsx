import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBox, FiGrid, FiSearch, FiTag, FiX } from 'react-icons/fi';
import { categoryAPI, kitAPI, productAPI } from '../../services/api';
import { getImageUrl } from '../../services/imageUtils';

const QUICK_LINKS = [
  {
    id: 'kit-agri-solar-placeholder',
    type: 'kit',
    name: 'Agri Solar',
    description: 'Solar kits for irrigation, farms, and remote agricultural power.',
    path: '/kit/agri-solar',
  },
  {
    id: 'kit-solar-ev-station-placeholder',
    type: 'kit',
    name: 'Solar EV Station',
    description: 'Solar charging station kit for EV and commercial charging needs.',
    path: '/kit/solar-ev-station',
  },
  {
    id: 'category-solar-lights-placeholder',
    type: 'category',
    name: 'Solar Lights',
    description: 'Outdoor, street, garden, and security solar lighting products.',
    path: '/category/solar-street-lights',
  },
];

const typeStyles = {
  product: {
    label: 'Product',
    icon: FiBox,
    className: 'bg-blue-50 text-blue-700',
  },
  category: {
    label: 'Category',
    icon: FiGrid,
    className: 'bg-emerald-50 text-emerald-700',
  },
  kit: {
    label: 'Kit',
    icon: FiTag,
    className: 'bg-amber-50 text-amber-700',
  },
};

const normalize = (value) => (value || '').toString().toLowerCase().trim();

const makeSearchText = (item) => normalize([
  item.name,
  item.description,
  item.category_name,
  item.wattage,
  item.warranty_info,
].filter(Boolean).join(' '));

const NavSearch = ({ onNavigate, isTransparent = false }) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(QUICK_LINKS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSearchItems = async () => {
    if (hasLoaded || isLoading) return;

    try {
      setIsLoading(true);
      const [productsResponse, categoriesResponse, kitsResponse] = await Promise.all([
        productAPI.getAll({ limit: 100 }),
        categoryAPI.getAll(),
        kitAPI.getAll({ limit: 100 }),
      ]);

      const products = (productsResponse.data.data || []).map((product) => ({
        id: `product-${product.id}`,
        type: 'product',
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        category_name: product.category_name,
        wattage: product.wattage,
        warranty_info: product.warranty_info,
        path: `/product/${product.id}`,
      }));

      const categories = (categoriesResponse.data.data || []).map((category) => ({
        id: `category-${category.id}`,
        type: 'category',
        name: category.name,
        description: category.description,
        image_url: category.image_url,
        path: `/category/${category.slug || category.id}`,
      }));

      const kits = (kitsResponse.data.data || []).map((kit) => ({
        id: `kit-${kit.id}`,
        type: 'kit',
        name: kit.name,
        description: kit.description,
        image_url: kit.image_url,
        products_count: kit.products_count,
        path: `/kit/${kit.slug || kit.id}`,
      }));

      const realItemKeys = new Set(
        [...products, ...categories, ...kits].map((item) => normalize(`${item.type}:${item.name}`))
      );
      const quickFallbacks = QUICK_LINKS.filter(
        (item) => !realItemKeys.has(normalize(`${item.type}:${item.name}`))
      );

      setItems([...quickFallbacks, ...products, ...categories, ...kits]);
      setHasLoaded(true);
    } catch (error) {
      setItems(QUICK_LINKS);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const recommendations = useMemo(() => {
    const searchTerm = normalize(query);

    if (!searchTerm) {
      return QUICK_LINKS;
    }

    return items
      .filter((item) => makeSearchText(item).includes(searchTerm))
      .map((item) => {
        const name = normalize(item.name);
        const description = normalize(item.description);
        let score = 0;

        if (name === searchTerm) score += 80;
        if (name.startsWith(searchTerm)) score += 50;
        if (name.includes(searchTerm)) score += 30;
        if (description.includes(searchTerm)) score += 10;
        if (item.type === 'product') score += 3;
        if (item.type === 'kit') score += 2;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const openSearch = () => {
    setIsOpen(true);
    loadSearchItems();
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    onNavigate?.();
  };

  const openResult = (item) => {
    navigate(item.path);
    closeSearch();
  };

  const handleKeyDown = (event) => {
    if (!isOpen) return;
    if (recommendations.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, recommendations.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === 'Enter' && recommendations[activeIndex]) {
      event.preventDefault();
      openResult(recommendations[activeIndex]);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex justify-end">
      {!isOpen && (
        <button
          type="button"
          onClick={openSearch}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-100 ${
            isTransparent
              ? 'border-white/25 bg-transparent text-white backdrop-blur-[2px] hover:border-white/60 hover:bg-white/10'
              : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary'
          }`}
          aria-label="Open search"
        >
          <FiSearch className="h-5 w-5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 top-0 z-50 w-[min(calc(100vw-2rem),28rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              type="search"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls="nav-search-results"
              aria-activedescendant={recommendations[activeIndex]?.id}
              placeholder="Search products, kits, categories"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-10 text-sm text-gray-900 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close search"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Clear search
            </button>
          )}

          <div
            id="nav-search-results"
            className="mt-2 max-h-[70vh] overflow-y-auto"
          >
            <div className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {query ? 'Recommendations' : 'Quick links'}
            </div>

            {isLoading && (
              <div className="px-3 py-4 text-sm text-gray-500">Loading recommendations...</div>
            )}

            {!isLoading && recommendations.length === 0 && (
              <div className="px-3 py-5 text-sm text-gray-500">
                No matches found. Try searching for panels, batteries, lights, or solar kits.
              </div>
            )}

            {!isLoading && recommendations.map((item, index) => {
              const style = typeStyles[item.type];
              const Icon = style.icon;

              return (
                <Link
                  key={item.id}
                  id={item.id}
                  to={item.path}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={closeSearch}
                  className={`flex gap-3 rounded-lg p-3 transition ${
                    index === activeIndex ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="aspect-square w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.image_url ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.className}`}>
                        {style.label}
                      </span>
                      {item.products_count !== undefined && (
                        <span className="text-[11px] text-gray-400">
                          {item.products_count} products
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavSearch;
