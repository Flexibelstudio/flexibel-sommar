
import React, { useState, useEffect, useRef } from 'react';
import { View, Level, AchievementDefinition, AchievementCategory, AchievementCheckData } from '../types';
import { APP_STRINGS, ACHIEVEMENT_DEFINITIONS, LEVEL_DEFINITIONS, WALKING_LEVEL_DEFINITIONS, WALKING_CHALLENGE_TOTAL_DAYS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, TrophyIcon, CheckCircleIcon, AcademicCapIcon, FootstepsIcon, StarIcon } from '../components/Icons';
import * as localStorageService from '../services/localStorageService';
import { getEarnedAchievementIds } from '../services/achievementService';
import { ProgressSparks } from '../components/ProgressSparks';
import { truncateText } from '../utils/textUtils';


interface AchievementsViewProps {
  onNavigate: (view: View) => void;
  userName: string | null;
  totalWorkoutsCompleted: number;
  currentWorkoutLevel: Level;
  walkingChallengeCurrentDay: number;
  currentWalkingChallengeLevel: Level | null;
  appShareCount: number;
}

type ActiveTabType = 'achievements' | 'workoutLevels' | 'walkingLevels';

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  onNavigate,
  userName,
  totalWorkoutsCompleted,
  currentWorkoutLevel,
  walkingChallengeCurrentDay,
  currentWalkingChallengeLevel,
  appShareCount,
}) => {
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);
  const [displayableAchievements, setDisplayableAchievements] = useState<AchievementDefinition[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('achievements');

  // State for workout level progress
  const [workoutProgressDetails, setWorkoutProgressDetails] = useState<{
    nextLevelName: string;
    workoutsToNext: number;
    progressPercentage: number;
  } | null>(null);
  const [workoutSparkKey, setWorkoutSparkKey] = useState(0);
  const prevWorkoutProgressPercentageRef = useRef<number>(0);

  // State for walking level progress
  const [walkingProgressDetails, setWalkingProgressDetails] = useState<{
    nextLevel: Level | null;
    daysToNext: number;
    progressPercentage: number;
  } | null>(null);
  const [walkingSparkKey, setWalkingSparkKey] = useState(0);
  const prevWalkingProgressPercentageRef = useRef<number>(0);


  useEffect(() => {
    const achievementCheckData: AchievementCheckData = {
      workoutLog: localStorageService.getWorkoutLog(),
      walkingLog: localStorageService.getWalkingLog(),
      favoriteWorkoutIds: localStorageService.getFavoriteWorkoutIds(),
      currentWorkoutLevel: currentWorkoutLevel,
      currentWalkingLevel: currentWalkingChallengeLevel,
      totalWorkoutsCompleted: totalWorkoutsCompleted,
      totalWalkingDaysCompleted: walkingChallengeCurrentDay,
      currentWorkoutStreak: localStorageService.getWorkoutStreak(),
      currentWalkingStreak: localStorageService.getWalkingChallengeStreak(),
      appShareCount: appShareCount,
    };
    const earnedIds = getEarnedAchievementIds(achievementCheckData);
    setEarnedAchievementIds(earnedIds);

    const superstarAchId = "engage_sharer_4_superstar";
    const superstarModalShown = localStorageService.hasFourthShareEasterEggBeenShown();
    const filteredAchievements = ACHIEVEMENT_DEFINITIONS.filter(ach => {
      if (ach.id === superstarAchId) {
        return earnedIds.includes(superstarAchId) || superstarModalShown;
      }
      return true;
    });
    setDisplayableAchievements(filteredAchievements);

    // Workout Level Progress Calculation
    if (currentWorkoutLevel) {
      const currentWorkoutLvlIdx = LEVEL_DEFINITIONS.findIndex(l => l.name === currentWorkoutLevel.name);
      const nextWorkoutLvlDef = (currentWorkoutLvlIdx !== -1 && currentWorkoutLvlIdx < LEVEL_DEFINITIONS.length - 1)
        ? LEVEL_DEFINITIONS[currentWorkoutLvlIdx + 1]
        : null;
      let calculatedWorkoutProgress = 0;
      if (nextWorkoutLvlDef && nextWorkoutLvlDef.minWorkouts !== undefined && currentWorkoutLevel.minWorkouts !== undefined) {
        const workoutsNeeded = nextWorkoutLvlDef.minWorkouts - currentWorkoutLevel.minWorkouts;
        const workoutsMade = totalWorkoutsCompleted - currentWorkoutLevel.minWorkouts;
        if (totalWorkoutsCompleted >= nextWorkoutLvlDef.minWorkouts) calculatedWorkoutProgress = 100;
        else if (workoutsNeeded > 0) calculatedWorkoutProgress = Math.max(0, Math.min(100, (workoutsMade / workoutsNeeded) * 100));
        setWorkoutProgressDetails({
          nextLevelName: nextWorkoutLvlDef.name,
          workoutsToNext: Math.max(0, nextWorkoutLvlDef.minWorkouts - totalWorkoutsCompleted),
          progressPercentage: calculatedWorkoutProgress
        });
      } else {
        setWorkoutProgressDetails(null);
      }
      if (calculatedWorkoutProgress > prevWorkoutProgressPercentageRef.current && calculatedWorkoutProgress < 100) {
        setWorkoutSparkKey(prev => prev + 1);
      }
      prevWorkoutProgressPercentageRef.current = calculatedWorkoutProgress;
    }

    // Walking Level Progress Calculation
    if (currentWalkingChallengeLevel) {
      const currentWalkingLvlIdx = WALKING_LEVEL_DEFINITIONS.findIndex(l => l.name === currentWalkingChallengeLevel.name);
      const nextWalkingLvlDefConst = (currentWalkingLvlIdx !== -1 && currentWalkingLvlIdx < WALKING_LEVEL_DEFINITIONS.length - 1)
        ? WALKING_LEVEL_DEFINITIONS[currentWalkingLvlIdx + 1]
        : null;
      let calculatedWalkingProgress = 0;
      if (nextWalkingLvlDefConst && nextWalkingLvlDefConst.minDays !== undefined && currentWalkingChallengeLevel.minDays !== undefined) {
        const daysNeeded = nextWalkingLvlDefConst.minDays - currentWalkingChallengeLevel.minDays;
        const daysMade = walkingChallengeCurrentDay - currentWalkingChallengeLevel.minDays;
        if (walkingChallengeCurrentDay >= nextWalkingLvlDefConst.minDays) calculatedWalkingProgress = 100;
        else if (daysNeeded > 0) calculatedWalkingProgress = Math.max(0, Math.min(100, (daysMade / daysNeeded) * 100));
        setWalkingProgressDetails({
          nextLevel: nextWalkingLvlDefConst,
          daysToNext: Math.max(0, nextWalkingLvlDefConst.minDays - walkingChallengeCurrentDay),
          progressPercentage: calculatedWalkingProgress
        });
      } else {
        setWalkingProgressDetails(null);
      }
      if (calculatedWalkingProgress > prevWalkingProgressPercentageRef.current && calculatedWalkingProgress < 100) {
        setWalkingSparkKey(prev => prev + 1);
      }
      prevWalkingProgressPercentageRef.current = calculatedWalkingProgress;
    }

  }, [
    totalWorkoutsCompleted, currentWorkoutLevel,
    walkingChallengeCurrentDay, currentWalkingChallengeLevel,
    appShareCount
  ]);

  const groupAchievementsByCategory = () => {
    const grouped: { [key in AchievementCategory]?: AchievementDefinition[] } = {};
    displayableAchievements.forEach(ach => {
      if (!grouped[ach.category]) grouped[ach.category] = [];
      grouped[ach.category]!.push(ach);
    });
    return grouped;
  };
  const groupedAchievements = groupAchievementsByCategory();
  const categoryOrder: AchievementCategory[] = [
    AchievementCategory.TRAINING, AchievementCategory.WALKING, AchievementCategory.ENGAGEMENT,
  ];

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      {categoryOrder.map(category => (
        groupedAchievements[category] && groupedAchievements[category]!.length > 0 && (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">{category}</h3>
            <div className="space-y-3">
              {groupedAchievements[category]!.map(ach => {
                const isEarned = earnedAchievementIds.includes(ach.id);
                const IconComponent = ach.icon;
                return (
                  <div
                    key={ach.id}
                    className={`flex items-start p-3 rounded-lg border transition-all ${isEarned ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 opacity-70'}`}
                    title={!isEarned ? APP_STRINGS.achievementLockedTooltip : ach.description}
                  >
                    <div className={`mr-3 mt-1 ${isEarned ? 'text-green-500' : 'text-gray-400'}`}>
                      {isEarned ? <CheckCircleIcon className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${isEarned ? 'text-green-700' : 'text-gray-600'}`}>{ach.name}</p>
                      <p className={`text-sm ${isEarned ? 'text-green-600' : 'text-gray-500'}`}>{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}
      {displayableAchievements.length === 0 && ACHIEVEMENT_DEFINITIONS.length > 0 && (
        <p className="text-gray-600 text-center">Inga utmärkelser synliga just nu. Fortsätt kämpa!</p>
      )}
      {ACHIEVEMENT_DEFINITIONS.length === 0 && (
        <p className="text-gray-600 text-center">Inga utmärkelser definierade ännu.</p>
      )}
    </div>
  );

  const renderWorkoutLevelsTab = () => (
    currentWorkoutLevel ? (
      <div className="space-y-4">
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <p className="text-lg text-gray-700 mb-1">
            Din nuvarande träningsnivå: <span className="font-bold text-[#51A1A1]">{currentWorkoutLevel.name}</span>
          </p>
          {workoutProgressDetails && workoutProgressDetails.workoutsToNext > 0 && (
            <>
              <p className="text-sm text-indigo-600 mt-2 mb-1">
                {APP_STRINGS.workoutsToNextLevelText
                  .replace('{count}', workoutProgressDetails.workoutsToNext.toString())
                  .replace('{levelName}', workoutProgressDetails.nextLevelName)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${workoutProgressDetails.progressPercentage}%` }}
                ></div>
                <ProgressSparks key={workoutSparkKey} percentage={workoutProgressDetails.progressPercentage} sparkColor="bg-indigo-300" />
              </div>
            </>
          )}
          {!workoutProgressDetails && LEVEL_DEFINITIONS.findIndex(l => l.name === currentWorkoutLevel.name) === LEVEL_DEFINITIONS.length - 1 && (
            <p className="text-sm font-semibold text-yellow-500 mt-2 flex items-center">
              <StarIcon className="w-5 h-5 mr-1 text-yellow-400" solid />
              {APP_STRINGS.maxLevelReachedText}
            </p>
          )}
        </div>
        {LEVEL_DEFINITIONS.map(level => {
          const isAchieved = totalWorkoutsCompleted >= (level.minWorkouts ?? 0);
          const isCurrent = level.name === currentWorkoutLevel.name;
          const baseClass = isCurrent ? 'bg-[#51A1A1] text-white ring-2 ring-offset-1 ring-[#418484]' : isAchieved ? 'bg-green-100 text-green-800 border-green-300' : 'bg-white text-gray-700 border-gray-200';
          return (
            <div key={`wl-${level.name}`} className={`p-4 rounded-lg shadow ${baseClass}`}>
              <div className="flex items-center mb-1">
                {isAchieved && <CheckCircleIcon className={`w-6 h-6 mr-2 ${isCurrent ? 'text-white' : 'text-green-500'}`} />}
                <h3 className={`text-xl font-semibold ${isCurrent ? 'text-white' : (isAchieved ? 'text-green-700' : 'text-[#418484]')}`}>{level.name}</h3>
              </div>
              {level.description && <p className={`text-sm ${isCurrent ? 'text-gray-200' : (isAchieved ? 'text-green-600' : 'text-gray-600')}`}>{level.description}</p>}
              <p className={`text-xs mt-1 ${isCurrent ? 'text-gray-300' : (isAchieved ? 'text-green-500' : 'text-gray-500')}`}>
                (Kräver minst {level.minWorkouts ?? 0} pass)
              </p>
            </div>
          );
        })}
      </div>
    ) : <p className="text-center text-gray-500">Laddar träningsnivåer...</p>
  );

  const renderWalkingLevelsTab = () => (
    currentWalkingChallengeLevel ? (
      <div className="space-y-4">
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
          <p className="text-lg text-gray-700 mb-1">
            Din nuvarande gångnivå: <span className="font-bold text-purple-600">{currentWalkingChallengeLevel.name}</span>
          </p>
          <p className="text-sm text-gray-600">
            Dagar avklarade: {walkingChallengeCurrentDay} av {WALKING_CHALLENGE_TOTAL_DAYS}
          </p>
          {walkingProgressDetails && walkingProgressDetails.nextLevel && walkingProgressDetails.daysToNext > 0 && (
            <>
              <p className="text-sm text-purple-600 mt-2 mb-1">
                {APP_STRINGS.daysToNextWalkingLevelText
                  .replace('{count}', walkingProgressDetails.daysToNext.toString())
                  .replace('{levelName}', walkingProgressDetails.nextLevel.name)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                <div
                  className="bg-purple-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${walkingProgressDetails.progressPercentage}%` }}
                ></div>
                <ProgressSparks key={walkingSparkKey} percentage={walkingProgressDetails.progressPercentage} sparkColor="bg-purple-300" />
              </div>
            </>
          )}
           {!walkingProgressDetails?.nextLevel && walkingChallengeCurrentDay >= WALKING_CHALLENGE_TOTAL_DAYS && (
            <p className="text-sm font-semibold text-yellow-500 mt-2 flex items-center">
              <StarIcon className="w-5 h-5 mr-1 text-yellow-400" solid />
              {APP_STRINGS.walkingChallengeMaxLevelReachedText}
            </p>
          )}
        </div>
        {WALKING_LEVEL_DEFINITIONS.map(level => {
          const isAchieved = walkingChallengeCurrentDay >= (level.minDays ?? 0);
          const isCurrent = level.name === currentWalkingChallengeLevel.name;
          const baseClass = isCurrent ? 'bg-purple-500 text-white ring-2 ring-offset-1 ring-purple-600' : isAchieved ? 'bg-green-100 text-green-800 border-green-300' : 'bg-white text-gray-700 border-gray-200';
          return (
            <div key={`pl-${level.name}`} className={`p-4 rounded-lg shadow ${baseClass}`}>
              <div className="flex items-center mb-1">
                {isAchieved && <CheckCircleIcon className={`w-6 h-6 mr-2 ${isCurrent ? 'text-white' : 'text-green-500'}`} />}
                <h3 className={`text-xl font-semibold ${isCurrent ? 'text-white' : (isAchieved ? 'text-green-700' : 'text-sky-700')}`}>{level.name}</h3>
              </div>
              {level.description && <p className={`text-sm ${isCurrent ? 'text-purple-200' : (isAchieved ? 'text-green-600' : 'text-gray-600')}`}>{level.description}</p>}
              <p className={`text-xs mt-1 ${isCurrent ? 'text-purple-300' : (isAchieved ? 'text-green-500' : 'text-gray-500')}`}>
                (Kräver minst {level.minDays ?? 0} dagar)
              </p>
            </div>
          );
        })}
      </div>
    ) : <p className="text-center text-gray-500">Laddar promenadnivåer...</p>
  );

  const tabButtonBaseStyle = "px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out flex-grow";
  const activeTabStyle = "bg-[#51A1A1] text-white focus:ring-[#62BDBD]";
  const inactiveTabStyle = "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";

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
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 flex items-center justify-center">
          <TrophyIcon className="w-8 h-8 mr-3 text-yellow-500" />
          Status & Utmärkelser
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 w-full max-w-lg mx-auto mb-8">
        <div className="flex space-x-2 sm:space-x-3 mb-6 border-b pb-4">
          <button 
            onClick={() => setActiveTab('achievements')} 
            className={`${tabButtonBaseStyle} ${activeTab === 'achievements' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeTab === 'achievements'}
          >
            Utmärkelser
          </button>
          <button 
            onClick={() => setActiveTab('workoutLevels')} 
            className={`${tabButtonBaseStyle} ${activeTab === 'workoutLevels' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeTab === 'workoutLevels'}
          >
            Träningsnivåer
          </button>
          <button 
            onClick={() => setActiveTab('walkingLevels')} 
            className={`${tabButtonBaseStyle} ${activeTab === 'walkingLevels' ? activeTabStyle : inactiveTabStyle}`}
            aria-pressed={activeTab === 'walkingLevels'}
          >
            Promenadnivåer
          </button>
        </div>

        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'workoutLevels' && renderWorkoutLevelsTab()}
        {activeTab === 'walkingLevels' && renderWalkingLevelsTab()}
      </div>
    </div>
  );
};
