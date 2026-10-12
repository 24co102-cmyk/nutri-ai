// src/components/QRCodeCamera.tsx
import React from 'react';
import VisionCamera from './VisionCamera';

export interface QRCodeCameraProps {
  onScan: (decodedText: string) => void;
  active: boolean;
}

const QRCodeCamera: React.FC<QRCodeCameraProps> = ({ onScan, active }) => {
  return <VisionCamera mode="qr" onScan={onScan} active={active} />;
};

export default QRCodeCamera;
