// src/components/QRCodeCamera.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Zap, ZapOff, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface QRCodeCameraProps {
  onScan: (decodedText: string) => void;
  active: boolean;
}

const QRCodeCamera: React.FC<QRCodeCameraProps> = ({ onScan, active }) => {
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'html5-qr-scanner-viewport';

  useEffect(() => {
    if (!active) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      setPermissionError(null);
      try {
        // Dedicated QR Code format scanner
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
        ];

        const html5Qrcode = new Html5Qrcode(containerId, {
          formatsToSupport,
          verbose: false,
        });
        html5QrcodeRef.current = html5Qrcode;

        const config = {
          fps: 15,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        };

        await html5Qrcode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (decodedText && decodedText.trim().length > 0) {
              onScan(decodedText.trim());
            }
          },
          () => {
            // Ignore frame-by-frame non-matching scans
          }
        );

        if (isMounted) {
          setIsScanning(true);
          // Check torch capability on camera track
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
        console.error('Camera QR scanner error:', err);
        if (isMounted) {
          setIsScanning(false);
          if (err?.name === 'NotAllowedError' || String(err).includes('Permission denied')) {
            setPermissionError('Camera permission was denied. Please allow camera access in your browser or switch to image upload.');
          } else if (err?.name === 'NotFoundError' || String(err).includes('DevicesNotFoundError')) {
            setPermissionError('No camera detected on this device. You can upload a QR image or enter content manually.');
          } else {
            setPermissionError('Unable to open camera stream. Please try uploading a QR photo or using manual input.');
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
        console.error('Error stopping QR scanner:', e);
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
    <div className="relative border-2 border-emerald-500/20 bg-neutral-950 rounded-2xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center shadow-inner">
      {/* HTML5 QR Code Video Viewport Container */}
      <div id={containerId} className="w-full h-full min-h-[280px] [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_canvas]:hidden" />

      {/* Target Crosshair & Corner Overlay */}
      {isScanning && !permissionError && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
          <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />

            {/* Scanning radar sweep animation line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />
          </div>

          <span className="text-xs font-semibold text-emerald-300 bg-neutral-900/90 px-3.5 py-1.5 rounded-full mt-4 border border-emerald-500/30 flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Align QR code inside frame — auto detects
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
        <div className="p-6 text-center space-y-3 max-w-sm text-neutral-300 z-10 bg-neutral-900/95 rounded-2xl border border-rose-500/30 m-4">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Camera Access Notice</h4>
          <p className="text-xs text-neutral-300 font-medium">{permissionError}</p>
        </div>
      )}

      {/* Loading state before stream starts */}
      {!isScanning && !permissionError && active && (
        <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 space-y-3 z-10">
          <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-200">Initializing QR Camera...</p>
            <p className="text-xs text-neutral-400">Requesting sensor stream</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeCamera;
