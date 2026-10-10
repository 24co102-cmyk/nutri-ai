// src/components/ProductManagementTable.tsx
import React, { useState, useMemo } from 'react';
import {
  exportProductsAsCsv,
  exportProductsAsJson,
  deleteFoodProduct,
  updateFoodProduct,
  resetAllFoodProducts,
  calculateNutritionAnalysis,
  runAutomatedSystemTests,
  type FoodProduct,
  type TestCaseResult,
} from '../api/foodBarcodeService';
import BarcodeRenderer from './BarcodeRenderer';
import QRCodeRenderer from './QRCodeRenderer';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Barcode as BarcodeIcon,
  QrCode,
  Download,
  RotateCcw,
  PlayCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Layers,
} from 'lucide-react';

interface ProductManagementTableProps {
  products: FoodProduct[];
  onRefresh: () => void;
  onScanShortcut?: (barcode: string) => void;
}

const ProductManagementTable: React.FC<ProductManagementTableProps> = ({
  products,
  onRefresh,
  onScanShortcut,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals state
  const [viewProduct, setViewProduct] = useState<FoodProduct | null>(null);
  const [editProduct, setEditProduct] = useState<FoodProduct | null>(null);
  const [barcodeModalProduct, setBarcodeModalProduct] = useState<FoodProduct | null>(null);
  const [qrModalProduct, setQrModalProduct] = useState<FoodProduct | null>(null);
  const [deleteConfirmSerial, setDeleteConfirmSerial] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Automated Test Suite modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm);
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  // Delete product action
  const handleDelete = async (serial: number) => {
    try {
      await deleteFoodProduct(serial);
      setDeleteConfirmSerial(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  // Reset all products action
  const handleResetAll = async () => {
    try {
      await resetAllFoodProducts();
      setShowResetConfirm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to reset database.');
    }
  };

  // Save edit action
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      await updateFoodProduct(editProduct.serialNumber, {
        productName: editProduct.productName,
        brandName: editProduct.brandName,
        category: editProduct.category,
        servingSize: editProduct.servingSize,
        calories: editProduct.calories,
        protein: editProduct.protein,
        carbohydrates: editProduct.carbohydrates,
        fat: editProduct.fat,
        sugar: editProduct.sugar,
        fiber: editProduct.fiber,
        sodium: editProduct.sodium,
        ingredients: editProduct.ingredients,
        allergens: editProduct.allergens,
        description: editProduct.description,
      });
      setEditProduct(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update product.');
    }
  };

  // Run tests action
  const handleRunTests = async () => {
    setTestRunning(true);
    setTestResults([]);
    setShowTestModal(true);
    try {
      const results = await runAutomatedSystemTests();
      setTestResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setTestRunning(false);
      onRefresh();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
      {/* Top Header & Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Product Management Table</span>
          </div>
          <h3 className="text-2xl font-black text-black tracking-widest uppercase mt-1">FOOD REGISTRY</h3>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Registered food inventory with persistent barcodes, QR generators, and nutrition tracking.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={() => exportProductsAsCsv(products)}
            disabled={products.length === 0}
            className="px-3 py-2 rounded-xl bg-[#faf9f8] hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Export registry to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportProductsAsJson(products)}
            disabled={products.length === 0}
            className="px-3 py-2 rounded-xl bg-[#faf9f8] hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Export registry to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          {/* Automated System Tests */}
          <button
            onClick={handleRunTests}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Run automatic self-tests across all serial positions"
          >
            <PlayCircle className="w-4 h-4 text-teal-600" />
            <span>System Tests</span>
          </button>

          {/* Reset All Products */}
          <button
            onClick={() => setShowResetConfirm(true)}
            disabled={products.length === 0}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
            title="Clear all 20 products"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name (e.g. Coca), brand or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-teal-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4 relative">
          <Filter className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-teal-500 focus:bg-white focus:outline-none transition-all text-xs font-semibold appearance-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      {products.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#faf9f8] border border-dashed border-neutral-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
            <BarcodeIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-neutral-900">No Food Products Registered Yet</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-medium">
            Use the "Add Food Product" form above to register your first product. Serial numbers and barcodes will be generated automatically.
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#faf9f8] text-xs text-neutral-500 font-medium">
          No products match your search query "{searchTerm}".
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f8] text-neutral-600 font-extrabold uppercase tracking-wider text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Serial</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Barcode</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.serialNumber} className="hover:bg-[#faf9f8] transition-colors">
                  {/* Serial */}
                  <td className="py-3 px-4 font-mono font-extrabold text-neutral-900">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      #{prod.serialNumber}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-900 text-xs">{prod.productName}</div>
                    <div className="text-[10px] text-neutral-400 font-medium">
                      {prod.servingSize} • {prod.calories} kcal
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4 font-semibold text-neutral-600">
                    {prod.brandName || <span className="text-neutral-400 italic">Not set</span>}
                  </td>

                  {/* Barcode */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-extrabold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[11px] inline-block border border-neutral-200">
                      {prod.barcode}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold text-[10px] border border-neutral-200/60">
                      {prod.category || 'General'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {/* View */}
                      <button
                        onClick={() => setViewProduct(prod)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                        title="View Product Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditProduct(prod)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        title="Edit Product Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Barcode Modal */}
                      <button
                        onClick={() => setBarcodeModalProduct(prod)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="View / Download Barcode"
                      >
                        <BarcodeIcon className="w-4 h-4" />
                      </button>

                      {/* QR Modal */}
                      <button
                        onClick={() => setQrModalProduct(prod)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                        title="View / Download QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* Scan Shortcut */}
                      {onScanShortcut && (
                        <button
                          onClick={() => onScanShortcut(prod.barcode)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                          title="Simulate Barcode Scan"
                        >
                          Scan
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmSerial(prod.serialNumber)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW PRODUCT DETAILS MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100 my-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wide uppercase border border-emerald-200">
                  Serial #{viewProduct.serialNumber} • Barcode: {viewProduct.barcode}
                </span>
                <h3 className="text-2xl font-black text-neutral-900 mt-1">{viewProduct.productName}</h3>
                <p className="text-xs text-neutral-500 font-semibold">
                  {viewProduct.brandName} • Category: {viewProduct.category} • Serving: {viewProduct.servingSize}
                </p>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nutrition Analysis */}
            {(() => {
              const analysis = calculateNutritionAnalysis(viewProduct);
              return (
                <div className="space-y-4">
                  {/* Health Score and Grade */}
                  <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Nutrition Health Score
                      </span>
                      <div className="text-2xl font-black text-neutral-900">{analysis.healthScore} / 100</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Nutri Grade</span>
                      <div className="text-2xl font-black">
                        <span className={`px-3 py-1 rounded-xl border ${analysis.gradeBadgeBg}`}>
                          {analysis.nutritionGrade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {analysis.explanations.map((exp, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200/60">
                        • {exp}
                      </span>
                    ))}
                  </div>

                  {/* AI Verdict */}
                  <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-teal-400">
                      <Brain className="w-4 h-4 text-teal-400" />
                      <span>AI Nutrition Verdict</span>
                    </div>
                    <p className="font-semibold text-neutral-200">{analysis.verdict}</p>
                    <p className="text-neutral-400">{analysis.recommendation}</p>
                    <p className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800 italic">
                      * Not a medical diagnosis. Nutritional information is for guidance purposes only.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Nutrition Facts Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-700">Nutrition Profile</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                  <span className="block text-[10px] font-bold text-amber-600">Calories</span>
                  <span className="text-sm font-black">{viewProduct.calories} kcal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                  <span className="block text-[10px] font-bold text-blue-600">Protein</span>
                  <span className="text-sm font-black">{viewProduct.protein}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                  <span className="block text-[10px] font-bold text-emerald-600">Carbs</span>
                  <span className="text-sm font-black">{viewProduct.carbohydrates}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-900">
                  <span className="block text-[10px] font-bold text-purple-600">Sugar</span>
                  <span className="text-sm font-black">{viewProduct.sugar}g</span>
                </div>
              </div>

              <div className="divide-y divide-neutral-100 text-xs pt-2">
                <div className="py-1.5 flex justify-between text-neutral-600">
                  <span>Total Fat</span>
                  <span className="font-bold text-neutral-800">{viewProduct.fat}g</span>
                </div>
                <div className="py-1.5 flex justify-between text-neutral-600">
                  <span>Dietary Fiber</span>
                  <span className="font-bold text-neutral-800">{viewProduct.fiber}g</span>
                </div>
                <div className="py-1.5 flex justify-between text-neutral-600">
                  <span>Sodium</span>
                  <span className="font-bold text-neutral-800">{viewProduct.sodium} mg</span>
                </div>
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div className="space-y-3 pt-1 text-xs">
              {viewProduct.ingredients.length > 0 && (
                <div>
                  <span className="font-bold text-neutral-700 block mb-1">Ingredients:</span>
                  <p className="text-neutral-600 bg-[#faf9f8] p-2.5 rounded-xl border border-neutral-200">
                    {viewProduct.ingredients.join(', ')}
                  </p>
                </div>
              )}
              {viewProduct.allergens.length > 0 && (
                <div>
                  <span className="font-bold text-rose-700 block mb-1">Allergens Detected:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewProduct.allergens.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewProduct(null)}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL (Locks Serial & Barcode) */}
      {editProduct && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-100 my-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-neutral-900">Edit Product Information</h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Serial Number & Barcode are strictly immutable.
                </p>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-only Serial & Barcode info banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Serial Number</span>
                <span className="font-mono font-extrabold text-neutral-900">#{editProduct.serialNumber} (Locked)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Unique Barcode</span>
                <span className="font-mono font-extrabold text-neutral-900">{editProduct.barcode} (Locked)</span>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editProduct.productName}
                    onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editProduct.brandName}
                    onChange={(e) => setEditProduct({ ...editProduct, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Serving Size</label>
                  <input
                    type="text"
                    value={editProduct.servingSize}
                    onChange={(e) => setEditProduct({ ...editProduct, servingSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editProduct.calories}
                    onChange={(e) => setEditProduct({ ...editProduct, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={editProduct.protein}
                    onChange={(e) => setEditProduct({ ...editProduct, protein: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={editProduct.carbohydrates}
                    onChange={(e) => setEditProduct({ ...editProduct, carbohydrates: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Sugar (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={editProduct.sugar}
                    onChange={(e) => setEditProduct({ ...editProduct, sugar: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="any"
                    value={editProduct.fat}
                    onChange={(e) => setEditProduct({ ...editProduct, fat: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Sodium (mg)</label>
                  <input
                    type="number"
                    value={editProduct.sodium}
                    onChange={(e) => setEditProduct({ ...editProduct, sodium: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf9f8] border border-neutral-200 font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE MODAL */}
      {barcodeModalProduct && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-100 text-center">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-neutral-900 text-sm">Product Barcode</h4>
              <button
                onClick={() => setBarcodeModalProduct(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="font-extrabold text-base text-neutral-900">{barcodeModalProduct.productName}</p>
              <p className="text-xs text-neutral-500 font-mono">Serial #{barcodeModalProduct.serialNumber}</p>
            </div>

            <BarcodeRenderer
              barcode={barcodeModalProduct.barcode}
              productName={barcodeModalProduct.productName}
              width={2.2}
              height={75}
              showDownload={true}
            />
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalProduct && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-100 text-center">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-neutral-900 text-sm">Product QR Code</h4>
              <button
                onClick={() => setQrModalProduct(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="font-extrabold text-base text-neutral-900">{qrModalProduct.productName}</p>
              <p className="text-xs text-neutral-500 font-mono">Serial #{qrModalProduct.serialNumber}</p>
            </div>

            <QRCodeRenderer
              barcode={qrModalProduct.barcode}
              productName={qrModalProduct.productName}
              size={180}
              showDownload={true}
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmSerial !== null && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="font-black text-neutral-900 text-base">Delete Product?</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Are you sure you want to delete Product #{deleteConfirmSerial}? Other registered serial numbers will NOT be shifted.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmSerial(null)}
                className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmSerial)}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET ALL CONFIRMATION DIALOG */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h4 className="font-black text-neutral-900 text-base">Reset All Products?</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Are you sure you want to delete all 20 products? This will completely clear your registered food database.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-colors"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATED TEST SUITE MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-100 my-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-extrabold text-[10px] tracking-wide uppercase border border-teal-200">
                  Verification Suite
                </span>
                <h3 className="text-xl font-black text-neutral-900 mt-1">Automatic System Diagnostic</h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Validates creation, deterministic barcode generation, lookup, editing, deletion & persistence.
                </p>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {testRunning ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-neutral-800">Executing 8 Automated Diagnostic Checks...</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {testResults.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border flex items-start gap-3 text-xs ${
                      t.passed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-neutral-900">{t.name}</div>
                      <div className="text-[11px] text-neutral-600 mt-0.5">{t.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementTable;
