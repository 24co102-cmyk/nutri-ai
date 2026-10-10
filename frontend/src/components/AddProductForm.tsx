import React, { useState } from 'react';
import {
  addFoodProduct,
  MAX_PRODUCTS,
  formatBarcodeForSerial,
  getNextAvailableSerial,
  type FoodProduct,
} from '../api/foodBarcodeService';
import { PlusCircle, AlertCircle, Sparkles, CheckCircle2, PackagePlus } from 'lucide-react';

interface AddProductFormProps {
  products: FoodProduct[];
  onProductAdded: (newProduct: FoodProduct) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ products, onProductAdded }) => {
  const currentCount = products.length;
  const isMaxReached = currentCount >= MAX_PRODUCTS;
  const nextSerial = getNextAvailableSerial(products);
  const nextBarcode = nextSerial ? formatBarcodeForSerial(nextSerial) : '';

  // Form Fields
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('Beverages');
  const [servingSize, setServingSize] = useState('100g');
  const [calories, setCalories] = useState<number | ''>(100);
  const [protein, setProtein] = useState<number | ''>(2);
  const [carbohydrates, setCarbohydrates] = useState<number | ''>(15);
  const [fat, setFat] = useState<number | ''>(1);
  const [sugar, setSugar] = useState<number | ''>(5);
  const [fiber, setFiber] = useState<number | ''>(1);
  const [sodium, setSodium] = useState<number | ''>(50);
  const [ingredientsText, setIngredientsText] = useState('');
  const [allergensText, setAllergensText] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (isMaxReached || !nextSerial) {
      setError('Maximum 20 products registered.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const parsedIngredients = ingredientsText
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedAllergens = allergensText
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const productPayload: Omit<FoodProduct, 'serialNumber' | 'barcode'> = {
        productName: productName.trim(),
        brandName: brandName.trim(),
        category: category.trim() || 'General',
        servingSize: servingSize.trim() || '100g',
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbohydrates: Number(carbohydrates) || 0,
        fat: Number(fat) || 0,
        sugar: Number(sugar) || 0,
        fiber: Number(fiber) || 0,
        sodium: Number(sodium) || 0,
        ingredients: parsedIngredients,
        allergens: parsedAllergens,
        description: description.trim(),
      };

      const added = await addFoodProduct(productPayload);
      onProductAdded(added);

      setSuccessMsg(`Product "${added.productName}" added! Assigned Serial No. ${added.serialNumber} & Barcode ${added.barcode}.`);
      setProductName('');
      setBrandName('');
      setIngredientsText('');
      setAllergensText('');
      setDescription('');

      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
      {/* Header with 0/20 to 20/20 counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <PackagePlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Product Registration</span>
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Add Food Product</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Enter your custom food products. Serial numbers & unique barcodes are assigned automatically.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 text-white font-mono text-xs font-bold shadow-xs flex items-center gap-2">
            <span>Products Registered:</span>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-extrabold ${isMaxReached ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {currentCount}/{MAX_PRODUCTS}
            </span>
          </div>
        </div>
      </div>

      {/* Auto Assigned Serial Notice */}
      {!isMaxReached && nextSerial && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automatic Assignment for Next Product:</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-extrabold shadow-2xs">
              Serial No: #{nextSerial}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-extrabold shadow-2xs">
              Barcode: {nextBarcode}
            </span>
          </div>
        </div>
      )}

      {/* Max reached warning */}
      {isMaxReached && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Maximum 20 products registered. Please delete an existing product to add a new one.</span>
        </div>
      )}

      {/* Success banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isMaxReached}
              placeholder="e.g. Coca Cola, Lays Classic, Amul Milk..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Brand Name</label>
            <input
              type="text"
              disabled={isMaxReached}
              placeholder="e.g. The Coca-Cola Company, Frito-Lay"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
            <select
              disabled={isMaxReached}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50"
            >
              <option value="Beverages">Beverages</option>
              <option value="Snacks & Chips">Snacks & Chips</option>
              <option value="Dairy & Milk">Dairy & Milk</option>
              <option value="Bakery & Bread">Bakery & Bread</option>
              <option value="Instant Food & Noodles">Instant Food & Noodles</option>
              <option value="Chocolates & Sweets">Chocolates & Sweets</option>
              <option value="Cereals & Breakfast">Cereals & Breakfast</option>
              <option value="Sauces & Spices">Sauces & Spices</option>
              <option value="Protein & Fitness">Protein & Fitness</option>
              <option value="General Food">General Food</option>
            </select>
          </div>

          {/* Serving Size */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Serving Size</label>
            <input
              type="text"
              disabled={isMaxReached}
              placeholder="e.g. 250ml, 30g, 1 bottle"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50"
            />
          </div>

          {/* Calories */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Calories (kcal)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={calories}
              onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Protein */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Protein (g)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={protein}
              onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Carbohydrates */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Carbohydrates (g)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={carbohydrates}
              onChange={(e) => setCarbohydrates(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Fat */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Fat (g)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={fat}
              onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Sugar */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Sugar (g)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={sugar}
              onChange={(e) => setSugar(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Fiber */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Fiber (g)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={fiber}
              onChange={(e) => setFiber(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>

          {/* Sodium */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Sodium (mg)</label>
            <input
              type="number"
              min="0"
              step="any"
              disabled={isMaxReached}
              value={sodium}
              onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold font-mono disabled:opacity-50"
            />
          </div>
        </div>

        {/* Text Areas for Ingredients, Allergens, Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Ingredients (comma separated)</label>
            <textarea
              rows={2}
              disabled={isMaxReached}
              placeholder="e.g. Carbonated Water, Sugar, Caramel Color, Phosphoric Acid, Natural Flavors, Caffeine"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Allergens (comma separated)</label>
            <textarea
              rows={2}
              disabled={isMaxReached}
              placeholder="e.g. Milk, Soy, Gluten, Peanuts (leave empty if none)"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50 resize-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-neutral-700 mb-1">Product Description</label>
            <input
              type="text"
              disabled={isMaxReached}
              placeholder="Brief description or dietary highlights..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isMaxReached || loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Registering...' : 'Add Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
