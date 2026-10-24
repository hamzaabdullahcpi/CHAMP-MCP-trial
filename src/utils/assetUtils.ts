import defaultHeroImage from '../assets/hero-city.jpg';
import defaultArchitectureImage from '../assets/sweden-model-architecture.png';

export { defaultHeroImage, defaultArchitectureImage };

/**
 * Safely resolves asset paths for all deployment environments (including GitHub Pages subpaths).
 * Handles absolute URLs (http/https/data), relative URLs, leading slash paths, and base paths.
 */
export function resolveAssetUrl(url?: string | null, fallbackUrl: string = defaultHeroImage): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallbackUrl;
  }

  const trimmed = url.trim();

  // If already an absolute external URL or data/blob URL, return as-is
  if (/^(https?:|\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  // If referencing the bundled hero city image
  if (trimmed.includes('hero-city.jpg')) {
    return defaultHeroImage;
  }

  // If referencing the Sweden architecture diagram
  if (trimmed.includes('sweden-model-architecture')) {
    return defaultArchitectureImage;
  }

  // Otherwise, attach Vite's base URL properly
  const cleanPath = trimmed.replace(/^\/+/, '');
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBase}${cleanPath}`;
}
