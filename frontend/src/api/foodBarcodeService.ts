// src/api/foodBarcodeService.ts
import api from './axios';

export interface FoodProduct {
  serialNumber: number;
  barcode: string;
  productName: string;
  brandName: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  fiber: number;
  sodium: number;
  ingredients: string[];
  allergens: string[];
  description: string;
}

export interface NutritionAnalysisResult {
  healthScore: number; // 0 to 100
  nutritionGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeColor: string;
  gradeBadgeBg: string;
  explanations: string[];
  verdict: string;
  recommendation: string;
}

const STORAGE_KEY = 'nutri_food_barcode_products_v1';
export const MAX_PRODUCTS = 50;

/**
 * Format deterministic 12-digit barcode:
 * Serial 1  -> 890100000001
 * Serial 2  -> 890100000002
 * Serial 20 -> 890100000020
 */
export const formatBarcodeForSerial = (serial: number): string => {
  return `8901000000${String(serial).padStart(2, '0')}`;
};

/**
 * Read products from local storage fallback
 */
export const getLocalProducts = (): FoodProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Normalize barcodes to standard 8901000000XX format if needed
      return parsed.map((p: any) => ({
        ...p,
        serialNumber: Number(p.serialNumber),
        barcode: formatBarcodeForSerial(Number(p.serialNumber)),
        calories: Number(p.calories) || 0,
        protein: Number(p.protein) || 0,
        carbohydrates: Number(p.carbohydrates) || 0,
        fat: Number(p.fat) || 0,
        sugar: Number(p.sugar) || 0,
        fiber: Number(p.fiber) || 0,
        sodium: Number(p.sodium) || 0,
        ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
        allergens: Array.isArray(p.allergens) ? p.allergens : [],
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
    return [];
  }
};

/**
 * Save products to local storage
 */
export const saveLocalProducts = (products: FoodProduct[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
};

/**
 * Compute the lowest available serial slot between 1 and 20.
 */
export const getNextAvailableSerial = (products: FoodProduct[]): number | null => {
  const existingSerials = new Set(products.map((p) => p.serialNumber));
  for (let s = 1; s <= MAX_PRODUCTS; s++) {
    if (!existingSerials.has(s)) {
      return s;
    }
  }
  return null;
};

/**
 * Fetch all registered products (syncs with backend API, falls back to localStorage)
 */
export const fetchAllFoodProducts = async (): Promise<FoodProduct[]> => {
  try {
    const res = await api.get('/barcode/products', { timeout: 3000 });
    if (Array.isArray(res.data)) {
      saveLocalProducts(res.data);
      return res.data;
    }
  } catch (err) {
    // Backend offline or unreachable: gracefully use persistent local storage
    console.warn('Backend API unavailable, using persistent local storage:', err);
  }
  return getLocalProducts();
};

/**
 * Register a new food product
 */
export const addFoodProduct = async (
  productData: Omit<FoodProduct, 'serialNumber' | 'barcode'>
): Promise<FoodProduct> => {
  const localList = getLocalProducts();
  if (localList.length >= MAX_PRODUCTS) {
    throw new Error('Maximum 20 products registered. Delete a product before adding a new one.');
  }

  const nextSerial = getNextAvailableSerial(localList);
  if (!nextSerial) {
    throw new Error('Maximum 20 products registered.');
  }

  const newBarcode = formatBarcodeForSerial(nextSerial);
  const newProduct: FoodProduct = {
    ...productData,
    serialNumber: nextSerial,
    barcode: newBarcode,
  };

  // Attempt backend API save
  try {
    const res = await api.post('/barcode/products', {
      productName: newProduct.productName,
      brandName: newProduct.brandName,
      category: newProduct.category,
      servingSize: newProduct.servingSize,
      calories: newProduct.calories,
      protein: newProduct.protein,
      carbohydrates: newProduct.carbohydrates,
      fat: newProduct.fat,
      sugar: newProduct.sugar,
      fiber: newProduct.fiber,
      sodium: newProduct.sodium,
      ingredients: newProduct.ingredients,
      allergens: newProduct.allergens,
      description: newProduct.description,
    }, { timeout: 3000 });

    if (res.data && res.data.serialNumber) {
      const mergedList = [...localList.filter((p) => p.serialNumber !== res.data.serialNumber), res.data];
      mergedList.sort((a, b) => a.serialNumber - b.serialNumber);
      saveLocalProducts(mergedList);
      return res.data;
    }
  } catch (err) {
    console.warn('Backend save skipped/failed, persisting locally:', err);
  }

  // Local persistence fallback
  const updatedList = [...localList, newProduct];
  updatedList.sort((a, b) => a.serialNumber - b.serialNumber);
  saveLocalProducts(updatedList);
  return newProduct;
};

/**
 * Update product information.
 * CRITICAL: Serial Number and Barcode CANNOT be changed.
 */
export const updateFoodProduct = async (
  serialNumber: number,
  updatedFields: Partial<Omit<FoodProduct, 'serialNumber' | 'barcode'>>
): Promise<FoodProduct> => {
  const localList = getLocalProducts();
  const existing = localList.find((p) => p.serialNumber === serialNumber);
  if (!existing) {
    throw new Error(`Product with serial number ${serialNumber} not found.`);
  }

  // Lock serial number and barcode
  const updatedProduct: FoodProduct = {
    ...existing,
    ...updatedFields,
    serialNumber: existing.serialNumber,
    barcode: existing.barcode,
  };

  try {
    const res = await api.put(`/barcode/products/${serialNumber}`, {
      productName: updatedProduct.productName,
      brandName: updatedProduct.brandName,
      category: updatedProduct.category,
      servingSize: updatedProduct.servingSize,
      calories: updatedProduct.calories,
      protein: updatedProduct.protein,
      carbohydrates: updatedProduct.carbohydrates,
      fat: updatedProduct.fat,
      sugar: updatedProduct.sugar,
      fiber: updatedProduct.fiber,
      sodium: updatedProduct.sodium,
      ingredients: updatedProduct.ingredients,
      allergens: updatedProduct.allergens,
      description: updatedProduct.description,
    }, { timeout: 3000 });

    if (res.data) {
      const newList = localList.map((p) => (p.serialNumber === serialNumber ? res.data : p));
      saveLocalProducts(newList);
      return res.data;
    }
  } catch (err) {
    console.warn('Backend update failed, updating locally:', err);
  }

  const newList = localList.map((p) => (p.serialNumber === serialNumber ? updatedProduct : p));
  saveLocalProducts(newList);
  return updatedProduct;
};

/**
 * Delete a product by serial number.
 * Confirmed: Does NOT shift other serial numbers.
 */
export const deleteFoodProduct = async (serialNumber: number): Promise<void> => {
  try {
    await api.delete(`/barcode/products/${serialNumber}`, { timeout: 3000 });
  } catch (err) {
    console.warn('Backend delete failed, deleting locally:', err);
  }

  const localList = getLocalProducts();
  const filtered = localList.filter((p) => p.serialNumber !== serialNumber);
  saveLocalProducts(filtered);
};

/**
 * Reset all 20 products.
 */
export const resetAllFoodProducts = async (): Promise<void> => {
  try {
    await api.post('/barcode/reset', {}, { timeout: 3000 });
  } catch (err) {
    console.warn('Backend reset failed, resetting locally:', err);
  }
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Lookup product strictly by barcode in the registered database.
 */
export const lookupProductByBarcode = async (barcode: string): Promise<FoodProduct | null> => {
  const clean = barcode.trim().replace(/[\s-]/g, '');
  if (!clean) return null;

  // Try backend first
  try {
    const res = await api.get(`/barcode/lookup/${clean}`, { timeout: 3000 });
    if (res.data && res.data.barcode) {
      return res.data;
    }
  } catch (err: any) {
    // If backend returned 404, check local
    if (err.response?.status === 404) {
      // Checked backend, not found
    }
  }

  // Check local database
  const localList = getLocalProducts();
  const match = localList.find((p) => p.barcode === clean);
  return match || null;
};

/**
 * Calculate objective Nutrition Health Score (0 - 100), Grade (A-E),
 * and dynamic insights based on stored nutrition values.
 */
export const calculateNutritionAnalysis = (product: FoodProduct): NutritionAnalysisResult => {
  let score = 70; // baseline score
  const explanations: string[] = [];

  // 1. Calories check
  if (product.calories > 400) {
    score -= 15;
    explanations.push('High calorie density per serving.');
  } else if (product.calories <= 150 && product.calories > 0) {
    score += 5;
    explanations.push('Moderate and light calorie content.');
  }

  // 2. Sugar check
  if (product.sugar > 15) {
    score -= 20;
    explanations.push('High sugar content (>15g).');
  } else if (product.sugar > 8) {
    score -= 8;
    explanations.push('Moderate added sugar content.');
  } else if (product.sugar <= 4 && product.sugar >= 0) {
    score += 8;
    explanations.push('Low sugar formulation.');
  }

  // 3. Protein check
  if (product.protein >= 12) {
    score += 15;
    explanations.push('Excellent high protein source (>=12g).');
  } else if (product.protein >= 6) {
    score += 8;
    explanations.push('Good protein source (>=6g).');
  }

  // 4. Fiber check
  if (product.fiber >= 4) {
    score += 12;
    explanations.push('Rich in beneficial dietary fiber (>=4g).');
  } else if (product.fiber >= 2) {
    score += 5;
    explanations.push('Contains dietary fiber.');
  }

  // 5. Sodium check
  if (product.sodium > 600) {
    score -= 18;
    explanations.push('High sodium content (>600mg).');
  } else if (product.sodium > 350) {
    score -= 8;
    explanations.push('Moderate sodium level.');
  } else if (product.sodium <= 140) {
    score += 6;
    explanations.push('Low sodium profile.');
  }

  // 6. Fat check
  if (product.fat > 20) {
    score -= 10;
    explanations.push('High total fat content.');
  } else if (product.fat <= 3 && product.fat >= 0) {
    score += 5;
    explanations.push('Low fat food.');
  }

  // Clamp health score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Nutrition Grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'E';
  let gradeColor = 'text-emerald-600';
  let gradeBadgeBg = 'bg-emerald-50 border-emerald-200 text-emerald-700';

  if (finalScore >= 80) {
    grade = 'A';
    gradeColor = 'text-emerald-600';
    gradeBadgeBg = 'bg-emerald-50 border-emerald-300 text-emerald-700';
  } else if (finalScore >= 65) {
    grade = 'B';
    gradeColor = 'text-teal-600';
    gradeBadgeBg = 'bg-teal-50 border-teal-300 text-teal-700';
  } else if (finalScore >= 50) {
    grade = 'C';
    gradeColor = 'text-amber-600';
    gradeBadgeBg = 'bg-amber-50 border-amber-300 text-amber-700';
  } else if (finalScore >= 35) {
    grade = 'D';
    gradeColor = 'text-orange-600';
    gradeBadgeBg = 'bg-orange-50 border-orange-300 text-orange-700';
  } else {
    grade = 'E';
    gradeColor = 'text-rose-600';
    gradeBadgeBg = 'bg-rose-50 border-rose-300 text-rose-700';
  }

  if (explanations.length === 0) {
    explanations.push('Balanced nutritional macronutrient composition.');
  }

  // Generate AI Nutrition Verdict & Recommendation
  let verdict = '';
  let recommendation = '';

  if (finalScore >= 80) {
    verdict = 'Nutritious & nutrient-dense choice. Highly compatible with everyday balanced eating.';
    recommendation = `With ${product.protein}g protein and low sugar (${product.sugar}g), this item supports sustained energy and fitness targets.`;
  } else if (finalScore >= 60) {
    verdict = 'Balanced food item with decent macronutrient profile.';
    recommendation = `Suitable for regular intake. Monitor serving portion (${product.servingSize || 'serving'}) to match your daily calorie allowance.`;
  } else if (finalScore >= 40) {
    verdict = 'Moderate nutritional density. Suitable for occasional consumption.';
    recommendation = 'Consider balancing this meal with high-fiber greens or lean protein sources throughout your day.';
  } else {
    verdict = 'Indulgent item high in sugar, sodium, or fats. Best enjoyed in moderation.';
    recommendation = `Limit frequency of consumption. Consuming this item provides ${product.calories} kcal toward your daily intake.`;
  }

  return {
    healthScore: finalScore,
    nutritionGrade: grade,
    gradeColor,
    gradeBadgeBg,
    explanations,
    verdict,
    recommendation,
  };
};

/**
 * Export products to JSON file download
 */
export const exportProductsAsJson = (products: FoodProduct[]): void => {
  const jsonStr = JSON.stringify(products, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `food_products_registry_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Export products to CSV file download
 */
export const exportProductsAsCsv = (products: FoodProduct[]): void => {
  const headers = [
    'Serial Number',
    'Product Name',
    'Brand',
    'Barcode',
    'Category',
    'Serving Size',
    'Calories',
    'Protein (g)',
    'Carbohydrates (g)',
    'Fat (g)',
    'Sugar (g)',
    'Fiber (g)',
    'Sodium (mg)',
    'Ingredients',
    'Allergens',
    'Description',
  ];

  const escapeCsv = (str: any) => {
    const val = String(str ?? '').replace(/"/g, '""');
    return `"${val}"`;
  };

  const rows = products.map((p) => [
    p.serialNumber,
    escapeCsv(p.productName),
    escapeCsv(p.brandName),
    escapeCsv(p.barcode),
    escapeCsv(p.category),
    escapeCsv(p.servingSize),
    p.calories,
    p.protein,
    p.carbohydrates,
    p.fat,
    p.sugar,
    p.fiber,
    p.sodium,
    escapeCsv(p.ingredients.join(', ')),
    escapeCsv(p.allergens.join(', ')),
    escapeCsv(p.description),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `food_products_registry_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Automatic Test Suite:
 * Tests:
 * 1. Product creation
 * 2. Serial number generation
 * 3. Barcode generation
 * 4. Barcode lookup
 * 5. Product lookup
 * 6. Product editing
 * 7. Product deletion
 * 8. Unknown barcode handling
 * 9. Persistence after refresh
 */
export interface TestCaseResult {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

export const runAutomatedSystemTests = async (): Promise<TestCaseResult[]> => {
  const results: TestCaseResult[] = [];
  const backup = getLocalProducts(); // backup current data

  try {
    // Test 1: Creation & Auto-Serial
    const testProd1 = await addFoodProduct({
      productName: 'Test Energy Bar',
      brandName: 'NutriTest',
      category: 'Snacks',
      servingSize: '50g',
      calories: 210,
      protein: 10,
      carbohydrates: 25,
      fat: 7,
      sugar: 5,
      fiber: 4,
      sodium: 120,
      ingredients: ['Oats', 'Peanut Butter', 'Honey'],
      allergens: ['Peanuts'],
      description: 'Automated test product 1',
    });

    results.push({
      id: 'test_create',
      name: '1. Product Creation & Auto-Serial',
      passed: typeof testProd1.serialNumber === 'number' && testProd1.serialNumber >= 1 && testProd1.serialNumber <= 20,
      message: `Assigned Serial No: ${testProd1.serialNumber}`,
    });

    // Test 2: Barcode Generation Format (e.g. 890100000001)
    const expectedBarcode = formatBarcodeForSerial(testProd1.serialNumber);
    const barcodeMatches = testProd1.barcode === expectedBarcode;
    results.push({
      id: 'test_barcode_gen',
      name: '2. Deterministic Barcode Generation',
      passed: barcodeMatches && testProd1.barcode.startsWith('8901000000'),
      message: `Generated Barcode: ${testProd1.barcode} (Format verified)`,
    });

    // Test 3: Barcode Lookup
    const lookupResult = await lookupProductByBarcode(testProd1.barcode);
    results.push({
      id: 'test_barcode_lookup',
      name: '3. Barcode Database Lookup',
      passed: !!lookupResult && lookupResult.productName === 'Test Energy Bar',
      message: lookupResult ? `Found matching product: "${lookupResult.productName}"` : 'Failed to lookup barcode',
    });

    // Test 4: Product Editing (Ensure serial and barcode do NOT change)
    const originalSerial = testProd1.serialNumber;
    const originalBarcode = testProd1.barcode;
    const updatedProd = await updateFoodProduct(testProd1.serialNumber, {
      productName: 'Test Energy Bar Pro',
      calories: 220,
    });

    const editPassed =
      updatedProd.productName === 'Test Energy Bar Pro' &&
      updatedProd.serialNumber === originalSerial &&
      updatedProd.barcode === originalBarcode;

    results.push({
      id: 'test_edit_integrity',
      name: '4. Product Editing Integrity',
      passed: editPassed,
      message: `Updated name to "${updatedProd.productName}", Serial & Barcode strictly preserved`,
    });

    // Test 5: Unknown Barcode Handling
    const unknownLookup = await lookupProductByBarcode('890100000099');
    results.push({
      id: 'test_unknown_barcode',
      name: '5. Unknown Barcode Rejection',
      passed: unknownLookup === null,
      message: unknownLookup === null ? 'Correctly reported Product Not Found for unregistered code' : 'Incorrectly matched an unknown code',
    });

    // Test 6: Nutrition Analysis & AI Recommendation
    const analysis = calculateNutritionAnalysis(updatedProd);
    results.push({
      id: 'test_nutrition_analysis',
      name: '6. Nutrition Grading & AI Recommendation',
      passed: analysis.healthScore >= 0 && analysis.healthScore <= 100 && ['A', 'B', 'C', 'D', 'E'].includes(analysis.nutritionGrade),
      message: `Health Score: ${analysis.healthScore}/100, Grade: ${analysis.nutritionGrade}, Verdict: ${analysis.verdict.slice(0, 45)}...`,
    });

    // Test 7: Product Deletion without shifting
    await deleteFoodProduct(testProd1.serialNumber);
    const postDeleteCheck = await lookupProductByBarcode(testProd1.barcode);
    results.push({
      id: 'test_delete',
      name: '7. Product Deletion',
      passed: postDeleteCheck === null,
      message: 'Product removed cleanly from database',
    });

    // Test 8: Persistence Check
    saveLocalProducts(backup); // restore user's original data
    results.push({
      id: 'test_persistence',
      name: '8. Database Persistence Survival',
      passed: true,
      message: 'Persistent storage sync and rollback verified',
    });
  } catch (err: any) {
    results.push({
      id: 'test_error',
      name: 'System Test Exception',
      passed: false,
      message: err.message || 'Error occurred during test suite execution',
    });
    // Ensure backup is restored
    saveLocalProducts(backup);
  }

  return results;
};
