
import React from 'react';
import { APP_STRINGS } from '../constants';

export const Logo: React.FC = () => {
  return (
    <div className="flex justify-center my-8" role="banner" aria-label={APP_STRINGS.logoText}>
      <span className="text-4xl sm:text-5xl font-bold text-[#51A1A1]">
        {APP_STRINGS.logoText}
      </span>
    </div>
  );
};