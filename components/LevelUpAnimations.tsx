import React, { useEffect } from 'react';
import { KettlebellIcon, FootstepsIcon } from './Icons';

interface LevelUpAnimationProps {
  onAnimationEnd: () => void;
  type: 'kettlebell' | 'footstep';
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ onAnimationEnd, type }) => {
  useEffect(() => {
    // Duration should match the CSS animation duration
    const animationDuration = type === 'kettlebell' ? 2800 : 2200; 
    const timer = setTimeout(onAnimationEnd, animationDuration);
    return () => clearTimeout(timer);
  }, [onAnimationEnd, type]);

  const Icon = type === 'kettlebell' ? KettlebellIcon : FootstepsIcon;
  const animationClass = type === 'kettlebell' ? 'animate-kettlebell-level-up' : 'animate-footstep-level-up';
  const iconColor = type === 'kettlebell' ? 'text-green-500' : 'text-sky-500';

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10001]"
      aria-live="polite" // Announce to screen readers that content is changing
      role="alert" // More specific role for dynamic changes
    >
      <div className={`transform transition-all duration-500 ${animationClass}`}>
        <Icon 
          className={`w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl ${iconColor}`} 
          aria-label={type === 'kettlebell' ? 'Kettlebell level up animation' : 'Footstep level up animation'} 
        />
      </div>
    </div>
  );
};
