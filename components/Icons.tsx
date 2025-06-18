import React from 'react';

interface IconProps {
  className?: string;
  onClick?: () => void; 
}

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

// Added ArrowSmRightIcon
export const ArrowSmRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3" />
  </svg>
);


export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
);

interface FireIconProps extends IconProps {
  streakLevel?: number; 
}

export const FireIcon: React.FC<FireIconProps> = ({ className, streakLevel = 0 }) => {
  let iconSizeClass = 'w-10 h-10 sm:w-12 sm:h-12'; 
  let animationClass = '';
  let colorClass = 'text-gray-400'; 

  if (streakLevel === 1) { 
    colorClass = 'text-orange-500';
    animationClass = 'animate-pulseSoftFire';
  } else if (streakLevel === 2) { 
    iconSizeClass = 'w-12 h-12 sm:w-14 sm:h-14';
    colorClass = 'text-red-500';
    animationClass = 'animate-pulseMediumFire';
  } else if (streakLevel >= 3) { 
    iconSizeClass = 'w-14 h-14 sm:w-16 sm:h-16';
    colorClass = 'text-red-600';
    animationClass = 'animate-pulseStrongFire';
  }
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSizeClass} ${colorClass} ${animationClass} ${className || ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-6.867 8.21 8.21 0 003 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18Z" />
    </svg>
  );
};


export const TrophyIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 9.75H11.25A3.375 3.375 0 007.5 13.125V18.75m9 0h-9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75h4.5M12 7.5A2.25 2.25 0 0114.25 5.25v-1.5A2.25 2.25 0 0012 1.5A2.25 2.25 0 009.75 3.75v1.5A2.25 2.25 0 0112 7.5z" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.813 2.846a4.5 4.5 0 01-3.09 3.09L13.156 15l-.813-2.846a4.5 4.5 0 013.09-3.09L18.25 7.5z" />
  </svg>
);

