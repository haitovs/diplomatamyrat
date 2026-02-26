import { useTranslation } from 'react-i18next';
import type { Product } from '../types';

/**
 * Normalize a string to a translation key:
 * "Editor's Pick" -> "editors_pick"
 * "Ships within 24 hours" -> "ships_within_24_hours"
 */
function toKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

interface TranslatedProduct {
  name: string;
  description: string;
  badge: string | null;
  materials: string | null;
  leadTime: string | null;
  highlights: string[];
}

export function useProductTranslation(product: Product | null | undefined): TranslatedProduct {
  const { t, i18n } = useTranslation();

  if (!product) {
    return { name: '', description: '', badge: null, materials: null, leadTime: null, highlights: [] };
  }

  const slug = product.slug;

  // For English, return originals directly
  if (i18n.language === 'en') {
    return {
      name: product.name,
      description: product.description,
      badge: product.badge,
      materials: product.materials,
      leadTime: product.leadTime,
      highlights: product.highlights?.map(h => h.text) || [],
    };
  }

  // For other languages, look up translations with fallback to original English
  const name = t(`products.${slug}.name`, { defaultValue: product.name });
  const description = t(`products.${slug}.description`, { defaultValue: product.description });
  const materials = product.materials
    ? t(`products.${slug}.materials`, { defaultValue: product.materials })
    : null;

  const badge = product.badge
    ? t(`badges.${toKey(product.badge)}`, { defaultValue: product.badge })
    : null;

  const leadTime = product.leadTime
    ? t(`leadTimes.${toKey(product.leadTime)}`, { defaultValue: product.leadTime })
    : null;

  const translatedHighlights = t(`products.${slug}.highlights`, { returnObjects: true });
  const highlights = Array.isArray(translatedHighlights)
    ? translatedHighlights
    : product.highlights?.map(h => h.text) || [];

  return { name, description, badge, materials, leadTime, highlights };
}

/** Translate a category name by slug */
export function useCategoryTranslation() {
  const { t, i18n } = useTranslation();

  return (slug: string | undefined, fallback: string) => {
    if (!slug || i18n.language === 'en') return fallback;
    return t(`categories.${slug}`, { defaultValue: fallback });
  };
}
