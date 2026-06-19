import { useEffect, useRef, useState } from 'react';
import { getOptimizedCloudinaryUrl } from '../utils/media';

export default function LazyVideo({
  src,
  className = '',
  controls = false,
  muted = true,
  playsInline = true,
  preload = 'none',
  poster,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#111] ${className}`}>
      {!visible ? <div className="absolute inset-0 animate-pulse bg-white/5" /> : null}
      {visible ? (
        <video
          src={getOptimizedCloudinaryUrl(src, 800) || src}
          poster={poster}
          className="h-full w-full object-cover"
          controls={controls}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
        />
      ) : null}
    </div>
  );
}
