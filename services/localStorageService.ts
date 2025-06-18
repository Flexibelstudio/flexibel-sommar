// services/localStorageService.ts

// Keys needed for the functions below
const APP_SHARE_COUNT_KEY = 'flexibelHalsostudioAppShareCount';
const FOURTH_SHARE_EASTER_EGG_SHOWN_KEY = 'flexibelHalsostudioFourthShareEasterEggShown';
const WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY = 'flexibelHalsostudioWalkingLastDate';

// --- App Share Count ---
export const getAppShareCount = (): number => {
  const count = localStorage.getItem(APP_SHARE_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementAppShareCount = (): void => {
  const currentCount = getAppShareCount();
  localStorage.setItem(APP_SHARE_COUNT_KEY, (currentCount + 1).toString());
};

// --- Fourth Share Easter Egg Modal Shown ---
export const hasFourthShareEasterEggBeenShown = (): boolean => {
  return localStorage.getItem(FOURTH_SHARE_EASTER_EGG_SHOWN_KEY) === 'true';
};

// Exporting the function as named in the import statement of HomeView.tsx
export const setFourthShareEasterEggBeenShown = (): void => {
  localStorage.setItem(FOURTH_SHARE_EASTER_EGG_SHOWN_KEY, 'true');
};

// --- Walking Challenge Last Completion Date ---
// This is an internal helper for isTodayWalkCompleted, not directly exported if not needed elsewhere by name.
// However, to keep it simple and potentially useful for other modules if they import *, we can export it.
// For strict minimality for HomeView's named imports, it could be unexported.
// Given App.tsx uses import *, exporting it is safer.
export const getWalkingChallengeLastCompletionDate = (): string | null => {
  return localStorage.getItem(WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY);
};

// --- Check if today's walk is completed ---
export const isTodayWalkCompleted = (): boolean => {
    const lastCompletionDate = getWalkingChallengeLastCompletionDate();
    if (!lastCompletionDate) return false;
    
    // Ensure to get 'today' in the same YYYY-MM-DD format as stored
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    return lastCompletionDate === todayStr;
};

// NOTE: This file might be missing other functions if the original was more comprehensive.
// This version provides functions specifically imported by HomeView.tsx and to fix the stated error.
// Other parts of the application (like App.tsx using import * as localStorageService)
// might require more functions to be restored here if this file was unintentionally emptied.

// Minimal set of other functions that might be used by App.tsx to avoid immediate breakage,
// assuming they were part of a typical localStorageService.
// These are added as a precaution because App.tsx uses a namespace import.

const USER_NAME_KEY = 'flexibelHalsostudioUserName';
const LAST_WORKOUT_DATE_KEY = 'flexibelHalsostudioLastWorkoutDate';
const WORKOUT_STREAK_KEY = 'flexibelHalsostudioWorkoutStreak';
const TOTAL_WORKOUTS_KEY = 'flexibelHalsostudioTotalWorkouts';
const WORKOUT_LOG_KEY = 'flexibelHalsostudioWorkoutLog';
const FAVORITE_WORKOUTS_KEY = 'flexibelHalsostudioFavoriteWorkouts';
const FAVORITED_GENERATED_WORKOUTS_KEY = 'flexibelHalsostudioFavoritedGeneratedWorkouts';
const WALKING_CHALLENGE_LOG_KEY = 'flexibelHalsostudioWalkingLog';
const WALKING_CHALLENGE_CURRENT_DAY_KEY = 'flexibelHalsostudioWalkingCurrentDay';
const WALKING_CHALLENGE_STREAK_KEY = 'flexibelHalsostudioWalkingStreak';

export const saveUserName = (name: string): void => localStorage.setItem(USER_NAME_KEY, name);
export const getUserName = (): string | null => localStorage.getItem(USER_NAME_KEY);
export const removeUserName = (): void => localStorage.removeItem(USER_NAME_KEY);

export const saveLastWorkoutDate = (date: string): void => localStorage.setItem(LAST_WORKOUT_DATE_KEY, date);
export const getLastWorkoutDate = (): string | null => localStorage.getItem(LAST_WORKOUT_DATE_KEY);

export const saveWorkoutStreak = (streak: number): void => localStorage.setItem(WORKOUT_STREAK_KEY, streak.toString());
export const getWorkoutStreak = (): number => {
  const streak = localStorage.getItem(WORKOUT_STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};

export const saveTotalWorkouts = (count: number): void => localStorage.setItem(TOTAL_WORKOUTS_KEY, count.toString());
export const getTotalWorkouts = (): number => {
  const count = localStorage.getItem(TOTAL_WORKOUTS_KEY);
  return count ? parseInt(count, 10) : 0;
};

// For brevity, complex types like WorkoutLogEntry, WalkingLogEntry, Workout are omitted from this minimal example's function signatures
// but would be needed for a fully functional service.
// The functions below are simplified to just interact with localStorage keys.

export const getWorkoutLog = (): any[] => {
  const logStr = localStorage.getItem(WORKOUT_LOG_KEY);
  return logStr ? JSON.parse(logStr) : [];
};
export const saveWorkoutLogEntry = (entry: any): void => {
  const log = getWorkoutLog();
  log.unshift(entry);
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(log.slice(0, 20))); // Max 20 entries
};

export const getFavoriteWorkoutIds = (): string[] => {
  const favStr = localStorage.getItem(FAVORITE_WORKOUTS_KEY);
  return favStr ? JSON.parse(favStr) : [];
};
export const addFavoriteWorkoutId = (id: string): void => {
  const favs = getFavoriteWorkoutIds();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(favs));
  }
};
export const removeFavoriteWorkoutId = (id: string): void => {
  let favs = getFavoriteWorkoutIds();
  favs = favs.filter(favId => favId !== id);
  localStorage.setItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(favs));
};
export const isFavoriteWorkout = (id: string): boolean => getFavoriteWorkoutIds().includes(id);

