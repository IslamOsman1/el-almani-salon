const CLOUDINARY_SEGMENT = '/upload/';

export function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes(CLOUDINARY_SEGMENT);
}

export function getOptimizedCloudinaryUrl(url, width = 800) {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }

  const transformations = `f_auto,q_auto,w_${width},c_fill`;
  return url.replace(CLOUDINARY_SEGMENT, `${CLOUDINARY_SEGMENT}${transformations}/`);
}

export function getResponsiveImageSet(url) {
  if (!url) {
    return {
      src: '/logo.png',
      srcSet: '',
      sizes: '100vw',
    };
  }

  if (!isCloudinaryUrl(url)) {
    return {
      src: url,
      srcSet: '',
      sizes: '100vw',
    };
  }

  const mobile400 = getOptimizedCloudinaryUrl(url, 400);
  const mobile600 = getOptimizedCloudinaryUrl(url, 600);
  const tablet800 = getOptimizedCloudinaryUrl(url, 800);
  const desktop1200 = getOptimizedCloudinaryUrl(url, 1200);

  return {
    src: tablet800,
    srcSet: `${mobile400} 400w, ${mobile600} 600w, ${tablet800} 800w, ${desktop1200} 1200w`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  };
}
