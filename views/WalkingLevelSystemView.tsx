import React, { useState, useEffect, useRef } from 'react';
import { View, Level } from '../types';
import { APP_STRINGS, WALKING_LEVEL_DEFINITIONS, WALKING_CHALLENGE_TOTAL_DAYS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, FootstepsIcon, StarIcon, CheckCircleIcon } from '../components/Icons'; 
import { ProgressSparks } from '../components/ProgressSparks'; // Import ProgressSparks

interface WalkingLevelSystemViewProps {
  onNavigate: (view: View) => void;
  userName: string | null;
  totalWalkingDaysCompleted: number;
  currentWalkingLevelProp: Level | null; 
}

export const WalkingLevelSystemView: React.FC<WalkingLevelSystemViewProps> = ({
  onNavigate,
  userName,
  totalWalkingDaysCompleted,
  currentWalkingLevelProp,
}) => {
  const [nextWalkingLevelDetails, setNextWalkingLevelDetails] = useState<{
    nextLevel: Level | null;
    daysToNext: number;
    progressPercentage: number;
  } | null>(null);

  const [sparkKey, setSparkKey] = useState(0);
  const prevProgressPercentageRef = useRef<number>(0);

  useEffect(() => {
    if (currentWalkingLevelProp) {
      const currentLvlIdx = WALKING_LEVEL_DEFINITIONS.findIndex(l => l.name === currentWalkingLevelProp.name);
      const nextLvlDef = (currentLvlIdx !== -1 && currentLvlIdx < WALKING_LEVEL_DEFINITIONS.length - 1)
        ? WALKING_LEVEL_DEFINITIONS[currentLvlIdx + 1]
        : null;
      
      let calculatedProgressPercentage = 0;
      if (nextLvlDef && nextLvlDef.minDays !== undefined && currentWalkingLevelProp.minDays !== undefined) {
        const daysNeededForNextSpan = nextLvlDef.minDays - currentWalkingLevelProp.minDays;
        const daysMadeInCurrentSpan = totalWalkingDaysCompleted - currentWalkingLevelProp.minDays;
        
        if (totalWalkingDaysCompleted >= nextLvlDef.minDays) {
            calculatedProgressPercentage = 100;
        } else if (daysNeededForNextSpan > 0) {
            calculatedProgressPercentage = Math.max(0, Math.min(100, (daysMadeInCurrentSpan / daysNeededForNextSpan) * 100));
        }
        
        setNextWalkingLevelDetails({
          nextLevel: nextLvlDef,
          daysToNext: Math.max(0, nextLvlDef.minDays - totalWalkingDaysCompleted),
          progressPercentage: calculatedProgressPercentage,
        });
      } else {
        setNextWalkingLevelDetails(null); 
      }

      if (calculatedProgressPercentage > prevProgressPercentageRef.current && calculatedProgressPercentage < 100) {
        setSparkKey(prev => prev + 1);
      }
      prevProgressPercentageRef.current = calculatedProgressPercentage;
    }
  }, [totalWalkingDaysCompleted, currentWalkingLevelProp]);

  const getLevelRequirementText = (level: Level): string | JSX.Element | null => {
    const isAchieved = totalWalkingDaysCompleted >= (level.minDays ?? 0);

    if (isAchieved) { // Covers past achieved AND current level (which is also achieved)
      return <CheckCircleIcon className="w-7 h-7 text-green-500" />;
    }
    // Future level (not achieved, not current)
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-800">
      <div className="w-full flex justify-start mt-2 mb-3">
        <Button
            onClick={() => onNavigate(View.Home)}
            variant="ghost"
            className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
            aria-label={APP_STRINGS.backToHome}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{APP_STRINGS.backToHome}</span>
        </Button>
      </div>
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center justify-center">
            <FootstepsIcon className="w-8 h-8 mr-3 text-sky-500" />
            {APP_STRINGS.walkingLevelSystemViewTitle}
        </h1>
      </div>

      <section>
        {currentWalkingLevelProp ? (
          <>
            <div className="mb-6 p-4 bg-white shadow-lg rounded-xl border border-gray-200">
                <p className="text-2xl text-gray-700 mb-1">
                    Din nuvarande gångnivå: <span className="font-bold text-purple-600 break-words text-2xl">{currentWalkingLevelProp.name}</span>
                </p>
                <p className="text-lg text-gray-600 mb-1">
                    Dagar avklarade: {totalWalkingDaysCompleted} av {WALKING_CHALLENGE_TOTAL_DAYS}
                </p>
                {nextWalkingLevelDetails && nextWalkingLevelDetails.nextLevel && nextWalkingLevelDetails.daysToNext > 0 && (
                <>
                    <p className="text-lg text-purple-600 mt-2 mb-1">
                    {APP_STRINGS.daysToNextWalkingLevelText
                        .replace('{count}', nextWalkingLevelDetails.daysToNext.toString())
                        .replace('{levelName}', nextWalkingLevelDetails.nextLevel.name)}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden"> {/* Added relative and overflow-hidden */}
                    <div
                        className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${nextWalkingLevelDetails.progressPercentage}%` }}
                        role="progressbar"
                        aria-valuenow={nextWalkingLevelDetails.progressPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Framsteg till nästa gångnivå: ${nextWalkingLevelDetails.progressPercentage.toFixed(0)}%`}
                    ></div>
                      <ProgressSparks
                        key={sparkKey}
                        percentage={nextWalkingLevelDetails.progressPercentage}
                        sparkColor="bg-purple-300"
                      />
                    </div>
                </>
                )}
                {nextWalkingLevelDetails && nextWalkingLevelDetails.daysToNext === 0 && nextWalkingLevelDetails.nextLevel && (
                    <p className="text-lg font-semibold text-purple-500 mt-2 flex items-center">
                        <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />
                        Redo för nästa nivå: {nextWalkingLevelDetails.nextLevel.name}!
                    </p>
                )}
                 {!nextWalkingLevelDetails?.nextLevel && totalWalkingDaysCompleted >= WALKING_CHALLENGE_TOTAL_DAYS && (
                    <p className="text-lg font-semibold text-yellow-500 mt-2 flex items-center">
                        <StarIcon className="w-6 h-6 mr-1 text-yellow-400" solid />
                        {APP_STRINGS.walkingChallengeMaxLevelReachedText}
                    </p>
                )}
            </div>
            <div className="space-y-4">
                {WALKING_LEVEL_DEFINITIONS.map((level) => {
                const isCurrent = currentWalkingLevelProp && level.name === currentWalkingLevelProp.name;
                const isAchieved = totalWalkingDaysCompleted >= (level.minDays ?? 0);
                const requirementInfo = getLevelRequirementText(level);
                const isRequirementIcon = requirementInfo !== null && typeof requirementInfo !== 'string';

                const baseDivClass = isCurrent ? 'bg-purple-500 text-white ring-2 ring-offset-1 ring-purple-600' : 
                                     isAchieved ? 'bg-green-100 text-green-800 border border-green-300' : 
                                                  'bg-white text-gray-700 border border-gray-200 hover:shadow-md';
                const titleColorClass = isCurrent ? 'text-white' : isAchieved ? 'text-green-700' : 'text-sky-700';
                
                let requirementDisplayNode = null;
                if (requirementInfo) {
                  if (isRequirementIcon) {
                    requirementDisplayNode = <span className="inline-flex items-center mr-2">{requirementInfo}</span>;
                  } else {
                    // This case should not happen for Walking Levels with the new getLevelRequirementText logic
                    const requirementColorClass = isCurrent ? 'text-purple-100' : 'text-green-600';
                    requirementDisplayNode = <div className={`text-3xl ${requirementColorClass}`}>{requirementInfo}</div>;
                  }
                }
                
                const descriptionColorClass = isCurrent ? 'text-purple-200' : isAchieved ? 'text-green-700' : 'text-gray-600';

                return (
                    <div
                      key={`walking-${level.name}`}
                      className={`p-5 rounded-lg shadow transition-all duration-300 ${baseDivClass}`}
                    >
                      <div className="flex flex-wrap items-center mb-1"> 
                        <h3 className={`text-3xl font-semibold mr-3 ${titleColorClass} flex items-center`}>
                           {isRequirementIcon && requirementDisplayNode}
                          {level.name}
                        </h3>
                        {!isRequirementIcon && requirementDisplayNode}
                      </div>
                      {level.description && (
                        <p className={`mt-1 text-xl ${descriptionColorClass}`}>
                          {level.description}
                        </p>
                      )}
                    </div>
                );
                })}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">Laddar data för Gå-Utmaningen...</p>
        )}
      </section>
    </div>
  );
};
