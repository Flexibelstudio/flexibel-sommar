
import React from 'react';

interface ButtonProps {
  onClick?: () => void; 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warmup' | 'pause' | 'pink' | 'purple' | 'pep'; 
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset'; 
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false, title, type = 'button' }) => {
  let baseStyle = 'font-semibold py-3 px-6 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out';
  
  if (disabled) {
    baseStyle += ' opacity-50 cursor-not-allowed';
  }

  switch (variant) {
    case 'primary':
      baseStyle += ` bg-[#51A1A1] hover:bg-[#418484] text-white focus:ring-[#62BDBD] border border-[#418484] ${disabled ? '' : 'active:bg-[#316767]'}`;
      if (disabled) baseStyle += ' bg-[#316767] hover:bg-[#316767] border-[#316767]';
      break;
    case 'secondary':
      baseStyle += ` bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 border border-gray-300 ${disabled ? '' : 'active:bg-gray-400'}`;
      if (disabled) baseStyle += ' bg-gray-300 hover:bg-gray-300 text-gray-400 border-gray-300';
      break;
    case 'danger': 
      baseStyle += ` bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 ${disabled ? '' : 'active:bg-red-700'}`;
      if (disabled) baseStyle += ' bg-red-700 hover:bg-red-700';
      break;
    case 'ghost':
       baseStyle = `font-semibold py-2 px-4 text-[#418484] hover:text-[#316767] hover:bg-[#E4F0F0] focus:outline-none focus:ring-2 focus:ring-[#51A1A1] rounded-md transition-colors duration-150 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed text-[#316767] hover:text-[#316767]' : ''}`;
      break;
    case 'warmup':
      baseStyle += ` bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 border border-orange-600 ${disabled ? '' : 'active:bg-orange-700'}`;
      if (disabled) baseStyle += ' bg-orange-700 hover:bg-orange-700 text-orange-200 border-orange-700';
      break;
    case 'pause': 
      baseStyle += ` bg-yellow-400 hover:bg-yellow-500 text-yellow-900 focus:ring-yellow-400 border border-yellow-500 ${disabled ? '' : 'active:bg-yellow-600'}`;
      if (disabled) baseStyle += ' bg-yellow-200 hover:bg-yellow-200 text-yellow-500 border-yellow-300';
      break;
    case 'pink':
      baseStyle += ` bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-400 border border-pink-600 ${disabled ? '' : 'active:bg-pink-700'}`;
      if (disabled) baseStyle += ' bg-pink-700 hover:bg-pink-700 text-pink-200 border-pink-700';
      break;
    case 'purple':
      baseStyle += ` bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 border border-purple-700 ${disabled ? '' : 'active:bg-purple-800'}`;
      if (disabled) baseStyle += ' bg-purple-800 hover:bg-purple-800 text-purple-300 border-purple-800';
      break;
    case 'pep': // New variant for "Dagens Pepp" modal button
      baseStyle += ` bg-yellow-400 hover:bg-yellow-500 text-yellow-900 focus:ring-yellow-300 border border-yellow-500 ${disabled ? '' : 'active:bg-yellow-600'}`;
      if (disabled) baseStyle += ' bg-yellow-200 hover:bg-yellow-200 text-yellow-500 border-yellow-300';
      break;
  }
  
  return (
    <button
      type={type} 
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};
