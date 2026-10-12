// src/api/barcodeService.ts
import axios from 'axios';
import api from './axios';

export interface ScannedProduct {
  barcode: string;
  product_name: string;
  brand: string;
  image_url?: string;
  quantity?: string;
  serving_size: string;
  serving_weight_g: number;

  // Per 100g values
  calories_100g: number;
  protein_100g: number;
  carbs_100g: number;
  fat_100g: number;
  sugar_100g: number;
  fiber_100g: number;
  sodium_mg_100g: number;
  sat_fat_100g: number;
  salt_100g?: number;

  // Per serving values (if provided)
  calories_serving?: number;
  protein_serving?: number;
  carbs_serving?: number;
  fat_serving?: number;
  sugar_serving?: number;
  fiber_serving?: number;
  sodium_mg_serving?: number;
  sat_fat_serving?: number;

  ingredients_text: string;
  ingredients: string[];
  allergens: string[];
  nutriscore_grade?: string;
  nova_group?: number;
  categories?: string[];
  primary_category?: string;
  source: string;
  source_url: string;
  assessment?: string;
}

export interface SimilarProductFilter {
  higherProtein?: boolean;
  lowerSugar?: boolean;
  lowerSodium?: boolean;
  lowerCalories?: boolean;
}

// Open Food Facts Public API Endpoint (for resilient client fallback)
const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product';

/**
 * Normalizes Open Food Facts raw product payload into ScannedProduct
 */
const normalizeOffProduct = (barcode: string, p: any): ScannedProduct => {
  const nutriments = p.nutriments || {};

  const num = (val: any, fallback = 0): number => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : Math.max(0, parsed);
  };

  // Serving weight extraction
  let servingWeight = num(p.serving_quantity, 0);
  const servingStr = p.serving_size || '100g';
  if (!servingWeight) {
    const match = servingStr.match(/(\d+(?:\.\d+)?)\s*g/i);
    if (match) servingWeight = num(match[1], 100);
    else servingWeight = 100;
  }

  // Calories per 100g (Check energy-kcal or convert kJ)
  let cal100 = num(nutriments['energy-kcal_100g'] || nutriments['energy-kcal_value'] || nutriments['energy-kcal']);
  if (!cal100 && nutriments['energy_100g']) {
    cal100 = Math.round(num(nutriments['energy_100g']) / 4.184);
  }

  // Sodium conversion: OFF stores sodium in grams per 100g. Convert to mg.
  let sodium100mg = num(nutriments['sodium_100g']) * 1000;
  const salt100 = num(nutriments['salt_100g']);
  if (!sodium100mg && salt100) {
    sodium100mg = Math.round((salt100 / 2.5) * 1000);
  }

  // Allergens parsing
  const rawAllergens = p.allergens_tags || [];
  const allergensList: string[] = rawAllergens
    .map((a: string) => a.replace(/^[a-z]{2}:/, '').replace(/-/g, ' ').trim())
    .filter(Boolean);

  // Ingredients extraction
  const rawIngs = p.ingredients || [];
  const ingNames: string[] = Array.isArray(rawIngs)
    ? rawIngs.map((i: any) => (i?.text || '').trim()).filter(Boolean).slice(0, 25)
    : [];

  const grade = p.nutriscore_grade ? String(p.nutriscore_grade).toUpperCase() : undefined;
  const nova = typeof p.nova_group === 'number' ? p.nova_group : undefined;
  const cats: string[] = (p.categories_tags || []).map((c: string) => c.replace(/^[a-z]{2}:/, '')).filter(Boolean);

  return {
    barcode,
    product_name: p.product_name || p.product_name_en || p.generic_name || 'Verified Product',
    brand: p.brands || p.brand_owner || 'Verified Brand',
    image_url: p.image_front_url || p.image_url || p.image_small_url,
    quantity: p.quantity || undefined,
    serving_size: servingStr,
    serving_weight_g: Math.round(servingWeight) || 100,

    calories_100g: Math.round(cal100),
    protein_100g: Number(num(nutriments['proteins_100g']).toFixed(1)),
    carbs_100g: Number(num(nutriments['carbohydrates_100g']).toFixed(1)),
    fat_100g: Number(num(nutriments['fat_100g']).toFixed(1)),
    sugar_100g: Number(num(nutriments['sugars_100g']).toFixed(1)),
    fiber_100g: Number(num(nutriments['fiber_100g']).toFixed(1)),
    sodium_mg_100g: Math.round(sodium100mg),
    sat_fat_100g: Number(num(nutriments['saturated-fat_100g']).toFixed(1)),
    salt_100g: Number(salt100.toFixed(2)),

    calories_serving: nutriments['energy-kcal_serving'] ? Math.round(num(nutriments['energy-kcal_serving'])) : undefined,
    protein_serving: nutriments['proteins_serving'] ? Number(num(nutriments['proteins_serving']).toFixed(1)) : undefined,
    carbs_serving: nutriments['carbohydrates_serving'] ? Number(num(nutriments['carbohydrates_serving']).toFixed(1)) : undefined,
    fat_serving: nutriments['fat_serving'] ? Number(num(nutriments['fat_serving']).toFixed(1)) : undefined,
    sugar_serving: nutriments['sugars_serving'] ? Number(num(nutriments['sugars_serving']).toFixed(1)) : undefined,
    fiber_serving: nutriments['fiber_serving'] ? Number(num(nutriments['fiber_serving']).toFixed(1)) : undefined,
    sodium_mg_serving: nutriments['sodium_serving'] ? Math.round(num(nutriments['sodium_serving']) * 1000) : undefined,
    sat_fat_serving: nutriments['saturated-fat_serving'] ? Number(num(nutriments['saturated-fat_serving']).toFixed(1)) : undefined,

    ingredients_text: p.ingredients_text || p.ingredients_text_en || 'Ingredients not provided by manufacturer.',
    ingredients: ingNames,
    allergens: allergensList,
    nutriscore_grade: grade,
    nova_group: nova,
    categories: cats,
    primary_category: cats[0] || undefined,
    source: 'Open Food Facts',
    source_url: `https://world.openfoodfacts.org/product/${barcode}`,
  };
};

