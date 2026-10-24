// Map pin colour per travel category; a place uses the colour of its first category.
export const CATEGORY_COLORS: Record<string, string> = {
  Heritage: '#f59e0b',
  Religious: '#f43f5e',
  'Hill Station': '#10b981',
  Beach: '#06b6d4',
  Wildlife: '#84cc16',
  Adventure: '#8b5cf6',
  Honeymoon: '#ec4899',
  'Family Trip': '#3b82f6',
};

export const DEFAULT_PIN_COLOR = '#f97316';

export const pinColor = (categories: string[]) => CATEGORY_COLORS[categories[0]] ?? DEFAULT_PIN_COLOR;
