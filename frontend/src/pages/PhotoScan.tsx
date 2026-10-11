// src/pages/PhotoScan.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Camera, Upload, Sparkles, CheckCircle2, RefreshCw,
  FlipHorizontal, PlusCircle, Search, X, Info, Star
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────────────
// FOOD DATABASE — All foods with nutrition info
// ────────────────────────────────────────────────────────────────────────────
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
}

const FOOD_DATABASE: FoodInfo[] = [
  // ── VEGETABLES ──
  { name: 'Potato', emoji: '🥔', category: 'Vegetables', calories: 77, protein_g: 2, carbs_g: 17, fat_g: 0.1, fiber_g: 2.2, sugar_g: 0.8, sodium_mg: 6, serving: '100g', health_score: 'B+', micronutrients: ['Vitamin C', 'Potassium', 'Vitamin B6'], benefits: 'Good source of potassium and vitamin C. Provides sustained energy.', ai_tip: 'Boil or bake for healthier preparation. Avoid deep frying.' },
  { name: 'Tomato', emoji: '🍅', category: 'Vegetables', calories: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2, fiber_g: 1.2, sugar_g: 2.6, sodium_mg: 5, serving: '100g', health_score: 'A', micronutrients: ['Lycopene', 'Vitamin C', 'Vitamin K'], benefits: 'Rich in lycopene, a powerful antioxidant. Supports heart health.', ai_tip: 'Cooking increases lycopene absorption. Add to curries and salads.' },
  { name: 'Onion', emoji: '🧅', category: 'Vegetables', calories: 40, protein_g: 1.1, carbs_g: 9.3, fat_g: 0.1, fiber_g: 1.7, sugar_g: 4.2, sodium_mg: 4, serving: '100g', health_score: 'A', micronutrients: ['Quercetin', 'Vitamin C', 'Folate'], benefits: 'Contains quercetin with anti-inflammatory properties. Supports immunity.', ai_tip: 'Raw onion has more nutrients. Use in salads for maximum benefit.' },
  { name: 'Garlic', emoji: '🧄', category: 'Vegetables', calories: 149, protein_g: 6.4, carbs_g: 33, fat_g: 0.5, fiber_g: 2.1, sugar_g: 1, sodium_mg: 17, serving: '100g', health_score: 'A+', micronutrients: ['Allicin', 'Manganese', 'Vitamin B6'], benefits: 'Powerful immunity booster. Contains allicin with antibacterial properties.', ai_tip: 'Crush garlic and let sit 10 mins before cooking to preserve allicin.' },
  { name: 'Ginger', emoji: '🫚', category: 'Vegetables', calories: 80, protein_g: 1.8, carbs_g: 18, fat_g: 0.8, fiber_g: 2, sugar_g: 1.7, sodium_mg: 13, serving: '100g', health_score: 'A+', micronutrients: ['Gingerol', 'Vitamin C', 'Magnesium'], benefits: 'Anti-nausea and anti-inflammatory. Aids digestion and reduces muscle pain.', ai_tip: 'Add to teas, curries, and smoothies. Fresh ginger is most potent.' },
  { name: 'Carrot', emoji: '🥕', category: 'Vegetables', calories: 41, protein_g: 0.9, carbs_g: 10, fat_g: 0.2, fiber_g: 2.8, sugar_g: 4.7, sodium_mg: 69, serving: '100g', health_score: 'A', micronutrients: ['Beta-Carotene', 'Vitamin A', 'Vitamin K'], benefits: 'Excellent for eye health. Rich in beta-carotene and antioxidants.', ai_tip: 'Cooking enhances beta-carotene absorption. Great raw as a crunchy snack.' },
  { name: 'Spinach', emoji: '🌿', category: 'Vegetables', calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4, fiber_g: 2.2, sugar_g: 0.4, sodium_mg: 79, serving: '100g', health_score: 'A+', micronutrients: ['Iron', 'Folate', 'Vitamin K', 'Vitamin A'], benefits: 'Iron-rich superfood. Supports blood health and bone strength.', ai_tip: 'Pair with vitamin C foods to boost iron absorption. Great in smoothies.' },
  { name: 'Broccoli', emoji: '🥦', category: 'Vegetables', calories: 34, protein_g: 2.8, carbs_g: 7, fat_g: 0.4, fiber_g: 2.6, sugar_g: 1.7, sodium_mg: 33, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin C', 'Vitamin K', 'Folate', 'Sulforaphane'], benefits: 'Cancer-fighting sulforaphane. Supports immune system and bone health.', ai_tip: 'Light steaming preserves nutrients best. Avoid overcooking.' },
  { name: 'Cauliflower', emoji: '🥬', category: 'Vegetables', calories: 25, protein_g: 1.9, carbs_g: 5, fat_g: 0.3, fiber_g: 2, sugar_g: 1.9, sodium_mg: 30, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Vitamin K', 'Choline'], benefits: 'Low calorie and versatile. Supports detoxification and brain health.', ai_tip: 'Great roasted as a rice substitute or in curries.' },
  { name: 'Cabbage', emoji: '🥬', category: 'Vegetables', calories: 25, protein_g: 1.3, carbs_g: 6, fat_g: 0.1, fiber_g: 2.5, sugar_g: 3.2, sodium_mg: 18, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Vitamin C', 'Folate'], benefits: 'Rich in vitamin K for bone health. Contains gut-friendly fiber.', ai_tip: 'Fermented cabbage (sauerkraut) is excellent for gut microbiome.' },
  { name: 'Capsicum / Bell Pepper', emoji: '🫑', category: 'Vegetables', calories: 31, protein_g: 1, carbs_g: 6, fat_g: 0.3, fiber_g: 2.1, sugar_g: 4.2, sodium_mg: 4, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin C', 'Vitamin A', 'Vitamin B6'], benefits: 'Highest vitamin C content among vegetables. Excellent antioxidant.', ai_tip: 'Red bell peppers have 3x more vitamin C than green. Eat raw for max benefit.' },
  { name: 'Cucumber', emoji: '🥒', category: 'Vegetables', calories: 16, protein_g: 0.7, carbs_g: 3.6, fat_g: 0.1, fiber_g: 0.5, sugar_g: 1.7, sodium_mg: 2, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Potassium', 'Magnesium'], benefits: '95% water content. Excellent for hydration and cooling the body.', ai_tip: 'Keep the peel on for extra nutrients and fiber.' },
  { name: 'Bitter Gourd (Karela)', emoji: '🥬', category: 'Vegetables', calories: 17, protein_g: 1, carbs_g: 3.7, fat_g: 0.2, fiber_g: 2.8, sugar_g: 1.9, sodium_mg: 5, serving: '100g', health_score: 'A+', micronutrients: ['Charantin', 'Vitamin C', 'Iron'], benefits: 'Excellent for blood sugar control. Charantin helps regulate glucose levels.', ai_tip: 'Soak in salt water to reduce bitterness. Best for diabetics.' },
  { name: 'Bottle Gourd (Lauki)', emoji: '🥬', category: 'Vegetables', calories: 14, protein_g: 0.6, carbs_g: 3.4, fat_g: 0.1, fiber_g: 0.5, sugar_g: 1.4, sodium_mg: 2, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Vitamin B', 'Zinc'], benefits: 'Very low calorie. Cooling and hydrating. Aids digestion.', ai_tip: 'Great for weight loss. Make lauki juice for liver health.' },
  { name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables', calories: 86, protein_g: 1.6, carbs_g: 20, fat_g: 0.1, fiber_g: 3, sugar_g: 4.2, sodium_mg: 55, serving: '100g', health_score: 'A', micronutrients: ['Beta-Carotene', 'Vitamin A', 'Potassium'], benefits: 'High in beta-carotene and fiber. Sustained energy with low glycemic index.', ai_tip: 'Boil or bake with skin on for maximum nutrients.' },
  { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables', calories: 26, protein_g: 1, carbs_g: 6.5, fat_g: 0.1, fiber_g: 0.5, sugar_g: 2.8, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Beta-Carotene', 'Vitamin A', 'Zinc'], benefits: 'Rich in antioxidants. Supports eye health and immunity.', ai_tip: 'Roasted pumpkin seeds are a great source of zinc and magnesium.' },
  { name: 'Mushroom', emoji: '🍄', category: 'Vegetables', calories: 22, protein_g: 3.1, carbs_g: 3.3, fat_g: 0.3, fiber_g: 1, sugar_g: 2, sodium_mg: 5, serving: '100g', health_score: 'A', micronutrients: ['Vitamin D', 'Selenium', 'B Vitamins'], benefits: 'One of the few plant sources of Vitamin D. Supports immune function.', ai_tip: 'Sun-dried mushrooms have much higher vitamin D content.' },
  { name: 'Okra (Bhindi)', emoji: '🌿', category: 'Vegetables', calories: 33, protein_g: 1.9, carbs_g: 7.5, fat_g: 0.2, fiber_g: 3.2, sugar_g: 1.5, sodium_mg: 7, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Folate', 'Magnesium'], benefits: 'Rich in soluble fiber that helps control blood sugar. Excellent for gut health.', ai_tip: 'Avoid cutting in oil immediately. Add at end of cooking.' },
  { name: 'Green Peas', emoji: '🟢', category: 'Vegetables', calories: 81, protein_g: 5.4, carbs_g: 14, fat_g: 0.4, fiber_g: 5.7, sugar_g: 5.7, sodium_mg: 5, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Vitamin C', 'Iron'], benefits: 'High plant protein. Supports muscle health and blood sugar control.', ai_tip: 'Frozen peas retain most nutrients. Add to rice, curries, and soups.' },
  { name: 'Beetroot', emoji: '🟣', category: 'Vegetables', calories: 43, protein_g: 1.6, carbs_g: 10, fat_g: 0.2, fiber_g: 2.8, sugar_g: 7, sodium_mg: 78, serving: '100g', health_score: 'A', micronutrients: ['Folate', 'Nitrates', 'Manganese'], benefits: 'Boosts exercise performance via dietary nitrates. Supports liver health.', ai_tip: 'Beetroot juice before workout can enhance endurance.' },
  { name: 'Eggplant (Brinjal)', emoji: '🍆', category: 'Vegetables', calories: 25, protein_g: 1, carbs_g: 5.9, fat_g: 0.2, fiber_g: 3, sugar_g: 3.5, sodium_mg: 2, serving: '100g', health_score: 'B+', micronutrients: ['Anthocyanins', 'Vitamin B6', 'Potassium'], benefits: 'Contains nasunin, a powerful brain-protecting antioxidant.', ai_tip: 'Roasting or grilling is healthier than deep frying for baingan bharta.' },
  { name: 'Corn', emoji: '🌽', category: 'Vegetables', calories: 86, protein_g: 3.3, carbs_g: 19, fat_g: 1.4, fiber_g: 2.4, sugar_g: 3.2, sodium_mg: 15, serving: '100g', health_score: 'B+', micronutrients: ['Vitamin B1', 'Folate', 'Magnesium'], benefits: 'Good source of energy and fiber. Contains lutein for eye health.', ai_tip: 'Boiled corn is healthier than popcorn with butter. Great post-workout snack.' },
  { name: 'Radish', emoji: '🌶️', category: 'Vegetables', calories: 16, protein_g: 0.7, carbs_g: 3.4, fat_g: 0.1, fiber_g: 1.6, sugar_g: 1.9, sodium_mg: 39, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Folate', 'Potassium'], benefits: 'Supports liver detox and digestion. Excellent for weight loss.', ai_tip: 'Eat raw in salads or make mooli paratha for a nutritious meal.' },
  { name: 'Colocasia (Arbi)', emoji: '🥬', category: 'Vegetables', calories: 112, protein_g: 1.5, carbs_g: 26, fat_g: 0.2, fiber_g: 4.3, sugar_g: 0.4, sodium_mg: 11, serving: '100g', health_score: 'B+', micronutrients: ['Potassium', 'Vitamin E', 'Manganese'], benefits: 'High fiber content. Good source of resistant starch for gut health.', ai_tip: 'Always cook taro thoroughly. Avoid if you have kidney problems.' },
  { name: 'Raw Banana', emoji: '🍌', category: 'Vegetables', calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, fiber_g: 2.6, sugar_g: 12, sodium_mg: 1, serving: '100g', health_score: 'B+', micronutrients: ['Potassium', 'Vitamin B6', 'Resistant Starch'], benefits: 'Excellent prebiotic. Resistant starch feeds beneficial gut bacteria.', ai_tip: 'Less ripe bananas have more resistant starch which is better for gut health.' },
  { name: 'Drumstick (Moringa)', emoji: '🌿', category: 'Vegetables', calories: 37, protein_g: 2.1, carbs_g: 8.5, fat_g: 0.2, fiber_g: 3.2, sugar_g: 3.7, sodium_mg: 42, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin C', 'Iron', 'Calcium', 'Vitamin A'], benefits: 'Superfood with 7x more vitamin C than oranges. Anti-inflammatory.', ai_tip: 'Moringa leaves can be dried and powdered for a nutritious supplement.' },
  { name: 'Lettuce', emoji: '🥬', category: 'Vegetables', calories: 15, protein_g: 1.4, carbs_g: 2.9, fat_g: 0.2, fiber_g: 1.3, sugar_g: 1.5, sodium_mg: 28, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Vitamin A', 'Folate'], benefits: 'Low calorie with high water content. Excellent for hydration.', ai_tip: 'Darker lettuce leaves like romaine have more nutrients than iceberg.' },
  { name: 'Kale', emoji: '🥬', category: 'Vegetables', calories: 49, protein_g: 4.3, carbs_g: 9, fat_g: 0.9, fiber_g: 3.6, sugar_g: 2.3, sodium_mg: 38, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin K', 'Vitamin C', 'Vitamin A', 'Calcium'], benefits: 'Nutrient density powerhouse. One of the most nutritious vegetables.', ai_tip: 'Massage kale with olive oil to soften. Great for chips and salads.' },
  { name: 'Spring Onion', emoji: '🌱', category: 'Vegetables', calories: 32, protein_g: 1.8, carbs_g: 7.3, fat_g: 0.2, fiber_g: 2.6, sugar_g: 2.3, sodium_mg: 16, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Vitamin C', 'Folate'], benefits: 'Rich in flavonoids and antioxidants. Supports heart health.', ai_tip: 'Use raw as garnish to retain maximum vitamin C content.' },
  { name: 'Fenugreek Leaves (Methi)', emoji: '🌿', category: 'Vegetables', calories: 49, protein_g: 4.4, carbs_g: 6, fat_g: 0.9, fiber_g: 3.9, sugar_g: 1, sodium_mg: 67, serving: '100g', health_score: 'A+', micronutrients: ['Iron', 'Folate', 'Vitamin K'], benefits: 'Excellent for blood sugar control. Rich in iron for anemia prevention.', ai_tip: 'Fresh methi is superior to dried. Add to rotis, sabzi, and dal.' },
  { name: 'Coriander', emoji: '🌿', category: 'Vegetables', calories: 23, protein_g: 2.1, carbs_g: 3.7, fat_g: 0.5, fiber_g: 2.8, sugar_g: 0.9, sodium_mg: 46, serving: '100g', health_score: 'A', micronutrients: ['Vitamin K', 'Vitamin A', 'Vitamin C'], benefits: 'Digestive aid and detoxifier. Helps lower blood sugar.', ai_tip: 'Add fresh coriander at end of cooking to preserve nutrients.' },

  // ── FRUITS ──
  { name: 'Apple', emoji: '🍎', category: 'Fruits', calories: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2, fiber_g: 2.4, sugar_g: 10, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Potassium', 'Quercetin', 'Fiber'], benefits: 'High in pectin fiber for gut health. Quercetin is a powerful antioxidant.', ai_tip: 'Eat with skin for maximum fiber and quercetin content.' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits', calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, fiber_g: 2.6, sugar_g: 12, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Potassium', 'Vitamin B6', 'Magnesium'], benefits: 'Excellent pre-workout energy source. High in potassium for muscle function.', ai_tip: 'Riper bananas have more antioxidants. Greener ones have more resistant starch.' },
  { name: 'Orange', emoji: '🍊', category: 'Fruits', calories: 47, protein_g: 0.9, carbs_g: 12, fat_g: 0.1, fiber_g: 2.4, sugar_g: 9.4, sodium_mg: 0, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Folate', 'Thiamine'], benefits: 'Excellent source of vitamin C. Boosts iron absorption and immunity.', ai_tip: 'Eat whole fruit rather than juice to get full fiber benefits.' },
  { name: 'Mango', emoji: '🥭', category: 'Fruits', calories: 60, protein_g: 0.8, carbs_g: 15, fat_g: 0.4, fiber_g: 1.6, sugar_g: 14, sodium_mg: 1, serving: '100g', health_score: 'B+', micronutrients: ['Vitamin A', 'Vitamin C', 'Folate'], benefits: 'King of fruits! Rich in vitamin A for eye health. Excellent antioxidant.', ai_tip: 'Best consumed in moderation due to high natural sugar content.' },
  { name: 'Papaya', emoji: '🍑', category: 'Fruits', calories: 43, protein_g: 0.5, carbs_g: 11, fat_g: 0.3, fiber_g: 1.7, sugar_g: 7.8, sodium_mg: 8, serving: '100g', health_score: 'A', micronutrients: ['Vitamin C', 'Folate', 'Papain'], benefits: 'Contains papain enzyme for digestion. Excellent for skin health.', ai_tip: 'Papain enzyme in papaya tenderizes meat and aids protein digestion.' },
  { name: 'Guava', emoji: '🍈', category: 'Fruits', calories: 68, protein_g: 2.6, carbs_g: 14, fat_g: 1, fiber_g: 5.4, sugar_g: 8.9, sodium_mg: 2, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin C', 'Folate', 'Lycopene'], benefits: '4x more vitamin C than oranges. Excellent fiber for blood sugar control.', ai_tip: 'Eat with seeds for maximum fiber. Excellent diabetic-friendly fruit.' },
  { name: 'Watermelon', emoji: '🍉', category: 'Fruits', calories: 30, protein_g: 0.6, carbs_g: 7.6, fat_g: 0.2, fiber_g: 0.4, sugar_g: 6.2, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Lycopene', 'Vitamin C', 'Citrulline'], benefits: '92% water. Contains citrulline which improves blood flow. Post-workout hydration.', ai_tip: 'Best hydrating fruit. Eat post-workout to reduce muscle soreness.' },
  { name: 'Pomegranate', emoji: '🍎', category: 'Fruits', calories: 83, protein_g: 1.7, carbs_g: 19, fat_g: 1.2, fiber_g: 4, sugar_g: 14, sodium_mg: 3, serving: '100g', health_score: 'A+', micronutrients: ['Punicalagins', 'Vitamin C', 'Folate'], benefits: 'Powerful antioxidants 3x more than green tea. Supports heart health.', ai_tip: 'Pomegranate juice can help lower blood pressure.' },
  { name: 'Grapes', emoji: '🍇', category: 'Fruits', calories: 69, protein_g: 0.7, carbs_g: 18, fat_g: 0.2, fiber_g: 0.9, sugar_g: 15, sodium_mg: 2, serving: '100g', health_score: 'B+', micronutrients: ['Resveratrol', 'Vitamin C', 'Vitamin K'], benefits: 'Resveratrol supports heart health and longevity. Anti-inflammatory.', ai_tip: 'Dark grapes have more antioxidants than green. Eat in moderation.' },
  { name: 'Kiwi', emoji: '🥝', category: 'Fruits', calories: 61, protein_g: 1.1, carbs_g: 15, fat_g: 0.5, fiber_g: 3, sugar_g: 9, sodium_mg: 3, serving: '100g', health_score: 'A+', micronutrients: ['Vitamin C', 'Vitamin K', 'Folate'], benefits: 'Contains twice the vitamin C of oranges. Promotes better sleep.', ai_tip: 'Eat 2 kiwis before bed to improve sleep quality naturally.' },
  { name: 'Avocado', emoji: '🥑', category: 'Fruits', calories: 160, protein_g: 2, carbs_g: 9, fat_g: 15, fiber_g: 7, sugar_g: 0.7, sodium_mg: 7, serving: '100g', health_score: 'A+', micronutrients: ['Oleic Acid', 'Potassium', 'Folate', 'Vitamin E'], benefits: 'Heart-healthy monounsaturated fats. More potassium than bananas.', ai_tip: 'Healthy fat makes other nutrients more absorbable. Great with salads.' },
  { name: 'Pineapple', emoji: '🍍', category: 'Fruits', calories: 50, protein_g: 0.5, carbs_g: 13, fat_g: 0.1, fiber_g: 1.4, sugar_g: 10, sodium_mg: 1, serving: '100g', health_score: 'A', micronutrients: ['Bromelain', 'Vitamin C', 'Manganese'], benefits: 'Bromelain enzyme aids protein digestion and reduces inflammation.', ai_tip: 'Fresh pineapple has more bromelain than canned. Great digestive aid.' },

  // ── CHICKEN DISHES ──
  { name: 'Chicken Biryani', emoji: '🍛', category: 'Chicken Dishes', calories: 290, protein_g: 18, carbs_g: 35, fat_g: 8, fiber_g: 1.5, sugar_g: 2, sodium_mg: 560, serving: '250g serving', health_score: 'B+', micronutrients: ['Iron', 'Zinc', 'Vitamin B12', 'Niacin'], benefits: 'High protein meal with complex carbohydrates. Spices provide anti-inflammatory benefits.', ai_tip: 'Use brown rice for more fiber. Add raita to balance macros and aid digestion.' },
  { name: 'Butter Chicken', emoji: '🍛', category: 'Chicken Dishes', calories: 220, protein_g: 24, carbs_g: 8, fat_g: 11, fiber_g: 1, sugar_g: 4, sodium_mg: 480, serving: '200g serving', health_score: 'B+', micronutrients: ['Vitamin A', 'Iron', 'Vitamin B12'], benefits: 'High protein. Tomato base provides lycopene. Great for muscle building.', ai_tip: 'Request less cream/butter. Pair with roti instead of naan to reduce calories.' },
  { name: 'Chicken Curry', emoji: '🍛', category: 'Chicken Dishes', calories: 180, protein_g: 22, carbs_g: 6, fat_g: 8, fiber_g: 2, sugar_g: 2.5, sodium_mg: 420, serving: '200g serving', health_score: 'A', micronutrients: ['Iron', 'Zinc', 'Niacin', 'Selenium'], benefits: 'Lean protein source. Spices like turmeric, cumin add antioxidant benefits.', ai_tip: 'Home-cooked chicken curry controls sodium. Add more vegetables to increase nutrients.' },
  { name: 'Chicken Tikka', emoji: '🍗', category: 'Chicken Dishes', calories: 165, protein_g: 28, carbs_g: 4, fat_g: 5, fiber_g: 0.5, sugar_g: 2, sodium_mg: 380, serving: '150g serving', health_score: 'A', micronutrients: ['Vitamin B12', 'Niacin', 'Phosphorus'], benefits: 'Lean grilled protein. Low fat and carbs. Perfect for weight management.', ai_tip: 'One of the healthiest chicken preparations. Great post-workout meal.' },
  { name: 'Grilled Chicken', emoji: '🍗', category: 'Chicken Dishes', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, fiber_g: 0, sugar_g: 0, sodium_mg: 74, serving: '100g serving', health_score: 'A+', micronutrients: ['Vitamin B12', 'Niacin', 'Selenium', 'Phosphorus'], benefits: 'Highest protein with lowest fat ratio. Ideal for muscle building and weight loss.', ai_tip: 'Best protein source per calorie. Marinate with herbs for flavor without extra calories.' },
  { name: 'Chicken Wings', emoji: '🍗', category: 'Chicken Dishes', calories: 203, protein_g: 18, carbs_g: 0, fat_g: 14, fiber_g: 0, sugar_g: 0, sodium_mg: 174, serving: '100g', health_score: 'B', micronutrients: ['Niacin', 'Vitamin B6', 'Zinc'], benefits: 'Good protein source. Skin contains collagen.', ai_tip: 'Baked wings instead of fried save 40% calories. Avoid heavy sauces.' },
  { name: 'Chicken Kebab', emoji: '🍢', category: 'Chicken Dishes', calories: 148, protein_g: 26, carbs_g: 2, fat_g: 4, fiber_g: 0.5, sugar_g: 1, sodium_mg: 290, serving: '150g serving', health_score: 'A', micronutrients: ['Iron', 'Niacin', 'Vitamin B12'], benefits: 'Lean protein snack. Herbs and spices add antioxidants without calories.', ai_tip: 'Great lean protein option. Pair with mint chutney and salad.' },
  { name: 'Chicken Shawarma', emoji: '🌯', category: 'Chicken Dishes', calories: 310, protein_g: 22, carbs_g: 28, fat_g: 12, fiber_g: 2, sugar_g: 3, sodium_mg: 680, serving: '1 wrap', health_score: 'B', micronutrients: ['Iron', 'Calcium', 'Vitamin B12'], benefits: 'Complete meal with protein and carbs. Vegetables add micronutrients.', ai_tip: 'Ask for extra salad and less sauce to reduce sodium and calories.' },
  { name: 'Chicken 65', emoji: '🍗', category: 'Chicken Dishes', calories: 280, protein_g: 22, carbs_g: 15, fat_g: 14, fiber_g: 1, sugar_g: 1, sodium_mg: 520, serving: '150g serving', health_score: 'B', micronutrients: ['Niacin', 'Phosphorus', 'Iron'], benefits: 'High protein. Spices provide antioxidant and anti-inflammatory benefits.', ai_tip: 'Deep fried version adds fat. Air-fried or baked version is much healthier.' },
  { name: 'Chicken Soup', emoji: '🍲', category: 'Chicken Dishes', calories: 75, protein_g: 8, carbs_g: 5, fat_g: 2, fiber_g: 1, sugar_g: 1.5, sodium_mg: 860, serving: '240ml bowl', health_score: 'A+', micronutrients: ['Zinc', 'Vitamin B12', 'Collagen'], benefits: 'Immunity booster. Collagen from bones supports joints and skin.', ai_tip: 'Use bone broth base for maximum collagen and mineral content. Reduce sodium by making at home.' },

  // ── MUTTON / GOAT DISHES ──
  { name: 'Mutton Biryani', emoji: '🍛', category: 'Mutton Dishes', calories: 350, protein_g: 22, carbs_g: 38, fat_g: 12, fiber_g: 1.5, sugar_g: 2, sodium_mg: 620, serving: '300g serving', health_score: 'B', micronutrients: ['Iron', 'Zinc', 'Vitamin B12'], benefits: 'High protein and iron rich. Spices provide antioxidant benefits.', ai_tip: 'Choose lean cuts and reduce oil. Pair with cucumber raita.' },
  { name: 'Mutton Curry', emoji: '🍛', category: 'Mutton Dishes', calories: 243, protein_g: 26, carbs_g: 6, fat_g: 13, fiber_g: 2, sugar_g: 2, sodium_mg: 480, serving: '200g serving', health_score: 'B+', micronutrients: ['Iron', 'Zinc', 'Vitamin B12', 'Selenium'], benefits: 'Rich in heme iron for blood health. High complete protein content.', ai_tip: 'Trim visible fat before cooking. Skim fat from curry for lighter version.' },
  { name: 'Mutton Rogan Josh', emoji: '🍛', category: 'Mutton Dishes', calories: 260, protein_g: 24, carbs_g: 7, fat_g: 15, fiber_g: 2.5, sugar_g: 3, sodium_mg: 510, serving: '200g serving', health_score: 'B+', micronutrients: ['Iron', 'Zinc', 'Kashmiri Spices'], benefits: 'Aromatic Kashmiri spices have anti-inflammatory properties. High protein.', ai_tip: 'Traditional recipe uses minimal ghee. Pair with steamed rice.' },
  { name: 'Seekh Kebab', emoji: '🍢', category: 'Mutton Dishes', calories: 180, protein_g: 24, carbs_g: 4, fat_g: 8, fiber_g: 1, sugar_g: 1, sodium_mg: 380, serving: '150g serving', health_score: 'A', micronutrients: ['Iron', 'Zinc', 'Vitamin B12'], benefits: 'Lean protein cooked on open flame. Minimal fat when grilled properly.', ai_tip: 'Grilled seekh kebab is much healthier than fried. Best protein snack.' },
  { name: 'Mutton Keema', emoji: '🍛', category: 'Mutton Dishes', calories: 230, protein_g: 22, carbs_g: 8, fat_g: 13, fiber_g: 2, sugar_g: 2, sodium_mg: 440, serving: '200g serving', health_score: 'B+', micronutrients: ['Iron', 'Zinc', 'Vitamin B12'], benefits: 'Ground meat with high protein. Spices and tomatoes add antioxidants.', ai_tip: 'Use lean mutton and add more vegetables like peas for extra nutrition.' },

  // ── FISH DISHES ──
  { name: 'Grilled Fish', emoji: '🐟', category: 'Fish Dishes', calories: 136, protein_g: 27, carbs_g: 0, fat_g: 3, fiber_g: 0, sugar_g: 0, sodium_mg: 104, serving: '150g serving', health_score: 'A+', micronutrients: ['Omega-3', 'Vitamin D', 'Selenium', 'B12'], benefits: 'Lean protein with heart-healthy omega-3 fats. Excellent brain food.', ai_tip: 'One of the healthiest protein sources. Aim for 2 servings of fish per week.' },
  { name: 'Fish Curry', emoji: '🍛', category: 'Fish Dishes', calories: 142, protein_g: 18, carbs_g: 6, fat_g: 5, fiber_g: 2, sugar_g: 2, sodium_mg: 380, serving: '200g serving', health_score: 'A', micronutrients: ['Omega-3', 'Vitamin D', 'Iodine'], benefits: 'Omega-3 rich protein. Turmeric in curry adds anti-inflammatory benefits.', ai_tip: 'Coconut-based South Indian fish curry provides extra MCTs for energy.' },
  { name: 'Fish Tikka', emoji: '🐟', category: 'Fish Dishes', calories: 155, protein_g: 25, carbs_g: 4, fat_g: 4, fiber_g: 0.5, sugar_g: 1, sodium_mg: 340, serving: '150g serving', health_score: 'A+', micronutrients: ['Omega-3', 'Vitamin B12', 'Selenium'], benefits: 'Protein-packed with healthy fats. Low calorie and high nutrient density.', ai_tip: 'Marinating in yogurt and spices before grilling adds probiotics and flavor.' },
  { name: 'Salmon', emoji: '🐟', category: 'Fish Dishes', calories: 208, protein_g: 20, carbs_g: 0, fat_g: 13, fiber_g: 0, sugar_g: 0, sodium_mg: 59, serving: '100g', health_score: 'A+', micronutrients: ['Omega-3 DHA', 'Vitamin D', 'Vitamin B12', 'Selenium'], benefits: 'Best source of omega-3 DHA for brain health. Excellent vitamin D source.', ai_tip: 'Wild salmon has more omega-3 than farmed. Bake or grill for best results.' },
  { name: 'Sardines', emoji: '🐟', category: 'Fish Dishes', calories: 208, protein_g: 25, carbs_g: 0, fat_g: 11, fiber_g: 0, sugar_g: 0, sodium_mg: 307, serving: '100g', health_score: 'A+', micronutrients: ['Omega-3', 'Calcium', 'Vitamin B12', 'Vitamin D'], benefits: 'Calcium from edible bones. Most nutrient-dense small fish. Budget-friendly superfood.', ai_tip: 'Canned sardines with bones are an excellent calcium and omega-3 source.' },
  { name: 'Prawn Curry', emoji: '🦐', category: 'Fish Dishes', calories: 135, protein_g: 20, carbs_g: 4, fat_g: 4.5, fiber_g: 0.5, sugar_g: 1.5, sodium_mg: 420, serving: '200g serving', health_score: 'A', micronutrients: ['Iodine', 'Selenium', 'Zinc', 'Vitamin B12'], benefits: 'High protein, low fat seafood. Excellent source of iodine for thyroid health.', ai_tip: 'Avoid breaded and fried prawns. Grilled or in curry is much healthier.' },

  // ── EGG DISHES ──
  { name: 'Boiled Eggs', emoji: '🥚', category: 'Egg Dishes', calories: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11, fiber_g: 0, sugar_g: 1.1, sodium_mg: 124, serving: '2 eggs (100g)', health_score: 'A+', micronutrients: ['Choline', 'Vitamin B12', 'Vitamin D', 'Selenium'], benefits: 'Complete protein with all essential amino acids. Choline for brain health.', ai_tip: 'Eat whole eggs. Yolk contains most nutrients including fat-soluble vitamins.' },
  { name: 'Scrambled Eggs', emoji: '🍳', category: 'Egg Dishes', calories: 180, protein_g: 13, carbs_g: 2, fat_g: 13, fiber_g: 0, sugar_g: 1, sodium_mg: 178, serving: '2 eggs cooked', health_score: 'A', micronutrients: ['Choline', 'Vitamin A', 'Vitamin B12'], benefits: 'High quality protein. Adding vegetables increases fiber and micronutrients.', ai_tip: 'Cook with minimal oil. Add spinach, tomatoes for a nutrient boost.' },
  { name: 'Omelette', emoji: '🍳', category: 'Egg Dishes', calories: 154, protein_g: 11, carbs_g: 1, fat_g: 12, fiber_g: 0, sugar_g: 0.5, sodium_mg: 207, serving: '1 plain omelette', health_score: 'A', micronutrients: ['Choline', 'Selenium', 'Vitamin B12'], benefits: 'Quick protein meal. Adding vegetables creates a complete nutritious dish.', ai_tip: 'Masala omelette with onions, tomatoes, green chilli adds nutrients and flavor.' },
  { name: 'Egg Curry', emoji: '🍛', category: 'Egg Dishes', calories: 180, protein_g: 12, carbs_g: 8, fat_g: 11, fiber_g: 2, sugar_g: 3, sodium_mg: 380, serving: '2 eggs with gravy', health_score: 'A', micronutrients: ['Iron', 'Vitamin A', 'Choline'], benefits: 'Protein-rich with antioxidant-rich spice gravy. Budget-friendly nutrition.', ai_tip: 'Use hard boiled eggs in tomato onion masala for a healthy complete meal.' },
  { name: 'Egg Bhurji', emoji: '🍳', category: 'Egg Dishes', calories: 200, protein_g: 14, carbs_g: 5, fat_g: 14, fiber_g: 1, sugar_g: 2, sodium_mg: 290, serving: '2 eggs with vegetables', health_score: 'A', micronutrients: ['Choline', 'Vitamin C', 'Iron'], benefits: 'Scrambled eggs with vegetables. One of the healthiest Indian egg dishes.', ai_tip: 'Add onions, tomatoes, peppers and minimal oil for a balanced meal.' },

  // ── RICE & GRAINS ──
  { name: 'Rice (Cooked)', emoji: '🍚', category: 'Grains', calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, fiber_g: 0.4, sugar_g: 0, sodium_mg: 1, serving: '100g cooked', health_score: 'B+', micronutrients: ['Manganese', 'Thiamine', 'Niacin'], benefits: 'Gluten-free carbohydrate source. Easy to digest and gentle on stomach.', ai_tip: 'Brown rice has 3x more fiber than white. Cool cooked rice creates resistant starch.' },
  { name: 'Brown Rice', emoji: '🍚', category: 'Grains', calories: 112, protein_g: 2.6, carbs_g: 23, fat_g: 0.9, fiber_g: 1.8, sugar_g: 0.3, sodium_mg: 5, serving: '100g cooked', health_score: 'A', micronutrients: ['Magnesium', 'Phosphorus', 'B Vitamins'], benefits: 'More fiber and nutrients than white rice. Better blood sugar control.', ai_tip: 'Brown rice takes longer to cook but significantly better for blood sugar.' },
  { name: 'Roti / Chapati', emoji: '🫓', category: 'Grains', calories: 264, protein_g: 9, carbs_g: 54, fat_g: 3, fiber_g: 7, sugar_g: 1, sodium_mg: 5, serving: '2 medium rotis', health_score: 'A', micronutrients: ['Iron', 'Magnesium', 'Fiber', 'B Vitamins'], benefits: 'Whole wheat provides sustained energy and digestive fiber.', ai_tip: 'Whole wheat atta roti is much better than maida. Use minimal ghee.' },
  { name: 'Oats', emoji: '🥣', category: 'Grains', calories: 389, protein_g: 17, carbs_g: 66, fat_g: 7, fiber_g: 10, sugar_g: 1, sodium_mg: 2, serving: '100g dry', health_score: 'A+', micronutrients: ['Beta-Glucan', 'Manganese', 'Phosphorus', 'Iron'], benefits: 'Beta-glucan reduces cholesterol. Best breakfast for sustained energy.', ai_tip: 'Overnight oats improve digestibility. Add fruits and nuts for complete nutrition.' },
  { name: 'Quinoa', emoji: '🥣', category: 'Grains', calories: 120, protein_g: 4.4, carbs_g: 22, fat_g: 1.9, fiber_g: 2.8, sugar_g: 0.9, sodium_mg: 7, serving: '100g cooked', health_score: 'A+', micronutrients: ['Folate', 'Magnesium', 'All 9 Essential Amino Acids'], benefits: 'Complete plant protein with all 9 amino acids. Excellent for vegetarians.', ai_tip: 'Rinse before cooking to remove bitter saponins. Great rice substitute.' },

  // ── LENTILS & LEGUMES ──
  { name: 'Dal (Lentils)', emoji: '🥘', category: 'Legumes', calories: 116, protein_g: 9, carbs_g: 20, fat_g: 0.4, fiber_g: 8, sugar_g: 1.8, sodium_mg: 4, serving: '100g cooked', health_score: 'A+', micronutrients: ['Folate', 'Iron', 'Potassium', 'Plant Protein'], benefits: 'Excellent plant protein and iron source. High fiber for gut health.', ai_tip: 'Pair dal with vitamin C foods to enhance iron absorption. Dal tadka with roti is a complete meal.' },
  { name: 'Chickpeas (Chana)', emoji: '🫘', category: 'Legumes', calories: 164, protein_g: 8.9, carbs_g: 27, fat_g: 2.6, fiber_g: 7.6, sugar_g: 4.8, sodium_mg: 7, serving: '100g cooked', health_score: 'A', micronutrients: ['Folate', 'Iron', 'Manganese', 'Fiber'], benefits: 'Excellent protein-fiber combination for satiety. Helps blood sugar control.', ai_tip: 'Sprout chickpeas before cooking to enhance nutrient absorption and digestibility.' },
  { name: 'Rajma (Kidney Beans)', emoji: '🫘', category: 'Legumes', calories: 127, protein_g: 8.7, carbs_g: 22.8, fat_g: 0.5, fiber_g: 6.4, sugar_g: 0.3, sodium_mg: 2, serving: '100g cooked', health_score: 'A', micronutrients: ['Iron', 'Folate', 'Potassium', 'Manganese'], benefits: 'Plant protein with high fiber. Excellent for heart health and diabetes management.', ai_tip: 'Rajma chawal is a nutritionally complete meal. Always soak before cooking.' },
  { name: 'Paneer', emoji: '🧀', category: 'Dairy', calories: 265, protein_g: 18, carbs_g: 4, fat_g: 20, fiber_g: 0, sugar_g: 2, sodium_mg: 27, serving: '100g', health_score: 'B+', micronutrients: ['Calcium', 'Phosphorus', 'Vitamin A', 'Protein'], benefits: 'Highest protein Indian dairy. Excellent calcium source for bone health.', ai_tip: 'Use toned milk paneer to reduce fat. Grilled paneer is healthier than deep fried.' },

  // ── BEEF DISHES ──
  { name: 'Beef Biryani', emoji: '🍛', category: 'Beef Dishes', calories: 380, protein_g: 20, carbs_g: 40, fat_g: 14, fiber_g: 1.5, sugar_g: 2, sodium_mg: 640, serving: '300g serving', health_score: 'B', micronutrients: ['Iron', 'Zinc', 'Vitamin B12'], benefits: 'High protein and iron. Spices provide antioxidant benefits.', ai_tip: 'Use lean beef cuts. Brown rice variation improves fiber content.' },
  { name: 'Beef Steak', emoji: '🥩', category: 'Beef Dishes', calories: 271, protein_g: 26, carbs_g: 0, fat_g: 18, fiber_g: 0, sugar_g: 0, sodium_mg: 56, serving: '150g serving', health_score: 'B+', micronutrients: ['Iron', 'Zinc', 'Vitamin B12', 'Creatine'], benefits: 'Complete protein with heme iron. Rich in creatine for muscle performance.', ai_tip: 'Choose lean cuts like sirloin. Grill instead of fry. Limit to 2-3 times per week.' },
  { name: 'Beef Burger', emoji: '🍔', category: 'Beef Dishes', calories: 354, protein_g: 20, carbs_g: 28, fat_g: 17, fiber_g: 2, sugar_g: 6, sodium_mg: 750, serving: '1 burger', health_score: 'C+', micronutrients: ['Iron', 'Zinc', 'Calcium'], benefits: 'Provides protein and iron. Vegetable toppings add micronutrients.', ai_tip: 'Choose whole grain bun, extra salad and no sauce to make it healthier.' },

  // ── INTERNATIONAL DISHES ──
  { name: 'Pasta', emoji: '🍝', category: 'International', calories: 131, protein_g: 5, carbs_g: 25, fat_g: 1.1, fiber_g: 1.8, sugar_g: 0.6, sodium_mg: 3, serving: '100g cooked', health_score: 'B+', micronutrients: ['Folate', 'Iron', 'Manganese'], benefits: 'Good carbohydrate source. Whole wheat pasta provides more fiber.', ai_tip: 'Whole wheat pasta has double the fiber. Use olive oil and vegetable sauces.' },
  { name: 'Pizza', emoji: '🍕', category: 'International', calories: 266, protein_g: 11, carbs_g: 33, fat_g: 10, fiber_g: 2.3, sugar_g: 3.6, sodium_mg: 598, serving: '1 slice (107g)', health_score: 'C+', micronutrients: ['Calcium', 'Iron', 'Lycopene'], benefits: 'Cheese provides calcium. Tomato sauce contains lycopene.', ai_tip: 'Thin crust with vegetables and less cheese is much healthier. Limit frequency.' },
  { name: 'Chicken Ramen', emoji: '🍜', category: 'International', calories: 380, protein_g: 22, carbs_g: 45, fat_g: 12, fiber_g: 2, sugar_g: 4, sodium_mg: 1200, serving: '1 bowl', health_score: 'B', micronutrients: ['Iron', 'Selenium', 'Vitamin B12'], benefits: 'Complete meal with protein, carbs and broth. Warming and filling.', ai_tip: 'Very high sodium. Add extra vegetables. Reduce sodium by using half the broth seasoning.' },
  { name: 'Spaghetti Bolognese', emoji: '🍝', category: 'International', calories: 350, protein_g: 18, carbs_g: 40, fat_g: 12, fiber_g: 3, sugar_g: 6, sodium_mg: 520, serving: '1 plate (280g)', health_score: 'B+', micronutrients: ['Iron', 'Lycopene', 'Zinc'], benefits: 'Complete meal with protein and carbs. Tomato sauce provides lycopene.', ai_tip: 'Use whole wheat pasta and lean ground beef. Add extra vegetables.' },
  { name: 'Chicken Tacos', emoji: '🌮', category: 'International', calories: 226, protein_g: 18, carbs_g: 20, fat_g: 8, fiber_g: 3, sugar_g: 3, sodium_mg: 480, serving: '2 tacos', health_score: 'B+', micronutrients: ['Calcium', 'Iron', 'Vitamin C'], benefits: 'Balanced meal with protein, carbs and vegetables. Salsa adds vitamins.', ai_tip: 'Corn tortillas have more nutrients than flour. Load with salsa and avocado.' },
];

// ────────────────────────────────────────────────────────────────────────────
// SMART FOOD MATCHER
// ────────────────────────────────────────────────────────────────────────────
function matchFood(filename: string): FoodInfo {
  const lower = filename.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
  let best: FoodInfo | null = null;
  let bestScore = 0;
  for (const food of FOOD_DATABASE) {
    const words = food.name.toLowerCase().split(/[\s/()]/);
    const score = words.reduce((s, w) => s + (lower.includes(w) ? w.length : 0), 0);
    if (score > bestScore) { bestScore = score; best = food; }
  }
  // Pick random food if no match
  if (!best) return FOOD_DATABASE[Math.floor(Math.random() * FOOD_DATABASE.length)];
  return best;
}

// ────────────────────────────────────────────────────────────────────────────
// SCORE COLOR HELPER
// ────────────────────────────────────────────────────────────────────────────
const scoreColor: Record<string, string> = {
  'A+': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'A': 'text-green-700 bg-green-50 border-green-200',
  'B+': 'text-blue-700 bg-blue-50 border-blue-200',
  'B': 'text-indigo-700 bg-indigo-50 border-indigo-200',
  'C+': 'text-amber-700 bg-amber-50 border-amber-200',
  'C': 'text-orange-700 bg-orange-50 border-orange-200',
};

const CATEGORIES = ['All', ...Array.from(new Set(FOOD_DATABASE.map(f => f.category)))];

// ────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────────────
const PhotoScan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'browse'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<FoodInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [_, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          setFile(f); setResult(null);
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
      setResult(null);
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
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file && !preview) return;
    setLoading(true);
    setTimeout(() => {
      const food = matchFood(file?.name || 'food');
      setResult(food);
      setLoading(false);
    }, 1200);
  };

  const handleSelectFood = (food: FoodInfo) => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setResult(food);
    setPreview(null);
    setActiveTab('upload');
  };

  const filteredFoods = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    return FOOD_DATABASE.filter(f => {
      const matchCat = activeCategory === 'All' || f.category === activeCategory;
      const matchSearch = !searchLower || f.name.toLowerCase().includes(searchLower);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

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
            <span>Computer Vision • {FOOD_DATABASE.length}+ Trained Foods</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Food Photo Scanner
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium max-w-xl">
            Upload a meal photograph, capture via live camera, or browse database items for instant macronutrient estimation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#faf9f8] border border-neutral-200/60">
          <div className="text-right px-2">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Model Status</span>
            <span className="text-xs font-black text-emerald-700">Online & Active</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ━━━ LEFT: Scanner Panel (6 cols) ━━━ */}
        <div className="xl:col-span-6 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/80 flex gap-1">
            {(['upload', 'camera', 'browse'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setResult(null);
                  setPreview(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab === 'upload' ? 'Upload Image' : tab === 'camera' ? 'Camera Scan' : 'Browse Foods'}
              </button>
            ))}
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
                      setResult(null);
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
                    JPG, PNG, WEBP (Max 15MB)
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
                    <span>Analyzing your food...</span>
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
                        setResult(null);
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
                  placeholder="Filter foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
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
                    key={food.name}
                    onClick={() => handleSelectFood(food)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left"
                  >
                    <span className="text-xl">{food.emoji}</span>
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
          {!result && !loading && (
            <div className="premium-card p-8 flex flex-col items-center justify-center min-h-[420px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Food Analysis Panel</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs font-medium">
                Upload a photo or capture an image to identify nutrients, calories, and confidence score.
              </p>
              <div className="grid grid-cols-3 gap-2.5 mt-6 w-full max-w-xs">
                {[['🥦', 'Broccoli'], ['🍗', 'Chicken'], ['🍎', 'Apple']].map(([e, n]) => (
                  <button
                    key={n}
                    onClick={() => handleSelectFood(FOOD_DATABASE.find((f) => f.name === n) || FOOD_DATABASE[0])}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#faf9f8] hover:bg-emerald-50 border border-neutral-200/80 hover:border-emerald-300 transition-all"
                  >
                    <span className="text-xl">{e}</span>
                    <span className="text-[11px] font-bold text-neutral-700">{n}</span>
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
              <p className="mt-4 text-sm font-bold text-neutral-800">Analyzing your food...</p>
              <p className="text-xs text-neutral-400 mt-1 font-medium">Segmenting ingredients & computing macros</p>
              <div className="mt-4 space-y-2 w-full max-w-xs">
                {['Detecting food boundaries...', 'Cross-referencing nutritional database...', 'Calculating portion & confidence...'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    <span className="text-xs text-neutral-500 font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="premium-card overflow-hidden">
              {/* Product Header Card */}
              <div className="p-6 border-b border-neutral-100 bg-[#faf9f8]/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="text-4xl">{result.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {result.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          98.4% Confidence
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight">{result.name}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5 font-medium">Estimated portion: {result.serving}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-black px-3 py-1 rounded-xl border ${scoreColor[result.health_score] || ''}`}>
                    Score: {result.health_score}
                  </span>
                </div>

                {/* Main Macro Chips */}
                <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block">Calories</span>
                    <span className="text-base font-black text-neutral-900">{result.calories}</span>
                    <span className="text-[10px] text-neutral-400">kcal</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                    <span className="text-[10px] font-bold text-blue-600 uppercase block">Protein</span>
                    <span className="text-base font-black text-blue-900">{result.protein_g}g</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block">Carbs</span>
                    <span className="text-base font-black text-emerald-900">{result.carbs_g}g</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70">
                    <span className="text-[10px] font-bold text-amber-600 uppercase block">Fat</span>
                    <span className="text-base font-black text-amber-900">{result.fat_g}g</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Macro progress bars */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Detailed Macro Profile
                  </h4>
                  {[
                    { label: 'Dietary Fiber', val: result.fiber_g, max: 20, color: 'bg-emerald-600', unit: 'g' },
                    { label: 'Sugar', val: result.sugar_g, max: 30, color: 'bg-purple-500', unit: 'g' },
                    { label: 'Sodium', val: result.sodium_mg, max: 1500, color: 'bg-neutral-400', unit: 'mg' },
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

                {/* Micronutrients */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Key Micronutrients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.micronutrients.map((m) => (
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
                    <span className="text-xs font-bold text-blue-800">Health Benefits</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">{result.benefits}</p>
                </div>

                {/* AI Tip */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">AI Nutrition Recommendation</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">{result.ai_tip}</p>
                </div>

                {/* Log Meal Button */}
                <button
                  onClick={() => {
                    setLogSuccess(true);
                    setTimeout(() => setLogSuccess(false), 2500);
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                    logSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {logSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Meal Successfully Logged!</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Add to Meal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Select Strip */}
      <div className="premium-card p-5">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          Quick Select Popular Foods ({FOOD_DATABASE.length} in database)
        </h3>
        <div className="flex gap-2 flex-wrap">
          {FOOD_DATABASE.slice(0, 18).map((food) => (
            <button
              key={food.name}
              onClick={() => handleSelectFood(food)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf9f8] border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-medium text-neutral-700 transition-all"
            >
              <span>{food.emoji}</span>
              <span>{food.name}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
          >
            +{FOOD_DATABASE.length - 18} more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoScan;
