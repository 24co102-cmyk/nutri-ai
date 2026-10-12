// src/components/VisionCamera.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import {
  Zap,
  ZapOff,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ZoomIn,
  Sparkles,
} from 'lucide-react';

export interface VisionCameraProps {
  mode: 'barcode' | 'qr';
  onScan: (code: string) => void;
  active: boolean;
}

// Formats for Barcode vs QR
const BARCODE_FORMATS_ZXING = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.ITF,
];

const QR_FORMATS_ZXING = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.AZTEC,
];

const SCAN_TIPS_BARCODE = [
  'Hold phone steady 15–20 cm away',
  'Align barcode across the green laser line',
  'Turn on flashlight if lighting is dim',
  'Use 2x zoom for tiny package barcodes',
];

const SCAN_TIPS_QR = [
  'Center the QR code inside the box',
  'Hold phone steady 15–25 cm away',
  'Ensure the code is well-lit and not tilted',
  'Tap screen if image needs focus readjustment',
];

const VisionCamera: React.FC<VisionCameraProps> = ({ mode, onScan, active }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isScanningRef = useRef(false);
  const hasDetectedRef = useRef(false);
  const lastScanTimeRef = useRef(0);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const barcodeDetectorRef = useRef<any>(null);

  // UI States
  const [isReady, setIsReady] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [streamResolution, setStreamResolution] = useState<string>('');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomSupported, setZoomSupported] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const [scanDetectedCode, setScanDetectedCode] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [tapFocusCoord, setTapFocusCoord] = useState<{ x: number; y: number } | null>(null);

  // Cycle tips every 3.5s
  useEffect(() => {
    if (!active || !isReady || scanDetectedCode) return;
    const tips = mode === 'barcode' ? SCAN_TIPS_BARCODE : SCAN_TIPS_QR;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [active, isReady, scanDetectedCode, mode]);

  // Clean stop all video tracks and loops
  const stopCameraStream = useCallback(() => {
    isScanningRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track cleanup error
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    trackRef.current = null;
    setIsReady(false);
    setTorchOn(false);
    setTorchSupported(false);
    setZoomSupported(false);
  }, []);

  // Initialize Native BarcodeDetector or ZXing
  const setupDetectors = useCallback(async () => {
    // 1. Try Native BarcodeDetector (Supported in modern Chrome Android, Chromium, Edge)
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const supported = await (window as any).BarcodeDetector.getSupportedFormats();
        const targetFormats =
          mode === 'barcode'
            ? ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf']
            : ['qr_code', 'data_matrix', 'aztec'];

        const availableFormats = targetFormats.filter((fmt) => supported.includes(fmt));
        if (availableFormats.length > 0) {
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({
            formats: availableFormats,
          });
        }
      } catch (e) {
        console.warn('Native BarcodeDetector initialization warning:', e);
      }
    }

    // 2. Setup ZXing Fallback
    try {
      const hints = new Map();
      const formats = mode === 'barcode' ? BARCODE_FORMATS_ZXING : QR_FORMATS_ZXING;
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);
      zxingReaderRef.current = reader;
    } catch (e) {
      console.warn('ZXing fallback initialization warning:', e);
    }
  }, [mode]);

  // Request high-resolution stream with continuous autofocus
  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setPermissionError(null);
    setScanDetectedCode(null);
    hasDetectedRef.current = false;

    await setupDetectors();

    // Resolution constraints: Request Full HD (1080p), fall back to 720p, then default
    const resolutionCandidates: MediaTrackConstraints[] = [
      // 1. Full HD (1080p) with continuous autofocus & exposure
      {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 },
        advanced: [
          { focusMode: 'continuous' } as any,
          { exposureMode: 'continuous' } as any,
          { whiteBalanceMode: 'continuous' } as any,
        ],
      },
      // 2. HD (720p) fallback
      {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        frameRate: { ideal: 30, min: 15 },
        advanced: [{ focusMode: 'continuous' } as any],
      },
      // 3. Resilient basic rear camera fallback
      {
        facingMode: { ideal: 'environment' },
      },
    ];

    let stream: MediaStream | null = null;

    for (const constraints of resolutionCandidates) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: constraints,
          audio: false,
        });
        break;
      } catch (err: any) {
        // If OverconstrainedError, continue to next candidate
        if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
          continue;
        }
        // If permission denied or not found, stop immediately
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError('Camera permission was denied. Please allow camera access in your browser settings.');
          return;
        }
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setPermissionError('No camera found on this device. You can enter or paste the code manually.');
          return;
        }
      }
    }

    if (!stream) {
      setPermissionError('Unable to access camera. Please verify device camera permissions or use manual entry.');
      return;
    }

    streamRef.current = stream;
    const track = stream.getVideoTracks()[0];
    trackRef.current = track;

    // Check Track Capabilities
    if (track) {
      const caps = track.getCapabilities ? (track.getCapabilities() as any) : {};
      const settings = track.getSettings ? track.getSettings() : {};

      // Check Torch
      if (caps.torch) {
        setTorchSupported(true);
      }

      // Check Zoom
      if (caps.zoom && typeof caps.zoom.max === 'number' && caps.zoom.max > 1) {
        setZoomSupported(true);
        setMaxZoom(Math.min(caps.zoom.max, 5));
        setCurrentZoom(caps.zoom.min || 1);
      }

      // Record Resolution
      const width = settings.width || 0;
      const height = settings.height || 0;
      if (width && height) {
        if (width >= 1920 || height >= 1920) {
          setStreamResolution(`${width}×${height} FHD (Ultra-Clear)`);
        } else if (width >= 1280 || height >= 1280) {
          setStreamResolution(`${width}×${height} HD (Clear)`);
        } else {
          setStreamResolution(`${width}×${height} (Standard)`);
        }
      }

      // Attempt to ensure continuous autofocus
      if (caps.focusMode && Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
        try {
          await track.applyConstraints({
            advanced: [{ focusMode: 'continuous' } as any],
          });
        } catch {
          // ignore focus mode constraint error
        }
      }
    }

    // Attach to video element
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play().then(() => {
            setIsReady(true);
            isScanningRef.current = true;
            startDetectionLoop();
          }).catch((e) => {
            console.error('Video play error:', e);
          });
        }
      };
    }
  }, [mode, setupDetectors, stopCameraStream]);

  // High-Efficiency Frame Detection Loop
  const startDetectionLoop = useCallback(() => {
    const scanFrame = async (timestamp: number) => {
      if (!isScanningRef.current || hasDetectedRef.current) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.paused || video.ended) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      // Throttle scanning to ~12 FPS (every 80ms) for high detection responsiveness without CPU overload
      if (timestamp - lastScanTimeRef.current >= 80) {
        lastScanTimeRef.current = timestamp;

        let detectedText: string | null = null;

        // --- Engine 1: Native Hardware BarcodeDetector ---
        if (barcodeDetectorRef.current) {
          try {
            const results = await barcodeDetectorRef.current.detect(video);
            if (results && results.length > 0 && results[0].rawValue) {
              detectedText = results[0].rawValue.trim();
            }
          } catch {
            // Native detector frame error, proceed to fallback
          }
        }

        // --- Engine 2: ZXing Library Fallback ---
        if (!detectedText && zxingReaderRef.current) {
          try {
            // Draw current video frame to downscaled offscreen canvas for fast memory parsing
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (ctx) {
                // Keep processing width bounded (max 640px) to ensure sub-20ms ZXing decode
                const vw = video.videoWidth || 640;
                const vh = video.videoHeight || 480;
                const scale = Math.min(1, 640 / vw);
                const dw = Math.floor(vw * scale);
                const dh = Math.floor(vh * scale);

                canvas.width = dw;
                canvas.height = dh;
                ctx.drawImage(video, 0, 0, dw, dh);

                try {
                  const zxResult = await zxingReaderRef.current.decodeFromCanvas(canvas);
                  if (zxResult && zxResult.getText()) {
                    detectedText = zxResult.getText().trim();
                  }
                } catch {
                  // Frame did not contain a valid barcode (normal scanning)
                }
              }
            }
          } catch {
            // Frame processing error
          }
        }

        // Successful Detection Action
        if (detectedText && !hasDetectedRef.current) {
          // If in barcode mode, verify basic length (at least 6 digits/chars)
          const valid = mode === 'barcode' ? detectedText.length >= 6 : detectedText.length > 0;
          if (valid) {
            hasDetectedRef.current = true;
            isScanningRef.current = false;
            setScanDetectedCode(detectedText);

            // Trigger gentle haptic vibration feedback on supported mobile devices
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              try {
                navigator.vibrate([40, 30, 40]);
              } catch {
                // ignore vibrate errors
              }
            }

            // Emit scanned code
            onScan(detectedText);
            return;
          }
        }
      }

      // Continue loop
      if (isScanningRef.current && !hasDetectedRef.current) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [mode, onScan]);

  // Lifecycle control
  useEffect(() => {
    if (active) {
      startCameraStream();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [active, startCameraStream, stopCameraStream]);

  // Toggle Torch
  const handleToggleTorch = async () => {
    const track = trackRef.current;
    if (!track || !torchSupported) return;
    try {
      const nextTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextTorch } as any],
      });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Toggle / Cycle Zoom (1x -> 2x -> 1x)
  const handleToggleZoom = async () => {
    const track = trackRef.current;
    if (!track || !zoomSupported) return;
    try {
      const targetZoom = currentZoom >= 2 ? 1 : Math.min(2, maxZoom);
      await track.applyConstraints({
        advanced: [{ zoom: targetZoom } as any],
      });
      setCurrentZoom(targetZoom);
    } catch (e) {
      console.warn('Zoom change failed:', e);
    }
  };

  // Tap to Focus Trigger
  const handleTapToFocus = async (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isReady) return;

    // Show visual reticle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTapFocusCoord({ x, y });
    setTimeout(() => setTapFocusCoord(null), 1200);

    // Re-apply continuous autofocus constraint
    try {
      const caps = track.getCapabilities ? (track.getCapabilities() as any) : {};
      if (caps.focusMode && Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
        await track.applyConstraints({
          advanced: [{ focusMode: 'continuous' } as any],
        });
      }
    } catch {
      // ignore focus constraint error
    }
  };

  const tips = mode === 'barcode' ? SCAN_TIPS_BARCODE : SCAN_TIPS_QR;

  return (
    <div
      onClick={handleTapToFocus}
      className="relative border-2 border-emerald-500/20 bg-neutral-950 rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center shadow-inner select-none cursor-pointer group"
      title="Tap anywhere to trigger macro focus"
    >
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Real Full-Resolution Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ minHeight: '300px' }}
      />

      {/* Tap-to-Focus Reticle Animation */}
      {tapFocusCoord && (
        <div
          className="absolute pointer-events-none w-14 h-14 border-2 border-amber-400 rounded-xl animate-ping -translate-x-1/2 -translate-y-1/2"
          style={{ left: tapFocusCoord.x, top: tapFocusCoord.y }}
        />
      )}

      {/* Laser Scanning Guide Overlay */}
      {isReady && !scanDetectedCode && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
          <div
            className={`border-2 rounded-2xl relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
              mode === 'barcode'
                ? 'w-72 h-36 border-teal-400/90 shadow-[0_0_25px_rgba(45,212,191,0.35)]'
                : 'w-60 h-60 border-emerald-400/90 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
            }`}
          >
            {/* High-Visibility Corner Accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-white rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-white rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white rounded-br-sm" />

            {/* Sweep Laser Line */}
            {mode === 'barcode' ? (
              <div className="absolute inset-x-0 h-0.5 bg-teal-300 shadow-[0_0_12px_#2dd4bf] animate-pulse" />
            ) : (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />
            )}
          </div>

          {/* Dynamic Smart Guidance Tip Banner */}
          <div className="mt-4 px-3.5 py-1.5 rounded-full bg-neutral-900/85 backdrop-blur-md border border-neutral-700/80 text-white text-[11px] font-semibold flex items-center gap-2 shadow-lg max-w-[90%] text-center">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{tips[tipIndex]}</span>
          </div>
        </div>
      )}

      {/* Detection Success Highlight */}
      {scanDetectedCode && (
        <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20 space-y-2 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-white">Code Detected Instantly!</h4>
          <span className="font-mono text-xs font-bold text-emerald-300 bg-neutral-900/90 px-3 py-1 rounded-lg border border-emerald-500/40">
            {scanDetectedCode}
          </span>
        </div>
      )}

      {/* Top Floating Controls Bar */}
      {isReady && !scanDetectedCode && (
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Stream Quality Badge */}
          <div className="px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold border border-neutral-700/80 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{streamResolution || 'Ultra-Clear 1080p'}</span>
          </div>

          {/* Action Buttons: Zoom & Torch */}
          <div className="flex items-center gap-2">
            {zoomSupported && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleZoom();
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-xs backdrop-blur-md border transition-all shadow-md flex items-center gap-1 ${
                  currentZoom > 1
                    ? 'bg-teal-500 text-white border-teal-400'
                    : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                }`}
                title="Toggle 2x Macro Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{currentZoom}x</span>
              </button>
            )}

            {torchSupported && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTorch();
                }}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-md ${
                  torchOn
                    ? 'bg-amber-500 text-neutral-950 border-amber-400'
                    : 'bg-neutral-900/80 text-amber-400 border-neutral-700 hover:bg-neutral-800'
                }`}
                title={torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
              >
                {torchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Permission Error State */}
      {permissionError && (
        <div className="p-6 text-center space-y-3 max-w-sm text-neutral-300 z-10 bg-neutral-900/95 rounded-2xl border border-rose-500/30 m-4">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
          <p className="text-xs text-neutral-300 font-medium">{permissionError}</p>
        </div>
      )}

      {/* Starting Camera Spinner */}
      {!isReady && !permissionError && active && (
        <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 space-y-3 z-10">
          <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-bold text-neutral-200">Starting Ultra-Clear Camera...</p>
            <p className="text-xs text-neutral-400">Requesting 1080p continuous macro focus</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionCamera;
