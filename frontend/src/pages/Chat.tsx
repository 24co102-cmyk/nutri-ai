// src/pages/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { Send, Sparkles, User, Bot, HelpCircle } from 'lucide-react';

interface ChatSource {
  title: string;
  file_path: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  source?: 'gemini' | 'project_rag' | 'tools' | 'training' | 'fallback';
  tools_used?: string[];
  sources?: ChatSource[];
}

const promptSuggestions = [
  'How is BarcodeScan.tsx implemented?',
  'What endpoints are in meals.py?',
  'What is my daily calorie target and health goal?',
  'Analyze my meals today',
  'Calories in 100g chicken breast?',
  'How does the VisionCamera autofocus work?',
  'Where are database models defined in backend?',
  "Create today's diet plan",
];

const getProjectKnowledgeAnswer = (query: string): string => {
  const q = query.toLowerCase();

  // ── Chicken Breast ──
  if (q.includes('chicken breast') || (q.includes('chicken') && (q.includes('calorie') || q.includes('protein') || q.includes('nutrition') || q.includes('fact')))) {
    if (q.includes('protein') && !q.includes('calorie') && !q.includes('fact')) {
      return '💪 Chicken breast contains **31 g of protein per 100 g**. It is one of the highest protein, lowest fat meats — perfect for muscle building and weight management.';
    }
    return '🍗 **Chicken Breast (per 100 g, cooked):**\n• Calories: **165 kcal**\n• Protein: **31 g**\n• Carbohydrates: **0 g**\n• Fat: **3.6 g**\n• Fiber: **0 g**\n\n✅ Excellent lean protein source. Great for weight loss and muscle gain.';
  }

  // ── Salmon ──
  if (q.includes('salmon')) {
    return '🐟 **Salmon (per 100 g, raw):**\n• Calories: **208 kcal**\n• Protein: **20 g**\n• Carbohydrates: **0 g**\n• Fat: **13 g**\n• Omega-3: **2.3 g**\n\n✅ Rich in omega-3 fatty acids. Great for heart health and anti-inflammation.';
  }

  // ── Shrimp ──
  if (q.includes('shrimp') || q.includes('prawn')) {
    return '🦐 **Shrimp (per 100 g, cooked):**\n• Calories: **99 kcal**\n• Protein: **24 g**\n• Carbohydrates: **0.2 g**\n• Fat: **0.3 g**\n\n✅ Very low calorie, very high protein — excellent for weight loss diets.';
  }

  // ── Eggs ──
  if (q.includes('egg') || q.includes('boiled egg')) {
    return '🥚 **Boiled Egg (per 100 g):**\n• Calories: **155 kcal**\n• Protein: **13 g**\n• Carbohydrates: **1.1 g**\n• Fat: **11 g**\n\n✅ Complete protein with all essential amino acids. Yolk has vitamins D and B12.';
  }

  // ── Paneer ──
  if (q.includes('paneer')) {
    if (q.includes('protein') && !q.includes('calorie') && !q.includes('fact')) {
      return '💪 Paneer contains **18 g of protein per 100 g**. It is the best vegetarian protein source in Indian cooking.';
    }
    return '🧀 **Paneer (per 100 g):**\n• Calories: **265 kcal**\n• Protein: **18 g**\n• Carbohydrates: **3.6 g**\n• Fat: **20 g**\n• Calcium: **480 mg**\n\n✅ Best vegetarian protein source. High calcium and healthy fats.';
  }

  // ── Tofu ──
  if (q.includes('tofu')) {
    return '🟨 **Tofu (per 100 g, firm):**\n• Calories: **76 kcal**\n• Protein: **8 g**\n• Carbohydrates: **1.9 g**\n• Fat: **4.8 g**\n\n✅ Plant-based complete protein. Great for vegans. Low calorie and versatile.';
  }

  // ── Greek Yogurt ──
  if (q.includes('greek yogurt') || q.includes('greek yoghurt')) {
    return '🥛 **Greek Yogurt (per 100 g, plain):**\n• Calories: **59 kcal**\n• Protein: **10 g**\n• Carbohydrates: **3.6 g**\n• Fat: **0.4 g**\n• Probiotics: ✅ Yes\n\n✅ High protein, low calorie, great for gut health. Perfect post-workout snack.';
  }

  // ── Milk ──
  if (q.includes('skim milk') || q.includes('skimmed milk')) {
    return '🥛 **Skim Milk (per 100 ml):**\n• Calories: **34 kcal**\n• Protein: **3.4 g**\n• Carbohydrates: **5 g**\n• Fat: **0.1 g**\n\n✅ Lower calorie option. Ideal for weight loss while maintaining protein intake.';
  }
  if (q.includes('milk')) {
    return '🥛 **Whole Milk (per 100 ml):**\n• Calories: **61 kcal**\n• Protein: **3.2 g**\n• Carbohydrates: **4.8 g**\n• Fat: **3.3 g**\n• Calcium: **120 mg**\n\n✅ Good source of calcium and vitamin D.';
  }

  // ── Cheese ──
  if (q.includes('cheddar') || (q.includes('cheese') && !q.includes('paneer'))) {
    return '🧀 **Cheddar Cheese (per 100 g):**\n• Calories: **402 kcal**\n• Protein: **25 g**\n• Carbohydrates: **1.3 g**\n• Fat: **33 g**\n\n⚠️ High calories and saturated fat. Use in small amounts.';
  }

  // ── Peanut Butter ──
  if (q.includes('peanut butter')) {
    return '🥜 **Peanut Butter (per 100 g):**\n• Calories: **588 kcal**\n• Protein: **25 g**\n• Carbohydrates: **20 g**\n• Fat: **50 g**\n• Fiber: **6 g**\n\n✅ High protein and healthy fat. Choose unsweetened/natural variety.';
  }

  // ── Peanuts ──
  if (q.includes('peanut') && !q.includes('butter')) {
    return '🥜 **Peanuts (per 100 g):**\n• Calories: **567 kcal**\n• Protein: **26 g**\n• Carbohydrates: **16 g**\n• Fat: **49 g**\n• Fiber: **8.5 g**\n\n✅ High protein legume. Limit to a small handful due to calorie density.';
  }

  // ── Almonds ──
  if (q.includes('almond')) {
    return '🌰 **Almonds (per 100 g):**\n• Calories: **579 kcal**\n• Protein: **21 g**\n• Carbohydrates: **22 g**\n• Fat: **50 g**\n• Fiber: **12.5 g**\n• Vitamin E: **26 mg**\n\n✅ Rich in vitamin E and magnesium. Limit to 20–25 almonds/day.';
  }

  // ── Cashews ──
  if (q.includes('cashew')) {
    return '🥜 **Cashews (per 100 g):**\n• Calories: **553 kcal**\n• Protein: **18 g**\n• Carbohydrates: **30 g**\n• Fat: **44 g**\n\n✅ Good source of magnesium and zinc. More carb-heavy than other nuts.';
  }

  // ── Walnuts ──
  if (q.includes('walnut')) {
    return '🌰 **Walnuts (per 100 g):**\n• Calories: **654 kcal**\n• Protein: **15 g**\n• Carbohydrates: **14 g**\n• Fat: **65 g**\n• Omega-3: **9 g**\n\n✅ Best plant source of omega-3. Excellent for brain health. Eat 4–5 walnuts/day.';
  }

  // ── Butter ──
  if (q.includes('butter') && !q.includes('peanut')) {
    return '🧈 **Butter (per 100 g):**\n• Calories: **717 kcal**\n• Fat: **81 g** (saturated: 51g)\n• Protein: **0.9 g**\n\n⚠️ Very high in calories and saturated fat. Use sparingly.';
  }

  // ── Olive Oil ──
  if (q.includes('olive oil')) {
    return '🫒 **Olive Oil (per 100 ml):**\n• Calories: **884 kcal**\n• Fat: **100 g** (73% monounsaturated)\n• Carbs & Protein: **0 g**\n\n✅ Heart-healthy fat rich in antioxidants. Use 1–2 tbsp per meal.';
  }

  // ── Honey ──
  if (q.includes('honey')) {
    return '🍯 **Honey (per 100 g):**\n• Calories: **304 kcal**\n• Carbohydrates: **82 g**\n• Fat: **0 g**\n\n⚠️ Natural but high in sugar. Use as healthier sugar substitute — 1 tsp = 21 kcal.';
  }

  // ── White Sugar ──
  if (q.includes('sugar')) {
    return '🧂 **White Sugar (per 100 g):**\n• Calories: **387 kcal**\n• Carbohydrates: **100 g** (pure sucrose)\n• Protein & Fat: **0 g**\n\n❌ Zero nutritional value. Excess sugar = weight gain and diabetes risk.';
  }

  // ── Avocado ──
  if (q.includes('avocado')) {
    if (q.includes('weight loss') || q.includes('good for')) {
      return '🥑 Avocado is **great for weight loss** in moderation. High in monounsaturated fats and fiber (6.7g/100g) which increase satiety. However it is calorie-dense (160 kcal/100g) — stick to half an avocado per meal.';
    }
    return '🥑 **Avocado (per 100 g):**\n• Calories: **160 kcal**\n• Protein: **2 g**\n• Carbohydrates: **9 g**\n• Fat: **15 g** (mostly monounsaturated)\n• Fiber: **6.7 g**\n• Potassium: **485 mg**\n\n✅ Heart-healthy fats, great for skin and brain.';
  }

  // ── Chia Seeds ──
  if (q.includes('chia')) {
    return '🌱 **Chia Seeds (per 100 g):**\n• Calories: **486 kcal**\n• Protein: **17 g**\n• Carbohydrates: **42 g**\n• Fat: **31 g**\n• Fiber: **34 g** ⬅️ Very high\n• Omega-3: **17.5 g**\n\n✅ Tiny superfood packed with fiber and omega-3. Add to yogurt or smoothies.';
  }

  // ── Flax Seeds ──
  if (q.includes('flax') || q.includes('flaxseed') || q.includes('linseed')) {
    return '🌿 **Flax Seeds (per 100 g):**\n• Calories: **534 kcal**\n• Protein: **18 g**\n• Carbohydrates: **29 g**\n• Fat: **42 g**\n• Fiber: **27 g**\n• Omega-3: **22 g**\n\n⚠️ Very calorie-dense. Eat only 1–2 tablespoons per day.';
  }

  // ── Oats ──
  if (q.includes('oat') || q.includes('oatmeal')) {
    return '🌾 **Oats (per 100 g, dry):**\n• Calories: **389 kcal**\n• Protein: **17 g**\n• Carbohydrates: **66 g**\n• Fat: **7 g**\n• Fiber: **10.6 g**\n\n✅ Best breakfast for weight loss. High fiber keeps you full. Lowers cholesterol.';
  }

  // ── Quinoa ──
  if (q.includes('quinoa')) {
    return '🌾 **Quinoa (per 100 g, cooked):**\n• Calories: **120 kcal**\n• Protein: **4.1 g** (complete protein!)\n• Carbohydrates: **21 g**\n• Fat: **1.9 g**\n• Fiber: **2.8 g**\n\n✅ Complete plant protein. Gluten-free. Better than white rice.';
  }

  // ── Brown Rice ──
  if (q.includes('brown rice')) {
    return '🍚 **Brown Rice (per 100 g, cooked):**\n• Calories: **111 kcal**\n• Protein: **2.6 g**\n• Carbohydrates: **23 g**\n• Fat: **0.9 g**\n• Fiber: **1.8 g**\n\n✅ Healthier than white rice. More fiber, more nutrients.';
  }

  // ── White Rice ──
  if (q.includes('rice') && !q.includes('brown')) {
    return '🍚 **White Rice (per 100 g, cooked):**\n• Calories: **130 kcal**\n• Protein: **2.7 g**\n• Carbohydrates: **28 g**\n• Fat: **0.3 g**\n• Fiber: **0.4 g**\n\n⚠️ High glycemic index. Prefer brown rice or quinoa for weight management.';
  }

  // ── Pasta ──
  if (q.includes('pasta')) {
    return '🍝 **Pasta (per 100 g, cooked):**\n• Calories: **131 kcal**\n• Protein: **5 g**\n• Carbohydrates: **25 g**\n• Fat: **1.1 g**\n• Fiber: **1.8 g**\n\n⚠️ Prefer whole wheat pasta. Watch portion size.';
  }

  // ── Whole Wheat Bread ──
  if (q.includes('whole wheat bread') || q.includes('brown bread') || q.includes('wholegrain')) {
    return '🍞 **Whole Wheat Bread (per 100 g):**\n• Calories: **247 kcal**\n• Protein: **13 g**\n• Carbohydrates: **41 g**\n• Fat: **3.4 g**\n• Fiber: **6.8 g**\n\n✅ Much healthier than white bread. High fiber helps digestion.';
  }

  // ── White Bread ──
  if (q.includes('bread') && !q.includes('wheat') && !q.includes('brown') && !q.includes('whole')) {
    return '🍞 **White Bread (per 100 g):**\n• Calories: **265 kcal**\n• Protein: **9 g**\n• Carbohydrates: **49 g**\n• Fat: **3.2 g**\n• Fiber: **2.7 g**\n\n⚠️ High glycemic index, low fiber. Switch to whole wheat.';
  }

  // ── Lentils ──
  if (q.includes('lentil') || q.includes('dal') || q.includes('daal')) {
    return '🫘 **Lentils / Dal (per 100 g, cooked):**\n• Calories: **116 kcal**\n• Protein: **9 g**\n• Carbohydrates: **20 g**\n• Fat: **0.4 g**\n• Fiber: **7.9 g**\n• Iron: **3.3 mg**\n\n✅ Excellent plant protein and iron source. Staple of Indian diet.';
  }

  // ── Chickpeas ──
  if (q.includes('chickpea') || q.includes('chana') || q.includes('garbanzo')) {
    return '🫘 **Chickpeas / Chana (per 100 g, cooked):**\n• Calories: **164 kcal**\n• Protein: **8.9 g**\n• Carbohydrates: **27 g**\n• Fat: **2.6 g**\n• Fiber: **7.6 g**\n\n✅ High protein legume rich in fiber and iron.';
  }

  // ── Apple ──
  if (q.includes('apple') && !q.includes('juice')) {
    return '🍎 **Apple (per 100 g):**\n• Calories: **52 kcal**\n• Protein: **0.3 g**\n• Carbohydrates: **14 g**\n• Fat: **0.2 g**\n• Fiber: **2.4 g**\n• Vitamin C: **4.6 mg**\n\n✅ Low calorie, high fiber. Great for gut health.';
  }

  // ── Banana ──
  if (q.includes('banana')) {
    if (q.includes('weight loss') || q.includes('high in carb') || q.includes('good for')) {
      return '🍌 Banana has **23 g of carbs per 100 g** — moderately high. For weight loss, eat 1 small banana/day. Rich in potassium and provides quick energy.';
    }
    return '🍌 **Banana (per 100 g):**\n• Calories: **89 kcal**\n• Protein: **1.1 g**\n• Carbohydrates: **23 g**\n• Fat: **0.3 g**\n• Fiber: **2.6 g**\n• Potassium: **358 mg**\n\n✅ Great pre-workout fruit. Rich in potassium and natural sugars.';
  }

  // ── Orange / Orange Juice ──
  if (q.includes('orange juice')) {
    return '🍊 **Orange Juice (per 100 ml):**\n• Calories: **45 kcal**\n• Carbohydrates: **10 g**\n• Vitamin C: **50 mg**\n\n⚠️ Lacks the fiber of whole oranges. Drink in moderation.';
  }
  if (q.includes('orange')) {
    return '🍊 **Orange (per 100 g):**\n• Calories: **47 kcal**\n• Protein: **0.9 g**\n• Carbohydrates: **12 g**\n• Fat: **0.1 g**\n• Fiber: **2.4 g**\n• Vitamin C: **53 mg**\n\n✅ Excellent source of Vitamin C and immune-boosting antioxidants.';
  }

  // ── Mango ──
  if (q.includes('mango')) {
    return '🥭 **Mango (per 100 g):**\n• Calories: **60 kcal**\n• Protein: **0.8 g**\n• Carbohydrates: **15 g**\n• Fat: **0.4 g**\n• Fiber: **1.6 g**\n• Vitamin C: **36 mg**\n\n✅ Delicious tropical fruit. Moderately high sugar — enjoy in moderation.';
  }

  // ── Grapes ──
  if (q.includes('grape')) {
    return '🍇 **Grapes (per 100 g):**\n• Calories: **69 kcal**\n• Protein: **0.7 g**\n• Carbohydrates: **18 g**\n• Fat: **0.2 g**\n• Fiber: **0.9 g**\n\n⚠️ High in natural sugars. Contain resveratrol (antioxidant). Limit portions.';
  }

  // ── Watermelon ──
  if (q.includes('watermelon')) {
    if (q.includes('carb') || q.includes('high in')) {
      return '🍉 No, watermelon is **low in carbs** with about **8 g per 100 g**. It is mostly water (92%) and very low calorie at just 30 kcal per 100 g.';
    }
    return '🍉 **Watermelon (per 100 g):**\n• Calories: **30 kcal**\n• Carbohydrates: **8 g**\n• Protein: **0.6 g**\n• Fat: **0.2 g**\n• Water: **92%**\n\n✅ Very low calorie. Excellent summer hydration fruit.';
  }

  // ── Strawberries ──
  if (q.includes('strawberry') || q.includes('strawberries')) {
    return '🍓 **Strawberries (per 100 g):**\n• Calories: **32 kcal**\n• Protein: **0.7 g**\n• Carbohydrates: **7.7 g**\n• Fat: **0.3 g**\n• Fiber: **2 g**\n• Vitamin C: **59 mg**\n\n✅ Very low calorie, high vitamin C. Perfect weight-loss snack.';
  }

  // ── Papaya ──
  if (q.includes('papaya')) {
    return '🍈 **Papaya (per 100 g):**\n• Calories: **43 kcal**\n• Protein: **0.5 g**\n• Carbohydrates: **11 g**\n• Fat: **0.3 g**\n• Fiber: **1.7 g**\n• Vitamin C: **62 mg**\n\n✅ Rich in digestive enzyme papain. Excellent for gut health.';
  }

  // ── Guava ──
  if (q.includes('guava')) {
    return '🍃 **Guava (per 100 g):**\n• Calories: **68 kcal**\n• Protein: **2.6 g**\n• Carbohydrates: **14 g**\n• Fat: **1 g**\n• Fiber: **5.4 g**\n• Vitamin C: **228 mg** ⬅️ Very high\n\n✅ 4x more Vitamin C than orange. Great for weight loss.';
  }

  // ── Dates ──
  if (q.includes('date') && !q.includes('dashboard') && !q.includes('today')) {
    return '🌴 **Dates (per 100 g, dried):**\n• Calories: **277 kcal**\n• Protein: **1.8 g**\n• Carbohydrates: **75 g**\n• Fat: **0.2 g**\n• Fiber: **6.7 g**\n• Potassium: **696 mg**\n\n⚠️ High in natural sugar. Excellent energy booster. Limit to 3–4 dates/day.';
  }

  // ── Raisins ──
  if (q.includes('raisin')) {
    return '🍇 **Raisins (per 100 g):**\n• Calories: **299 kcal**\n• Protein: **3.1 g**\n• Carbohydrates: **79 g**\n• Fat: **0.5 g**\n• Iron: **1.9 mg**\n\n⚠️ Very high in sugar. Use sparingly as natural sweetener.';
  }

  // ── Coconut Water ──
  if (q.includes('coconut water')) {
    return '🥥 **Coconut Water (per 100 ml):**\n• Calories: **19 kcal**\n• Protein: **0.7 g**\n• Carbohydrates: **3.7 g**\n• Fat: **0.2 g**\n• Potassium: **250 mg**\n\n✅ Natural electrolyte drink. Excellent for post-workout hydration.';
  }

  // ── Cola / Soda ──
  if (q.includes('cola') || q.includes('soda') || q.includes('soft drink') || q.includes('coke')) {
    return '🥤 **Cola / Soda (per 100 ml):**\n• Calories: **42 kcal**\n• Carbohydrates: **10.6 g** (pure sugar)\n• Protein & Fat: **0 g**\n\n❌ Zero nutritional value. A 350ml can = ~145 kcal of pure sugar. Avoid completely.';
  }

  // ── Ice Cream ──
  if (q.includes('ice cream')) {
    return '🍦 **Ice Cream (per 100 g, vanilla):**\n• Calories: **207 kcal**\n• Protein: **3.5 g**\n• Carbohydrates: **24 g**\n• Fat: **11 g**\n• Sugar: **21 g**\n\n⚠️ High in sugar and fat. An occasional treat — 1 scoop (65g) = ~135 kcal.';
  }

  // ── Dark Chocolate ──
  if (q.includes('chocolate') || q.includes('dark chocolate')) {
    return '🍫 **Dark Chocolate 70%+ (per 100 g):**\n• Calories: **598 kcal**\n• Protein: **7.8 g**\n• Carbohydrates: **46 g**\n• Fat: **43 g**\n• Fiber: **10.9 g**\n• Iron: **11.9 mg**\n\n✅ Rich in flavonoids. Good for heart. Limit to 1–2 squares (20–30 g) daily.';
  }

  // ── Pizza ──
  if (q.includes('pizza')) {
    return '🍕 **Pizza (per 100 g, cheese & tomato):**\n• Calories: **266 kcal**\n• Protein: **11 g**\n• Carbohydrates: **33 g**\n• Fat: **10 g**\n• Sodium: **598 mg**\n\n⚠️ High calories, sodium, and refined carbs. Choose thin crust + veggie toppings.';
  }

  // ── French Fries ──
  if (q.includes('french fries') || q.includes('fries')) {
    return '🍟 **French Fries (per 100 g):**\n• Calories: **312 kcal**\n• Protein: **3.4 g**\n• Carbohydrates: **41 g**\n• Fat: **15 g**\n\n❌ High calorie junk food. Deep fried = trans fats. Avoid or eat rarely.';
  }

  // ── Chips ──
  if (q.includes('chip') || q.includes('crisps')) {
    return '🍟 **Potato Chips (per 100 g):**\n• Calories: **536 kcal**\n• Protein: **7 g**\n• Carbohydrates: **53 g**\n• Fat: **35 g**\n• Sodium: **500–700 mg**\n\n❌ Ultra-processed junk food. High in trans fats and sodium. Avoid.';
  }

  // ── Broccoli ──
  if (q.includes('broccoli')) {
    return '🥦 **Broccoli (per 100 g):**\n• Calories: **34 kcal**\n• Protein: **2.8 g**\n• Carbohydrates: **7 g**\n• Fat: **0.4 g**\n• Fiber: **2.6 g**\n• Vitamin C: **89 mg**\n\n✅ Superfood. Excellent for weight loss, cancer prevention, and bone health.';
  }

  // ── Spinach ──
  if (q.includes('spinach') || q.includes('palak')) {
    return '🥬 **Spinach / Palak (per 100 g):**\n• Calories: **23 kcal**\n• Protein: **2.9 g**\n• Carbohydrates: **3.6 g**\n• Fat: **0.4 g**\n• Iron: **2.7 mg**\n• Vitamin K: **483 mcg**\n\n✅ Extremely nutrient-dense and low calorie. Great for iron and bone health.';
  }

  // ── Okra / Bhindi ──
  if (q.includes('okra') || q.includes('bhindi') || q.includes('ladyfinger')) {
    return '🫛 **Okra / Bhindi (per 100 g):**\n• Calories: **33 kcal**\n• Protein: **1.9 g**\n• Carbohydrates: **7 g**\n• Fat: **0.2 g**\n• Fiber: **3.2 g**\n\n✅ Low calorie, high fiber. Great for blood sugar regulation.';
  }

  // ── Cauliflower ──
  if (q.includes('cauliflower') || q.includes('gobhi') || q.includes('gobi')) {
    return '🥦 **Cauliflower (per 100 g):**\n• Calories: **25 kcal**\n• Protein: **1.9 g**\n• Carbohydrates: **5 g**\n• Fat: **0.3 g**\n• Fiber: **2 g**\n\n✅ Very low calorie. Excellent low-carb rice or mash substitute.';
  }

  // ── Cabbage ──
  if (q.includes('cabbage') || q.includes('patta gobhi')) {
    return '🥬 **Cabbage (per 100 g):**\n• Calories: **25 kcal**\n• Protein: **1.3 g**\n• Carbohydrates: **6 g**\n• Fat: **0.1 g**\n• Fiber: **2.5 g**\n\n✅ Very low calorie. High in vitamin K.';
  }

  // ── Carrot ──
  if (q.includes('carrot') || q.includes('gajar')) {
    return '🥕 **Carrot (per 100 g):**\n• Calories: **41 kcal**\n• Protein: **0.9 g**\n• Carbohydrates: **10 g**\n• Fat: **0.2 g**\n• Fiber: **2.8 g**\n• Vitamin A: **835 mcg** ⬅️ Very high\n\n✅ Rich in beta-carotene. Great for eye health and immunity.';
  }

  // ── Cucumber ──
  if (q.includes('cucumber') || q.includes('kheera')) {
    return '🥒 **Cucumber (per 100 g):**\n• Calories: **16 kcal**\n• Protein: **0.7 g**\n• Carbohydrates: **3.6 g**\n• Fat: **0.1 g**\n• Water: **95%**\n\n✅ One of the lowest calorie foods. Perfect for weight loss and hydration.';
  }

  // ── Tomato ──
  if (q.includes('tomato') || q.includes('tamatar')) {
    return '🍅 **Tomato (per 100 g):**\n• Calories: **18 kcal**\n• Protein: **0.9 g**\n• Carbohydrates: **3.9 g**\n• Fat: **0.2 g**\n• Lycopene: **2.6 mg** (antioxidant)\n\n✅ Very low calorie. Rich in lycopene which reduces cancer risk.';
  }

  // ── Beetroot ──
  if (q.includes('beetroot') || q.includes('beet') || q.includes('chukandar')) {
    return '🫀 **Beetroot (per 100 g):**\n• Calories: **43 kcal**\n• Protein: **1.6 g**\n• Carbohydrates: **9.6 g**\n• Fat: **0.2 g**\n• Fiber: **2.8 g**\n\n✅ Boosts exercise endurance and lowers blood pressure.';
  }

  // ── Onion ──
  if (q.includes('onion') || q.includes('pyaz')) {
    return '🧅 **Onion (per 100 g):**\n• Calories: **40 kcal**\n• Protein: **1.1 g**\n• Carbohydrates: **9.3 g**\n• Fat: **0.1 g**\n• Fiber: **1.7 g**\n\n✅ Low calorie flavor base. Rich in quercetin (anti-inflammatory).';
  }

  // ── Mushrooms ──
  if (q.includes('mushroom')) {
    return '🍄 **Mushrooms (per 100 g):**\n• Calories: **22 kcal**\n• Protein: **3.1 g**\n• Carbohydrates: **3.3 g**\n• Fat: **0.3 g**\n\n✅ Low calorie, high protein for a vegetable. One of few plant sources of Vitamin D.';
  }

  // ── Green Peas ──
  if (q.includes('green pea') || q.includes('matar')) {
    return '🟢 **Green Peas (per 100 g):**\n• Calories: **81 kcal**\n• Protein: **5.4 g**\n• Carbohydrates: **14 g**\n• Fat: **0.4 g**\n• Fiber: **5.1 g**\n\n✅ High protein vegetable. Good for plant-based diets.';
  }

  // ── Sweet Potato ──
  if (q.includes('sweet potato') || q.includes('shakarkandi')) {
    return '🍠 **Sweet Potato (per 100 g, baked):**\n• Calories: **86 kcal**\n• Protein: **1.6 g**\n• Carbohydrates: **20 g**\n• Fat: **0.1 g**\n• Fiber: **3 g**\n• Vitamin A: **961 mcg** ⬅️ Excellent\n\n✅ Healthier than regular potato. High in vitamin A, fiber, and antioxidants.';
  }

  // ── Potato ──
  if (q.includes('potato') && !q.includes('sweet') && !q.includes('chip') && !q.includes('fries')) {
    return '🥔 **Potato (per 100 g, boiled):**\n• Calories: **77 kcal**\n• Protein: **2 g**\n• Carbohydrates: **17 g**\n• Fat: **0.1 g**\n• Potassium: **421 mg**\n\n⚠️ High GI when mashed or fried. Boiled potato is filling and nutritious.';
  }

  // ─── BMI ───
  if (q.includes('bmi') || q.includes('body mass index')) {
    return '📊 **BMI (Body Mass Index) Calculation:**\n\n**Formula:** BMI = Weight (kg) ÷ Height² (m²)\n\n**BMI Categories:**\n• < 18.5 → Underweight\n• 18.5 – 24.9 → Normal / Healthy ✅\n• 25.0 – 29.9 → Overweight ⚠️\n• ≥ 30.0 → Obese ❌\n\n**Example:** 70 kg, 1.75 m tall → BMI = 70 ÷ 3.06 = **22.9** ✅ Normal\n\n*NutriLens Dashboard shows your BMI automatically.*';
  }

  // ─── BMR ───
  if (q.includes('bmr') || q.includes('basal metabolic rate') || q.includes('metabolism')) {
    return '🔥 **BMR (Basal Metabolic Rate) — Mifflin-St Jeor Formula:**\n\n**Men:** BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5\n**Women:** BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161\n\n**Activity Multipliers (TDEE):**\n• Sedentary: BMR × 1.2\n• Light active: BMR × 1.375\n• Moderate active: BMR × 1.55\n• Very active: BMR × 1.725\n\n*NutriLens uses this formula to set your daily calorie goal.*';
  }

  // ─── Calorie Splits ───
  if (q.includes('1200') && (q.includes('kcal') || q.includes('calorie') || q.includes('split') || q.includes('diet'))) {
    return '🥗 **1200 kcal Diet Macro Split (40/30/30):**\n• Carbs (40%): **120 g/day**\n• Protein (30%): **90 g/day**\n• Fat (30%): **40 g/day**\n\n*Best for: Women doing light exercise aiming for weight loss.*';
  }
  if (q.includes('1500') && (q.includes('kcal') || q.includes('calorie') || q.includes('split') || q.includes('diet'))) {
    return '🥗 **1500 kcal Diet Macro Split (40/30/30):**\n• Carbs (40%): **150 g/day**\n• Protein (30%): **112 g/day**\n• Fat (30%): **50 g/day**\n\n*Best for: Moderate weight loss for average-height women or petite men.*';
  }
  if (q.includes('2000') && (q.includes('kcal') || q.includes('calorie') || q.includes('split') || q.includes('diet'))) {
    return '🥗 **2000 kcal Diet Macro Split (40/30/30):**\n• Carbs (40%): **200 g/day**\n• Protein (30%): **150 g/day**\n• Fat (30%): **67 g/day**\n\n*Standard adult maintenance diet.*';
  }
  if (q.includes('2200') && (q.includes('kcal') || q.includes('calorie') || q.includes('split') || q.includes('diet'))) {
    return '🥗 **2200 kcal Diet Macro Split (40/30/30):**\n• Carbs (40%): **220 g/day**\n• Protein (30%): **165 g/day**\n• Fat (30%): **73 g/day**\n\n*Best for: Active men or women doing strength training.*';
  }
  if (q.includes('2500') && (q.includes('kcal') || q.includes('calorie') || q.includes('split') || q.includes('diet'))) {
    return '🥗 **2500 kcal Diet Macro Split (40/30/30):**\n• Carbs (40%): **250 g/day**\n• Protein (30%): **188 g/day**\n• Fat (30%): **83 g/day**\n\n*Best for: Muscle gain (bulking) or very active athletes.*';
  }

  // ─── Water Intake ───
  if (q.includes('water') && (q.includes('intake') || q.includes('drink') || q.includes('litre') || q.includes('liter') || q.includes('daily') || q.includes('how much'))) {
    return '💧 **Daily Water Intake Guide:**\n\n**Rule:** 35 ml × body weight (kg) per day.\n\n| Body Weight | Daily Water |\n|-------------|-------------|\n| 50 kg | 1.75 L |\n| 60 kg | 2.1 L |\n| 70 kg | 2.45 L |\n| 80 kg | 2.8 L |\n| 90 kg | 3.15 L |\n\n• Add 500 ml per 30 min of exercise.\n• Drink a glass first thing in the morning.\n• Track water on the NutriLens Dashboard.';
  }

  // ─── Weight Loss ───
  if (q.includes('weight loss') || q.includes('lose weight') || q.includes('fat loss') || q.includes('slim') || q.includes('reduce weight')) {
    return '⚖️ **Weight Loss Science & Tips:**\n\n**Golden Rule:** Calorie Deficit — burn more than you eat.\n• 500 kcal/day deficit = 0.5 kg loss per week.\n\n**Best Foods:**\nBroccoli, spinach, cucumber, chicken breast, Greek yogurt, oats, apple, strawberries, lentils.\n\n**Avoid:**\nChips, fries, cola, sugar, ice cream, white bread.\n\n**Lifestyle:**\n• Sleep 7–8 hours.\n• Drink 2–3L water daily.\n• Strength train 3–4 days/week.';
  }

  // ─── Muscle Gain ───
  if (q.includes('muscle') || q.includes('bulk') || q.includes('gain weight') || q.includes('bodybuilding') || q.includes('gym')) {
    return '💪 **Muscle Gain Nutrition Guide:**\n\n**Golden Rule:** Calorie Surplus + High Protein.\n• Eat 200–300 kcal above your TDEE.\n• Target **1.6–2.2 g of protein per kg** body weight.\n\n**Best Foods:**\nChicken breast, eggs, salmon, paneer, Greek yogurt, oats, brown rice, sweet potato, almonds.\n\n**Timing:**\n• Pre-workout: Banana + oats.\n• Post-workout: Chicken + rice within 30–60 min.';
  }

  // ─── High Protein Sources ───
  if (q.includes('high protein') || q.includes('protein source') || q.includes('best protein') || q.includes('protein food')) {
    return '💪 **Top High-Protein Foods (per 100g):**\n\n| Food | Protein |\n|------|---------|\n| Chicken Breast | 31 g |\n| Shrimp | 24 g |\n| Peanuts | 26 g |\n| Salmon | 20 g |\n| Boiled Eggs | 13 g |\n| Paneer | 18 g |\n| Greek Yogurt | 10 g |\n| Tofu | 8 g |\n| Lentils (cooked) | 9 g |\n| Chickpeas | 8.9 g |';
  }

  // ─── App Feature: Dashboard ───
  if (q.includes('dashboard')) {
    return '📊 **NutriLens Dashboard (/dashboard):**\n\nYour real-time health command center:\n• **Daily Calorie Ring**: Consumed vs Target calories.\n• **Macros Breakdown**: Protein, Carbs, Fat.\n• **Water Intake Tracker**: Daily hydration goal.\n• **Weight Trend Chart**: Body weight over time.\n• **BMI Card**: Current BMI with category badge.\n• **Meal Summary**: Today\'s logged meals at a glance.';
  }

  // ─── Add Meal ───
  if (q.includes('add meal') || q.includes('log meal') || q.includes('log food')) {
    return '🍽️ **Add Meal (/meals/add):**\n\n1. Navigate to **Add Meal** from sidebar.\n2. Search for your food item.\n3. Set quantity (grams or servings).\n4. Select: **Breakfast / Lunch / Dinner / Snack**.\n5. Hit **Log Meal** — appears on Dashboard instantly.\n\n*All meals stored in NutriLens backend.*';
  }

  // ─── Meal History ───
  if (q.includes('meal history') || q.includes('past meal') || q.includes('previous meal')) {
    return '📜 **Meal History (/meals):**\n\nView all past meals sorted by date. Each entry shows:\n• Meal type & food items\n• Total calories per meal\n• Date & time logged\n\nYou can delete individual meal logs from this page.';
  }

  // ─── Settings ───
  if (q.includes('setting')) {
    return '⚙️ **NutriLens Settings (/settings):**\n\n• **Profile Tab**: Update name, weight, height, age, fitness goal, dietary preferences, allergies.\n• **Notifications Tab**: Meal reminders, water alerts, weekly reports.\n• **Security Tab**: Change password, 2FA, and **Logout & Redirect to Gmail**.\n• **Appearance Tab**: Dark mode toggle, language preference.';
  }

  // ─── Project Overview ───
  if (q.includes('what is nutrilens') || q.includes('about project') || q.includes('project overview') || q.includes('what does this app do') || q.includes('nutrilens project') || q.includes('what is this project') || q.includes('about this app')) {
    return '🌟 **NutriLens AI Health & Nutrition Suite**\n\nA full-stack production health app with:\n• **Dashboard**: Real-time calorie, macro, water, and weight tracking.\n• **AI Photo Scanner**: Front/back camera with computer vision food analysis.\n• **Barcode Scanner**: Camera EAN/UPC scanner with Open Food Facts database.\n• **AI Diet Generator**: Custom meal schedules for Weight Loss/Gain/Maintenance.\n• **AI Assistant**: Nutrition facts + app feature Q&A.\n• **Google + Phone OTP Login**: Dual login system with WelcomeModal overlay.\n• **Logout → Gmail**: One-click session clear and Gmail redirect.';
  }

  // ─── Scanners ───
  if (q.includes('scanner') || q.includes('photo') || q.includes('camera') || q.includes('barcode') || q.includes('scan')) {
    return '📸 **NutriLens Scanners:**\n\n**1. Photo Food Scanner (/scan/photo):**\n- Live camera with **Front/Back toggle**.\n- Capture food → AI breakdown of calories, carbs, protein, fats, ingredients.\n\n**2. Barcode Scanner (/scan/barcode):**\n- Live EAN-13/UPC-A camera scanning (html5-qrcode).\n- Manual 13-digit entry fallback.\n- Open Food Facts lookup → Nutrition, allergen warnings, AI evaluation, meal logging.\n- Torch/flashlight toggle support.';
  }

  // ─── Login ───
  if (q.includes('login') || q.includes('signin') || q.includes('auth') || q.includes('otp') || q.includes('phone number') || q.includes('google')) {
    return '🔐 **NutriLens Dual Login System:**\n\nWhen you open the app, a **WelcomeModal** appears:\n1. **Continue with Google** – 1-click Google Account sign-in.\n2. **Phone + OTP** – Enter phone number → 4-digit OTP (any 4 digits in demo mode).\n3. **Skip / Explore** – Access prototype without login.\n\nReopen anytime via **"Login Options"** button in the header.';
  }

  // ─── Logout ───
  if (q.includes('logout') || q.includes('signout') || q.includes('gmail') || q.includes('exit app')) {
    return '🚪 **Logout & Gmail Redirect:**\n\nLog out from 3 places:\n• **Sidebar**: Red "Logout & Go to Gmail" button at bottom.\n• **Header**: Red "Logout" button (top right).\n• **Settings → Security Tab**: "Log Out & Redirect to Gmail".\n\nClicks clear localStorage/sessionStorage and redirect to **https://mail.google.com**.';
  }

  // ─── Tech Stack ───
  if (q.includes('tech') || q.includes('stack') || q.includes('react') || q.includes('fastapi') || q.includes('python') || q.includes('code') || q.includes('architecture') || q.includes('vite') || q.includes('tailwind')) {
    return '⚙️ **NutriLens Technology Stack:**\n\n**Frontend:** React 18 + TypeScript, Vite, Tailwind CSS v4, React Router DOM v6, Lucide React, Recharts, html5-qrcode, Axios.\n\n**Backend:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy + SQLite, Pydantic.\n\n**External APIs:** Open Food Facts (barcode lookup).';
  }

  // ─── Diet Plan ───
  if (q.includes('diet') || q.includes('meal plan') || q.includes('diet plan') || q.includes('what to eat')) {
    return '🥗 **AI Diet Planner (/diet-plan):**\n\nGenerate custom meal schedules:\n• **Weight Loss**: Calorie deficit, high fiber + protein.\n• **Muscle Gain**: Calorie surplus, high protein + complex carbs.\n• **Maintenance**: Balanced macros.\n\nSample Day (Weight Loss ~1500 kcal):\n🌅 Breakfast: Oatmeal + egg + coffee (380 kcal)\n🌞 Lunch: Grilled chicken + brown rice + salad (420 kcal)\n🌙 Dinner: Dal + roti + sabzi (380 kcal)\n🍎 Snack: Apple + 10 almonds (150 kcal)';
  }

  // ─── Calorie / Nutrition General ───
  if (q.includes('calorie') || q.includes('protein') || q.includes('macro') || q.includes('carb') || q.includes('fat') || q.includes('fiber') || q.includes('nutrition')) {
    return '🔥 **Nutrition Basics:**\n\n• 1g Fat = 9 kcal | 1g Protein = 4 kcal | 1g Carbs = 4 kcal\n• **Protein target**: 1.6–2.2g per kg body weight.\n• **Carbs**: Choose complex carbs (oats, brown rice, sweet potato).\n• **Fat**: Choose unsaturated fats (olive oil, avocado, nuts).\n• **Fiber target**: 25–38g per day.\n\nAsk me: "Nutrition facts of broccoli" or "Calories in banana".';
  }

  // ─── Default fallback ───
  return '🤖 **NutriLens AI Assistant:**\n\nI can help you with:\n🥗 **Nutrition Facts** – "Calories in 100g chicken breast", "Protein in paneer", "Is avocado good for weight loss?"\n📊 **Health Calculations** – "How to calculate BMI?", "What is BMR?", "Water intake for 70kg?"\n🍽️ **Diet Planning** – "1500 kcal diet split", "Best foods for weight loss", "High protein foods"\n📱 **App Features** – Dashboard, Photo Scanner, Barcode Scanner, Diet Plan, Add Meal, Settings, Logout\n\nTry: *"How many calories are in 100g of oats?"* or *"How does the barcode scanner work?"*';
};

