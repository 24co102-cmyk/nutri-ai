import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface QRCodeRendererProps {
  barcode: string;
  productName?: string;
  size?: number;
  showDownload?: boolean;
}

const QRCodeRenderer: React.FC<QRCodeRendererProps> = ({
  barcode,
  productName,
  size = 180,
  showDownload = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && barcode) {
      const payload = JSON.stringify({ barcode });
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('Error generating QR code:', err);
        }
      );
    }
  }, [barcode, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode_${barcode}_${(productName || 'product').replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-3 premium-card">
      <div className="py-1 flex justify-center">
        <canvas ref={canvasRef} className="rounded-xl shadow-inner" />
      </div>

      <div className="text-[11px] font-mono text-neutral-500 mt-1">
        {JSON.stringify({ barcode })}
      </div>

      {showDownload && (
        <button
          onClick={handleDownload}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
          title="Download printable PNG QR code image"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR</span>
        </button>
      )}
    </div>
  );
};

export default QRCodeRenderer;
