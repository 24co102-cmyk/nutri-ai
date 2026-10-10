// src/pages/BarcodeScan.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddProductForm from '../components/AddProductForm';
import ProductManagementTable from '../components/ProductManagementTable';
import ScanFoodBarcode from '../components/ScanFoodBarcode';
import GlobalBarcodeScanner from '../components/GlobalBarcodeScanner';
import {
  fetchAllFoodProducts,
  MAX_PRODUCTS,
  type FoodProduct,
} from '../api/foodBarcodeService';
import {
  Barcode as BarcodeIcon,
  Layers,
  Globe,
} from 'lucide-react';

const BarcodeScan: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'scanner' | 'registry' | 'global') || 'scanner';

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'scanner' | 'registry' | 'global'>(initialTab);

  // Products Database State
  const [products, setProducts] = useState<FoodProduct[]>([]);

  // Barcode passed from Registry "Scan" shortcut
  const [targetedBarcode, setTargetedBarcode] = useState<string | undefined>(undefined);

  const loadProducts = async () => {
    try {
      const data = await fetchAllFoodProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Update URL query on tab switch
  const switchTab = (tab: 'scanner' | 'registry' | 'global') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Handler when user clicks "Scan" shortcut in the Table
  const handleScanShortcut = (barcode: string) => {
    setTargetedBarcode(barcode);
    switchTab('scanner');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Navigation Tabs Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
            <BarcodeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-neutral-900 tracking-tight">Food Barcode & QR Suite</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                {products.length}/{MAX_PRODUCTS} ACTIVE
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              Deterministic 12-digit barcodes, live scanner, nutrition grades & registry management.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 w-full md:w-auto overflow-x-auto">
          {/* Tab 1: Scanner */}
          <button
            onClick={() => switchTab('scanner')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'scanner'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <BarcodeIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Barcode Scanner</span>
          </button>

          {/* Tab 2: Registry (50 Slots) */}
          <button
            onClick={() => switchTab('registry')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 relative ${
              activeTab === 'registry'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Product Registry</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
              {products.length}/{MAX_PRODUCTS}
            </span>
          </button>

          {/* Tab 3: Global Open Food Facts */}
          <button
            onClick={() => switchTab('global')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'global'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>Global OFF DB</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCANNER & LOOKUP */}
      {activeTab === 'scanner' && (
        <ScanFoodBarcode
          initialBarcode={targetedBarcode}
          onMealLogged={loadProducts}
        />
      )}

      {/* TAB 2: PRODUCT REGISTRY & GENERATOR */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          {/* Add Food Product Form */}
          <AddProductForm
            products={products}
            onProductAdded={(newProd) => {
              setProducts((prev) => {
                const list = [...prev.filter((p) => p.serialNumber !== newProd.serialNumber), newProd];
                list.sort((a, b) => a.serialNumber - b.serialNumber);
                return list;
              });
            }}
          />

          {/* Product Management Table */}
          <ProductManagementTable
            products={products}
            onRefresh={loadProducts}
            onScanShortcut={handleScanShortcut}
          />
        </div>
      )}

      {/* TAB 3: GLOBAL OPEN FOOD FACTS SCANNER (Preserved 100%) */}
      {activeTab === 'global' && (
        <GlobalBarcodeScanner />
      )}
    </div>
  );
};

export default BarcodeScan;
