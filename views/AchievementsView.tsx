
import React, { useState, useEffect } from 'react';
import { View, Level, AchievementDefinition, AchievementCategory, AchievementCheckData } from '../types';
import { APP_STRINGS, ACHIEVEMENT_DEFINITIONS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, TrophyIcon, CheckCircleIcon } from '../components/Icons';
import * as localStorageService from '../services/localStorageService';
import { getEarnedAchievementIds } from '../services/achievementService';

interface AchievementsViewProps {
  onNavigate: (view: View) => void;
  userName: string | null;
  totalWorkoutsCompleted: number;
  currentWorkoutLevel: Level;
  walkingChallengeCurrentDay: number;
  currentWalkingChallengeLevel: Level | null;
  appShareCount: number; // Added for conditional display
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  onNavigate,
  userName,
  totalWorkoutsCompleted,
  currentWorkoutLevel,
  walkingChallengeCurrentDay,
  currentWalkingChallengeLevel,
  appShareCount, // Consumed prop
}) => {
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);
  const [displayableAchievements, setDisplayableAchievements] = useState<AchievementDefinition[]>([]);

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
      appShareCount: appShareCount, // Use prop here for checkData
    };
    const earnedIds = getEarnedAchievementIds(achievementCheckData);
    setEarnedAchievementIds(earnedIds);

    // Filter achievements for display
    const filtered = ACHIEVEMENT_DEFINITIONS.filter(ach => {
      if (ach.id === 'engage_sharer_4_superstar') {
        // Show if share count is >= 4 OR if it's already earned (e.g. from a previous version)
        return appShareCount >= 4 || earnedIds.includes('engage_sharer_4_superstar');
      }
      return true; // Include all other achievements
    });
    setDisplayableAchievements(filtered);

  }, [
    totalWorkoutsCompleted,
    currentWorkoutLevel,
    walkingChallengeCurrentDay,
    currentWalkingChallengeLevel,
    appShareCount, // Add appShareCount to dependency array
  ]);

  const groupAchievementsByCategory = () => {
    const grouped: { [key in AchievementCategory]?: AchievementDefinition[] } = {};
    displayableAchievements.forEach(ach => { // Use displayableAchievements
      if (!grouped[ach.category]) {
        grouped[ach.category] = [];
      }
      grouped[ach.category]!.push(ach);
    });
    return grouped;
  };
  const groupedAchievements = groupAchievementsByCategory();
  const categoryOrder: AchievementCategory[] = [
    AchievementCategory.TRAINING,
    AchievementCategory.WALKING,
    AchievementCategory.ENGAGEMENT,
  ];

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
          {APP_STRINGS.profileAchievementsTitle}
        </h1>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mx-auto mb-8">
        {categoryOrder.map(category => (
          groupedAchievements[category] && groupedAchievements[category]!.length > 0 && (
            <div key={category} className="mb-6">
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
    </div>
  );
};
