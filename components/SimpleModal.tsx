
import React from 'react';
import { Button } from './Button';
import { XCircleIcon } from './Icons';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  theme?: 'default' | 'pep'; // New theme prop
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, title, children, theme = 'default' }) => {
  if (!isOpen) {
    return null;
  }

  const isPepTheme = theme === 'pep';

  const modalBgClass = isPepTheme ? 'bg-yellow-50 border-2 border-yellow-500' : 'bg-white';
  const titleColorClass = isPepTheme ? 'text-yellow-800' : 'text-gray-800';
  const closeIconColorClass = isPepTheme ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 hover:text-gray-600';
  const contentTextColorClass = isPepTheme ? 'text-yellow-700' : 'text-gray-700';
  const footerButtonVariant = isPepTheme ? 'pep' : 'secondary';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="simple-modal-title">
      <div className={`${modalBgClass} p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalOpen`}>
        <div className="flex justify-between items-center mb-4">
          <h3 id="simple-modal-title" className={`text-xl font-semibold ${titleColorClass}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`${closeIconColorClass} transition-colors`}
            aria-label="Stäng modal"
          >
            <XCircleIcon className="w-7 h-7" />
          </button>
        </div>
        <div className={`${contentTextColorClass} mb-6`}>
          {children}
        </div>
        <Button onClick={onClose} variant={footerButtonVariant} className="w-full">
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
