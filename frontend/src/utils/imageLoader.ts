/**
 * Image Loader Utility
 * 
 * This utility helps load images from the public/images directory.
 * Images are organized by category for easy management.
 */

export const IMAGE_CATEGORIES = {
  HERO: 'hero',
  ABOUT: 'about',
  CARBUILD: 'carbuild',
  GALLERY: 'gallery'
} as const;

export type ImageCategory = typeof IMAGE_CATEGORIES[keyof typeof IMAGE_CATEGORIES];

/**
 * Get all images from a specific category folder
 */
export const getImagesFromFolder = (category: ImageCategory): string[] => {
  try {
    // Use Vite's import.meta.glob to get all images
    const imageModules = import.meta.glob('/public/images/**/*.{jpg,jpeg,png,webp,gif}', { 
      eager: false,
      as: 'url'
    });

    const imagePaths = Object.keys(imageModules)
      .filter(path => path.includes(`/images/${category}/`))
      .map(path => path.replace('/public', ''))
      .sort();

    return imagePaths;
  } catch (error) {
    console.error(`Error loading images from ${category}:`, error);
    return [];
  }
};

/**
 * Get a specific image by name from a category
 */
export const getImage = (category: ImageCategory, filename: string): string | null => {
  const images = getImagesFromFolder(category);
  const image = images.find(img => img.includes(filename));
  return image || null;
};

/**
 * Get hero image (main banner image)
 */
export const getHeroImage = (): string => {
  const heroImage = getImage(IMAGE_CATEGORIES.HERO, 'hero-main') || 
                   getImage(IMAGE_CATEGORIES.HERO, 'hero-banner') ||
                   getImagesFromFolder(IMAGE_CATEGORIES.HERO)[0];
  
  return heroImage || '/images/placeholder-hero.jpg';
};

/**
 * Get profile image
 */
export const getProfileImage = (): string => {
  const profileImage = getImage(IMAGE_CATEGORIES.ABOUT, 'profile');
  return profileImage || '/images/placeholder-profile.jpg';
};

/**
 * Check if images exist in a category
 */
export const hasImages = (category: ImageCategory): boolean => {
  return getImagesFromFolder(category).length > 0;
};

/**
 * Format image filename to readable title
 */
export const formatImageTitle = (path: string): string => {
  const filename = path.split('/').pop() || '';
  return filename
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};