export const getFavoritedGeneratedWorkouts = (): any[] => {
  const str = localStorage.getItem(FAVORITED_GENERATED_WORKOUTS_KEY);
  return str ? JSON.parse(str) : [];
};
export const addFavoritedGeneratedWorkout = (workout: any): void => {
  const favs = getFavoritedGeneratedWorkouts();
  favs.unshift(workout);
  localStorage.setItem(FAVORITED_GENERATED_WORKOUTS_KEY, JSON.stringify(favs));
};
export const removeFavoritedGeneratedWorkout = (id: string): void => {
  let favs = getFavoritedGeneratedWorkouts();
  favs = favs.filter(w => w.id !== id);
  localStorage.setItem(FAVORITED_GENERATED_WORKOUTS_KEY, JSON.stringify(favs));
};


export const getWalkingLog = (): any[] => {
  const logStr = localStorage.getItem(WALKING_CHALLENGE_LOG_KEY);
  return logStr ? JSON.parse(logStr) : [];
};
export const saveWalkingLogEntry = (entry: any): void => {
  const log = getWalkingLog();
  log.unshift(entry);
  localStorage.setItem(WALKING_CHALLENGE_LOG_KEY, JSON.stringify(log.slice(0, 60))); // Max 60 entries
};

export const saveWalkingChallengeCurrentDay = (day: number): void => localStorage.setItem(WALKING_CHALLENGE_CURRENT_DAY_KEY, day.toString());
export const getWalkingChallengeCurrentDay = (): number => {
  const day = localStorage.getItem(WALKING_CHALLENGE_CURRENT_DAY_KEY);
  return day ? parseInt(day, 10) : 0;
};

export const saveWalkingChallengeLastCompletionDate = (date: string): void => localStorage.setItem(WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY, date);

export const saveWalkingChallengeStreak = (streak: number): void => localStorage.setItem(WALKING_CHALLENGE_STREAK_KEY, streak.toString());
export const getWalkingChallengeStreak = (): number => {
  const streak = localStorage.getItem(WALKING_CHALLENGE_STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};

// Dummy functions for active walk state if needed by other parts, not strictly by HomeView's direct imports
const ACTIVE_WALK_IS_ACTIVE_KEY = 'flexibelHalsostudioActiveWalkIsActive';
export const clearActiveWalkState = (): void => {
  localStorage.removeItem(ACTIVE_WALK_IS_ACTIVE_KEY);
  // Remove other related keys if they exist
};
export const getActiveWalkState = (): any | null => {
   const isActiveStr = localStorage.getItem(ACTIVE_WALK_IS_ACTIVE_KEY);
   if (isActiveStr === 'true') return { isActive: true }; // Simplified
   return null;
};
export const saveActiveWalkState = (state: any): void => {
  localStorage.setItem(ACTIVE_WALK_IS_ACTIVE_KEY, state.isActive.toString());
  // Save other parts of state if they exist
};

// Dummy getCurrentWalkingLevel - a more complete version would need Level type from types.ts
// and WALKING_LEVEL_DEFINITIONS from constants.ts. For now, a placeholder.
// This is more for App.tsx's `* as localStorageService` potentially calling it.
// HomeView itself receives currentWalkingLevel as a prop.
export const getCurrentWalkingLevel = (): any => {
    // This is a simplified placeholder. A real implementation would involve:
    // import { Level } from '../types';
    // import { WALKING_LEVEL_DEFINITIONS, getWalkingLevelUtil as getWalkingLevelUtilFunc } from '../constants';
    // const completedDays = getWalkingChallengeCurrentDay();
    // return getWalkingLevelUtilFunc(completedDays);
    return { name: "Promenad-Pionjär", minDays: 0 }; // Placeholder
};
