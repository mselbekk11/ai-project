import React from 'react';

/**
 * Creates a proxy URL for Astria images to handle CORS and authentication
 */
export function getProxiedImageUrl(originalUrl: string): string {
  // If it's not an Astria URL, return as-is
  if (!originalUrl.startsWith('https://mp.astria.ai/') && 
      !originalUrl.startsWith('https://api.astria.ai/')) {
    return originalUrl;
  }

  // Create proxy URL through our API
  const proxyUrl = new URL('/api/proxy-image', window.location.origin);
  proxyUrl.searchParams.set('url', originalUrl);
  
  return proxyUrl.toString();
}

/**
 * Hook to handle image loading errors with fallback
 */
export function useImageWithFallback(originalUrl: string) {
  const [imageUrl, setImageUrl] = React.useState(originalUrl);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError && (originalUrl.startsWith('https://mp.astria.ai/') || 
                      originalUrl.startsWith('https://api.astria.ai/'))) {
      // Try proxy URL on first error
      setImageUrl(getProxiedImageUrl(originalUrl));
      setHasError(true);
    }
  };

  return { imageUrl, handleError, hasError };
}