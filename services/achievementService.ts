// services/achievementService.ts
import { ACHIEVEMENT_DEFINITIONS } from '../constants';
import { AchievementDefinition, AchievementCheckData } from '../types';

/**
 * Determines which achievements have been earned by the user.
 * @param checkData - The user's current progress data.
 * @returns An array of IDs of the earned achievements.
 */
export const getEarnedAchievementIds = (checkData: AchievementCheckData): string[] => {
  const earnedIds: string[] = [];
  ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
    if (achievement.isAchieved(checkData)) {
      earnedIds.push(achievement.id);
    }
  });
  return earnedIds;
};