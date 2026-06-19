import { useMemo, useState } from 'react';
import { getResponsiveImageSet } from '../utils/media';

export default function OptimizedImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  eager = false,
  highPriority = false,
  sizes,
}) {
  const [loaded, setLoaded] = useState(false);
  const responsive = useMemo(() => getResponsiveImageSet(src), [src]);

  return (
    <div className={`relative overflow-hidden bg-[#111] ${className}`}>
      <div
        className={`absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.04),rgba(214,168,58,0.12),rgba(255,255,255,0.04))] transition duration-500 ${
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={responsive.src}
        srcSet={responsive.srcSet || undefined}
        sizes={sizes || responsive.sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={highPriority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`transition duration-500 ${loaded ? 'scale-100 blur-0' : 'scale-[1.02] blur-xl'} ${imgClassName}`}
      />
    </div>
  );
}
