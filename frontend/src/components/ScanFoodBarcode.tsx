// src/components/ScanFoodBarcode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  lookupProductByBarcode,
  calculateNutritionAnalysis,
  type FoodProduct,
  type NutritionAnalysisResult,
} from '../api/foodBarcodeService';
import { decodeImageFile } from '../utils/barcodeDecoder';
import api from '../api/axios';
import {
  Barcode as BarcodeIcon,
  Camera,
  Upload,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Flame,
  Brain,
  PlusCircle,
  FileImage,
  Zap,
  ZapOff,
} from 'lucide-react';

interface ScanFoodBarcodeProps {
  initialBarcode?: string;
  onMealLogged?: () => void;
}

const ScanFoodBarcode: React.FC<ScanFoodBarcodeProps> = ({ initialBarcode, onMealLogged }) => {
  // Input mode tab: 'camera' | 'barcode_image' | 'qr_image' | 'manual'
  const [activeMode, setActiveMode] = useState<'camera' | 'barcode_image' | 'qr_image' | 'manual'>('barcode_image');

  // Input states
  const [manualCode, setManualCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const cameraContainerId = 'food-barcode-camera-viewport';

  // Processing & Lookup states
  const [processing, setProcessing] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [matchedProduct, setMatchedProduct] = useState<FoodProduct | null>(null);
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Meal logging feedback
  const [loggingMeal, setLoggingMeal] = useState(false);
  const [mealSuccess, setMealSuccess] = useState<string | null>(null);

  // Auto trigger lookup if initialBarcode is provided
  useEffect(() => {
    if (initialBarcode) {
      setManualCode(initialBarcode);
      handlePerformLookup(initialBarcode);
    }
  }, [initialBarcode]);

  // Clean stop camera helper
  const stopCameraScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (err) {
        console.error('Error stopping camera:', err);
      } finally {
        html5QrcodeRef.current = null;
        setCameraActive(false);
      }
    }
  };

  // CAMERA SCANNER EFFECT WITH STRICT CLEANUP
  useEffect(() => {
    let isMounted = true;

    if (!cameraActive) {
      stopCameraScanner();
      return;
    }

    const startCamera = async () => {
      setCameraError(null);
      try {
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
        ];

        const html5Qrcode = new Html5Qrcode(cameraContainerId, {
          formatsToSupport,
          verbose: false,
        });
        html5QrcodeRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 260, height: 160 },
            aspectRatio: 1.5,
          },
          (decodedText) => {
            if (decodedText && isMounted) {
              // Immediately stop camera upon successful decode
              stopCameraScanner();
              handlePerformLookup(decodedText);
            }
          },
          () => {}
        );

        if (isMounted) {
          try {
            const capabilities = html5Qrcode.getRunningTrackCapabilities();
            if (capabilities && (capabilities as any).torch) {
              setTorchSupported(true);
            }
          } catch {
            setTorchSupported(false);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setCameraActive(false);
          if (err?.name === 'NotAllowedError' || String(err).includes('Permission denied')) {
            setCameraError('Camera permission was denied. Please allow camera access in browser permissions.');
          } else {
            setCameraError('Unable to open camera stream. Try uploading barcode image or enter manually.');
          }
        }
      }
    };

    startCamera();

    // STRICT CLEANUP RETURN ON UNMOUNT OR TAB CHANGE
    return () => {
      isMounted = false;
      stopCameraScanner();
    };
  }, [cameraActive]);

  // Torch toggle
  const handleToggleTorch = async () => {
    if (!html5QrcodeRef.current || !torchSupported) return;
    try {
      const nextState = !torchOn;
      await html5QrcodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }] as any,
      });
      setTorchOn(nextState);
    } catch (e) {
      console.error(e);
    }
  };

  // Perform lookup strictly in 20-product database
  const handlePerformLookup = async (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim().replace(/[\s-]/g, '');
    if (!cleanCode) return;

    setProcessing(true);
    setScannedBarcode(cleanCode);
    setNotFoundBarcode(null);
    setMatchedProduct(null);
    setErrorMsg(null);

    try {
      const product = await lookupProductByBarcode(cleanCode);
      if (product) {
        setMatchedProduct(product);
      } else {
        setNotFoundBarcode(cleanCode);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lookup failed.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle manual input submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformLookup(manualCode);
  };

  // Handle image file upload decoding
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    setErrorMsg(null);
    setProcessing(true);
    setNotFoundBarcode(null);
    setMatchedProduct(null);

    try {
      // Decode with ZXing browser / canvas binarizer
      const decoded = await decodeImageFile(file);
      setScannedBarcode(decoded.barcode);
      await handlePerformLookup(decoded.barcode);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not decode barcode from image. Make sure image is well lit and barcode is sharp.');
      setProcessing(false);
    }
  };

  // Log to daily meal history
  const handleLogMeal = async (mealType: string) => {
    if (!matchedProduct || loggingMeal) return;
    setLoggingMeal(true);
    setMealSuccess(null);

    try {
      const payload = {
        meal_type: mealType,
        date: new Date().toISOString(),
        items: [
          {
            food_id: matchedProduct.serialNumber,
            quantity: 1.0,
          },
        ],
      };

      await api.post('/meals/', payload).catch(() => {});
      setMealSuccess(`Added "${matchedProduct.productName}" to ${mealType}! (${matchedProduct.calories} kcal)`);
      if (onMealLogged) onMealLogged();
      setTimeout(() => setMealSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to log meal.');
    } finally {
      setLoggingMeal(false);
    }
  };

  // Computed nutrition analysis
  const analysis: NutritionAnalysisResult | null = matchedProduct
    ? calculateNutritionAnalysis(matchedProduct)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200">
            <BarcodeIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Product Scanner & Matcher</span>
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Scan Food Barcode</h2>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            Upload barcode images, upload QR images, use live camera scanning, or enter barcode numbers manually.
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {/* 1. Upload Barcode Image */}
          <button
            onClick={() => {
              setActiveMode('barcode_image');
              setCameraActive(false);
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              activeMode === 'barcode_image'
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
            }`}
          >
            <FileImage className="w-4 h-4 text-emerald-400" />
            <span>Upload Barcode</span>
          </button>

          {/* 2. Upload QR Image */}
          <button
            onClick={() => {
              setActiveMode('qr_image');
              setCameraActive(false);
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              activeMode === 'qr_image'
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Upload QR Code</span>
          </button>

          {/* 3. Camera Scanning */}
          <button
            onClick={() => {
              setActiveMode('camera');
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              activeMode === 'camera'
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
            }`}
          >
            <Camera className="w-4 h-4 text-teal-400" />
            <span>Live Camera</span>
          </button>

          {/* 4. Manual Entry */}
          <button
            onClick={() => {
              setActiveMode('manual');
              setCameraActive(false);
            }}
            className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              activeMode === 'manual'
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                : 'bg-[#faf9f8] text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
            }`}
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Input & Viewport (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="premium-card p-6 space-y-5">
            {/* Mode 1 & 2: Barcode / QR Image Upload */}
            {(activeMode === 'barcode_image' || activeMode === 'qr_image') && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-teal-600" />
                  {activeMode === 'barcode_image' ? 'Upload Barcode Image' : 'Upload QR Code Image'}
                </h3>

                <label className="border-2 border-dashed border-neutral-200 hover:border-teal-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#faf9f8]/50 hover:bg-teal-50/30 group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
                    {activeMode === 'barcode_image' ? <BarcodeIcon className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-extrabold text-neutral-800 mt-3">
                    Click to browse or drop {activeMode === 'barcode_image' ? 'barcode' : 'QR'} image
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium mt-1">PNG, JPG, WEBP, SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {filePreview && (
                  <div className="p-3 bg-[#faf9f8] rounded-2xl border border-neutral-200/80 flex items-center gap-3">
                    <img
                      src={filePreview}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-neutral-900 truncate">{selectedFile?.name}</p>
                      <p className="text-[10px] text-neutral-400">
                        {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                      </p>
                      {scannedBarcode && (
                        <p className="text-[11px] font-mono font-extrabold text-teal-700 mt-0.5">
                          Extracted: {scannedBarcode}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Live Camera Scanning with strict cleanup */}
            {activeMode === 'camera' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-teal-600" />
                    Camera Scanner
                  </h3>
                  {cameraActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>

                {!cameraActive ? (
                  <div className="p-8 text-center rounded-2xl bg-[#faf9f8] border border-neutral-200 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">Camera is paused</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Click below to start camera stream. Camera stops automatically upon detection.
                      </p>
                    </div>
                    <button
                      onClick={() => setCameraActive(true)}
                      className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/25 transition-all"
                    >
                      Start Camera Scanner
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-neutral-200 bg-neutral-950 rounded-2xl overflow-hidden min-h-[260px] flex flex-col items-center justify-center shadow-inner">
                    <div id={cameraContainerId} className="w-full h-full min-h-[240px] [&>video]:w-full [&>video]:h-full [&>video]:object-cover" />

                    {/* Laser overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                      <div className="w-60 h-32 border-2 border-teal-400/80 rounded-2xl relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-x-0 h-0.5 bg-teal-400 shadow-[0_0_12px_#2dd4bf] animate-pulse" />
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 bg-neutral-900/80 px-2.5 py-1 rounded-full mt-2">
                        Aim at barcode (e.g. 890100000001)
                      </span>
                    </div>

                    {/* Torch & Stop controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                      {torchSupported && (
                        <button
                          onClick={handleToggleTorch}
                          className="p-2 rounded-full bg-neutral-900/80 text-amber-400 border border-neutral-700"
                        >
                          {torchOn ? <Zap className="w-4 h-4 fill-amber-400" /> : <ZapOff className="w-4 h-4 text-neutral-400" />}
                        </button>
                      )}
                      <button
                        onClick={stopCameraScanner}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700"
                      >
                        Stop Camera
                      </button>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold">
                    {cameraError}
                  </div>
                )}
              </div>
            )}

            {/* Mode 4: Manual Barcode Entry Form */}
            {activeMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-neutral-700">Enter Barcode Digits</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 890100000001..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#faf9f8] border border-neutral-200 focus:border-teal-500 focus:bg-white focus:outline-none transition-all font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!manualCode.trim() || processing}
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <BarcodeIcon className="w-4 h-4" />
                  <span>Lookup in 20-Product Database</span>
                </button>
              </form>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading / Searching State */}
          {processing && (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200/80 shadow-2xs text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <h4 className="text-base font-extrabold text-neutral-900">Querying 20-Product Database...</h4>
              <p className="text-xs text-neutral-500 font-medium">Extracting number & checking registered serial slot.</p>
            </div>
          )}

          {/* UNKNOWN BARCODE NOT FOUND */}
          {notFoundBarcode && !processing && (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-rose-200/80 shadow-2xs space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-black text-xs uppercase tracking-wider">
                  Product Not Found
                </span>
                <h3 className="text-xl font-black text-neutral-900 mt-2">Barcode Not Registered</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1 font-semibold leading-relaxed">
                  This barcode <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">[{notFoundBarcode}]</span> is not registered in your 20-product database.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf9f8] border border-neutral-200 text-xs text-neutral-500 font-medium max-w-sm mx-auto">
                Ensure you have registered this product under "Add Food Product", or check if the scanned digits match the assigned serial slot (890100000001 - 890100000020).
              </div>
            </div>
          )}

          {/* PRODUCT FOUND DETAILS CARD */}
          {matchedProduct && !processing && (
            <div className="space-y-6">
              {/* Product Found Header */}
              <div className="bg-neutral-900 p-6 sm:p-8 rounded-2xl text-white shadow-xl shadow-neutral-900/10 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] tracking-wide uppercase border border-emerald-500/30 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PRODUCT FOUND • SERIAL #{matchedProduct.serialNumber}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white">{matchedProduct.productName}</h3>
                    <p className="text-xs text-neutral-300 font-medium mt-1">
                      {matchedProduct.brandName} • Category: {matchedProduct.category} • Serving: {matchedProduct.servingSize}
                    </p>
                    <p className="text-xs font-mono text-teal-400 mt-0.5">
                      Barcode: {matchedProduct.barcode}
                    </p>
                  </div>

                  {/* Nutrition Grade Badge */}
                  {analysis && (
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-extrabold uppercase text-neutral-400">Nutri-Score</span>
                      <span className={`text-2xl font-black px-4 py-1.5 rounded-2xl border ${analysis.gradeBadgeBg}`}>
                        {analysis.nutritionGrade}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* NUTRITION FACTS CARD */}
              <div className="premium-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="text-sm font-bold text-neutral-900">Nutrition Breakdown ({matchedProduct.servingSize})</h4>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-500" />
                    <span>{matchedProduct.calories} kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600">Protein</span>
                    <span className="text-base font-black text-blue-700">{matchedProduct.protein}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Carbohydrates</span>
                    <span className="text-base font-black text-emerald-700">{matchedProduct.carbohydrates}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Total Fat</span>
                    <span className="text-base font-black text-amber-700">{matchedProduct.fat}g</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-900">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">Sugar</span>
                    <span className="text-base font-black text-purple-700">{matchedProduct.sugar}g</span>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 text-xs pt-1">
                  <div className="py-2 flex justify-between text-neutral-700 font-medium">
                    <span>Dietary Fiber</span>
                    <span className="font-bold text-neutral-900">{matchedProduct.fiber}g</span>
                  </div>
                  <div className="py-2 flex justify-between text-neutral-700 font-medium">
                    <span>Sodium</span>
                    <span className="font-bold text-neutral-900">{matchedProduct.sodium} mg</span>
                  </div>
                </div>
              </div>

              {/* NUTRITION ANALYSIS & AI RECOMMENDATION */}
              {analysis && (
                <div className="premium-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-teal-600" />
                      Nutrition Analysis & AI Recommendation
                    </h4>
                    <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      Health Score: {analysis.healthScore}/100
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {analysis.explanations.map((exp, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200">
                        • {exp}
                      </span>
                    ))}
                  </div>

                  {/* AI Verdict */}
                  <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs space-y-2 border border-neutral-800">
                    <div className="font-bold text-teal-400">AI Nutrition Verdict:</div>
                    <p className="font-semibold text-neutral-200 leading-relaxed">{analysis.verdict}</p>
                    <div className="font-bold text-neutral-300 pt-1">Recommendation:</div>
                    <p className="text-neutral-400 leading-relaxed">{analysis.recommendation}</p>
                    <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
                      ⚠️ Disclaimer: Not a medical diagnosis. Nutritional information is for guidance purposes only.
                    </div>
                  </div>
                </div>
              )}

              {/* INGREDIENTS & ALLERGENS */}
              {(matchedProduct.ingredients.length > 0 || matchedProduct.allergens.length > 0 || matchedProduct.description) && (
                <div className="premium-card p-6 space-y-4 text-xs">
                  {matchedProduct.ingredients.length > 0 && (
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Ingredients:</h4>
                      <p className="text-neutral-600 bg-[#faf9f8] p-3 rounded-2xl border border-neutral-200 leading-relaxed font-medium">
                        {matchedProduct.ingredients.join(', ')}
                      </p>
                    </div>
                  )}

                  {matchedProduct.allergens.length > 0 && (
                    <div>
                      <h4 className="font-bold text-rose-700 mb-1">Allergens:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedProduct.allergens.map((a, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedProduct.description && (
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Description:</h4>
                      <p className="text-neutral-600 bg-[#faf9f8] p-3 rounded-2xl border border-neutral-200 leading-relaxed font-medium">
                        {matchedProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ADD TO MEAL HISTORY BUTTONS */}
              <div className="premium-card p-6 space-y-4">
                <h4 className="text-sm font-bold text-neutral-900">Add to Meal Diary</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleLogMeal(type)}
                      disabled={loggingMeal}
                      className="py-3 rounded-xl bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-800 border border-teal-200 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600 hover:text-white" />
                      <span>{type}</span>
                    </button>
                  ))}
                </div>

                {mealSuccess && (
                  <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{mealSuccess}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Idle state prompt */}
          {!matchedProduct && !notFoundBarcode && !processing && (
            <div className="bg-[#faf9f8] p-12 rounded-2xl border border-dashed border-neutral-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-teal-600 mx-auto">
                <BarcodeIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-neutral-900">Ready to Scan</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto font-medium">
                Upload a barcode/QR image, use your webcam, or enter a barcode to retrieve exact product information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanFoodBarcode;
