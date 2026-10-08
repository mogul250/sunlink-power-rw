import { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const sliderModules = import.meta.glob('../../assets/sliders/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const sliderImages = useMemo(
    () => Object.entries(sliderModules)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([, src]) => src),
    []
  );

  useEffect(() => {
    if (sliderImages.length <= 1 || hasUserInteracted) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % sliderImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [hasUserInteracted, sliderImages.length]);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 8);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showPreviousSlide = () => {
    setHasUserInteracted(true);
    setCurrentSlide((current) => {
      if (sliderImages.length <= 1) return current;
      return (current - 1 + sliderImages.length) % sliderImages.length;
    });
  };

  const showNextSlide = () => {
    setHasUserInteracted(true);
    setCurrentSlide((current) => {
      if (sliderImages.length <= 1) return current;
      return (current + 1) % sliderImages.length;
    });
  };

  const showSelectedSlide = (index) => {
    setHasUserInteracted(true);
    setCurrentSlide(index);
  };

  const scrollToFeaturedVideos = () => {
    document.getElementById('featured-videos')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="relative h-[clamp(260px,36vw,440px)] overflow-hidden bg-white text-white">
      <div className="absolute inset-0">
        {sliderImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {sliderImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPreviousSlide}
            className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:left-6 md:h-12 md:w-12"
            aria-label="Show previous slide"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={showNextSlide}
            className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 md:right-6 md:h-12 md:w-12"
            aria-label="Show next slide"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 right-6 z-30 hidden items-center gap-2 md:flex">
            {sliderImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => showSelectedSlide(index)}
                className={`h-2.5 transition-all ${
                  index === currentSlide ? 'w-8 bg-primary-400' : 'w-2.5 bg-white/45 hover:bg-white'
                }`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {isAtTop && (
        <button
          type="button"
          onClick={scrollToFeaturedVideos}
          className="absolute bottom-4 left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#094fa4] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent md:h-12 md:w-12"
          aria-label="Scroll to featured videos"
        >
          <FiChevronDown className="h-6 w-6 animate-bounce" />
        </button>
      )}
    </section>
  );
};

export default Hero;