const RECENT_TOPICS = [
  { id: 1, title: 'Macro Optimization', time: 'Today', icon: Sparkles },
  { id: 2, title: 'Dinner Recommendations', time: 'Yesterday', icon: HelpCircle },
  { id: 3, title: 'Post-Workout Fuel', time: '2 days ago', icon: Sparkles },
  { id: 4, title: 'Electrolyte & Water Balance', time: '3 days ago', icon: HelpCircle },
];

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Hello! I am your NutriLens AI Nutrition Coach. I can analyze your meals, recommend optimal foods based on your daily targets, or answer any nutritional questions. How can I support your nutrition today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/profile/').catch(() => ({ data: null })),
      api.get('/meals/').catch(() => ({ data: [] })),
    ]).then(([pRes, mRes]) => {
      if (pRes?.data) setProfile(pRes.data);
      if (mRes?.data) setMeals(mRes.data);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: queryText.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => !(m.role === 'assistant' && updatedMessages.indexOf(m) === 0))
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await api.post('/chat/', {
        message: queryText.trim(),
        history: history.slice(0, -1),
      });

      const replyText = res.data.reply || res.data.message;
      const source = res.data.source || 'gemini';
      const tools_used = res.data.tools_used || [];
      const sources = res.data.sources || [];

      if (replyText) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: replyText, source, tools_used, sources },
        ]);
      } else {
        throw new Error('Empty reply');
      }
    } catch {
      const replyText = getProjectKnowledgeAnswer(queryText.trim());
      setMessages((prev) => [...prev, { role: 'assistant', text: replyText, source: 'training' }]);
    } finally {
      setLoading(false);
    }
  };

  const targetCalories = profile?.daily_calorie_target || 2000;
  const consumedCalories = meals.reduce((acc: number, m: any) => acc + (m.total_calories || 0), 0);
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const targetProtein = profile?.protein_target || 130;
  const consumedProtein = meals.reduce((acc: number, m: any) => acc + (m.total_protein || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 h-[calc(100vh-7.5rem)] flex flex-col">
      {/* ━━━ Top Header Bar (Clean White SaaS Design) ━━━ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-2xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              NutriLens AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-neutral-400 font-medium">Personalized Diet & Nutrition Intelligence Engine</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full border border-emerald-200 hidden sm:inline-block">
          Powered by Gemini AI v2.5
        </span>
      </div>

      {/* ━━━ Main 3-Column Grid ━━━ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* ── LEFT: Conversation Topics & History (3 cols) ── */}
        <div className="hidden lg:flex flex-col lg:col-span-3 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Topics & History
            </h3>
            <button
              onClick={() =>
                setMessages([
                  {
                    role: 'assistant',
                    text: 'New session started. How can I assist with your nutrition and diet targets today?',
                  },
                ])
              }
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
            >
              + New Chat
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            {RECENT_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSend(`Tell me more about ${topic.title.toLowerCase()}`)}
                className="w-full text-left p-3 rounded-2xl border border-transparent hover:border-neutral-200 hover:bg-[#faf9f8] transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-neutral-800 truncate group-hover:text-emerald-700">
                    {topic.title}
                  </p>
                  <span className="text-[10px] text-neutral-400 font-medium">{topic.time}</span>
                </div>
                <topic.icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 shrink-0" />
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 text-[11px] text-neutral-500 font-medium leading-relaxed">
            💡 NutriLens AI has full context of your daily calorie limits, BMI status, and logged food entries.
          </div>
        </div>

        {/* ── CENTER: Chat Interface (6 cols on XL, 9 cols on LG, 12 on mobile) ── */}
        <div className="lg:col-span-9 xl:col-span-6 flex flex-col h-full space-y-3 min-h-0">
          {/* Chat Stream Card */}
          <div className="flex-1 premium-card p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Quick Suggestion Chips */}
            <div className="space-y-2 pb-3 border-b border-neutral-100">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Suggested Questions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {promptSuggestions.slice(0, 5).map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="px-3 py-1.5 rounded-xl bg-[#faf9f8] hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-neutral-200 text-[11px] text-neutral-700 font-semibold transition-all text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isUser
                        ? 'bg-neutral-900 text-white'
                        : 'bg-emerald-600 text-white shadow-2xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-2xs'
                        : 'bg-[#faf9f8] text-neutral-800 rounded-tl-none border border-neutral-200/70'
                    }`}
                  >
                    {msg.text}
                    {!isUser && (msg.source || (msg.tools_used && msg.tools_used.length > 0) || (msg.sources && msg.sources.length > 0)) && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/60 space-y-2">
                        {/* Source engine & tool badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              msg.source === 'gemini'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : msg.source === 'project_rag'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : msg.source === 'tools'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {msg.source === 'gemini'
                              ? '✨ Gemini AI'
                              : msg.source === 'project_rag'
                              ? '📁 Project RAG'
                              : msg.source === 'tools'
                              ? '⚡ Live App Tools'
                              : '📚 Nutrition Engine'}
                          </span>

                          {msg.tools_used?.map((tool) => (
                            <span
                              key={tool}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center gap-1"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              {tool === 'search_project_knowledge'
                                ? 'Codebase RAG'
                                : tool === 'get_user_profile'
                                ? 'Live Profile'
                                : tool === 'get_meal_history'
                                ? 'Meal DB'
                                : tool === 'lookup_barcode'
                                ? 'Barcode Registry'
                                : tool === 'search_foods'
                                ? 'Food DB'
                                : tool}
                            </span>
                          ))}
                        </div>

                        {/* Repository source file references */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                              Sources:
                            </span>
                            {msg.sources.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/80 inline-flex items-center gap-1"
                                title={s.title}
                              >
                                📄 {s.file_path}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#faf9f8] p-3 rounded-2xl border border-neutral-200/70 text-xs text-neutral-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-neutral-200/80 shadow-2xs shrink-0"
          >
            <input
              type="text"
              placeholder="Ask anything about meals, calories, or diet plans..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#faf9f8] border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ── RIGHT: Nutrition Context Panel (3 cols) ── */}
        <div className="hidden xl:flex flex-col xl:col-span-3 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 overflow-y-auto">
          <div className="pb-3 border-b border-neutral-100">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Active Context
            </span>
            <h3 className="text-sm font-extrabold text-neutral-900">Your Health Profile</h3>
          </div>

          {/* Daily Calories Status */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Daily Energy Target
            </span>
            <div className="text-lg font-black text-neutral-900">
              {consumedCalories.toLocaleString()}{' '}
              <span className="text-xs font-normal text-neutral-400">/ {targetCalories.toLocaleString()} kcal</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              {remainingCalories.toLocaleString()} kcal remaining today
            </p>
          </div>

          {/* Health Goal */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Health Goal
            </span>
            <div className="text-xs font-extrabold text-neutral-800">
              {profile?.health_goal || 'Weight Loss & Fitness'}
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">BMR adherence mode</span>
          </div>

          {/* Protein Intake */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Protein Intake
            </span>
            <div className="text-sm font-black text-blue-900">
              {Math.round(consumedProtein)}g <span className="text-xs text-neutral-400 font-normal">/ {targetProtein}g</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((consumedProtein / targetProtein) * 100))}%` }}
              />
            </div>
          </div>

          {/* Today's Meals logged */}
          <div className="p-3.5 rounded-2xl bg-[#faf9f8] border border-neutral-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Logged Meals
              </span>
              <span className="text-xs font-black text-neutral-900">{meals.length} Today</span>
            </div>

            {meals.length === 0 ? (
              <p className="text-[11px] text-neutral-400 font-medium">No meals logged yet today.</p>
            ) : (
              <ul className="space-y-1 divide-y divide-neutral-100 text-[11px]">
                {meals.slice(0, 3).map((m: any, idx: number) => (
                  <li key={idx} className="pt-1 flex justify-between text-neutral-700 font-medium">
                    <span>{m.meal_type || 'Meal'}</span>
                    <span className="font-bold text-neutral-900">{m.total_calories || 0} kcal</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
