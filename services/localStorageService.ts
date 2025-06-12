
import { WorkoutLogEntry, WalkingLogEntry, Level, Workout } from '../types'; // Added Workout
import { WALKING_LEVEL_DEFINITIONS, getCurrentWalkingLevel as getWalkingLevelUtil, WALKING_CHALLENGE_TOTAL_DAYS } from '../constants';


const USER_NAME_KEY = 'flexibelHalsostudioUserName';
const LAST_WORKOUT_DATE_KEY = 'flexibelHalsostudioLastWorkoutDate';
const WORKOUT_STREAK_KEY = 'flexibelHalsostudioWorkoutStreak';
const TOTAL_WORKOUTS_KEY = 'flexibelHalsostudioTotalWorkouts';
const WORKOUT_LOG_KEY = 'flexibelHalsostudioWorkoutLog';
const MAX_LOG_ENTRIES = 20; // For workouts
const DARK_MODE_KEY = 'flexibelHalsostudioDarkMode';
const FAVORITE_WORKOUTS_KEY = 'flexibelHalsostudioFavoriteWorkouts';
const FAVORITED_AI_WORKOUTS_KEY = 'flexibelHalsostudioFavoritedAIWorkouts'; // New key

// --- Walking Challenge Keys ---
const WALKING_CHALLENGE_LOG_KEY = 'flexibelHalsostudioWalkingLog';
const WALKING_CHALLENGE_CURRENT_DAY_KEY = 'flexibelHalsostudioWalkingCurrentDay';
const WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY = 'flexibelHalsostudioWalkingLastDate';
const WALKING_CHALLENGE_STREAK_KEY = 'flexibelHalsostudioWalkingStreak';
const MAX_WALKING_LOG_ENTRIES = 60;

// --- Active Walk State Keys ---
const ACTIVE_WALK_IS_ACTIVE_KEY = 'flexibelHalsostudioActiveWalkIsActive';
const ACTIVE_WALK_START_TIME_KEY = 'flexibelHalsostudioActiveWalkStartTime';
const ACTIVE_WALK_PAUSE_START_TIME_KEY = 'flexibelHalsostudioActiveWalkPauseStartTime';
const ACTIVE_WALK_TOTAL_PAUSED_DURATION_KEY = 'flexibelHalsostudioActiveWalkTotalPausedDuration';


// --- Share Tracking Key ---
const APP_SHARE_COUNT_KEY = 'flexibelHalsostudioAppShareCount';
const FOURTH_SHARE_EASTER_EGG_SHOWN_KEY = 'flexibelHalsostudioFourthShareEasterEggShown'; // New key

// User Name
export const saveUserName = (name: string): void => {
  localStorage.setItem(USER_NAME_KEY, name);
};

export const getUserName = (): string | null => {
  return localStorage.getItem(USER_NAME_KEY);
};

export const removeUserName = (): void => {
  localStorage.removeItem(USER_NAME_KEY);
};

// Last Workout Date (for workout streak)
export const saveLastWorkoutDate = (date: string): void => {
  localStorage.setItem(LAST_WORKOUT_DATE_KEY, date);
};

export const getLastWorkoutDate = (): string | null => {
  return localStorage.getItem(LAST_WORKOUT_DATE_KEY);
};

// Workout Streak
export const saveWorkoutStreak = (streak: number): void => {
  localStorage.setItem(WORKOUT_STREAK_KEY, streak.toString());
};

export const getWorkoutStreak = (): number => {
  const streak = localStorage.getItem(WORKOUT_STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};

// Total Workouts Completed
export const saveTotalWorkouts = (count: number): void => {
  localStorage.setItem(TOTAL_WORKOUTS_KEY, count.toString());
};

export const getTotalWorkouts = (): number => {
  const count = localStorage.getItem(TOTAL_WORKOUTS_KEY);
  return count ? parseInt(count, 10) : 0;
};

// Workout Log
export const getWorkoutLog = (): WorkoutLogEntry[] => {
  const logStr = localStorage.getItem(WORKOUT_LOG_KEY);
  if (logStr) {
    try {
      return JSON.parse(logStr) as WorkoutLogEntry[];
    } catch (e) {
      console.error("Failed to parse workout log:", e);
      return [];
    }
  }
  return [];
};

export const saveWorkoutLogEntry = (entry: WorkoutLogEntry): void => {
  const log = getWorkoutLog();
  // A very strict duplicate check: only if the exact same workoutId and millisecond timestamp exists.
  // This is mainly to prevent true double-saves from a bug, but allow rapid distinct sessions.
  const isDuplicate = log.some(
    (logItem) =>
      logItem.workoutId === entry.workoutId &&
      logItem.completionTimestamp === entry.completionTimestamp
  );

  if (isDuplicate) {
    console.warn("Duplicate workout log entry (same ID and exact timestamp) prevented:", entry);
    return;
  }

  log.unshift(entry);
  const trimmedLog = log.slice(0, MAX_LOG_ENTRIES);
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(trimmedLog));
};

