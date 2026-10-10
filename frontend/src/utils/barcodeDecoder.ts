// src/utils/barcodeDecoder.ts
import {
  BrowserMultiFormatReader,
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} from '@zxing/library';

export interface DecodedBarcodeResult {
  rawText: string;
  barcode: string; // cleaned barcode number (e.g. 890100000001)
  formatName: string;
}

/**
 * Clean and extract a barcode from decoded text.
 * Can be either:
 * - A pure numeric barcode (e.g. "890100000001")
 * - A JSON string with barcode field (e.g. '{"barcode":"890100000001"}')
 */
export const extractBarcodeFromText = (text: string): string => {
  const trimmed = text.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.barcode) {
        return String(parsed.barcode).trim();
      }
    } catch {
      // not valid JSON, proceed to regex
    }
  }

  // 2. Check for 12-digit format 8901000000XX
  const match12 = trimmed.match(/\b(8901\d{8})\b/);
  if (match12) {
    return match12[1];
  }

  // 3. Fallback: match any 8 to 14 digit sequence
  const matchNum = trimmed.match(/\b\d{8,14}\b/);
  if (matchNum) {
    return matchNum[0];
  }

  // 4. Return stripped string
  return trimmed.replace(/[^\w]/g, '');
};

/**
 * Decode barcode or QR from an uploaded image File.
 */
export const decodeImageFile = async (file: File): Promise<DecodedBarcodeResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Failed to read image file data.'));
      }

      const img = new Image();
      img.onload = async () => {
        try {
          // 1. Try standard BrowserMultiFormatReader
          const zxingReader = new BrowserMultiFormatReader();
          try {
            const result = await zxingReader.decodeFromImageElement(img);
            if (result && result.getText()) {
              const raw = result.getText();
              const barcode = extractBarcodeFromText(raw);
              return resolve({
                rawText: raw,
                barcode,
                formatName: result.getBarcodeFormat() ? String(result.getBarcodeFormat()) : 'BARCODE',
              });
            }
          } catch (firstErr) {
            // First attempt failed, continue to canvas multi-pass
          }

          // 2. Multi-pass canvas fallback with contrast enhancement
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas context not supported.'));
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const luminanceSource = new RGBLuminanceSource(
            new Uint8ClampedArray(imageData.data),
            canvas.width,
            canvas.height
          );
          const bitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

          const hints = new Map();
          hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.CODE_128,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.UPC_A,
            BarcodeFormat.UPC_E,
            BarcodeFormat.CODE_39,
            BarcodeFormat.QR_CODE,
          ]);
          hints.set(DecodeHintType.TRY_HARDER, true);

          const multiReader = new MultiFormatReader();
          multiReader.setHints(hints);

          try {
            const res = multiReader.decode(bitmap);
            if (res && res.getText()) {
              const raw = res.getText();
              const barcode = extractBarcodeFromText(raw);
              return resolve({
                rawText: raw,
                barcode,
                formatName: res.getBarcodeFormat() ? String(res.getBarcodeFormat()) : 'BARCODE',
              });
            }
          } catch (binarizerErr) {
            // Invert colors or scale attempt
          }

          reject(new Error('No clear barcode or QR pattern found. Ensure the image is crisp and not blurred.'));
        } catch (err: any) {
          reject(new Error(err.message || 'Failed to decode barcode from image.'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error('Error reading uploaded file.'));
    reader.readAsDataURL(file);
  });
};
