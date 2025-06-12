import React, { useEffect, useState, useRef } from 'react';
import { View, Level } from '../types';
import { APP_STRINGS, LEVEL_DEFINITIONS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, AcademicCapIcon, StarIcon, CheckCircleIcon } from '../components/Icons'; 
import { ProgressSparks } from '../components/ProgressSparks'; // Import ProgressSparks

interface LevelSystemViewProps {
  onNavigate: (view: View) => void;
  userName: string | null;
  totalWorkoutsCompleted: number;
  currentLevel: Level; 
}

export const LevelSystemView: React.FC<LevelSystemViewProps> = ({
  onNavigate,
  userName,
  totalWorkoutsCompleted,
  currentLevel,
}) => {
  
  const [workoutProgressDetails, setWorkoutProgressDetails] = useState<{
    nextLevelName: string;
    workoutsToNext: number;
    progressPercentage: number;
  } | null>(null);

  const [sparkKey, setSparkKey] = useState(0);
  const prevProgressPercentageRef = useRef<number>(0);

  useEffect(() => {
    if (currentLevel) {
      const currentWorkoutLevelIndex = LEVEL_DEFINITIONS.findIndex(l => l.name === currentLevel.name);
      const nextWorkoutLevelDefinition = (currentWorkoutLevelIndex !== -1 && currentWorkoutLevelIndex < LEVEL_DEFINITIONS.length - 1)
        ? LEVEL_DEFINITIONS[currentWorkoutLevelIndex + 1]
        : null;

      let calculatedProgressPercentage = 0;
      if (nextWorkoutLevelDefinition && nextWorkoutLevelDefinition.minWorkouts !== undefined && currentLevel.minWorkouts !== undefined) {
        const workoutsNeededForNextSpan = nextWorkoutLevelDefinition.minWorkouts - currentLevel.minWorkouts;
        const workoutsMadeInCurrentSpan = totalWorkoutsCompleted - currentLevel.minWorkouts;
        
        if (totalWorkoutsCompleted >= nextWorkoutLevelDefinition.minWorkouts) {
            calculatedProgressPercentage = 100;
        } else if (workoutsNeededForNextSpan > 0) {
            calculatedProgressPercentage = Math.max(0, Math.min(100, (workoutsMadeInCurrentSpan / workoutsNeededForNextSpan) * 100));
        }
        setWorkoutProgressDetails({
          nextLevelName: nextWorkoutLevelDefinition.name,
          workoutsToNext: Math.max(0, nextWorkoutLevelDefinition.minWorkouts - totalWorkoutsCompleted),
          progressPercentage: calculatedProgressPercentage,
        });
      } else {
        setWorkoutProgressDetails(null); // Max level reached or issue with definitions
      }

      if (calculatedProgressPercentage > prevProgressPercentageRef.current && calculatedProgressPercentage < 100) {
        setSparkKey(prev => prev + 1);
      }
      prevProgressPercentageRef.current = calculatedProgressPercentage;
    }
  }, [totalWorkoutsCompleted, currentLevel]);

  const getLevelRequirementText = (level: Level): string | JSX.Element | null => {
    const isCurrent = currentLevel && level.name === currentLevel.name;
    const isAchieved = totalWorkoutsCompleted >= (level.minWorkouts ?? 0);

    if (isAchieved && !isCurrent) { // Achieved but not current (past level)
      return <CheckCircleIcon className="w-7 h-7 text-green-500" />;
    }

    if (isCurrent) {
      // For "Nybörjare" (first level), never show (X/Y pass) text. It's current and achieved.
      // Return a checkmark as it's achieved.
      if (level.name === LEVEL_DEFINITIONS[0].name) {
        return <CheckCircleIcon className="w-7 h-7 text-green-500" />;
      }

      // For other current levels, display progress if there's a next level
      if (workoutProgressDetails && level.minWorkouts !== undefined && workoutProgressDetails.nextLevelName) {
        const nextLevelDef = LEVEL_DEFINITIONS.find(l => l.name === workoutProgressDetails.nextLevelName);
        if (nextLevelDef && nextLevelDef.minWorkouts !== undefined) {
            const progressInLevel = totalWorkoutsCompleted - (level.minWorkouts ?? 0);
            // Denominator should be the span of workouts for the current level towards the next
            const spanOfLevelDenominator: number = nextLevelDef.minWorkouts - level.minWorkouts;

            if (spanOfLevelDenominator > 0 && totalWorkoutsCompleted < nextLevelDef.minWorkouts) {
                return `(${progressInLevel}/${spanOfLevelDenominator} pass)`;
            } else { // Reached or exceeded requirement for next level, or no clear span
               return <CheckCircleIcon className="w-7 h-7 text-green-500" />;
            }
        }
      }
      // Default for current level if no specific progress text (e.g. max level reached and it's current)
      return <CheckCircleIcon className="w-7 h-7 text-green-500" />;
    }
    
    // Future level (not achieved, not current) - return null to remove the "(X pass)"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#418484] flex items-center justify-center">
            <AcademicCapIcon className="w-8 h-8 mr-3 text-[#51A1A1]" />
            {APP_STRINGS.workoutLevelSystemTitle}
        </h1>
      </div>
      

      <section className="mb-10">
       {currentLevel ? (
        <div className="mb-6 p-4 bg-white shadow-lg rounded-xl border border-gray-200">
            <p className="text-2xl text-gray-700 mb-1">
            Din nuvarande träningsnivå: <span className="font-bold text-[#51A1A1] text-2xl">{currentLevel.name}</span>
            </p>
            {workoutProgressDetails && workoutProgressDetails.workoutsToNext > 0 && (
            <>
                <p className="text-lg text-indigo-600 mt-2 mb-1">
                {APP_STRINGS.workoutsToNextLevelText
                    .replace('{count}', workoutProgressDetails.workoutsToNext.toString())
                    .replace('{levelName}', workoutProgressDetails.nextLevelName)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden"> {/* Added relative and overflow-hidden */}
                <div
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${workoutProgressDetails.progressPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={workoutProgressDetails.progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Framsteg till nästa träningsnivå: ${workoutProgressDetails.progressPercentage.toFixed(0)}%`}
                ></div>
                  <ProgressSparks
                    key={sparkKey}
                    percentage={workoutProgressDetails.progressPercentage}
                    sparkColor="bg-indigo-300"
                  />
                </div>
            </>
            )}
            {workoutProgressDetails && workoutProgressDetails.workoutsToNext === 0 && LEVEL_DEFINITIONS.findIndex(l => l.name === currentLevel.name) < LEVEL_DEFINITIONS.length -1 && (
                 <p className="text-lg font-semibold text-indigo-500 mt-2 flex items-center">
                    <CheckCircleIcon className="w-6 h-6 mr-1 text-green-500" />
                    Redo för nästa nivå: {workoutProgressDetails.nextLevelName}!
                 </p>
            )}
            {!workoutProgressDetails && LEVEL_DEFINITIONS.findIndex(l => l.name === currentLevel.name) === LEVEL_DEFINITIONS.length -1 && (
                <p className="text-lg font-semibold text-yellow-500 mt-2 flex items-center">
                    <StarIcon className="w-6 h-6 mr-1 text-yellow-400" solid />
                    {APP_STRINGS.maxLevelReachedText}
                </p>
            )}
        </div>
        ) : (
          <p className="text-center text-gray-500">Laddar nivåinformation...</p>
        )}
        <div className="space-y-4">
            {LEVEL_DEFINITIONS.map((level) => {
            const isCurrent = currentLevel && level.name === currentLevel.name;
            const isAchieved = totalWorkoutsCompleted >= (level.minWorkouts ?? 0);
            const requirementInfo = getLevelRequirementText(level);
            const isRequirementIcon = requirementInfo !== null && typeof requirementInfo !== 'string';

            const baseDivClass = isCurrent ? 'bg-[#51A1A1] text-white ring-2 ring-offset-1 ring-[#418484]' : 
                                 isAchieved ? 'bg-green-100 text-green-800 border border-green-300' : 
                                              'bg-white text-gray-700 border border-gray-200 hover:shadow-md';
            const titleColorClass = isCurrent ? 'text-white' : isAchieved ? 'text-green-700' : 'text-[#418484]';
            
            let requirementDisplayNode = null;
            if (requirementInfo) {
                if (isRequirementIcon) {
                    requirementDisplayNode = <span className="inline-flex items-center mr-2">{requirementInfo}</span>;
                } else { // It's a string like (X/Y pass)
                    const requirementColorClass = isCurrent ? 'text-gray-100' : 'text-green-600'; 
                    requirementDisplayNode = <div className={`text-3xl ${requirementColorClass}`}>{requirementInfo}</div>;
                }
            }

            const descriptionColorClass = isCurrent ? 'text-gray-200' : isAchieved ? 'text-green-700' : 'text-gray-600';

            return (
                <div
                  key={`workout-${level.name}`}
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
      </section>
    </div>
  );
};
