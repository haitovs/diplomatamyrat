const TMT_SYMBOL = 'TMT';
const TMT_SYMBOL_UNICODE = '₼'; // Manat symbol

export interface CurrencyFormatOptions {
  useSymbol?: boolean; // Use ₼ instead of TMT
  includeDecimals?: boolean; // Show .00 for whole numbers
}

/**
 * Format price in TMT currency
 * @param price - Price in TMT
 * @param options - Formatting options
 * @returns Formatted price string (e.g., "2,730 TMT" or "2,730 ₼")
 */
export function formatPrice(
  price: number,
  options: CurrencyFormatOptions = {}
): string {
  const { useSymbol = false, includeDecimals = true } = options;

  // Format with Turkmen locale (thousands separator)
  const formatted = new Intl.NumberFormat('tk-TM', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(price);

  // Return with symbol or text
  if (useSymbol) {
    return `${formatted} ${TMT_SYMBOL_UNICODE}`;
  }
  return `${formatted} ${TMT_SYMBOL}`;
}

/**
 * Parse price string back to number (for input fields)
 * @param priceString - Price string with TMT
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = priceString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range (e.g., "100 - 5,000 TMT")
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  return `${formatPrice(minPrice, { includeDecimals: false })} - ${formatPrice(maxPrice)}`;
}
