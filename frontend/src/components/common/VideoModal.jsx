import { FiX } from 'react-icons/fi';
import { getYoutubeInfo } from '../../utils/media';

const VideoModal = ({ title, url, onClose }) => {
  const video = getYoutubeInfo(url);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6" onClick={onClose}>
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Video resource</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close video"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-black">
          <iframe
            src={video.embedUrl}
            title={title}
            className="aspect-video w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
