// src/api/nutrilensService.ts
import api from './axios';

export interface NutriLensProduct {
  found: boolean;
  barcode: string;
  product_name: string;
  brand: string;
  image?: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  saturated_fat: number;
  ingredients: string;
  allergens: string[];
  categories: string[];
  nutriscore_grade?: string;
  health_score: number;
  health_verdict: string;
  calories_level: string;
  sugar_level: string;
  fat_level: string;
  sodium_level: string;
  protein_level: string;
}

export interface NutriLensAlternative {
  barcode: string;
  product_name: string;
  brand: string;
  image?: string;
  calories: number;
  protein: number;
  sugar: number;
  sodium: number;
  health_score: number;
}

export interface VerdictResponse {
  ai_verdict: string;
  personalized_recommendation?: string;
  source: string;
}

export const scanBarcode = async (barcode: string): Promise<NutriLensProduct> => {
  const clean = barcode.trim().replace(/\s+/g, '');
  const response = await api.get<NutriLensProduct>(`/nutrilens/scan/${clean}`);
  return response.data;
};

export const getAiVerdict = async (product: NutriLensProduct): Promise<VerdictResponse> => {
  const response = await api.post<VerdictResponse>('/nutrilens/verdict', {
    barcode: product.barcode,
    product_name: product.product_name,
    calories: product.calories,
    protein: product.protein,
    carbohydrates: product.carbohydrates,
    fat: product.fat,
    sugar: product.sugar,
    sodium: product.sodium,
    fiber: product.fiber,
    health_score: product.health_score,
    ingredients: product.ingredients,
    allergens: product.allergens,
  });
  return response.data;
};

export const getAlternatives = async (
  barcode: string,
  category: string
): Promise<NutriLensAlternative[]> => {
  const response = await api.get<{ alternatives: NutriLensAlternative[] }>(
    `/nutrilens/alternatives/${barcode}`,
    { params: { category } }
  );
  return response.data.alternatives;
};
