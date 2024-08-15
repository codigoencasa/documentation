import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const colors = [
  { name: 'Teal', hex: '#20E3B2' },
  { name: 'Dark Blue', hex: '#0F172A' },
  { name: 'Light Gray', hex: '#F1F5F9' },
  { name: 'Dark Gray', hex: '#64748B' },
  { name: 'White', hex: '#FFFFFF' },
];

const ColorPalette = () => {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="p-4  rounded-lg ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map(({ name, hex }) => (
          <div key={hex} className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: hex }}
              onClick={() => copyToClipboard(hex)}
            >
              {copiedColor === hex && (
                <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                  <Check className="text-white" size={24} />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">{name}</p>
            <p className="text-xs text-gray-500">{hex}</p>
            <button
              className="mt-1 text-xs text-gray-500 flex items-center hover:text-gray-700"
              onClick={() => copyToClipboard(hex)}
            >
              <Copy size={12} className="mr-1" />
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export  {ColorPalette};