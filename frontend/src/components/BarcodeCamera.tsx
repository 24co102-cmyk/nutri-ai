// src/components/BarcodeCamera.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Zap, ZapOff, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface BarcodeCameraProps {
  onScan: (barcode: string) => void;
  active: boolean;
}

const BarcodeCamera: React.FC<BarcodeCameraProps> = ({ onScan, active }) => {
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'html5-barcode-scanner-viewport';

  useEffect(() => {
    if (!active) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      setPermissionError(null);
      try {
        // Formats to support (UPC-A, EAN-13, EAN-8, UPC-E, CODE-128, etc.)
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE,
        ];

        const html5Qrcode = new Html5Qrcode(containerId, {
          formatsToSupport,
          verbose: false,
        });
        html5QrcodeRef.current = html5Qrcode;

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.5,
        };

        await html5Qrcode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (decodedText && decodedText.trim().length >= 6) {
              onScan(decodedText.trim());
            }
          },
          () => {
            // Ignore scan attempt errors (continuous scanning frame)
          }
        );

        if (isMounted) {
          setIsScanning(true);
          // Check torch support
          try {
            const capabilities = html5Qrcode.getRunningTrackCapabilities();
            if (capabilities && (capabilities as any).torch) {
              setTorchSupported(true);
            }
          } catch (e) {
            setTorchSupported(false);
          }
        }
      } catch (err: any) {
        console.error('Camera barcode scanner error:', err);
        if (isMounted) {
          setIsScanning(false);
          if (err?.name === 'NotAllowedError' || String(err).includes('Permission denied')) {
            setPermissionError('Camera permission was denied. Please allow camera access in your browser settings.');
          } else if (err?.name === 'NotFoundError' || String(err).includes('DevicesNotFoundError')) {
            setPermissionError('No camera device found on this system.');
          } else {
            setPermissionError('Unable to start camera scanner. Try entering barcode manually below.');
          }
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [active]);

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (e) {
        console.error('Error stopping html5Qrcode:', e);
      } finally {
        html5QrcodeRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const toggleTorch = async () => {
    if (!html5QrcodeRef.current || !torchSupported) return;
    try {
      const nextState = !torchOn;
      await html5QrcodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }] as any,
      });
      setTorchOn(nextState);
    } catch (e) {
      console.error('Failed to toggle torch:', e);
    }
  };

  return (
    <div className="relative border-2 border-neutral-200 bg-neutral-950 rounded-2xl overflow-hidden min-h-[260px] flex flex-col items-center justify-center shadow-inner">
      {/* HTML5 QR Code Video Viewport Container */}
      <div id={containerId} className="w-full h-full min-h-[240px] [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_canvas]:hidden" />

      {/* Laser Scanning Frame Overlay */}
      {isScanning && !permissionError && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
          <div className="w-64 h-36 border-2 border-teal-400/80 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(45,212,191,0.25)] flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal-400 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal-400 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal-400 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal-400 rounded-br-sm" />

            {/* Laser Line */}
            <div className="absolute inset-x-0 h-0.5 bg-teal-400 shadow-[0_0_12px_#2dd4bf] animate-pulse" />
          </div>

          <span className="text-[11px] font-bold text-teal-300 bg-neutral-900/80 px-3 py-1 rounded-full mt-3 border border-teal-500/30 flex items-center gap-1.5 backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Point camera at barcode — auto-detects!
          </span>
        </div>
      )}

      {/* Torch Control Button */}
      {torchSupported && isScanning && (
        <button
          type="button"
          onClick={toggleTorch}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-amber-400 border border-neutral-700 backdrop-blur-md transition-all shadow-md z-20"
          title={torchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
        >
          {torchOn ? <Zap className="w-4 h-4 fill-amber-400" /> : <ZapOff className="w-4 h-4 text-neutral-400" />}
        </button>
      )}

      {/* Permission Error State */}
      {permissionError && (
        <div className="p-6 text-center space-y-3 max-w-sm text-neutral-300 z-10 bg-neutral-900/90 rounded-2xl border border-rose-500/30 m-4">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
          <p className="text-xs text-neutral-300 font-medium">{permissionError}</p>
        </div>
      )}

      {/* Loading state before stream starts */}
      {!isScanning && !permissionError && active && (
        <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 space-y-2 z-10">
          <RefreshCw className="w-6 h-6 text-teal-400 animate-spin" />
          <span className="text-xs font-bold text-neutral-300">Starting Auto-Scan Camera...</span>
        </div>
      )}
    </div>
  );
};

export default BarcodeCamera;
