import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';

const PrintButton = ({ btnText }) => {
  return (
    <button className="flex items-center justify-center bg-black rounded-2xl px-5 py-3 gap-3 shadow-sm">
      <PrinterIcon className="h-6 w-6 text-white" />

      <span className="text-sm text-white">{btnText}</span>
    </button>
  );
};

export default PrintButton;
