import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';

const PrintButton = ({ btnText }) => {
  return (
    <button className="flex items-center justify-center bg-black rounded-2xl px-5 py-4 gap-2 shadow-sm">
      <PrinterIcon className="h-7 w-7 text-white" />

      <span className="text-sm text-white">{btnText}</span>
    </button>
  );
};

export default PrintButton;
