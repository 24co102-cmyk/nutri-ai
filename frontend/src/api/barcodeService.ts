// src/api/barcodeService.ts
import axios from 'axios';

export interface ScannedProduct {
  barcode: string;
  product_name: string;
  brand: string;
  image_url?: string;
  serving_size: string;
  serving_weight_g: number; // default serving size in grams (e.g. 100 or extracted)
  
  // Per 100g values
  calories_100g: number;
  protein_100g: number;
  carbs_100g: number;
  fat_100g: number;
  sugar_100g: number;
  fiber_100g: number;
  sodium_mg_100g: number;
  sat_fat_100g: number;

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
  allergens: string[];
  additives_count: number;
  nutriscore_grade?: string;
  categories: string[];
  primary_category?: string;
}

export interface SimilarProductFilter {
  higherProtein?: boolean;
  lowerSugar?: boolean;
  lowerSodium?: boolean;
  lowerCalories?: boolean;
}

// Open Food Facts Public API Endpoint
const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const OFF_CATEGORY_BASE = 'https://world.openfoodfacts.org/category';

export const fetchProductByBarcode = async (barcode: string): Promise<ScannedProduct | null> => {
  const cleanBarcode = barcode.trim().replace(/\s+/g, '');
  if (!cleanBarcode || cleanBarcode.length < 6) {
    throw new Error('Please enter a valid 8 to 14 digit barcode.');
  }

  try {
    const response = await axios.get(`${OFF_API_BASE}/${cleanBarcode}.json`, {
      timeout: 8000,
      headers: {
        'User-Agent': 'NutriLens-AI-HealthSuite/1.0 (contact: support@nutrilens.app)',
      },
    });

    if (!response.data || response.data.status !== 1 || !response.data.product) {
      return null;
    }

    const p = response.data.product;
    const nutriments = p.nutriments || {};

    // Helper for safe number extraction
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
    if (!sodium100mg && nutriments['salt_100g']) {
      sodium100mg = Math.round((num(nutriments['salt_100g']) / 2.5) * 1000);
    }

    // Allergens parsing
    const rawAllergens = p.allergens_tags || [];
    const allergensList: string[] = rawAllergens
      .map((a: string) => a.replace(/^[a-z]{2}:/, '').replace(/-/g, ' '))
      .filter(Boolean);

    // Categories parsing
    const categoriesList: string[] = (p.categories_tags || [])
      .map((c: string) => c.replace(/^[a-z]{2}:/, ''))
      .filter(Boolean);

    const product: ScannedProduct = {
      barcode: cleanBarcode,
      product_name: p.product_name || p.product_name_en || p.generic_name || 'Scanned Food Product',
      brand: p.brands || p.brand_owner || 'Verified Brand',
      image_url: p.image_front_url || p.image_url || p.image_small_url,
      serving_size: servingStr,
      serving_weight_g: Math.round(servingWeight),

      calories_100g: Math.round(cal100),
      protein_100g: Number(num(nutriments['proteins_100g']).toFixed(1)),
      carbs_100g: Number(num(nutriments['carbohydrates_100g']).toFixed(1)),
      fat_100g: Number(num(nutriments['fat_100g']).toFixed(1)),
      sugar_100g: Number(num(nutriments['sugars_100g']).toFixed(1)),
      fiber_100g: Number(num(nutriments['fiber_100g']).toFixed(1)),
      sodium_mg_100g: Math.round(sodium100mg),
      sat_fat_100g: Number(num(nutriments['saturated-fat_100g']).toFixed(1)),

      // Optional per-serving values
      calories_serving: nutriments['energy-kcal_serving'] ? Math.round(num(nutriments['energy-kcal_serving'])) : undefined,
      protein_serving: nutriments['proteins_serving'] ? Number(num(nutriments['proteins_serving']).toFixed(1)) : undefined,
      carbs_serving: nutriments['carbohydrates_serving'] ? Number(num(nutriments['carbohydrates_serving']).toFixed(1)) : undefined,
      fat_serving: nutriments['fat_serving'] ? Number(num(nutriments['fat_serving']).toFixed(1)) : undefined,
      sugar_serving: nutriments['sugars_serving'] ? Number(num(nutriments['sugars_serving']).toFixed(1)) : undefined,
      fiber_serving: nutriments['fiber_serving'] ? Number(num(nutriments['fiber_serving']).toFixed(1)) : undefined,

      ingredients_text: p.ingredients_text || p.ingredients_text_en || 'Ingredients list not provided by manufacturer.',
      allergens: allergensList,
      additives_count: (p.additives_tags || []).length,
      nutriscore_grade: p.nutriscore_grade ? String(p.nutriscore_grade).toUpperCase() : undefined,
      categories: categoriesList,
      primary_category: categoriesList[0] || undefined,
    };

    return product;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('Database lookup timed out. Please check your internet connection.');
    }
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(error.message || 'Failed to connect to food product database.');
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
    const response = await axios.get(`${OFF_CATEGORY_BASE}/${cleanTag}.json?page_size=12`, {
      timeout: 8000,
    });

    if (!response.data || !Array.isArray(response.data.products)) {
      return [];
    }

    const items: ScannedProduct[] = response.data.products
      .filter((p: any) => p.code && p.code !== currentProduct.barcode && p.product_name)
      .map((p: any) => {
        const nutriments = p.nutriments || {};
        const cal = parseFloat(nutriments['energy-kcal_100g'] || nutriments['energy-kcal_value'] || 0) || 0;
        const prot = parseFloat(nutriments['proteins_100g'] || 0) || 0;
        const sugar = parseFloat(nutriments['sugars_100g'] || 0) || 0;
        const sod = (parseFloat(nutriments['sodium_100g'] || 0) || 0) * 1000;

        return {
          barcode: String(p.code),
          product_name: p.product_name || 'Similar Product',
          brand: p.brands || 'Brand',
          image_url: p.image_front_url || p.image_small_url,
          serving_size: p.serving_size || '100g',
          serving_weight_g: 100,
          calories_100g: Math.round(cal),
          protein_100g: Number(prot.toFixed(1)),
          carbs_100g: Number((parseFloat(nutriments['carbohydrates_100g'] || 0) || 0).toFixed(1)),
          fat_100g: Number((parseFloat(nutriments['fat_100g'] || 0) || 0).toFixed(1)),
          sugar_100g: Number(sugar.toFixed(1)),
          fiber_100g: Number((parseFloat(nutriments['fiber_100g'] || 0) || 0).toFixed(1)),
          sodium_mg_100g: Math.round(sod),
          sat_fat_100g: Number((parseFloat(nutriments['saturated-fat_100g'] || 0) || 0).toFixed(1)),
          ingredients_text: p.ingredients_text || '',
          allergens: [],
          additives_count: (p.additives_tags || []).length,
          categories: [],
        };
      });

    // Apply filtering if requested
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
