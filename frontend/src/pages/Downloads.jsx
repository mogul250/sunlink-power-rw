import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiDownload, FiFileText, FiFilter, FiPlay, FiSearch, FiVideo } from 'react-icons/fi';
import { resourceAPI } from '../services/api';
import { getImageUrl } from '../services/imageUtils';
import VideoModal from '../components/common/VideoModal';

const filterOptions = [
  { value: 'all', label: 'All Resources' },
  { value: 'standalone', label: 'General Resources' },
  { value: 'product', label: 'Product Documents' },
  { value: 'category', label: 'Category Documents' },
  { value: 'kit', label: 'Kit Documents' },
  { value: 'video', label: 'Videos Only' },
  { value: 'file', label: 'Files Only' }
];

const Downloads = () => {
  const [downloads, setDownloads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchDownloads();
  }, [activeFilter]);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const params = {};

      if (activeFilter === 'video' || activeFilter === 'file') {
        params.type = activeFilter;
      } else if (activeFilter !== 'all') {
        params.relation_type = activeFilter;
      }

      const response = await resourceAPI.getDownloads(params);
      setDownloads(response.data.data);
    } catch (error) {
      console.error('Failed to load downloads', error);
    } finally {
      setLoading(false);
    }
  };

  const matchesSearch = (resource, groupName = '') => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      resource.title,
      resource.description,
      resource.relation_name,
      groupName
    ].some((value) => value?.toLowerCase().includes(query));
  };

  const filteredData = useMemo(() => {
    if (!downloads) return null;

    return {
      standalone: downloads.standalone.filter((resource) => matchesSearch(resource)),
      products: downloads.products
        .map((group) => ({
          ...group,
          resources: group.resources.filter((resource) => matchesSearch(resource, group.name))
        }))
        .filter((group) => group.resources.length > 0),
      categories: downloads.categories
        .map((group) => ({
          ...group,
          resources: group.resources.filter((resource) => matchesSearch(resource, group.name))
        }))
        .filter((group) => group.resources.length > 0),
      kits: downloads.kits
        .map((group) => ({
          ...group,
          resources: group.resources.filter((resource) => matchesSearch(resource, group.name))
        }))
        .filter((group) => group.resources.length > 0),
      featuredVideos: downloads.featuredVideos.filter((resource) => matchesSearch(resource))
    };
  }, [downloads, searchTerm]);

  const renderResourceRow = (resource) => (
    <div key={resource.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {resource.resource_type === 'video' ? (
            <FiVideo className="h-4 w-4 text-primary" />
          ) : (
            <FiFileText className="h-4 w-4 text-primary" />
          )}
          <h3 className="font-semibold text-gray-900">{resource.title}</h3>
        </div>
        {resource.description && <p className="mt-2 text-sm leading-6 text-gray-600">{resource.description}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {resource.resource_type === 'video' ? (
          <button
            type="button"
            onClick={() => setSelectedVideo(resource)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <FiPlay className="h-4 w-4" />
            Watch Video
          </button>
        ) : (
          <a
            href={getImageUrl(resource.file_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
          >
            <FiDownload className="h-4 w-4" />
            Download File
          </a>
        )}
      </div>
    </div>
  );

  const renderGroupedSection = (title, description, groups) => {
    if (!groups.length) return null;

    return (
      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-gray-600">{description}</p>
        </div>

        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.resources.length} document{group.resources.length === 1 ? '' : 's'} available</p>
                </div>
              </div>
              <div className="space-y-3">
                {group.resources.map(renderResourceRow)}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const totalCount = filteredData
    ? filteredData.standalone.length +
      filteredData.products.reduce((sum, group) => sum + group.resources.length, 0) +
      filteredData.categories.reduce((sum, group) => sum + group.resources.length, 0) +
      filteredData.kits.reduce((sum, group) => sum + group.resources.length, 0)
    : 0;

  return (
    <>
      <Helmet>
        <title>Resources Library - Sunlink Power</title>
        <meta name="description" content="Access product catalogues, technical manuals, project documents, and video resources from Sunlink Power." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 md:py-14">
        <div className="container mx-auto max-w-[90rem] px-4">
          <div className="rounded-3xl bg-gradient-to-r from-[#094fa4] via-[#073b7a] to-[#061a33] px-6 py-10 text-white md:px-10">
            <p className="text-sm font-bold uppercase tracking-wide text-[#ffd166]">Resources Library</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">Technical Documents, Catalogues, and Media Resources</h1>
            <p className="mt-4 max-w-3xl text-white/80">
              Access curated product literature, technical manuals, project references, and video materials in one organized destination.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm md:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by document title, description, or related solution..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-primary"
                />
              </div>

              <div className="relative">
                <FiFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={activeFilter}
                  onChange={(event) => setActiveFilter(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-primary"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              {loading ? 'Loading resources...' : `${totalCount} resource${totalCount === 1 ? '' : 's'} available`}
            </p>
          </div>

          {!loading && filteredData && (
            <>
              {filteredData.standalone.length > 0 && (
                <section className="mt-10">
                  <div className="mb-5">
                    <h2 className="text-2xl font-bold text-gray-900">General Resources</h2>
                    <p className="mt-1 text-gray-600">Corporate literature, catalogues, brochures, and reference materials published for general access.</p>
                  </div>
                  <div className="space-y-3">
                    {filteredData.standalone.map(renderResourceRow)}
                  </div>
                </section>
              )}

              {renderGroupedSection('Product Documents', 'Manuals, videos, and supporting files organized by individual product.', filteredData.products)}
              {renderGroupedSection('Category Documents', 'Shared documents and media organized by product category.', filteredData.categories)}
              {renderGroupedSection('Kit Documents', 'Resources related to complete systems, kits, and integrated solutions.', filteredData.kits)}

              {totalCount === 0 && (
                <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                  <h2 className="text-xl font-bold text-gray-900">No matching resources found</h2>
                  <p className="mt-2 text-gray-600">Please try a different keyword or filter selection.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedVideo && (
        <VideoModal
          title={selectedVideo.title}
          url={selectedVideo.youtube_url}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default Downloads;
