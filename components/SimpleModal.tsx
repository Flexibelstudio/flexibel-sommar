
import React from 'react';
import { Button } from './Button';
import { XCircleIcon } from './Icons';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="simple-modal-title">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalOpen">
        <div className="flex justify-between items-center mb-4">
          <h3 id="simple-modal-title" className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Stäng modal"
          >
            <XCircleIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="text-gray-700 mb-6">
          {children}
        </div>
        <Button onClick={onClose} variant="secondary" className="w-full">
          Stäng
        </Button>
      </div>
      <style>{`
        @keyframes modalOpen {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalOpen {
          animation: modalOpen 0.3s forwards;
        }
      `}</style>
    </div>
  );
};
