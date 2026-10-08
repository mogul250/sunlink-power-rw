import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { categoryAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { getImageUrl } from '../../services/imageUtils';

const HOME_CATEGORY_PRIORITY = [
  'solar-panels',
  'hybrid-inverters',
  'string-inverters',
  'off-grid-inverters',
  'microinverters',
  'batteries',
  'energy-storage-systems',
  'solar-water-pumps',
  'solar-street-lights',
  'solar-flood-lights',
  'ev-chargers',
  'charge-controllers',
  'solar-fans',
];

const LOW_PRIORITY_CATEGORY_KEYWORDS = [
  'accessor',
  'combiner',
  'management',
  'strip',
  'batten',
  'garden',
];

const getCategoryPriority = (category) => {
  const slug = category.slug?.toLowerCase() || '';
  const name = category.name?.toLowerCase() || '';
  const preferredIndex = HOME_CATEGORY_PRIORITY.indexOf(slug);

  if (preferredIndex !== -1) return preferredIndex;
  if (LOW_PRIORITY_CATEGORY_KEYWORDS.some((keyword) => slug.includes(keyword) || name.includes(keyword))) {
    return HOME_CATEGORY_PRIORITY.length + 100;
  }

  return HOME_CATEGORY_PRIORITY.length + 20;
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLoopIndex, setActiveLoopIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const carouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const carouselCategories = useMemo(() => (
    categories.length
      ? Array.from({ length: 5 }, () => categories).flat()
      : []
  ), [categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryAPI.getAll();
      const homeCategories = [...(response.data.data || [])]
        .sort((first, second) => {
          const priorityDifference = getCategoryPriority(first) - getCategoryPriority(second);
          if (priorityDifference !== 0) return priorityDifference;
          return (first.name || '').localeCompare(second.name || '');
        })
        .slice(0, 8);

      setCategories(homeCategories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const getCardStep = useCallback(() => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector('[data-category-card="true"]');
    if (!carousel || !firstCard) return 320;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap || '20');
    return cardWidth + gap;
  }, []);

  const getSegmentWidth = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || categories.length === 0) return 0;

    return getCardStep() * categories.length;
  }, [categories.length, getCardStep]);

  const normalizeInfiniteScroll = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || categories.length === 0) return;

    const segmentWidth = getSegmentWidth();
    if (!segmentWidth) return;

    if (carousel.scrollLeft < segmentWidth * 1.15) {
      carousel.scrollLeft += segmentWidth * 2;
    } else if (carousel.scrollLeft > segmentWidth * 3.15) {
      carousel.scrollLeft -= segmentWidth * 2;
    }
  }, [categories.length, getSegmentWidth]);

  const updateActiveCategory = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || categories.length === 0) return;

    const cardStep = getCardStep();
    const centerPosition = carousel.scrollLeft + carousel.clientWidth / 2;
    const centeredLoopIndex = Math.round((centerPosition - cardStep / 2) / cardStep);
    setActiveLoopIndex(Math.max(0, Math.min(centeredLoopIndex, carouselCategories.length - 1)));
  }, [carouselCategories.length, categories.length, getCardStep]);

  const handleCarouselScroll = useCallback(() => {
    if (!hasUserInteracted) {
      normalizeInfiniteScroll();
    }
    updateActiveCategory();
  }, [hasUserInteracted, normalizeInfiniteScroll, updateActiveCategory]);

  const stopCarouselMotion = useCallback(() => {
    const carousel = carouselRef.current;
    setHasUserInteracted(true);

    if (!carousel) return;
    carousel.style.scrollBehavior = 'auto';
    carousel.scrollLeft = carousel.scrollLeft;
  }, []);

  const scrollCategories = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setHasUserInteracted(true);
    carousel.style.scrollBehavior = 'smooth';

    const cardStep = getCardStep();
    const nextLoopIndex = activeLoopIndex + direction;
    const targetScrollLeft = nextLoopIndex * cardStep + cardStep / 2 - carousel.clientWidth / 2;

    carousel.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
    setActiveLoopIndex(nextLoopIndex);
  };

  const startDragging = (event) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    stopCarouselMotion();
    isDraggingRef.current = true;
    dragStartXRef.current = event.pageX;
    dragStartScrollRef.current = carousel.scrollLeft;
    carousel.classList.add('cursor-grabbing');
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    carouselRef.current?.classList.remove('cursor-grabbing');
  };

  const dragCarousel = (event) => {
    const carousel = carouselRef.current;
    if (!carousel || !isDraggingRef.current) return;

    event.preventDefault();
    carousel.scrollLeft = dragStartScrollRef.current - (event.pageX - dragStartXRef.current);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || categories.length === 0 || hasUserInteracted) return;

    requestAnimationFrame(() => {
      carousel.scrollLeft = getSegmentWidth() * 2;
      updateActiveCategory();
    });
  }, [categories.length, getSegmentWidth, hasUserInteracted, updateActiveCategory]);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <LoadingSpinner size="lg" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <ErrorMessage message={error} onRetry={fetchCategories} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="browse-categories"
      className="relative z-10 scroll-mt-16 bg-gray-50 pb-14 pt-8 md:pb-20 md:pt-10 xl:scroll-mt-20"
      onPointerDown={stopCarouselMotion}
    >
      <div className="container-custom">
        <div className="mb-8 border border-gray-200 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-[#094fa4]">Product Families</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 md:text-4xl">
              Browse by category
            </h2>
            <p className="mt-4 max-w-2xl text-gray-600">
              Start with the component family you need, then compare available products.
            </p>
          </div>
          <Link to="/browse" className="mt-6 inline-flex w-fit items-center bg-[#094fa4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#073b7a]">
            All Categories
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollCategories(-1)}
            className="absolute left-0 top-1/2 z-50 flex h-11 w-11 -translate-x-2 -translate-y-1/2 items-center justify-center bg-white text-gray-900 shadow-md transition hover:bg-[#094fa4] hover:text-white md:-translate-x-5"
            aria-label="Show previous categories"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>

          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            onMouseDown={startDragging}
            onClick={stopCarouselMotion}
            onTouchStart={stopCarouselMotion}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            onMouseMove={dragCarousel}
            className="flex cursor-grab select-none gap-5 overflow-x-auto scroll-smooth px-7 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-10"
          >
            {carouselCategories.map((category, index) => {
              const distance = Math.abs(index - activeLoopIndex);
              const scale = distance === 0 ? 'scale-[1.14]' : distance === 1 ? 'scale-[1.06]' : 'scale-100';
              const zIndex = distance === 0 ? 'z-20' : distance === 1 ? 'z-10' : 'z-0';

              return (
                <Link
                  key={`${category.id}-${index}`}
                  data-category-card="true"
                  to={`/category/${category.slug}`}
                  className={`group relative w-[240px] shrink-0 overflow-hidden border border-gray-200 bg-white shadow-sm transition duration-300 ${scale} ${zIndex} hover:border-[#094fa4]/30 md:w-[280px]`}
                  draggable="false"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100 md:h-52">
                    <img
                      src={getImageUrl(category.image_url) || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600'}
                      alt={category.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-xl font-bold text-white">{category.name}</h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                      {category.description || 'Explore our range of high-quality products'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">View Products</span>
                      <div className="flex h-9 w-9 items-center justify-center bg-[#094fa4]/10 transition-all group-hover:bg-[#094fa4]">
                        <FiArrowRight className="h-4 w-4 text-[#094fa4] transition-colors group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollCategories(1)}
            className="absolute right-0 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 translate-x-2 items-center justify-center bg-white text-gray-900 shadow-md transition hover:bg-[#094fa4] hover:text-white md:translate-x-5"
            aria-label="Show next categories"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
