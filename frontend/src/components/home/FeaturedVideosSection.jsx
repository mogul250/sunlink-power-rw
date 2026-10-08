import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { resourceAPI } from '../../services/api';
import { getYoutubeInfo } from '../../utils/media';

const getAutoplayEmbedUrl = (url) => {
  const info = getYoutubeInfo(url);
  if (!info) return null;

  return `${info.embedUrl}?autoplay=1&mute=1&rel=0&playsinline=1`;
};

const FeaturedVideosSection = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        const response = await resourceAPI.getFeaturedVideos();
        const videos = (response.data.data || []).filter((item) => item.resource_type === 'video');
        setFeaturedVideos(videos);
      } catch (error) {
        console.error('Failed to load featured videos', error);
      }
    };

    fetchFeaturedVideos();
  }, []);

  const activeVideo = featuredVideos[activeIndex] || null;
  const activeVideoInfo = useMemo(() => getYoutubeInfo(activeVideo?.youtube_url), [activeVideo]);
  const autoplayUrl = useMemo(() => getAutoplayEmbedUrl(activeVideo?.youtube_url), [activeVideo]);

  const showPreviousVideo = () => {
    setActiveIndex((current) => (
      current === 0 ? featuredVideos.length - 1 : current - 1
    ));
  };

  const showNextVideo = () => {
    setActiveIndex((current) => (
      current === featuredVideos.length - 1 ? 0 : current + 1
    ));
  };

  if (!activeVideo || !activeVideoInfo || !autoplayUrl) return null;

  return (
    <section id="featured-videos" className="bg-white py-6 md:py-8">
      <div className="container-custom">
        <div className="relative mx-auto max-w-4xl">
          <button
            type="button"
            onClick={showPreviousVideo}
            className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-[#094fa4] hover:text-white md:-left-4 md:h-10 md:w-10"
            aria-label="Show previous featured video"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>

          <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="aspect-[16/8.5] bg-black md:aspect-[16/8]">
              <iframe
                key={activeVideo.id}
                src={autoplayUrl}
                title={activeVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <button
            type="button"
            onClick={showNextVideo}
            className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-[#094fa4] hover:text-white md:-right-4 md:h-10 md:w-10"
            aria-label="Show next featured video"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex justify-end">
          <Link to="/downloads" className="inline-flex items-center text-sm font-bold text-[#094fa4]">
            Browse all resources
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideosSection;
