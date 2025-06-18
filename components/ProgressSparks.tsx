import React from 'react';

interface ProgressSparksProps {
  percentage: number; // Current progress percentage (0-100)
  sparkColor?: string; // Tailwind color class for the sparks, e.g., 'bg-yellow-400'
  count?: number; // Number of sparks
}

export const ProgressSparks: React.FC<ProgressSparksProps> = ({
  percentage,
  sparkColor = 'bg-yellow-400', // Default spark color
  count = 5,
}) => {
  // Don't render if no progress or if progress is 100% (sparks are for *filling*)
  if (percentage === 0 || percentage >= 100) return null;

  return (
    <div
      className="absolute top-0 h-full pointer-events-none"
      style={{
        left: `calc(${percentage}% - 3px)`, // Adjust to center the spark origin point (width of particle / 2)
        zIndex: 1, // Ensure sparks are above the filled part of the bar but can be under text if needed
      }}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => {
        // Generate random values for spark animation offsets
        const dx = `${Math.random() * 20 - 10}px`; // Random horizontal movement (-10px to 10px)
        const dy = `${Math.random() * 20 - 10}px`; // Random vertical movement (-10px to 10px)
        const dxEnd = `${Math.random() * 40 - 20}px`;
        const dyEnd = `${Math.random() * 40 - 20}px`;
        return (
          <div
            key={index}
            className={`progress-spark-particle ${sparkColor}`}
            style={
              {
                animationDelay: `${index * 0.05}s`,
                '--spark-dx': dx,
                '--spark-dy': dy,
                '--spark-dx-end': dxEnd,
                '--spark-dy-end': dyEnd,
              } as React.CSSProperties // Type assertion for custom properties
            }
          />
        );
        })}
    </div>
  );
};
