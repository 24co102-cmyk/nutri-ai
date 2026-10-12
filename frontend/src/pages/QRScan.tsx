// src/pages/QRScan.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Html5Qrcode } from 'html5-qrcode';
import QRCodeCamera from '../components/QRCodeCamera';
import { fetchProductByBarcode, type ScannedProduct } from '../api/barcodeService';
import {
  QrCode,
  Camera,
  Upload,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Search,
  RefreshCw,
  ShieldCheck,
  FileText,
  Globe,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

type ScanMode = 'camera' | 'upload' | 'manual';
type ContentType = 'url' | 'product_barcode' | 'product_url' | 'json' | 'text';

interface DecodedResult {
  raw: string;
  type: ContentType;
  timestamp: string;
  detectedBarcode?: string;
  isSafeUrl?: boolean;
  safeUrlHref?: string;
  domain?: string;
  jsonPreview?: any;
}

const SAMPLE_FALLBACKS = [
  { label: 'Open Food Facts URL', text: 'https://world.openfoodfacts.org/product/737628064502' },
  { label: 'Product GTIN Code', text: '3017620422003' },
  { label: 'Website Link', text: 'https://nutri-ai-eight-iota.vercel.app' },
  { label: 'Nutrition Text Note', text: 'Daily Target: 2000 kcal | 130g Protein | NutriLens Demo' },
];

const QRScan: React.FC = () => {
  const navigate = useNavigate();

  // Mode selection: 'camera' | 'upload' | 'manual'
  const [scanMode, setScanMode] = useState<ScanMode>('camera');

  // Input states
  const [manualInput, setManualInput] = useState('');
  const [isDecodingFile, setIsDecodingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  // Result state
  const [decodedResult, setDecodedResult] = useState<DecodedResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Product lookup states (if QR contains a barcode or product URL)
  const [lookingUpProduct, setLookingUpProduct] = useState(false);
  const [productData, setProductData] = useState<ScannedProduct | null>(null);
  const [productNotFound, setProductNotFound] = useState(false);
  const [productLookupError, setProductLookupError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----------------------------------------------------
  // Content Classifier & Safety Analyzer
  // ----------------------------------------------------
  const analyzeContent = (rawText: string): DecodedResult => {
    const trimmed = rawText.trim();
    const timestamp = new Date().toLocaleTimeString();

    // 1. Check for pure numeric product barcode (GTIN-8, UPC-A, EAN-13, GTIN-14)
    if (/^\d{6,14}$/.test(trimmed)) {
      return {
        raw: trimmed,
        type: 'product_barcode',
        timestamp,
        detectedBarcode: trimmed,
      };
    }

    // 2. Check for URL
    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const parsed = new URL(trimmed);
        const isSafe = ['http:', 'https:'].includes(parsed.protocol);

        // Check if URL contains an Open Food Facts product or product barcode in path
        const offMatch = trimmed.match(/openfoodfacts\.org\/product\/(\d{6,14})/i);
        const genericBarcodeMatch = trimmed.match(/\/(\d{6,14})(?:[/?#]|$)/);
        const extractedBarcode = offMatch ? offMatch[1] : genericBarcodeMatch ? genericBarcodeMatch[1] : undefined;

        return {
          raw: trimmed,
          type: extractedBarcode ? 'product_url' : 'url',
          timestamp,
          detectedBarcode: extractedBarcode,
          isSafeUrl: isSafe,
          safeUrlHref: isSafe ? trimmed : undefined,
          domain: parsed.hostname,
        };
      } catch {
        // Fallback to text if URL parsing fails
      }
    }

    // 3. Check for Structured JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsedJson = JSON.parse(trimmed);
        let extractedBarcode: string | undefined;
        if (parsedJson && typeof parsedJson === 'object') {
          const candidate = parsedJson.barcode || parsedJson.gtin || parsedJson.code || parsedJson.ean;
          if (candidate && /^\d{6,14}$/.test(String(candidate))) {
            extractedBarcode = String(candidate);
          }
        }

        return {
          raw: trimmed,
          type: 'json',
          timestamp,
          detectedBarcode: extractedBarcode,
          jsonPreview: parsedJson,
        };
      } catch {
        // Not valid JSON, continue to text
      }
    }

    // 4. Default: Plain text
    return {
      raw: trimmed,
      type: 'text',
      timestamp,
    };
  };

  // ----------------------------------------------------
  // Handler for Decoded Content
  // ----------------------------------------------------
  const handleDecodedText = (text: string) => {
    if (!text || !text.trim()) return;
    const analyzed = analyzeContent(text);
    setDecodedResult(analyzed);
    setCopied(false);
    setProductData(null);
    setProductNotFound(false);
    setProductLookupError(null);
  };

  // ----------------------------------------------------
  // Camera Scan Callback
  // ----------------------------------------------------
  const handleCameraScan = (text: string) => {
    // Only accept if not currently displaying a result
    if (!decodedResult) {
      handleDecodedText(text);
    }
  };

  // ----------------------------------------------------
  // File Upload Decoder (Dual Engine: ZXing + Html5Qrcode)
  // ----------------------------------------------------
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    setIsDecodingFile(true);
    setFileError(null);

    // Create object URL for preview and decoding
    const objectUrl = URL.createObjectURL(file);
    setUploadedPreview(objectUrl);

    let decodedText: string | null = null;

    // Engine 1: @zxing/browser BrowserQRCodeReader
    try {
      const codeReader = new BrowserQRCodeReader();
      const zxingResult = await codeReader.decodeFromImageUrl(objectUrl);
      if (zxingResult && zxingResult.getText()) {
        decodedText = zxingResult.getText();
      }
    } catch {
      // ZXing didn't find or failed; attempt Engine 2
    }

    // Engine 2: Html5Qrcode.scanFile fallback
    if (!decodedText) {
      try {
        // Create an ephemeral container for Html5Qrcode file scan
        let tempContainer = document.getElementById('temp-html5qr-file-engine');
        if (!tempContainer) {
          tempContainer = document.createElement('div');
          tempContainer.id = 'temp-html5qr-file-engine';
          tempContainer.style.display = 'none';
          document.body.appendChild(tempContainer);
        }

        const html5Qr = new Html5Qrcode('temp-html5qr-file-engine', { verbose: false });
        const html5Result = await html5Qr.scanFile(file, false);
        if (html5Result) {
          decodedText = html5Result;
        }
        await html5Qr.clear();
      } catch {
        // Engine 2 also failed
      }
    }

    setIsDecodingFile(false);

    if (decodedText) {
      handleDecodedText(decodedText);
    } else {
      setFileError(
        'No QR code detected in this image. Please ensure the QR code is centered, well-lit, and in focus.'
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // ----------------------------------------------------
  // Manual Input Submit
  // ----------------------------------------------------
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setManualError('Please enter or paste QR code content.');
      return;
    }
    setManualError(null);
    handleDecodedText(manualInput.trim());
  };

  // ----------------------------------------------------
  // Product Lookup Handler
  // ----------------------------------------------------
  const handleLookupProduct = async (code: string) => {
    setLookingUpProduct(true);
    setProductNotFound(false);
    setProductLookupError(null);
    setProductData(null);

    try {
      const result = await fetchProductByBarcode(code);
      if (result) {
        setProductData(result);
      } else {
        setProductNotFound(true);
      }
    } catch (err: any) {
      console.error('QR Product lookup error:', err);
      setProductLookupError(err?.message || 'Failed to retrieve food product details. Please try again.');
    } finally {
      setLookingUpProduct(false);
    }
  };

  // ----------------------------------------------------
  // Copy to Clipboard
  // ----------------------------------------------------
  const handleCopy = () => {
    if (decodedResult) {
      navigator.clipboard.writeText(decodedResult.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ----------------------------------------------------
  // Reset Action
  // ----------------------------------------------------
  const handleReset = () => {
    setDecodedResult(null);
    setProductData(null);
    setProductNotFound(false);
    setProductLookupError(null);
    setFileError(null);
    setManualError(null);
    setUploadedPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 backdrop-blur-md rounded-xl inline-flex text-white">
              <QrCode className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Smart Vision Tool
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight pt-2">QR Code Scanner</h1>
          <p className="text-emerald-100 text-sm max-w-lg">
            Instantly decode QR codes using your device camera, photo upload, or text paste. Identify URLs, text, and food product barcodes.
          </p>
        </div>

        {/* Barcode Scanner Shortcut */}
        <div className="z-10 flex items-center">
          <button
            type="button"
            onClick={() => navigate('/scan/barcode')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md text-xs font-semibold text-white transition-all shadow-sm"
            title="Open standard 1D Barcode Scanner"
          >
            <Package className="w-4 h-4 text-emerald-200" />
            Switch to Barcode Scanner
          </button>
        </div>
      </div>

      {/* Main Scanner Container */}
      {!decodedResult ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6">
          {/* Mode Selector Tabs */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setScanMode('camera');
                setFileError(null);
                setManualError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              Camera Scan
            </button>
            <button
              type="button"
              onClick={() => {
                setScanMode('upload');
                setFileError(null);
                setManualError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                scanMode === 'upload'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => {
                setScanMode('manual');
                setFileError(null);
                setManualError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                scanMode === 'manual'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Manual Paste
            </button>
          </div>

          {/* Mode 1: Camera Scanner */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <QRCodeCamera onScan={handleCameraScan} active={true} />
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span>Supports all standard QR codes & 2D formats</span>
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Client-side decoding
                </span>
              </div>
            </div>
          )}

          {/* Mode 2: Upload Image */}
          {scanMode === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
                  isDecodingFile
                    ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-neutral-50/50 dark:bg-neutral-800/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {isDecodingFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                      Decoding QR Code from Image...
                    </p>
                    <p className="text-xs text-neutral-400">Processing visual matrix</p>
                  </div>
                ) : uploadedPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded QR"
                      className="max-h-40 max-w-xs object-contain rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm"
                    />
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Click to choose another image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-neutral-500 dark:text-neutral-400">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        Drop a QR code image here or click to browse
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Supports PNG, JPG, WebP, screenshots from phone or PC
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {fileError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Image Read Notice: </span>
                    {fileError}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Manual Input */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>Enter or Paste Decoded QR Content</span>
                  <span className="text-neutral-400 font-normal">URL, GTIN barcode, or text</span>
                </label>
                <textarea
                  rows={4}
                  value={manualInput}
                  onChange={(e) => {
                    setManualInput(e.target.value);
                    setManualError(null);
                  }}
                  placeholder="Paste URL, numeric barcode (e.g. 737628064502), or text payload..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-neutral-800 dark:text-neutral-200 transition-all font-mono"
                />
              </div>

              {manualError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4" /> Process QR Content
              </button>
            </form>
          )}

          {/* 1-Click Quick Testing Chips */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Quick Test Examples
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_FALLBACKS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleDecodedText(sample.text)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-600 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-neutral-200 dark:border-neutral-700 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================
           Decoded QR Result View
        ==================================================== */
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Result Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">QR Code Decoded</h2>
                    {/* Content Type Badge */}
                    {decodedResult.type === 'product_barcode' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Package className="w-3 h-3" /> Product Barcode (GTIN)
                      </span>
                    )}
                    {decodedResult.type === 'product_url' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Product Database URL
                      </span>
                    )}
                    {decodedResult.type === 'url' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Web URL
                      </span>
                    )}
                    {decodedResult.type === 'json' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Structured JSON
                      </span>
                    )}
                    {decodedResult.type === 'text' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Plain Text
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Scanned at {decodedResult.timestamp}</p>
                </div>
              </div>

              {/* Reset / Scan Again Button */}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Another QR
              </button>
            </div>

            {/* Decoded Content Display Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>Decoded Content:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied to Clipboard!' : 'Copy Content'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-sm font-mono text-neutral-900 dark:text-neutral-100 break-all select-all">
                {decodedResult.raw}
              </div>
            </div>

            {/* Safe URL Handling Section (RULE 5) */}
            {decodedResult.isSafeUrl && decodedResult.safeUrlHref && (
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Safe External Link Detected ({decodedResult.domain})
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      NutriLens AI does not auto-open links to ensure your security. You can inspect or open this URL in a separate isolated tab.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={decodedResult.safeUrlHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Link in New Tab
                  </a>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    External link • Target will open in new window
                  </span>
                </div>
              </div>
            )}

            {/* Product Identifier Detected Actions (RULE 4) */}
            {decodedResult.detectedBarcode && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        Product Barcode Detected: {decodedResult.detectedBarcode}
                      </h3>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        This QR code contains a recognized GTIN/EAN numeric product code.
                      </p>
                    </div>
                  </div>

                  {!productData && !productNotFound && (
                    <button
                      type="button"
                      disabled={lookingUpProduct}
                      onClick={() => handleLookupProduct(decodedResult.detectedBarcode!)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                    >
                      {lookingUpProduct ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Looking Up...
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" /> Lookup Food Product
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Product Not Found State */}
                {productNotFound && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Info className="w-4 h-4 text-amber-600" />
                      No Food Record Found in Open Food Facts
                    </div>
                    <p className="text-amber-800 dark:text-amber-300">
                      We searched for barcode <code className="font-mono">{decodedResult.detectedBarcode}</code>, but no matching food product record was found. Note that many QR codes encode hardware, payment, or custom data rather than packaged foods.
                    </p>
                  </div>
                )}

                {/* Product Lookup Error State */}
                {productLookupError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{productLookupError}</span>
                  </div>
                )}

                {/* Product Data Card Display */}
                {productData && (
                  <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-800/80 shadow-xs space-y-4">
                    <div className="flex items-start gap-4">
                      {productData.image_url ? (
                        <img
                          src={productData.image_url}
                          alt={productData.product_name}
                          className="w-16 h-16 object-contain rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            {productData.brand}
                          </span>
                          {productData.nutriscore_grade && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              NutriScore {productData.nutriscore_grade}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                          {productData.product_name}
                        </h4>
                        <p className="text-xs text-neutral-400">Barcode: {productData.barcode}</p>
                      </div>
                    </div>

                    {/* Macro Pillars */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                        <span className="text-[10px] text-neutral-400 block font-medium">Calories</span>
                        <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                          {productData.calories_100g} kcal
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                        <span className="text-[10px] text-neutral-400 block font-medium">Protein</span>
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400">
                          {productData.protein_100g}g
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                        <span className="text-[10px] text-neutral-400 block font-medium">Carbs</span>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {productData.carbs_100g}g
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                        <span className="text-[10px] text-neutral-400 block font-medium">Fat</span>
                        <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                          {productData.fat_100g}g
                        </span>
                      </div>
                    </div>

                    {/* Action: Open in Barcode Inspector */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => navigate('/scan/barcode')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                      >
                        Open In Full Barcode Inspector <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScan;