export const AcademicCapIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const StarIcon: React.FC<IconProps & { solid?: boolean }> = ({ className, solid, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className} onClick={onClick}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.324h5.372a.562.562 0 01.328.97l-4.341 3.155a.563.563 0 00-.182.635l1.634 4.995a.563.563 0 01-.84.622l-4.34-3.155a.563.563 0 00-.652 0l-4.34 3.155a.563.563 0 01-.84-.622l1.634-4.995a.563.563 0 00-.182-.635L2.001 9.905a.562.562 0 01.328-.97h5.372a.563.563 0 00.475-.324L11.48 3.5z" />
  </svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 4.006 4.006 0 00-3.663-.137m12.964 4.596A3.996 3.996 0 0121 12c0 .778-.249 1.503-.684 2.098m-11.282 4.012A3.992 3.992 0 0112 21c1.232 0 2.453-.046 3.662-.137a4.006 4.006 0 003.7-3.7 4.006 4.006 0 00.137-3.663m-3.543 12.964A3.993 3.993 0 014.5 12c0-.778.249-1.503.684-2.098m11.282-4.012a3.992 3.992 0 00-3.543-3.543A3.992 3.992 0 0012 3c-1.232 0-2.453.046-3.662.137a4.006 4.006 0 00-3.7 3.7 4.006 4.006 0 00-.137 3.663M3.75 12h16.5m-16.5 0L8.25 16.5m-4.5-4.5L8.25 7.5" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

export const CertificateIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-8.25c-.621 0-1.125-.504-1.125-1.125V17.25m10.5 0C18.504 17.25 19.5 16.254 19.5 15V6.75c0-1.254-.996-2.25-2.25-2.25h-1.5MX7.5 17.25c-.621 0-1.125-.504-1.125-1.125V6.75c0-1.254.504-2.25 1.125-2.25H9M15 6.75V5.25c0-.621-.504-1.125-1.125-1.125H10.125c-.621 0-1.125.504-1.125 1.125V6.75m5.25 0h-4.5M15 6.75H9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 11.25l1.5 1.5 3-3M9 18h6" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 002.25 2.25 2.25 2.25 0 002.25-2.25A2.25 2.25 0 0012 12z" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const KettlebellIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {/* Handle */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7a5 5 0 016 0" /> {/* Top arc of handle */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7v3M15 7v3" /> {/* Sides of handle */}
    {/* Body */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 10c0-1 1-2 2-2h6c1 0 2 1 2 2v1c0 4-2 7-5 7s-5-3-5-7v-1z" />
    {/* Flat Base */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 18h8" />
  </svg>
);

export const StickFigureIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 100 4 2 2 0 000-4z" /> {/* Head */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5" /> {/* Torso */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3 3 3" /> {/* Arms */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l-2 5" /> {/* Left Leg */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13l2 5" /> {/* Right Leg */}
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.075 4.038A6.75 6.75 0 0112 3a6.75 6.75 0 011.925 1.038M10.075 4.038C8.787 4.773 7.5 6.28 7.5 8.25c0 2.344 1.963 4.25 4.5 4.25s4.5-1.906 4.5-4.25c0-1.97-1.287-3.477-3.075-4.212M10.075 4.038A6.723 6.723 0 0012 12.75a6.723 6.723 0 001.925-8.712M12 12.75v3.75m-1.125 2.625h2.25M9.75 19.125h4.5M12 19.125v1.125A2.625 2.625 0 019.375 22.5h-1.5a2.625 2.625 0 01-2.625-2.25V19.125m6.75 0v1.125a2.625 2.625 0 002.625 2.25h1.5a2.625 2.625 0 002.625-2.25V19.125" />
  </svg>
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12H8.375M15.75 12H15.875M12 12H12.125M4.5 12A7.5 7.5 0 0012 19.5A7.5 7.5 0 0019.5 12A7.5 7.5 0 0012 4.5A7.5 7.5 0 004.5 12z" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const WaveIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75s1.5-2 4.5-2 4.5 2 4.5 2S15.75 7.75 18.75 7.75s4.5 2 4.5 2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.75s1.5-2 4.5-2 4.5 2 4.5 2S15.75 11.75 18.75 11.75s4.5 2 4.5 2" />
  </svg>
);

export const DrinkIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6" /> {/* Base */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V12" /> {/* Stem */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5h13.5L12 12 5.25 7.5z" /> {/* Glass bowl */}
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 1.805.248 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.168.422.36 1.057.413 2.228.058 1.265.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.248 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.168-1.057.36-2.228.413-1.265.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-1.805-.248-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.168-.422-.36-1.057-.413-2.228-.058-1.265-.07-1.646-.07-4.85s.012-3.584.07-4.85c.055-1.17.248 1.805.413-2.227.217-.562.477.96.896-1.382.42-.419.819-.679 1.381-.896.422-.168 1.057.36 2.228-.413C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.473.012-4.68.067-1.064.049-1.63.227-1.98.377-.413.174-.717.397-.975.66-.258.26-.48.56-.66.976-.148.35-.327.915-.375 1.98C4.027 8.527 4.015 8.884 4.015 12s.012 3.473.067 4.68c.049 1.064.227 1.63.375 1.98.174.413.397.717.66.975.26.258.56.48.976.66.35.148.915.327 1.98.375 1.207.055 1.564.067 4.68.067s3.473-.012 4.68-.067c1.064-.049 1.63-.227 1.98-.375.413-.174.717-.397.975-.66.258-.26.48.56.66-.976.148-.35.327.915-.375-1.98.055-1.207.067-1.564.067-4.68s-.012-3.473-.067-4.68c-.049-1.064-.227-1.63-.375-1.98-.174-.413-.397-.717-.66-.975-.26-.258-.56-.48-.976-.66-.35-.148-.915-.327-1.98-.375C15.473 4.027 15.116 4.015 12 4.015zm0 2.712a5.273 5.273 0 100 10.546 5.273 5.273 0 000-10.546zm0 8.741a3.468 3.468 0 110-6.936 3.468 3.468 0 010 6.936zm4.783-8.349a1.237 1.237 0 100-2.474 1.237 1.237 0 000 2.474z" />
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.07 3.66 9.26 8.44 9.95v-7.03H7.9v-2.92h2.54V9.84c0-2.52 1.5-3.91 3.8-3.91 1.09 0 2.22.19 2.22.19v2.47h-1.26c-1.24 0-1.62.77-1.62 1.56v1.88h2.78l-.45 2.92h-2.33v7.03c4.78-.69 8.44-4.88 8.44-9.95C22 6.53 17.5 2.04 12 2.04z"/>
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const FootstepsIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 4.5A4.125 4.125 0 008.25 6H6a2.25 2.25 0 00-2.25 2.25v.75a2.25 2.25 0 00.938 1.801L7.5 12.75M12.75 4.5V12m0 0l1.532 2.298A3.375 3.375 0 0115 15.75V18a2.25 2.25 0 01-2.25 2.25h-.75a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 00-.938-1.801L7.5 12.75M11.25 19.5A4.125 4.125 0 0015.75 18H18a2.25 2.25 0 002.25-2.25v-.75a2.25 2.25 0 00-.938-1.801L16.5 11.25M11.25 19.5V12m0 0L9.718 9.702A3.375 3.375 0 019 8.25V6a2.25 2.25 0 012.25-2.25h.75A2.25 2.25 0 0114.25 6v1.5a2.25 2.25 0 00.938 1.801L16.5 11.25" />
  </svg>
);

export const HighFiveIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.226l2.907-2.907a2.25 2.25 0 013.182 0L16.5 15.226" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.093 7.553L5.625 4.086a1.5 1.5 0 00-2.121 2.121l3.468 3.468a1.5 1.5 0 002.121 0zM14.907 7.553l3.468-3.467a1.5 1.5 0 012.121 2.121l-3.468 3.468a1.5 1.5 0 01-2.121 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18c0-1.03.286-2.005.82-2.854M18 18c0-1.03-.286-2.005-.82-2.854" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.82 15.146A8.964 8.964 0 0112 13.5a8.964 8.964 0 015.18 1.646" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5V21" />
  </svg>
);

export const FistBumpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.5V7.5a2.25 2.25 0 00-2.25-2.25h-2.25a2.25 2.25 0 00-2.25 2.25V10.5m0 0h4.5m-4.5 0H6.75m0 0V15m3-4.5V15m3-4.5V15m3-4.5V15m0 0H15A2.25 2.25 0 0017.25 12.75V10.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.75c0 .966.784 1.75 1.75 1.75h.5A1.75 1.75 0 0013.75 18.75V15.75H9.75v3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75V10.5A2.25 2.25 0 019.75 8.25h4.5A2.25 2.25 0 0116.5 10.5v5.25" />
  </svg>
);

export const BicepIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v3.75m0 0V15m0-4.5H12m0 0h1.5m-1.5 0H9.75m1.5 0H15m0 0v4.5A2.25 2.25 0 0112.75 18h-1.5A2.25 2.25 0 019 15.75V10.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 10.5a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v3.75a2.25 2.25 0 002.25 2.25h.75M7.5 10.5H6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
  </svg>
);

export const CalendarDaysIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);