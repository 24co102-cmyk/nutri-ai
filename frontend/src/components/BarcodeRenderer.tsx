import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download } from 'lucide-react';

interface BarcodeRendererProps {
  barcode: string;
  productName?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  showDownload?: boolean;
}

const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  barcode,
  productName,
  width = 2,
  height = 70,
  fontSize = 18,
  showDownload = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && barcode) {
      try {
        JsBarcode(canvasRef.current, barcode, {
          format: 'CODE128',
          width,
          height,
          displayValue: true,
          font: 'monospace',
          fontOptions: 'bold',
          fontSize,
          textMargin: 8,
          margin: 12,
          background: '#ffffff',
          lineColor: '#000000',
        });
      } catch (err) {
        console.error('Error rendering barcode:', err);
      }
    }
  }, [barcode, width, height, fontSize]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `barcode_${barcode}_${(productName || 'product').replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-3 premium-card">
      <div className="overflow-x-auto max-w-full py-1 flex justify-center">
        <canvas ref={canvasRef} className="rounded-lg shadow-inner max-w-full" />
      </div>

      {showDownload && (
        <button
          onClick={handleDownload}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
          title="Download printable PNG barcode image"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Barcode</span>
        </button>
      )}
    </div>
  );
};

export default BarcodeRenderer;