// Dark Mode Preference
export const saveDarkModePreference = (isDarkMode: boolean): void => {
  localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
};

export const getDarkModePreference = (): boolean => {
  const preference = localStorage.getItem(DARK_MODE_KEY);
  return preference ? JSON.parse(preference) : false;
};

// Favorite Workout IDs (for quick check and star icon state)
export const getFavoriteWorkoutIds = (): string[] => {
  const favoritesStr = localStorage.getItem(FAVORITE_WORKOUTS_KEY);
  if (favoritesStr) {
    try {
      return JSON.parse(favoritesStr) as string[];
    } catch (e) {
      console.error("Failed to parse favorite workouts:", e);
      return [];
    }
  }
  return [];
};

export const addFavoriteWorkoutId = (workoutId: string): void => {
  const favorites = getFavoriteWorkoutIds();
  if (!favorites.includes(workoutId)) {
    favorites.push(workoutId);
    localStorage.setItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(favorites));
  }
};

export const removeFavoriteWorkoutId = (workoutId: string): void => {
  let favorites = getFavoriteWorkoutIds();
  favorites = favorites.filter(id => id !== workoutId);
  localStorage.setItem(FAVORITE_WORKOUTS_KEY, JSON.stringify(favorites));
};

export const isFavoriteWorkout = (workoutId: string): boolean => {
  const favorites = getFavoriteWorkoutIds();
  return favorites.includes(workoutId);
};

// --- Favorited AI Workouts (Full Objects) ---
export const getFavoritedAIWorkouts = (): Workout[] => {
  const workoutsStr = localStorage.getItem(FAVORITED_AI_WORKOUTS_KEY);
  if (workoutsStr) {
    try {
      return JSON.parse(workoutsStr) as Workout[];
    } catch (e) {
      console.error("Failed to parse favorited AI workouts:", e);
      return [];
    }
  }
  return [];
};

const saveFavoritedAIWorkouts = (workouts: Workout[]): void => {
  localStorage.setItem(FAVORITED_AI_WORKOUTS_KEY, JSON.stringify(workouts));
};

export const addFavoritedAIWorkout = (workout: Workout): void => {
  const aiWorkouts = getFavoritedAIWorkouts();
  // Remove if already exists to prevent duplicates, then add the (potentially updated) one
  const updatedAIWorkouts = aiWorkouts.filter(w => w.id !== workout.id);
  updatedAIWorkouts.unshift(workout); // Add to the beginning
  saveFavoritedAIWorkouts(updatedAIWorkouts);
};

export const removeFavoritedAIWorkout = (workoutId: string): void => {
  const aiWorkouts = getFavoritedAIWorkouts();
  const updatedAIWorkouts = aiWorkouts.filter(w => w.id !== workoutId);
  saveFavoritedAIWorkouts(updatedAIWorkouts);
};


// --- Walking Challenge Storage Functions ---

// Walking Challenge Log
export const getWalkingLog = (): WalkingLogEntry[] => {
  const logStr = localStorage.getItem(WALKING_CHALLENGE_LOG_KEY);
  if (logStr) {
    try {
      return JSON.parse(logStr) as WalkingLogEntry[];
    } catch (e) {
      console.error("Failed to parse walking log:", e);
      return [];
    }
  }
  return [];
};

export const saveWalkingLogEntry = (entry: WalkingLogEntry): void => {
  let log = getWalkingLog();
  const existingEntryIndex = log.findIndex(
    (logItem) =>
      logItem.challengeDay === entry.challengeDay &&
      logItem.dateCompleted === entry.dateCompleted
  );

  if (existingEntryIndex !== -1) {
    log[existingEntryIndex] = entry;
  } else {
    log.unshift(entry);
    log = log.slice(0, MAX_WALKING_LOG_ENTRIES);
  }

  localStorage.setItem(WALKING_CHALLENGE_LOG_KEY, JSON.stringify(log));
};

// Current Day in Walking Challenge (1-30)
export const saveWalkingChallengeCurrentDay = (day: number): void => {
  const boundedDay = Math.max(0, Math.min(day, WALKING_CHALLENGE_TOTAL_DAYS + 1));
  localStorage.setItem(WALKING_CHALLENGE_CURRENT_DAY_KEY, boundedDay.toString());
};

export const getWalkingChallengeCurrentDay = (): number => {
  const day = localStorage.getItem(WALKING_CHALLENGE_CURRENT_DAY_KEY);
  return day ? parseInt(day, 10) : 0;
};

