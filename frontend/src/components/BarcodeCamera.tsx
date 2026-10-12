// src/components/BarcodeCamera.tsx
import React from 'react';
import VisionCamera from './VisionCamera';

export interface BarcodeCameraProps {
  onScan: (barcode: string) => void;
  active: boolean;
}

const BarcodeCamera: React.FC<BarcodeCameraProps> = ({ onScan, active }) => {
  return <VisionCamera mode="barcode" onScan={onScan} active={active} />;
};

export default BarcodeCamera;
