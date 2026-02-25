/**
 * Get the full URL for an image, handling both local uploads and external URLs
 */
export function getImageUrl(url: string | undefined | null, fallback = '/images/placeholder.svg'): string {
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/images')) return url;

  // For local uploads, prefix with the API server URL
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return cleanUrl;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