/**
 * Searches and retrieves verified product details by barcode.
 * Priority:
 * 1. Backend API endpoint GET /api/barcode/{barcode}
 * 2. Fallback to Open Food Facts directly if backend is cold/waking up
 */
export const fetchProductByBarcode = async (barcode: string): Promise<ScannedProduct | null> => {
  const cleanBarcode = barcode.trim().replace(/\s+/g, '').replace(/-/g, '');
  if (!cleanBarcode || !/^\d{6,14}$/.test(cleanBarcode)) {
    throw new Error('Please enter a valid 6 to 14 digit numeric barcode (e.g. 737628064502).');
  }

  // 1. Try Backend Endpoint GET /api/barcode/{barcode}
  try {
    const res = await api.get(`/barcode/${cleanBarcode}`, { timeout: 10000 });
    if (res.data && res.data.found) {
      return res.data as ScannedProduct;
    }
  } catch (backendError: any) {
    // If backend explicitly returned 404, product is not in database
    if (backendError.response?.status === 404) {
      return null;
    }
    // If 400 Bad Request
    if (backendError.response?.status === 400) {
      throw new Error(backendError.response.data?.detail || 'Invalid barcode format.');
    }
    // For other errors (cold start / 502 / timeout), proceed to client direct lookup fallback
    console.warn('Backend barcode endpoint unavailable, attempting direct Open Food Facts lookup:', backendError.message);
  }

  // 2. Resilient Direct Fallback to Open Food Facts API v2
  try {
    const offRes = await axios.get(`${OFF_API_BASE}/${cleanBarcode}.json`, {
      timeout: 9000,
      headers: {
        'User-Agent': 'NutriLensAI/1.0 (https://nutri-ai-eight-iota.vercel.app; support@nutrilens.app)',
      },
    });

    if (!offRes.data || offRes.data.status !== 1 || !offRes.data.product) {
      return null;
    }

    return normalizeOffProduct(cleanBarcode, offRes.data.product);
  } catch (offError: any) {
    if (offError.response?.status === 404) {
      return null;
    }
    if (offError.code === 'ECONNABORTED' || offError.message?.includes('timeout')) {
      throw new Error('Database lookup timed out. Please check your internet connection.');
    }
    throw new Error('Unable to connect to food product database. Please try again.');
  }
};

export const fetchSimilarProducts = async (
  categoryTag: string,
  currentProduct: ScannedProduct,
  filter?: SimilarProductFilter
): Promise<ScannedProduct[]> => {
  if (!categoryTag) return [];

  try {
    const cleanTag = categoryTag.toLowerCase().replace(/\s+/g, '-');
    const response = await axios.get(`https://world.openfoodfacts.org/category/${cleanTag}.json?page_size=12`, {
      timeout: 8000,
    });

    if (!response.data || !Array.isArray(response.data.products)) {
      return [];
    }

    const items: ScannedProduct[] = response.data.products
      .filter((p: any) => p.code && p.code !== currentProduct.barcode && p.product_name)
      .map((p: any) => normalizeOffProduct(String(p.code), p));

    let filtered = items;
    if (filter?.higherProtein) {
      filtered = filtered.filter((p) => p.protein_100g >= currentProduct.protein_100g);
    }
    if (filter?.lowerSugar) {
      filtered = filtered.filter((p) => p.sugar_100g <= currentProduct.sugar_100g);
    }
    if (filter?.lowerSodium) {
      filtered = filtered.filter((p) => p.sodium_mg_100g <= currentProduct.sodium_mg_100g);
    }
    if (filter?.lowerCalories) {
      filtered = filtered.filter((p) => p.calories_100g <= currentProduct.calories_100g);
    }

    return filtered.slice(0, 4);
  } catch (err) {
    console.error('Failed to fetch similar products:', err);
    return [];
  }
};