// Last Date Walking Challenge day was completed
export const saveWalkingChallengeLastCompletionDate = (date: string): void => {
  localStorage.setItem(WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY, date);
};

export const getWalkingChallengeLastCompletionDate = (): string | null => {
  return localStorage.getItem(WALKING_CHALLENGE_LAST_COMPLETION_DATE_KEY);
};

// Walking Streak (consecutive days of 30min walks)
export const saveWalkingChallengeStreak = (streak: number): void => {
  localStorage.setItem(WALKING_CHALLENGE_STREAK_KEY, streak.toString());
};

export const getWalkingChallengeStreak = (): number => {
  const streak = localStorage.getItem(WALKING_CHALLENGE_STREAK_KEY);
  return streak ? parseInt(streak, 10) : 0;
};

// Get current walking level based on completed days
export const getCurrentWalkingLevel = (): Level => {
  const completedDays = getWalkingChallengeCurrentDay();
  const effectiveDays = completedDays > WALKING_CHALLENGE_TOTAL_DAYS ? WALKING_CHALLENGE_TOTAL_DAYS : completedDays;
  return getWalkingLevelUtil(effectiveDays);
};

// Check if today's walk is completed
export const isTodayWalkCompleted = (): boolean => {
    const lastCompletionDate = getWalkingChallengeLastCompletionDate();
    if (!lastCompletionDate) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return lastCompletionDate === todayStr;
};

// --- Active Walk State Functions ---
export interface ActiveWalkState {
  isActive: boolean;
  startTime: number | null;
  pauseStartTime: number | null; // Timestamp when pause began
  totalPausedDuration: number | null; // Milliseconds
}

export const saveActiveWalkState = (state: ActiveWalkState): void => {
  localStorage.setItem(ACTIVE_WALK_IS_ACTIVE_KEY, JSON.stringify(state.isActive));
  if (state.startTime !== null) {
    localStorage.setItem(ACTIVE_WALK_START_TIME_KEY, state.startTime.toString());
  } else {
    localStorage.removeItem(ACTIVE_WALK_START_TIME_KEY);
  }
  if (state.pauseStartTime !== null) {
    localStorage.setItem(ACTIVE_WALK_PAUSE_START_TIME_KEY, state.pauseStartTime.toString());
  } else {
    localStorage.removeItem(ACTIVE_WALK_PAUSE_START_TIME_KEY);
  }
  if (state.totalPausedDuration !== null) {
    localStorage.setItem(ACTIVE_WALK_TOTAL_PAUSED_DURATION_KEY, state.totalPausedDuration.toString());
  } else {
    localStorage.removeItem(ACTIVE_WALK_TOTAL_PAUSED_DURATION_KEY);
  }
};

export const getActiveWalkState = (): ActiveWalkState | null => {
  const isActiveStr = localStorage.getItem(ACTIVE_WALK_IS_ACTIVE_KEY);
  if (!isActiveStr || JSON.parse(isActiveStr) === false) {
    return null;
  }

  const startTimeStr = localStorage.getItem(ACTIVE_WALK_START_TIME_KEY);
  const pauseStartTimeStr = localStorage.getItem(ACTIVE_WALK_PAUSE_START_TIME_KEY);
  const totalPausedDurationStr = localStorage.getItem(ACTIVE_WALK_TOTAL_PAUSED_DURATION_KEY);

  return {
    isActive: true,
    startTime: startTimeStr ? parseInt(startTimeStr, 10) : null,
    pauseStartTime: pauseStartTimeStr ? parseInt(pauseStartTimeStr, 10) : null,
    totalPausedDuration: totalPausedDurationStr ? parseInt(totalPausedDurationStr, 10) : null,
  };
};

export const clearActiveWalkState = (): void => {
  localStorage.removeItem(ACTIVE_WALK_IS_ACTIVE_KEY);
  localStorage.removeItem(ACTIVE_WALK_START_TIME_KEY);
  localStorage.removeItem(ACTIVE_WALK_PAUSE_START_TIME_KEY);
  localStorage.removeItem(ACTIVE_WALK_TOTAL_PAUSED_DURATION_KEY);
};


// App Share Count
export const getAppShareCount = (): number => {
  const count = localStorage.getItem(APP_SHARE_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementAppShareCount = (): void => {
  const currentCount = getAppShareCount();
  localStorage.setItem(APP_SHARE_COUNT_KEY, (currentCount + 1).toString());
};

// Fourth Share Easter Egg Modal Shown
export const hasFourthShareEasterEggBeenShown = (): boolean => {
  return localStorage.getItem(FOURTH_SHARE_EASTER_EGG_SHOWN_KEY) === 'true';
};

export const setFourthShareEasterEggShown = (): void => {
  localStorage.setItem(FOURTH_SHARE_EASTER_EGG_SHOWN_KEY, 'true');
};
