// src/components/ImageUploader.tsx
import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  label?: string;
  preview?: string | null;
  onImageChange?: (file: File | null, previewUrl: string | null) => void;
  defaultText?: string;
}

export default function ImageUploader({ label, preview, onImageChange }: Props) {
  const [localPreview, setLocalPreview] = useState(preview);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setLocalPreview(url);
      onImageChange?.(file, url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl h-52 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
      >
        {localPreview ? (
          <img src={localPreview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{label ? "Click to upload" : "Upload Photo"}</p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}