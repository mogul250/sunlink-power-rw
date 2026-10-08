import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { getImageUrl } from '../../services/imageUtils';

export default function ProjectImage({ src, alt, className = '', loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null);
  return <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
    {src && failedSource !== src ? <img src={getImageUrl(src)} alt={alt} loading={loading} onError={() => setFailedSource(src)} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" /> : <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"><FiImage className="h-8 w-8 text-slate-400" /></div>}
  </div>;
}
