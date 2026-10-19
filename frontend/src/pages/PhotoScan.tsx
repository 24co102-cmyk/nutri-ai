// src/pages/PhotoScan.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import api from '../api/axios';
import {
  Camera, Upload, Sparkles, CheckCircle2, RefreshCw,
  FlipHorizontal, PlusCircle, Search, X, Info, Star, AlertCircle,
  ShieldCheck, HelpCircle, Sliders, ShoppingBasket, Download, Eye,
  Check, Layers
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────────────────
export interface DetectedFoodItem {
  name: string;
  category: string;
  serving: string;
  serving_grams: number;
  quantity: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  health_score: string;
  emoji: string;
  confidence: number;
  micronutrients: string[];
  benefits: string;
  ai_tip: string;
  matched_catalog: boolean;
  catalog_id?: string | null;
  catalog_name?: string | null;
  reference_source: string;
  is_approximate: boolean;
  notes?: string | null;
  image_file?: string | null;
  image_url?: string | null;
  nutrition_per_100g?: {
    calories_kcal: number;
    protein_g: number;
    carbohydrates_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g: number;
    sodium_mg: number;
  };
}

export interface PlateSummary {
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  total_sugar_g: number;
  total_sodium_mg: number;
  item_count: number;
  matched_count: number;
  unmatched_count: number;
}

export interface BasketItem {
  id: string;
  name: string;
  category: string;
  basket_category: string;
  typical_serving: string;
  serving_grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  notes: string;
  image_file: string;
  svg_url: string | null;
  photo_url: string | null;
  has_photo: boolean;
  image_type: 'photograph' | 'reference_illustration';
  download_filename: string;
  is_approximate: boolean;
  reference_source: string;
}

export interface BasketCategory {
  name: string;
  count: number;
}

interface FoodInfo {
  name: string;
  emoji: string;
  category: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  serving: string;
  health_score: string;
  micronutrients: string[];
  benefits: string;
  ai_tip: string;
  catalog_id?: string;
  image_file?: string;
  notes?: string;
}

const DEFAULT_POPULAR_FOODS: FoodInfo[] = [
  { name: 'Apple', emoji: '🍎', category: 'Fruits', calories: 52, protein_g: 0.3, carbs_g: 13.8, fat_g: 0.2, fiber_g: 2.4, sugar_g: 10.4, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Potassium', 'Fiber'], benefits: 'Pectin fiber promotes digestive health and satiety.', ai_tip: 'Eat fresh with peel for optimal fiber intake.', catalog_id: 'food_0001', image_file: 'images/apple.svg', notes: 'Generic raw fruit estimate; variety and ripeness change values.' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits', calories: 89, protein_g: 1.1, carbs_g: 22.8, fat_g: 0.3, fiber_g: 2.6, sugar_g: 12.2, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Potassium', 'Vitamin B6', 'Magnesium'], benefits: 'Rich in potassium supporting muscle contraction and energy.', ai_tip: 'Great natural pre-workout snack.', catalog_id: 'food_0002', image_file: 'images/banana.svg', notes: 'Generic raw fruit estimate.' },
  { name: 'Orange', emoji: '🍊', category: 'Fruits', calories: 47, protein_g: 0.9, carbs_g: 11.8, fat_g: 0.1, fiber_g: 2.4, sugar_g: 9.4, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Folate'], benefits: 'High vitamin C strengthens immunity and iron absorption.', ai_tip: 'Eat whole segments rather than juice to retain fiber.', catalog_id: 'food_0003', image_file: 'images/orange.svg' },
  { name: 'Mango', emoji: '🥭', category: 'Fruits', calories: 60, protein_g: 0.8, carbs_g: 15.0, fat_g: 0.4, fiber_g: 1.6, sugar_g: 13.7, sodium_mg: 1, serving: '100g', health_score: 'B+', micronutrients: ['Vitamin A', 'Vitamin C'], benefits: 'Vitamin A supports eye and immune health.', ai_tip: 'Pair with protein to moderate glycemic impact.', catalog_id: 'food_0004', image_file: 'images/mango.svg' },
  { name: 'Spinach', emoji: '🌿', category: 'Vegetables', calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4, fiber_g: 2.2, sugar_g: 0.4, sodium_mg: 30, serving: '100g', health_score: 'A+', micronutrients: ['Iron', 'Folate', 'Vitamin K'], benefits: 'Dense in iron and folate for blood vitality.', ai_tip: 'Lightly sauté or add to eggs and smoothies.', catalog_id: 'food_0037', image_file: 'images/spinach.svg' },
  { name: 'Broccoli', emoji: '🥦', category: 'Vegetables', calories: 34, protein_g: 2.8, carbs_g: 6.6, fat_g: 0.4, fiber_g: 2.6, sugar_g: 1.7, sodium_mg: 30, serving: '100g', health_score: 'A+', micronutrients: ['Sulforaphane', 'Vitamin C'], benefits: 'Potent glucosinolates and antioxidant defenses.', ai_tip: 'Steam lightly for maximum micronutrient retention.', catalog_id: 'food_0039', image_file: 'images/broccoli.svg' },
  { name: 'Chicken breast cooked', emoji: '🍗', category: 'Protein', calories: 165, protein_g: 31.0, carbs_g: 0.0, fat_g: 3.6, fiber_g: 0.0, sugar_g: 0.0, sodium_mg: 120, serving: '100g', health_score: 'A+', micronutrients: ['Niacin', 'Selenium', 'Phosphorus'], benefits: 'Lean complete protein ideal for muscle repair and satiety.', ai_tip: 'Grill or bake with aromatic herbs.', catalog_id: 'food_0088', image_file: 'images/chicken_breast_cooked.svg' },
  { name: 'Salmon cooked', emoji: '🐟', category: 'Protein', calories: 206, protein_g: 22.1, carbs_g: 0.0, fat_g: 12.4, fiber_g: 0.0, sugar_g: 0.0, sodium_mg: 120, serving: '100g', health_score: 'A+', micronutrients: ['Omega-3 DHA', 'Vitamin D', 'B12'], benefits: 'Heart-healthy omega-3 fatty acids for cognitive and joint health.', ai_tip: 'Bake with lemon and fresh dill.', catalog_id: 'food_0090', image_file: 'images/salmon_cooked.svg' },
  { name: 'Egg whole cooked', emoji: '🥚', category: 'Protein', calories: 155, protein_g: 12.6, carbs_g: 1.1, fat_g: 10.6, fiber_g: 0.0, sugar_g: 1.1, sodium_mg: 120, serving: '100g', health_score: 'A', micronutrients: ['Choline', 'Vitamin D', 'Lutein'], benefits: 'Complete amino acid profile plus choline for brain health.', ai_tip: 'Hard boil for convenient high-protein meal prep.', catalog_id: 'food_0087', image_file: 'images/egg_whole_cooked.svg' },
  { name: 'Dal cooked', emoji: '🥘', category: 'Legumes', calories: 116, protein_g: 9.0, carbs_g: 20.0, fat_g: 0.4, fiber_g: 7.9, sugar_g: 1.8, sodium_mg: 10, serving: '100g', health_score: 'A+', micronutrients: ['Folate', 'Plant Iron', 'Potassium'], benefits: 'High plant protein and prebiotic dietary fiber.', ai_tip: 'Pair with whole grains for a complete protein profile.', catalog_id: 'food_0075', image_file: 'images/dal_cooked.svg' },
  { name: 'White rice cooked', emoji: '🍚', category: 'Grains', calories: 130, protein_g: 2.7, carbs_g: 28.2, fat_g: 0.3, fiber_g: 0.4, sugar_g: 0.1, sodium_mg: 10, serving: '100g', health_score: 'B+', micronutrients: ['Manganese', 'Selenium'], benefits: 'Clean, easily digestible complex carbohydrate fuel.', ai_tip: 'Pair with fiber-rich lentils and vegetable curries.', catalog_id: 'food_0061', image_file: 'images/white_rice_cooked.svg' },
  { name: 'Roti chapati', emoji: '🫓', category: 'Indian bread', calories: 297, protein_g: 9.0, carbs_g: 50.0, fat_g: 7.0, fiber_g: 7.0, sugar_g: 2.0, sodium_mg: 10, serving: '100g', health_score: 'A', micronutrients: ['Fiber', 'B Vitamins', 'Iron'], benefits: 'Whole wheat dietary fiber supports gut motility.', ai_tip: 'Make with minimal oil for light, nutritious carbs.', catalog_id: 'food_0065', image_file: 'images/roti_chapati.svg' },
  { name: 'Chicken biryani', emoji: '🍛', category: 'Indian rice dish', calories: 180, protein_g: 10.0, carbs_g: 20.0, fat_g: 6.0, fiber_g: 1.0, sugar_g: 2.0, sodium_mg: 300, serving: '100g', health_score: 'B+', micronutrients: ['Protein', 'Spices', 'Iron'], benefits: 'Complete savory meal with turmeric and warming digestive spices.', ai_tip: 'Serve with cucumber yogurt raita for cooling balance.', catalog_id: 'food_0100', image_file: 'images/chicken_biryani.svg' },
  { name: 'Paneer butter masala', emoji: '🧀', category: 'Indian curry', calories: 220, protein_g: 9.0, carbs_g: 10.0, fat_g: 16.0, fiber_g: 2.0, sugar_g: 5.0, sodium_mg: 300, serving: '100g', health_score: 'B', micronutrients: ['Calcium', 'Phosphorus', 'Lycopene'], benefits: 'Calcium and dairy protein in a rich spiced tomato gravy.', ai_tip: 'Enjoy in moderation alongside whole grain roti.', catalog_id: 'food_0107', image_file: 'images/paneer_butter_masala.svg' },
  { name: 'Almonds', emoji: '🥜', category: 'Nuts and seeds', calories: 579, protein_g: 21.2, carbs_g: 21.6, fat_g: 49.9, fiber_g: 12.5, sugar_g: 4.4, sodium_mg: 10, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin E', 'Magnesium', 'Fiber'], benefits: 'Heart-healthy monounsaturated fats and powerful vitamin E.', ai_tip: 'A small palm (25-30g) makes an optimal daily portion.', catalog_id: 'food_0093', image_file: 'images/almonds.svg' },
  { name: 'Oats dry', emoji: '🥣', category: 'Grains', calories: 389, protein_g: 16.9, carbs_g: 66.3, fat_g: 6.9, fiber_g: 10.6, sugar_g: 0.9, sodium_mg: 10, serving: '100g', health_score: 'A+', micronutrients: ['Beta-glucan', 'Iron', 'Zinc'], benefits: 'Soluble beta-glucan fiber helps maintain healthy cholesterol.', ai_tip: 'Prepare as overnight oats with berries and seeds.', catalog_id: 'food_0063', image_file: 'images/oats_dry.svg' },
  { name: 'Greek yogurt plain', emoji: '🥛', category: 'Dairy', calories: 97, protein_g: 9.0, carbs_g: 3.9, fat_g: 5.0, fiber_g: 0.0, sugar_g: 3.2, sodium_mg: 10, serving: '100g', health_score: 'A+', micronutrients: ['Probiotics', 'Calcium', 'Protein'], benefits: 'Living active probiotics support gut microbiome balance.', ai_tip: 'Top with chia seeds and blueberries for morning energy.', catalog_id: 'food_0085', image_file: 'images/greek_yogurt_plain.svg' },
  { name: 'Avocado', emoji: '🥑', category: 'Fruits', calories: 160, protein_g: 2.0, carbs_g: 8.5, fat_g: 14.7, fiber_g: 6.7, sugar_g: 0.7, sodium_mg: 1, serving: '100g', health_score: 'A+', micronutrients: ['Oleic acid', 'Potassium', 'Folate'], benefits: 'Monounsaturated fats enhance nutrient bioavailability.', ai_tip: 'Slice into fresh salads or mash with lemon.', catalog_id: 'food_0017', image_file: 'images/avocado.svg' },
];

const scoreColor: Record<string, string> = {
  'A+': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'A': 'text-green-700 bg-green-50 border-green-200',
  'B+': 'text-blue-700 bg-blue-50 border-blue-200',
  'B': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  'C+': 'text-amber-700 bg-amber-50 border-amber-200',
  'C': 'text-orange-700 bg-orange-50 border-orange-200',
  'D': 'text-rose-700 bg-rose-50 border-rose-200',
};

// ────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────────────
const PhotoScan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'browse' | 'basket'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Multi-item plate state
  const [detectedItems, setDetectedItems] = useState<DetectedFoodItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [plateSummary, setPlateSummary] = useState<PlateSummary | null>(null);

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [loggingMeal, setLoggingMeal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [_, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Database food catalog for Browse tab
  const [dbFoods, setDbFoods] = useState<FoodInfo[]>(DEFAULT_POPULAR_FOODS);

  // Food Basket Gallery State
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [basketCategories, setBasketCategories] = useState<BasketCategory[]>([]);
  const [basketActiveCategory, setBasketActiveCategory] = useState<string>('All Foods');
  const [basketSearch, setBasketSearch] = useState<string>('');
  const [basketPhotosOnly, setBasketPhotosOnly] = useState<boolean>(false);
  const [basketLoading, setBasketLoading] = useState<boolean>(false);
  const [selectedBasketItem, setSelectedBasketItem] = useState<BasketItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load complete catalog from backend on mount
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/foods/?limit=300');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped: FoodInfo[] = res.data.map((f: any) => ({
            name: f.name,
            emoji: f.emoji || (f.category?.toLowerCase().includes('fruit') ? '🍎' : f.category?.toLowerCase().includes('vegetable') ? '🥦' : '🍲'),
            category: f.category || 'General',
            calories: Number(f.calories) || 0,
            protein_g: Number(f.protein) || 0,
            carbs_g: Number(f.carbs) || 0,
            fat_g: Number(f.fat) || 0,
            fiber_g: Number(f.fiber) || 0,
            sugar_g: typeof f.sugar === 'string' ? parseFloat(f.sugar) || 0 : 0,
            sodium_mg: typeof f.sodium === 'string' ? parseFloat(f.sodium) || 0 : 0,
            serving: f.serving_size || '100g',
            health_score: f.nutrition_grade || 'A',
            micronutrients: ['NutriEmotion Benchmark'],
            benefits: f.notes || 'Nutrient benchmark from reference starter catalog.',
            ai_tip: 'Reference food item verified in local database.',
            catalog_id: f.catalog_id,
            image_file: f.image_file,
            notes: f.notes,
          }));
          setDbFoods(mapped);
        }
      } catch (e) {
        console.warn('Using default starter catalog items for browse.');
      }
    };
    fetchCatalog();
  }, []);

  // Fetch Food Basket items from backend
  useEffect(() => {
    const fetchBasket = async () => {
      setBasketLoading(true);
      try {
        const res = await api.get('/photo/basket');
        if (res.data?.success && Array.isArray(res.data?.items)) {
          setBasketItems(res.data.items);
          setBasketCategories(res.data.categories || []);
        }
      } catch (e) {
        console.error('Failed to load Food Basket items:', e);
      } finally {
        setBasketLoading(false);
      }
    };
    fetchBasket();
  }, []);

  const startCamera = async (facing: 'environment' | 'user') => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraActive(true);
    } catch {
      setCameraError('Camera not accessible. Please use Upload or Browse tab.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') startCamera(cameraFacing);
    else stopCamera();
    return () => stopCamera();
  }, [activeTab]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreview(dataUrl);
      canvas.toBlob(blob => {
        if (blob) {
          const f = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setFile(f);
          setDetectedItems([]);
          setPlateSummary(null);
        }
      }, 'image/jpeg');
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setDetectedItems([]);
      setPlateSummary(null);
      setErrorMessage(null);
      setStatusMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setDetectedItems([]);
      setPlateSummary(null);
      setErrorMessage(null);
      setStatusMessage(null);
    }
  };

  // Helper to recalculate plate totals locally
  const recalculatePlateTotals = (items: DetectedFoodItem[]): PlateSummary => {
    const total_cal = Math.round(items.reduce((acc, it) => acc + (it.calories || 0), 0) * 10) / 10;
    const total_prot = Math.round(items.reduce((acc, it) => acc + (it.protein_g || 0), 0) * 10) / 10;
    const total_carb = Math.round(items.reduce((acc, it) => acc + (it.carbs_g || 0), 0) * 10) / 10;
    const total_fat = Math.round(items.reduce((acc, it) => acc + (it.fat_g || 0), 0) * 10) / 10;
    const total_fiber = Math.round(items.reduce((acc, it) => acc + (it.fiber_g || 0), 0) * 10) / 10;
    const total_sugar = Math.round(items.reduce((acc, it) => acc + (it.sugar_g || 0), 0) * 10) / 10;
    const total_sodium = Math.round(items.reduce((acc, it) => acc + (it.sodium_mg || 0), 0) * 10) / 10;
    const matched = items.filter(it => it.matched_catalog).length;
    return {
      total_calories: total_cal,
      total_protein_g: total_prot,
      total_carbs_g: total_carb,
      total_fat_g: total_fat,
      total_fiber_g: total_fiber,
      total_sugar_g: total_sugar,
      total_sodium_mg: total_sodium,
      item_count: items.length,
      matched_count: matched,
      unmatched_count: items.length - matched,
    };
  };

  const handleAnalyze = async () => {
    if (!file && !preview) return;
    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await api.post('/photo/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (preview && preview.startsWith('data:')) {
        res = await api.post('/photo/analyze', { image_base64: preview });
      } else {
        res = await api.post('/photo/analyze', { image_url: preview });
      }

      if (res.data?.success && res.data?.is_food && res.data.detected_items?.length > 0) {
        const items: DetectedFoodItem[] = res.data.detected_items;
        setDetectedItems(items);
        setActiveItemIndex(0);
        setPlateSummary(res.data.plate_summary || recalculatePlateTotals(items));
        setStatusMessage(res.data.message || `Identified ${items.length} food item(s) on plate.`);
      } else {
        setDetectedItems([]);
        setPlateSummary(null);
        setErrorMessage(
          res.data?.message || 'No food could be recognized in this image. Please pick from the food database or enter values manually.'
        );
      }
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setDetectedItems([]);
      setPlateSummary(null);
      setErrorMessage(
        err.response?.data?.detail || err.message || 'AI vision service unavailable. Please check your connection or select from catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Adjust grams or quantity for a detected item
  const handleUpdatePortion = (index: number, newGrams: number, newQty: number) => {
    setDetectedItems(prev => {
      const updated = [...prev];
      if (!updated[index]) return prev;
      const item = { ...updated[index] };
      const grams = Math.max(1, newGrams);
      const qty = Math.max(0.1, newQty);
      const factor = (grams / 100.0) * qty;

      const base = item.nutrition_per_100g || {
        calories_kcal: (item.calories / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        protein_g: (item.protein_g / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        carbohydrates_g: (item.carbs_g / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        fat_g: (item.fat_g / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        fiber_g: (item.fiber_g / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        sugar_g: (item.sugar_g / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
        sodium_mg: (item.sodium_mg / ((item.serving_grams || 100) / 100 * (item.quantity || 1))) || 0,
      };

      item.serving_grams = Math.round(grams);
      item.quantity = Math.round(qty * 10) / 10;
      item.serving = `${Math.round(grams * qty)}g`;
      item.calories = Math.round((base.calories_kcal || 0) * factor * 10) / 10;
      item.protein_g = Math.round((base.protein_g || 0) * factor * 10) / 10;
      item.carbs_g = Math.round((base.carbohydrates_g || 0) * factor * 10) / 10;
      item.fat_g = Math.round((base.fat_g || 0) * factor * 10) / 10;
      item.fiber_g = Math.round((base.fiber_g || 0) * factor * 10) / 10;
      item.sugar_g = Math.round((base.sugar_g || 0) * factor * 10) / 10;
      item.sodium_mg = Math.round((base.sodium_mg || 0) * factor * 10) / 10;

      updated[index] = item;
      setPlateSummary(recalculatePlateTotals(updated));
      return updated;
    });
  };

  // Log all scanned plate items to meals database
  const handleLogToMeals = async () => {
    if (detectedItems.length === 0 || loggingMeal) return;
    setLoggingMeal(true);
    try {
      const mealItems = detectedItems.map(it => ({
        food_name: it.name,
        quantity: it.quantity,
        calories: it.calories,
        protein: it.protein_g,
        carbs: it.carbs_g,
        fat: it.fat_g,
      }));

      await api.post('/meals/', {
        meal_type: mealType,
        date: new Date().toISOString(),
        items: mealItems,
      });

      setLogSuccess(true);
      try {
        localStorage.removeItem('nutrilens:cached-meals');
        window.dispatchEvent(new Event('nutrilens:meals-updated'));
      } catch (e) {}
      setTimeout(() => setLogSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to log meal:', err);
      alert('Could not log meal to database. Please check your network connection.');
    } finally {
      setLoggingMeal(false);
    }
  };

  const handleSelectFood = (food: FoodInfo) => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    const filename = food.image_file ? food.image_file.replace(/^images\//, '') : '';
    const imgUrl = filename ? `/food_reference_images/${filename}` : null;

    const item: DetectedFoodItem = {
      name: food.name,
      category: food.category || 'Meal',
      serving: food.serving || '100g',
      serving_grams: 100.0,
      quantity: 1.0,
      calories: food.calories,
      protein_g: food.protein_g,
      carbs_g: food.carbs_g,
      fat_g: food.fat_g,
      fiber_g: food.fiber_g,
      sugar_g: food.sugar_g,
      sodium_mg: food.sodium_mg,
      health_score: food.health_score || 'A',
      emoji: food.emoji || '🥗',
      confidence: 100.0,
      micronutrients: food.micronutrients || ['NutriEmotion Benchmark'],
      benefits: food.benefits || 'Reference item from NutriEmotion starter catalog.',
      ai_tip: food.ai_tip || 'Portion adjustable via reference controls.',
      matched_catalog: true,
      catalog_id: food.catalog_id || null,
      catalog_name: food.name,
      reference_source: 'NutriEmotion Food Reference Starter Catalog',
      is_approximate: true,
      notes: food.notes || 'Generic reference estimate from starter catalog.',
      image_file: food.image_file,
      image_url: imgUrl,
      nutrition_per_100g: {
        calories_kcal: food.calories,
        protein_g: food.protein_g,
        carbohydrates_g: food.carbs_g,
        fat_g: food.fat_g,
        fiber_g: food.fiber_g,
        sugar_g: food.sugar_g,
        sodium_mg: food.sodium_mg,
      },
    };

    setDetectedItems([item]);
    setActiveItemIndex(0);
    setPlateSummary(recalculatePlateTotals([item]));
    setPreview(null);
    setActiveTab('upload');
  };

  // Download genuine image from Food Basket
  const handleDownloadImage = async (item: BasketItem, preferredFormat: 'photo' | 'svg' = 'photo') => {
    setDownloadingId(item.id);
    try {
      const filename = (preferredFormat === 'photo' && item.has_photo)
        ? item.download_filename
        : (item.image_file ? item.image_file.replace(/^images\//, '') : `${item.name.toLowerCase().replace(/\s+/g, '_')}.svg`);

      const res = await api.get(`/photo/basket/download?item_id=${item.id}&preferred=${preferredFormat}`, {
        responseType: 'blob',
      });

      const mimeType = preferredFormat === 'photo' && item.has_photo ? 'image/jpeg' : 'image/svg+xml';
      const blob = new Blob([res.data], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadSuccessId(item.id);
      setTimeout(() => setDownloadSuccessId(null), 2500);
    } catch (err: any) {
      console.error('Failed to download image:', err);
      alert(`Could not download image for ${item.name}. Please ensure the server is online.`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Test an image from Food Basket in AI Scanner
  const handleTestInScanner = (item: BasketItem) => {
    const targetUrl = item.photo_url || item.svg_url;
    if (!targetUrl) return;

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(targetUrl);
    setFile(null);
    setDetectedItems([]);
    setPlateSummary(null);
    setSelectedBasketItem(null);
    setActiveTab('upload');
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(dbFoods.map(f => f.category)))];
  }, [dbFoods]);

  const filteredFoods = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return dbFoods.filter(f => {
      const matchCat = activeCategory === 'All' || f.category === activeCategory;
      const matchSearch = !searchLower || f.name.toLowerCase().includes(searchLower);
      return matchCat && matchSearch;
    });
  }, [dbFoods, activeCategory, searchQuery]);

  // Filtered Food Basket items
  const filteredBasketItems = useMemo(() => {
    const q = basketSearch.toLowerCase().trim();
    return basketItems.filter(item => {
      const matchCat = basketActiveCategory === 'All Foods' || item.basket_category === basketActiveCategory;
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchPhotos = !basketPhotosOnly || item.has_photo;
      return matchCat && matchSearch && matchPhotos;
    });
  }, [basketItems, basketActiveCategory, basketSearch, basketPhotosOnly]);

  const activeItem = detectedItems[activeItemIndex] || null;

  const macroBar = (val: number, max: number, color: string) => (
    <div className="w-full bg-neutral-100 rounded-full h-2">
      <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min((val / max) * 100, 100)}%` }} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* ━━━ Header Card ━━━ */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-2 border border-cyan-200/80">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Computer Vision • 233 Reference Catalog Foods • 42 HD Photographs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Food Photo Scanner
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
            Upload meal photos, capture with live camera, cross-reference verified catalog benchmarks, adjust portions, and explore the new Food Basket reference gallery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
          <div className="text-right px-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Vision Engine</span>
            <span className="text-xs font-black text-emerald-700">Gemini Vision Active</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
        </div>
      </div>

      {/* ━━━ Main Switcher Tabs (Including Food Basket) ━━━ */}
      <div className="bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/80 flex gap-1">
        {[
          { key: 'upload', label: 'Upload Image', icon: Upload },
          { key: 'camera', label: 'Camera Scan', icon: Camera },
          { key: 'browse', label: 'Browse Quick List', icon: Search },
          { key: 'basket', label: 'Food Basket Gallery', icon: ShoppingBasket, count: 233 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{tab.label}</span>
              {tab.count && (
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full ml-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ━━━ TAB 4: FOOD BASKET GALLERY ━━━ */}
      {activeTab === 'basket' && (
        <div className="space-y-5">
          {/* Basket Header & Controls */}
          <div className="premium-card p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <ShoppingBasket className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h2 className="text-xl font-extrabold text-neutral-900">Food Basket Reference Library</h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Search 233 authenticated food reference items across 10 categories, download real image files with descriptive filenames, or send directly into the AI Photo Scanner.
                </p>
              </div>

              {/* Photo Filter Toggle */}
              <button
                onClick={() => setBasketPhotosOnly(!basketPhotosOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  basketPhotosOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-300'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Show Real Photos Only (42)</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food by name, alias, or ingredient (e.g. apple, biryani, spinach, pizza, salmon)..."
                value={basketSearch}
                onChange={(e) => setBasketSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:outline-none font-medium text-neutral-900"
              />
              {basketSearch && (
                <button
                  onClick={() => setBasketSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills with Live Accurate Counts */}
            <div className="flex gap-1.5 flex-wrap">
              {basketCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setBasketActiveCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 ${
                    basketActiveCategory === cat.name
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    basketActiveCategory === cat.name ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs px-1 text-neutral-500 font-medium">
            <span>
              Showing <strong className="text-neutral-900">{filteredBasketItems.length}</strong> available food items in{' '}
              <strong className="text-neutral-900">{basketActiveCategory}</strong>
              {basketPhotosOnly && ' (Photographs Only)'}
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Genuine Stored Assets
            </span>
          </div>

          {/* Food Basket Cards Grid */}
          {basketLoading ? (
            <div className="premium-card p-12 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-neutral-800">Loading Food Basket Gallery...</p>
            </div>
          ) : filteredBasketItems.length === 0 ? (
            <div className="premium-card p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-800">No foods found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No items match your search for "{basketSearch}". Try selecting "All Foods" or clearing the search filter.
              </p>
              <button
                onClick={() => {
                  setBasketSearch('');
                  setBasketActiveCategory('All Foods');
                  setBasketPhotosOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBasketItems.map((item) => (
                <div
                  key={item.id}
                  className="premium-card overflow-hidden flex flex-col justify-between group hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  {/* Card Image Area */}
                  <div
                    onClick={() => setSelectedBasketItem(item)}
                    className="relative bg-[#faf9f8] p-4 flex items-center justify-center min-h-[170px] border-b border-neutral-100 cursor-pointer overflow-hidden"
                  >
                    {item.has_photo && item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to SVG if photo file fails
                          if (item.svg_url) (e.target as HTMLImageElement).src = item.svg_url;
                        }}
                      />
                    ) : item.svg_url ? (
                      <img
                        src={item.svg_url}
                        alt={item.name}
                        className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
                        <ShoppingBasket className="w-8 h-8" />
                      </div>
                    )}

                    {/* Image Type Badge */}
                    <div className="absolute top-3 right-3">
                      {item.has_photo ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                          <Camera className="w-2.5 h-2.5" />
                          HD Photo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-900/70 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5" />
                          SVG Card
                        </span>
                      )}
                    </div>

                    {/* Quick View Button Hover Overlay */}
                    <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                          {item.basket_category}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {item.id}
                        </span>
                      </div>
                      <h4
                        onClick={() => setSelectedBasketItem(item)}
                        className="text-sm font-extrabold text-neutral-900 tracking-tight hover:text-emerald-700 cursor-pointer line-clamp-1"
                      >
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Serving: {item.typical_serving}
                      </p>

                      {/* Macro Chips */}
                      <div className="grid grid-cols-4 gap-1 text-center mt-2.5 pt-2 border-t border-neutral-100">
                        <div className="bg-[#faf9f8] p-1 rounded-lg">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase block">Cal</span>
                          <span className="text-xs font-black text-neutral-900">{item.calories}</span>
                        </div>
                        <div className="bg-[#faf9f8] p-1 rounded-lg">
                          <span className="text-[9px] font-bold text-blue-600 uppercase block">P</span>
                          <span className="text-xs font-black text-blue-900">{item.protein_g}g</span>
                        </div>
                        <div className="bg-[#faf9f8] p-1 rounded-lg">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase block">C</span>
                          <span className="text-xs font-black text-emerald-900">{item.carbs_g}g</span>
                        </div>
                        <div className="bg-[#faf9f8] p-1 rounded-lg">
                          <span className="text-[9px] font-bold text-amber-600 uppercase block">F</span>
                          <span className="text-xs font-black text-amber-900">{item.fat_g}g</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                      {/* Download Action */}
                      <button
                        onClick={() => handleDownloadImage(item, item.has_photo ? 'photo' : 'svg')}
                        disabled={downloadingId === item.id}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all border ${
                          downloadSuccessId === item.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                        }`}
                      >
                        {downloadSuccessId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Downloaded {item.download_filename}!</span>
                          </>
                        ) : downloadingId === item.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Download {item.download_filename}</span>
                          </>
                        )}
                      </button>

                      {/* Test in Scanner Action */}
                      <button
                        onClick={() => handleTestInScanner(item)}
                        className="w-full py-1.5 px-3 rounded-xl text-[10px] font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Test in AI Scanner</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ━━━ Detail Modal ━━━ */}
          {selectedBasketItem && (
            <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 border border-neutral-200 shadow-2xl relative my-8">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBasketItem(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Title & Badges */}
                <div className="pr-8">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold">
                      {selectedBasketItem.basket_category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      ID: {selectedBasketItem.id}
                    </span>
                    {selectedBasketItem.has_photo && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        Genuine HD Photograph Available
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                    {selectedBasketItem.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                    Standard Reference Serving: {selectedBasketItem.typical_serving}
                  </p>
                </div>

                {/* Image Display */}
                <div className="rounded-2xl bg-[#faf9f8] p-6 border border-neutral-200 flex items-center justify-center max-h-64 overflow-hidden relative">
                  {selectedBasketItem.has_photo && selectedBasketItem.photo_url ? (
                    <img
                      src={selectedBasketItem.photo_url}
                      alt={selectedBasketItem.name}
                      className="max-h-52 w-auto object-contain rounded-xl"
                    />
                  ) : selectedBasketItem.svg_url ? (
                    <img
                      src={selectedBasketItem.svg_url}
                      alt={selectedBasketItem.name}
                      className="max-h-52 w-auto object-contain"
                    />
                  ) : (
                    <ShoppingBasket className="w-16 h-16 text-neutral-400" />
                  )}
                </div>

                {/* Nutrition Breakdown per 100g */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Reference Nutrition (Per 100g)
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700">
                      Starter Catalog Benchmark
                    </span>
                  </div>

                  {/* 4 Core Macros */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200/70">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block">Calories</span>
                      <span className="text-base font-black text-neutral-900">{selectedBasketItem.calories}</span>
                      <span className="text-[10px] text-neutral-400">kcal</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200/70">
                      <span className="text-[10px] font-bold text-blue-600 uppercase block">Protein</span>
                      <span className="text-base font-black text-blue-900">{selectedBasketItem.protein_g}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200/70">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase block">Carbs</span>
                      <span className="text-base font-black text-emerald-900">{selectedBasketItem.carbs_g}g</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200/70">
                      <span className="text-[10px] font-bold text-amber-600 uppercase block">Fat</span>
                      <span className="text-base font-black text-amber-900">{selectedBasketItem.fat_g}g</span>
                    </div>
                  </div>

                  {/* Fiber, Sugar, Sodium */}
                  <div className="space-y-2 pt-2">
                    {[
                      { label: 'Dietary Fiber', val: selectedBasketItem.fiber_g, max: 20, color: 'bg-emerald-600', unit: 'g' },
                      { label: 'Sugar', val: selectedBasketItem.sugar_g, max: 30, color: 'bg-purple-500', unit: 'g' },
                      { label: 'Sodium', val: selectedBasketItem.sodium_mg, max: 1500, color: 'bg-neutral-400', unit: 'mg' },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-neutral-600">{m.label}</span>
                          <span className="font-bold text-neutral-900">{m.val}{m.unit}</span>
                        </div>
                        {macroBar(m.val, m.max, m.color)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes and Limitations Box */}
                {selectedBasketItem.notes && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-neutral-500" />
                      Catalog Reference Notes
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                      {selectedBasketItem.notes}
                    </p>
                  </div>
                )}

                {/* Modal Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => handleDownloadImage(selectedBasketItem, selectedBasketItem.has_photo ? 'photo' : 'svg')}
                    disabled={downloadingId === selectedBasketItem.id}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download {selectedBasketItem.download_filename}</span>
                  </button>

                  <button
                    onClick={() => handleTestInScanner(selectedBasketItem)}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Test in AI Vision Scanner</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ SCANNER VIEW (Upload, Camera, Browse) ━━━ */}
      {activeTab !== 'basket' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* ━━━ LEFT: Scanner Panel (6 cols) ━━━ */}
          <div className="xl:col-span-6 space-y-4">
            {/* Quick Banner Linking to Food Basket */}
            <div
              onClick={() => setActiveTab('basket')}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/80 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShoppingBasket className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-black text-neutral-900 group-hover:text-emerald-700">
                    Food Basket Library
                  </span>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    233 benchmark foods & 42 real photos available to browse & download
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                Open Basket →
              </span>
            </div>

            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <div className="premium-card p-6 space-y-4">
                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-neutral-200">
                    <img src={preview} alt="Food capture" className="w-full h-64 object-cover" />
                    <button
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                        setDetectedItems([]);
                        setPlateSummary(null);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-neutral-700 rounded-xl shadow-md transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl h-60 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-neutral-200 hover:border-emerald-400 hover:bg-[#faf9f8]/50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200/80">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-neutral-800">Drop food photograph here</p>
                    <p className="text-xs text-neutral-400 mt-1 font-medium">or click to browse local files</p>
                    <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 px-2.5 py-0.5 rounded-full mt-2.5">
                      JPG, PNG, WEBP (Supports single or multi-food meals)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={(!file && !preview) || loading}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing image with Gemini Vision...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Food Recognition</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* CAMERA TAB */}
            {activeTab === 'camera' && (
              <div className="premium-card p-6 space-y-4">
                <div className="relative bg-neutral-900 rounded-2xl overflow-hidden min-h-[256px] flex items-center justify-center border border-neutral-800">
                  {preview ? (
                    <div className="relative w-full">
                      <img src={preview} alt="Captured food" className="w-full h-64 object-cover" />
                      <button
                        onClick={() => {
                          setPreview(null);
                          setDetectedItems([]);
                          setPlateSummary(null);
                          startCamera(cameraFacing);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/90 text-neutral-700 rounded-xl shadow-md"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : cameraError ? (
                    <div className="text-center p-8">
                      <Camera className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
                      <p className="text-neutral-300 text-xs font-medium">{cameraError}</p>
                    </div>
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 border-4 border-transparent pointer-events-none">
                        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-emerald-400 rounded-br" />
                      </div>
                      <button
                        onClick={() => {
                          setCameraFacing((f) => (f === 'environment' ? 'user' : 'environment'));
                          startCamera(cameraFacing === 'environment' ? 'user' : 'environment');
                        }}
                        className="absolute top-4 right-4 p-2 bg-neutral-900/60 hover:bg-neutral-900/80 text-white rounded-xl backdrop-blur-sm"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {preview ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing Food...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze Captured Photo</span>
                      </>
                    )}
                  </button>
                ) : (
                  !cameraError && (
                    <button
                      onClick={capturePhoto}
                      className="w-full py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                  )
                )}
              </div>
            )}

            {/* BROWSE TAB */}
            {activeTab === 'browse' && (
              <div className="premium-card p-5 space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter 233 reference foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:outline-none font-medium"
                  />
                </div>

                {/* Category filter */}
                <div className="flex gap-1.5 flex-wrap max-h-24 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                        activeCategory === cat
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Food grid */}
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.catalog_id || food.name}
                      onClick={() => handleSelectFood(food)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left"
                    >
                      {food.image_file ? (
                        <img
                          src={`/food_reference_images/${food.image_file.replace(/^images\//, '')}`}
                          alt={food.name}
                          className="w-7 h-7 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xl shrink-0">{food.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{food.name}</p>
                        <p className="text-[10px] text-neutral-400">{food.calories} kcal • {food.protein_g}g P</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${scoreColor[food.health_score] || 'bg-[#faf9f8] text-neutral-500 border-neutral-200'}`}>
                        {food.health_score}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ━━━ RIGHT: Nutrition Result Panel (6 cols) ━━━ */}
          <div className="xl:col-span-6">
            {errorMessage && !loading && detectedItems.length === 0 && (
              <div className="premium-card p-6 mb-4 border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Recognition Note</span>
                </div>
                <p className="text-xs text-rose-600 leading-relaxed font-medium">
                  {errorMessage}
                </p>
                <button
                  onClick={() => {
                    setErrorMessage(null);
                    setActiveTab('basket');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all"
                >
                  Browse Food Basket Gallery →
                </button>
              </div>
            )}

            {detectedItems.length === 0 && !loading && (
              <div className="premium-card p-8 flex flex-col items-center justify-center min-h-[420px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center mb-4">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Food Analysis Panel</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs font-medium">
                  Upload or capture a photo. NutriLens recognizes multiple items, cross-references verified reference data, and calculates plate nutrition totals.
                </p>
                <div className="grid grid-cols-3 gap-2.5 mt-6 w-full max-w-xs">
                  {[['🥦', 'Broccoli'], ['🍗', 'Chicken breast cooked'], ['🍎', 'Apple']].map(([e, n]) => (
                    <button
                      key={n}
                      onClick={() => {
                        setErrorMessage(null);
                        const target = dbFoods.find((f) => f.name.toLowerCase() === n.toLowerCase()) || dbFoods[0];
                        handleSelectFood(target);
                      }}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#faf9f8] hover:bg-emerald-50 border border-neutral-200/80 hover:border-emerald-300 transition-all"
                    >
                      <span className="text-xl">{e}</span>
                      <span className="text-[11px] font-bold text-neutral-700 truncate w-full text-center">{n}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="premium-card p-8 flex flex-col items-center justify-center min-h-[420px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-bold text-neutral-800">Analyzing your meal with Gemini Vision...</p>
                <p className="text-xs text-neutral-400 mt-1 font-medium">Segmenting plate foods & cross-referencing catalog</p>
                <div className="mt-4 space-y-2 w-full max-w-xs">
                  {['Inspecting image with vision AI...', 'Matching food items in NutriEmotion catalog...', 'Calculating multi-item plate totals & macros...'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      <span className="text-xs text-neutral-500 font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detectedItems.length > 0 && !loading && (
              <div className="space-y-4">
                {/* ━━━ Combined Plate Summary Banner ━━━ */}
                {plateSummary && (
                  <div className="premium-card p-5 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-200/80">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wide">
                            PLATE TOTALS • {plateSummary.item_count} {plateSummary.item_count === 1 ? 'ITEM' : 'ITEMS'}
                          </span>
                          {plateSummary.matched_count > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {plateSummary.matched_count} Catalog Verified
                            </span>
                          )}
                          {plateSummary.unmatched_count > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <HelpCircle className="w-3 h-3 text-amber-600" />
                              {plateSummary.unmatched_count} AI Estimate
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black text-neutral-900 mt-1">
                          Plate Nutrition Overview
                        </h3>
                        {statusMessage && (
                          <p className="text-xs text-neutral-600 mt-0.5">{statusMessage}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-700 block">
                          {plateSummary.total_calories} <span className="text-xs font-bold text-neutral-500">kcal</span>
                        </span>
                      </div>
                    </div>

                    {/* Combined Totals Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-emerald-200/60">
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-blue-600 uppercase block">Protein</span>
                        <span className="text-sm font-black text-blue-900">{plateSummary.total_protein_g}g</span>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase block">Carbs</span>
                        <span className="text-sm font-black text-emerald-900">{plateSummary.total_carbs_g}g</span>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-amber-600 uppercase block">Fat</span>
                        <span className="text-sm font-black text-amber-900">{plateSummary.total_fat_g}g</span>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-purple-600 uppercase block">Fiber</span>
                        <span className="text-sm font-black text-purple-900">{plateSummary.total_fiber_g}g</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-Item Tabs (If > 1 item) */}
                {detectedItems.length > 1 && (
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {detectedItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveItemIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                          activeItemIndex === idx
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                        <span className="opacity-70 text-[10px]">({item.calories} kcal)</span>
                        {item.matched_catalog && (
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Active Item Details Card */}
                {activeItem && (
                  <div className="premium-card overflow-hidden">
                    {/* Item Header */}
                    <div className="p-6 border-b border-neutral-100 bg-[#faf9f8]/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {activeItem.image_url ? (
                            <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200/80 p-2 flex items-center justify-center shrink-0 shadow-2xs">
                              <img
                                src={activeItem.image_url}
                                alt={activeItem.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <span className="text-4xl shrink-0">{activeItem.emoji}</span>
                          )}

                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                {activeItem.category}
                              </span>
                              {activeItem.matched_catalog ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Catalog Verified Benchmark
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                                  <HelpCircle className="w-3 h-3 text-amber-600" />
                                  AI Estimate (Unverified)
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                                {activeItem.confidence.toFixed(1)}% Confidence
                              </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                              {activeItem.name}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                              Current Portion: {activeItem.serving_grams}g ({activeItem.quantity} serving)
                            </p>
                          </div>
                        </div>

                        <span className={`text-xs font-black px-3 py-1 rounded-xl border shrink-0 ${scoreColor[activeItem.health_score] || ''}`}>
                          Score: {activeItem.health_score}
                        </span>
                      </div>

                      {/* Active Item Macros */}
                      <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Calories</span>
                          <span className="text-base font-black text-neutral-900">{activeItem.calories}</span>
                          <span className="text-[10px] text-neutral-400">kcal</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                          <span className="text-[10px] font-bold text-blue-600 uppercase block">Protein</span>
                          <span className="text-base font-black text-blue-900">{activeItem.protein_g}g</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Carbs</span>
                          <span className="text-base font-black text-emerald-900">{activeItem.carbs_g}g</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                          <span className="text-[10px] font-bold text-amber-600 uppercase block">Fat</span>
                          <span className="text-base font-black text-amber-900">{activeItem.fat_g}g</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Portion-Size Adjustment Controls */}
                      <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-neutral-600" />
                            <span className="text-xs font-bold text-neutral-800">Portion Adjustment ({activeItem.name})</span>
                          </div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            {activeItem.serving_grams} grams
                          </span>
                        </div>

                        {/* Gram Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400 font-bold">
                            <span>25g</span>
                            <span>100g</span>
                            <span>200g</span>
                            <span>300g</span>
                            <span>500g</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="500"
                            step="10"
                            value={activeItem.serving_grams}
                            onChange={(e) => handleUpdatePortion(activeItemIndex, parseFloat(e.target.value), activeItem.quantity)}
                            className="w-full accent-emerald-600 cursor-pointer"
                          />
                        </div>

                        {/* Quick Gram Preset Buttons & Quantity Stepper */}
                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex gap-1 flex-wrap">
                            {[50, 100, 150, 200, 250].map((presetG) => (
                              <button
                                key={presetG}
                                type="button"
                                onClick={() => handleUpdatePortion(activeItemIndex, presetG, activeItem.quantity)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                  activeItem.serving_grams === presetG
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                {presetG}g
                              </button>
                            ))}
                          </div>

                          {/* Serving Multiplier Stepper */}
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-neutral-200">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase">Qty:</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePortion(activeItemIndex, activeItem.serving_grams, Math.max(0.5, activeItem.quantity - 0.5))}
                              className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-neutral-800 min-w-[24px] text-center">
                              {activeItem.quantity}x
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePortion(activeItemIndex, activeItem.serving_grams, activeItem.quantity + 0.5)}
                              className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detailed macro profile */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          Detailed Macro Profile
                        </h4>
                        {[
                          { label: 'Dietary Fiber', val: activeItem.fiber_g, max: 20, color: 'bg-emerald-600', unit: 'g' },
                          { label: 'Sugar', val: activeItem.sugar_g, max: 30, color: 'bg-purple-500', unit: 'g' },
                          { label: 'Sodium', val: activeItem.sodium_mg, max: 1500, color: 'bg-neutral-400', unit: 'mg' },
                        ].map((m) => (
                          <div key={m.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-neutral-600">{m.label}</span>
                              <span className="font-bold text-neutral-900">{m.val}{m.unit}</span>
                            </div>
                            {macroBar(m.val, m.max, m.color)}
                          </div>
                        ))}
                      </div>

                      {/* Reference & Transparency Box */}
                      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-700">
                          <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="text-xs font-bold text-neutral-800">Data Source & Verification</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 font-medium">
                          {activeItem.reference_source}
                          {activeItem.catalog_id ? ` (ID: ${activeItem.catalog_id})` : ''}
                        </p>
                        {activeItem.notes && (
                          <p className="text-[11px] text-neutral-500 italic mt-0.5">
                            "{activeItem.notes}"
                          </p>
                        )}
                      </div>

                      {/* Micronutrients */}
                      <div>
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                          Key Micronutrients
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeItem.micronutrients.map((m) => (
                            <span key={m} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Star className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-bold text-blue-800">Nutritional Health Benefit</span>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">{activeItem.benefits}</p>
                      </div>

                      {/* AI Tip */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-800">Dietary Recommendation</span>
                        </div>
                        <p className="text-xs text-emerald-700 leading-relaxed font-medium">{activeItem.ai_tip}</p>
                      </div>

                      {/* Meal Type Selector & Log Meal Button */}
                      <div className="space-y-2 pt-2 border-t border-neutral-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-600">Log As Meal:</span>
                          <div className="flex gap-1">
                            {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setMealType(m)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                  mealType === m
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleLogToMeals}
                          disabled={loggingMeal}
                          className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 ${
                            logSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          }`}
                        >
                          {logSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Logged {detectedItems.length} item(s) to {mealType} & Saved in Database!</span>
                            </>
                          ) : loggingMeal ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Saving Meal to Database...</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4" />
                              <span>
                                Log {detectedItems.length} {detectedItems.length === 1 ? 'Item' : 'Items'} to {mealType} (+{plateSummary?.total_calories || activeItem.calories} kcal)
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Select Strip (When not on Basket tab) */}
      {activeTab !== 'basket' && (
        <div className="premium-card p-5">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-neutral-400" />
            Quick Select Reference Starter Foods ({dbFoods.length} in database)
          </h3>
          <div className="flex gap-2 flex-wrap">
            {dbFoods.slice(0, 18).map((food) => (
              <button
                key={food.catalog_id || food.name}
                onClick={() => handleSelectFood(food)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f8] border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-medium text-neutral-700 transition-all"
              >
                <span>{food.emoji}</span>
                <span>{food.name}</span>
              </button>
            ))}
            <button
              onClick={() => setActiveTab('basket')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
            >
              +Open Food Basket ({dbFoods.length}) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoScan;
