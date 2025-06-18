declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

import {
  trackUsernameEntered,
  trackChallengeStarted,
  trackChallengeCompleted,
  trackLevelUp,
  trackAwardReceived
} from './analytics';

import React, { useState, useEffect, useCallback } from 'react';
import { Workout, View, ExercisePhaseType, WorkoutFormat, Level, DiplomaData, CurrentWorkoutCompletionData, PostWarmUpPromptViewProps, WalkingLogEntry, WorkoutLogEntry, CurrentWalkingCompletionData, WalkingDiplomaData, SummerStatusLevel, AchievementCheckData, LogWalkFormData } from './types';
import { HomeView } from './views/HomeView';
import { WorkoutDetailView } from './views/WorkoutDetailView';
import { PreWorkoutCountdownView } from './views/PreWorkoutCountdownView';
import { WorkoutActiveView } from './views/WorkoutActiveView';
import { PostWorkoutView } from './views/PostWorkoutView';
// LevelSystemView and WalkingLevelSystemView removed
import { ProfileView } from './views/ProfileView';
import { SpreadLoveView } from './views/SpreadLoveView';
import { DiplomaView } from './views/DiplomaView';
import { PostWarmUpPromptView } from './views/PostWarmUpPromptView';
import { TipsView } from './views/TipsView';
// Removed ActiveWalkingView import as it's obsolete
import { PostWalkingView } from './views/PostWalkingView';
import { GenerateWorkoutView } from './views/GenerateWorkoutView'; 
import { AchievementsView } from './views/AchievementsView'; 
import { LogWalkView } from './views/LogWalkView'; // Added LogWalkView import
import * as localStorageService from './services/localStorageService';
import * as audioService from './services/audioService';
import * as analyticsService from './services/analyticsService'; 
import { APP_STRINGS, WORKOUTS, LEVEL_DEFINITIONS, getCurrentWorkoutLevel as getWorkoutLevelUtil, WALKING_CHALLENGE_TOTAL_DAYS, getCurrentWalkingLevel as getWalkingLevelUtilFunc, WALKING_LEVEL_DEFINITIONS, WALKING_CHALLENGE_DAILY_MINUTES, MAX_WORKOUT_CHALLENGE_POINTS, MAX_WALKING_CHALLENGE_POINTS, MAX_ACHIEVEMENT_POINTS, TOTAL_SUMMER_SCORE_MAX, SUMMER_STATUS_LEVELS, ACHIEVEMENT_DEFINITIONS, PREPARE_SEGMENT } from './constants';
import { WalkingDiplomaView } from './views/WalkingDiplomaView';
import { getEarnedAchievementIds } from './services/achievementService';


export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>(View.Home);

  const [diplomaData, setDiplomaData] = useState<DiplomaData | null>(null);
  const [walkingDiplomaDataToDisplay, setWalkingDiplomaDataToDisplay] = useState<WalkingDiplomaData | null>(null);
  const [currentWorkoutCompletionData, setCurrentWorkoutCompletionData] = useState<CurrentWorkoutCompletionData | null>(null);
  const [currentWalkingCompletionData, setCurrentWalkingCompletionData] = useState<CurrentWalkingCompletionData | null>(null);

  const [availableKBChallengeWorkouts, setAvailableKBChallengeWorkouts] = useState<Workout[]>([]);
  const [availableBWChallengeWorkouts, setAvailableBWChallengeWorkouts] = useState<Workout[]>([]);
  const [isGeneralChallengePromptActive, setIsGeneralChallengePromptActive] = useState(false);


  // Centralized Stats State
  const [streakCount, setStreakCount] = useState(0);
  const [totalWorkoutsCount, setTotalWorkoutsCount] = useState(0);
  const [currentWorkoutLevel, setCurrentWorkoutLevel] = useState<Level | null>(null);
  const [nextWorkoutLevelInfo, setNextWorkoutLevelInfo] = useState<{ nextLevelDef: Level | null; workoutsToNextLevel: number; percentageToNext: number; } | null>(null);

  const [walkingChallengeCurrentDay, setWalkingChallengeCurrentDay] = useState(0);
  const [currentWalkingLevel, setCurrentWalkingLevel] = useState<Level | null>(null);
  const [walkingStreak, setWalkingStreak] = useState(0);
  const [isTodayWalkDone, setIsTodayWalkDone] = useState(false);
  const [nextWalkingLevelInfo, setNextWalkingLevelInfo] = useState<{ nextLevelDef: Level | null; daysToNextLevel: number; percentageToNext: number; } | null>(null);

  // Total Summer Status State
  const [currentTotalSummerScore, setCurrentTotalSummerScore] = useState(0);
  const [currentSummerStatusLevelName, setCurrentSummerStatusLevelName] = useState('');

  useEffect(() => {
    const newViewClass = `view-${currentView}`;
    // Base classes that should ideally be on the body from index.html
    const baseClasses = ['bg-white', 'text-gray-800', 'text-lg']; // Match classes in body tag

    // Remove any old view-specific classes
    Array.from(document.body.classList).forEach(cls => {
      if (cls.startsWith('view-')) {
        document.body.classList.remove(cls);
      }
    });

    // Add the new view-specific class
    document.body.classList.add(newViewClass);

    // Ensure base classes are present (they might be removed if body.className was directly set before)
    // Or, if index.html body tag is minimal, ensure they are added.
    // For this setup, index.html already has them, so this just ensures they stay if logic was different.
    baseClasses.forEach(baseCls => {
      if (!document.body.classList.contains(baseCls)) {
        // This part might be optional if index.html's body tag is guaranteed to have these
        // and we are sure no other JS overwrites the entire classList.
        // document.body.classList.add(baseCls);
      }
    });
  }, [currentView]);

  const loadGlobalStats = useCallback(() => {
    const workoutsCount = localStorageService.getTotalWorkouts();
    setStreakCount(localStorageService.getWorkoutStreak());
    setTotalWorkoutsCount(workoutsCount);
    const userWorkoutLvl = getWorkoutLevelUtil(workoutsCount);
    setCurrentWorkoutLevel(userWorkoutLvl);

    const currentWorkoutLvlIdx = LEVEL_DEFINITIONS.findIndex(l => l.name === userWorkoutLvl.name);
    const nextWorkoutLvlDef = (currentWorkoutLvlIdx !== -1 && currentWorkoutLvlIdx < LEVEL_DEFINITIONS.length - 1)
      ? LEVEL_DEFINITIONS[currentWorkoutLvlIdx + 1]
      : null;

    if (nextWorkoutLvlDef && nextWorkoutLvlDef.minWorkouts !== undefined && userWorkoutLvl.minWorkouts !== undefined) {
      const workoutsNeededForNextSpan = nextWorkoutLvlDef.minWorkouts - userWorkoutLvl.minWorkouts;
      const workoutsMadeInCurrentSpan = workoutsCount - userWorkoutLvl.minWorkouts;
      let percentage = 0;
        if (workoutsCount >= nextWorkoutLvlDef.minWorkouts) {
            percentage = 100;
        } else if (workoutsNeededForNextSpan > 0) {
            percentage = Math.max(0, Math.min(100, (workoutsMadeInCurrentSpan / workoutsNeededForNextSpan) * 100));
        }
      setNextWorkoutLevelInfo({
        nextLevelDef: nextWorkoutLvlDef,
        workoutsToNextLevel: Math.max(0, nextWorkoutLvlDef.minWorkouts - workoutsCount),
        percentageToNext: percentage
      });
    } else {
      setNextWorkoutLevelInfo(null);
    }

    const wcCurrentDay = localStorageService.getWalkingChallengeCurrentDay();
    setWalkingChallengeCurrentDay(wcCurrentDay);
    setWalkingStreak(localStorageService.getWalkingChallengeStreak());
    const userWalkingLvl = getWalkingLevelUtilFunc(wcCurrentDay);
    setCurrentWalkingLevel(userWalkingLvl);
    
    const localToday = new Date();
    const localTodayStr = `${localToday.getFullYear()}-${(localToday.getMonth() + 1).toString().padStart(2, '0')}-${localToday.getDate().toString().padStart(2, '0')}`;
    setIsTodayWalkDone(localStorageService.getWalkingChallengeLastCompletionDate() === localTodayStr);


    const currentWalkingLvlIdx = WALKING_LEVEL_DEFINITIONS.findIndex(l => l.name === userWalkingLvl.name);
    const nextWalkingLvlDefConst = (currentWalkingLvlIdx !== -1 && currentWalkingLvlIdx < WALKING_LEVEL_DEFINITIONS.length - 1)
      ? WALKING_LEVEL_DEFINITIONS[currentWalkingLvlIdx + 1]
      : null;

    if (nextWalkingLvlDefConst && nextWalkingLvlDefConst.minDays !== undefined && userWalkingLvl.minDays !== undefined) {
        const daysNeededForNextSpan = nextWalkingLvlDefConst.minDays - userWalkingLvl.minDays;
        const daysMadeInCurrentSpan = wcCurrentDay - userWalkingLvl.minDays;
        let percentage = 0;
        if (wcCurrentDay >= nextWalkingLvlDefConst.minDays) {
            percentage = 100;
        } else if (daysNeededForNextSpan > 0) {
            percentage = Math.max(0, Math.min(100, (daysMadeInCurrentSpan / daysNeededForNextSpan) * 100));
        }
        setNextWalkingLevelInfo({
            nextLevelDef: nextWalkingLvlDefConst,
            daysToNextLevel: Math.max(0, nextWalkingLvlDefConst.minDays - wcCurrentDay),
            percentageToNext: percentage
        });
    } else {
        setNextWalkingLevelInfo(null);
    }

    // Calculate Total Summer Status
    const achievementCheckData: AchievementCheckData = {
        workoutLog: localStorageService.getWorkoutLog(),
        walkingLog: localStorageService.getWalkingLog(),
        favoriteWorkoutIds: localStorageService.getFavoriteWorkoutIds(),
        currentWorkoutLevel: userWorkoutLvl,
        currentWalkingLevel: userWalkingLvl,
        totalWorkoutsCompleted: workoutsCount,
        totalWalkingDaysCompleted: wcCurrentDay,
        currentWorkoutStreak: localStorageService.getWorkoutStreak(),
        currentWalkingStreak: localStorageService.getWalkingChallengeStreak(),
        appShareCount: localStorageService.getAppShareCount(),
    };
    const earnedAchievementIds = getEarnedAchievementIds(achievementCheckData);
    const numEarnedAchievements = earnedAchievementIds.length;

    const scoreFromWorkouts = Math.min(workoutsCount, MAX_WORKOUT_CHALLENGE_POINTS);
    const scoreFromWalking = Math.min(wcCurrentDay, MAX_WALKING_CHALLENGE_POINTS);
    const scoreFromAchievements = numEarnedAchievements;

    const totalScore = scoreFromWorkouts + scoreFromWalking + scoreFromAchievements;
    setCurrentTotalSummerScore(totalScore);

    let statusName = SUMMER_STATUS_LEVELS[0].name;
    for (let i = SUMMER_STATUS_LEVELS.length - 1; i >= 0; i--) {
      if (totalScore >= SUMMER_STATUS_LEVELS[i].minScore) {
        statusName = SUMMER_STATUS_LEVELS[i].name;
        break;
      }
    }
    setCurrentSummerStatusLevelName(statusName);

// 🔥 Lägg in direkt här, fortfarande inne i useCallback:

const previouslyLoggedAchievements = localStorageService.getLoggedAchievements() || [];

const newAchievements = earnedAchievementIds.filter(id => !previouslyLoggedAchievements.includes(id));

newAchievements.forEach(achievementId => {
    trackAwardReceived(achievementId);
});

localStorageService.saveLoggedAchievements([...previouslyLoggedAchievements, ...newAchievements]);

}, []);  // <-- detta avslutar useCallback


  useEffect(() => {
    const storedName = localStorageService.getUserName();
    if (storedName) setUserName(storedName);
    loadGlobalStats();

    // Active walk state is no longer used, so related recovery logic is removed.

    const kbFiltered = WORKOUTS.filter(w => w.type === 'kettlebell' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15);
    setAvailableKBChallengeWorkouts(kbFiltered);
    const bwFiltered = WORKOUTS.filter(w => w.type === 'bodyweight' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15 && !w.id.startsWith('warmup-'));
    setAvailableBWChallengeWorkouts(bwFiltered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGlobalStats]); 


  const handleNavigation = useCallback((
    view: View,
    data?: Workout | DiplomaData | WalkingDiplomaData | { workout: Workout; wasAbortedByUser?: boolean, completedTimeSeconds?: number } | { startChallenge: 'KB' | 'BW', context?: string } | { initialTimestamp?: number, completedDurationSeconds?: number, distance?: string, steps?: string, comment?: string, context?: string, logTimestampToUpdate?: number } | LogWalkFormData
  ) => {
    const newPreviousView = currentView;
    setPreviousView(newPreviousView);
    let workoutToPass: Workout | null = null;

    if (view === View.Home && data && (data as { startChallenge: 'KB' | 'BW' }).startChallenge) {
      const challengeType = (data as { startChallenge: 'KB' | 'BW' }).startChallenge;
      const workoutsToUse = challengeType === 'KB' ? availableKBChallengeWorkouts : availableBWChallengeWorkouts;
      if (workoutsToUse.length > 0) {
        const randomWorkout = workoutsToUse[Math.floor(Math.random() * workoutsToUse.length)];
        setSelectedWorkout(randomWorkout);
        setIsGeneralChallengePromptActive(false);
        setCurrentView(View.WorkoutDetail);
        return;
      } else {
        alert(APP_STRINGS.noWorkoutsAvailable);
        setIsGeneralChallengePromptActive(false);
        setCurrentView(View.Home);
        return;
      }
    }

    const workoutNavData = data as { workout: Workout; wasAbortedByUser?: boolean, completedTimeSeconds?: number };
    if ((view === View.PostWorkout || view === View.PostWarmUpPrompt) && newPreviousView === View.ActiveWorkout && workoutNavData?.workout?.id) {
      const completedWorkoutObject = WORKOUTS.find(w => w.id === workoutNavData.workout.id) || workoutNavData.workout;
      const wasAborted = workoutNavData.wasAbortedByUser || false;

      setSelectedWorkout({ ...completedWorkoutObject });
      setIsGeneralChallengePromptActive(false);
      const isWarmUp = completedWorkoutObject.id.startsWith('warmup-');

      if (isWarmUp) {
        setCurrentWorkoutCompletionData(null);
        setCurrentView(View.PostWarmUpPrompt);
        return;
      }

      const completionTimestamp = new Date();
      const localTodayDate = new Date();
      const localTodayDateStr = `${localTodayDate.getFullYear()}-${(localTodayDate.getMonth() + 1).toString().padStart(2, '0')}-${localTodayDate.getDate().toString().padStart(2, '0')}`;
      
      const lastWorkoutDateStr = localStorageService.getLastWorkoutDate();
      const currentStreakValue = localStorageService.getWorkoutStreak();
      const previousTotalWorkouts = localStorageService.getTotalWorkouts();

      let newTotalWorkouts = previousTotalWorkouts;
      let newStreak = currentStreakValue;
      let didLevelUp = false;
      let levelAfter = getWorkoutLevelUtil(previousTotalWorkouts);

      if (!wasAborted) {
        newTotalWorkouts = previousTotalWorkouts + 1;
        localStorageService.saveTotalWorkouts(newTotalWorkouts);

        if (lastWorkoutDateStr !== localTodayDateStr) {
          const localYesterday = new Date(localTodayDate);
          localYesterday.setDate(localTodayDate.getDate() - 1);
          const localYesterdayStr = `${localYesterday.getFullYear()}-${(localYesterday.getMonth() + 1).toString().padStart(2, '0')}-${localYesterday.getDate().toString().padStart(2, '0')}`;
          newStreak = (lastWorkoutDateStr === localYesterdayStr) ? currentStreakValue + 1 : 1;
          localStorageService.saveLastWorkoutDate(localTodayDateStr);
        }
        localStorageService.saveWorkoutStreak(newStreak);

        const levelBefore = getWorkoutLevelUtil(previousTotalWorkouts);
        levelAfter = getWorkoutLevelUtil(newTotalWorkouts);
        didLevelUp = levelAfter.name !== levelBefore.name && newTotalWorkouts > 0;

        analyticsService.trackEvent('workout_completed', {
            event_category: 'workout_engagement',
            event_action: 'complete_workout',
            item_id: completedWorkoutObject.id,
            item_name: completedWorkoutObject.title,
            workout_type: completedWorkoutObject.id.startsWith('generated-') ? 'generated' : completedWorkoutObject.type,
            workout_format: completedWorkoutObject.format,
            workout_difficulty: completedWorkoutObject.difficultyLevel,
            workout_score: workoutNavData.completedTimeSeconds !== undefined 
              ? workoutNavData.completedTimeSeconds 
              : (completedWorkoutObject.format === WorkoutFormat.AMRAP || completedWorkoutObject.format === WorkoutFormat.TIME_CAP ? 'score_pending_input' : undefined),
            value: newTotalWorkouts, 
        });

        // GA-spårning till Google Analytics 4:
        trackChallengeCompleted(completedWorkoutObject.title);


        if (didLevelUp) {
            analyticsService.trackEvent('level_up', {
                event_category: 'user_progression',
                event_action: 'level_up_workout',
                level_name: levelAfter.name,
                value: newTotalWorkouts, 
            });

            // 👉 Lägg till:
trackLevelUp(levelAfter.name);

        }

      } else {
        newStreak = currentStreakValue;
        newTotalWorkouts = previousTotalWorkouts;
        levelAfter = getWorkoutLevelUtil(previousTotalWorkouts);
        didLevelUp = false;
      }

      setCurrentWorkoutCompletionData({
        dateTime: completionTimestamp,
        streak: newStreak,
        totalWorkouts: newTotalWorkouts,
        level: levelAfter,
        didLevelUp: didLevelUp,
        workoutId: completedWorkoutObject.id,
        abortedByUser: wasAborted,
        completedTimeSeconds: workoutNavData.completedTimeSeconds,
      });

      setDiplomaData(null);
      setWalkingDiplomaDataToDisplay(null);
      if (!wasAborted) {
          loadGlobalStats();
      }
      setCurrentView(View.PostWorkout);
      return;
    }
    
    const walkNavData = data as LogWalkFormData;
    if (view === View.PostWalking && newPreviousView === View.LogWalk && walkNavData) {
        const formDataToProcess: LogWalkFormData = { ...walkNavData };
        const actualDurationMinutes = formDataToProcess.durationMinutes;
        const challengeCompleted = actualDurationMinutes >= WALKING_CHALLENGE_DAILY_MINUTES;
        const effectiveAbortedState = !challengeCompleted;

        const logTimestamp = Date.now();
        const dateCompletedStr = new Date(logTimestamp).toISOString().split('T')[0];

        let currentChallengeDayValue = localStorageService.getWalkingChallengeCurrentDay();
        let currentWalkingStreakValue = localStorageService.getWalkingChallengeStreak();
        const lastWalkCompletionDateStr = localStorageService.getWalkingChallengeLastCompletionDate();
        let didWalkingLevelUp = false;
        let walkingLevelAfter = getWalkingLevelUtilFunc(currentChallengeDayValue);

        if (challengeCompleted) {
            const previousChallengeDay = currentChallengeDayValue;
            if (lastWalkCompletionDateStr !== dateCompletedStr || currentChallengeDayValue === 0) {
                 currentChallengeDayValue = Math.min(currentChallengeDayValue + 1, WALKING_CHALLENGE_TOTAL_DAYS);
            }
            localStorageService.saveWalkingChallengeCurrentDay(currentChallengeDayValue);
            localStorageService.saveWalkingChallengeLastCompletionDate(dateCompletedStr);

            walkingLevelAfter = getWalkingLevelUtilFunc(currentChallengeDayValue);

            if (lastWalkCompletionDateStr) {
                const localTodayForStreak = new Date(logTimestamp);
                const localYesterdayForStreak = new Date(localTodayForStreak);
                localYesterdayForStreak.setDate(localTodayForStreak.getDate() - 1);
                const localYesterdayStrForStreak = localYesterdayForStreak.toISOString().split('T')[0];

                if (lastWalkCompletionDateStr === localYesterdayStrForStreak) {
                    currentWalkingStreakValue++;
                } else if (lastWalkCompletionDateStr !== dateCompletedStr) { 
                    currentWalkingStreakValue = 1;
                }
            } else { 
                currentWalkingStreakValue = 1;
            }
            localStorageService.saveWalkingChallengeStreak(currentWalkingStreakValue);

            const walkingLogEntry: WalkingLogEntry = {
                dateCompleted: dateCompletedStr, 
                challengeDay: currentChallengeDayValue,
                durationMinutes: actualDurationMinutes,
                levelNameAtCompletion: walkingLevelAfter.name,
                streakAtCompletion: currentWalkingStreakValue, 
                distance: formDataToProcess.distance,
                steps: formDataToProcess.steps,
                comment: formDataToProcess.comment,
                logTimestamp: logTimestamp, 
            };
            localStorageService.saveWalkingLogEntry(walkingLogEntry);
            
            const walkingLevelBefore = getWalkingLevelUtilFunc(previousChallengeDay);
            didWalkingLevelUp = walkingLevelAfter.name !== walkingLevelBefore.name && currentChallengeDayValue > 0;

            analyticsService.trackEvent('walk_day_completed', {
                event_category: 'walking_engagement',
                event_action: 'complete_walk_day_manual_log',
                item_id: `walk_day_${currentChallengeDayValue}`,
                walk_day_completed_number: currentChallengeDayValue,
                walk_duration_minutes: actualDurationMinutes,
                walk_distance_km: formDataToProcess.distance ? parseFloat(formDataToProcess.distance.replace(',', '.')) : undefined,
                walk_steps: formDataToProcess.steps ? parseInt(formDataToProcess.steps) : undefined,
                value: currentChallengeDayValue, 
            });

            // 👉 Lägg till:
trackChallengeCompleted(`Promenad dag ${currentChallengeDayValue}`);


            if (didWalkingLevelUp) {
                analyticsService.trackEvent('level_up', {
                    event_category: 'user_progression',
                    event_action: 'level_up_walking',
                    level_name: walkingLevelAfter.name,
                    value: currentChallengeDayValue, 
                });

                // 👉 Lägg till:
trackLevelUp(walkingLevelAfter.name);

            }
        }

        setCurrentWalkingCompletionData({
            logTimestamp: new Date(logTimestamp),
            newChallengeDay: currentChallengeDayValue,
            currentStreak: currentWalkingStreakValue,
            level: walkingLevelAfter,
            didLevelUp: didWalkingLevelUp,
            abortedByUser: effectiveAbortedState,
            completedDurationMinutes: actualDurationMinutes,
            distance: formDataToProcess.distance,
            steps: formDataToProcess.steps,
            comment: formDataToProcess.comment,
        });
        setDiplomaData(null);
        setWalkingDiplomaDataToDisplay(null);
        loadGlobalStats();
        setCurrentView(View.PostWalking);
        return;
    }


    if (view === View.Diploma && data && typeof (data as DiplomaData).totalWorkoutsCompleted === 'number' && (data as DiplomaData).completionDateTime) {
      setDiplomaData(data as DiplomaData);
      setWalkingDiplomaDataToDisplay(null);
    } else if (view === View.WalkingDiploma && data && typeof (data as WalkingDiplomaData).totalWalkingDaysAtThisPoint === 'number' && (data as WalkingDiplomaData).logTimestamp) {
      setWalkingDiplomaDataToDisplay(data as WalkingDiplomaData);
      setDiplomaData(null);
    } else if (data && (data as Workout).id) {
        const originalWorkout = WORKOUTS.find(w => w.id === (data as Workout).id) || data as Workout;
        workoutToPass = {...originalWorkout};

        if ((view === View.PreWorkoutCountdown || view === View.ActiveWorkout) && userName && workoutToPass.timedSegments) {
            const prepareSegmentCopy = { ...PREPARE_SEGMENT, name: APP_STRINGS.prepareSegmentTitlePersonalized.replace('{name}', userName) };
            if (workoutToPass.timedSegments.length === 0 || workoutToPass.timedSegments[0].type !== ExercisePhaseType.PREPARE) {
                workoutToPass.timedSegments = [prepareSegmentCopy, ...workoutToPass.timedSegments];
            } else {
                workoutToPass.timedSegments[0] = {
                    ...workoutToPass.timedSegments[0],
                    name: prepareSegmentCopy.name,
                    durationSeconds: PREPARE_SEGMENT.durationSeconds,
                    type: PREPARE_SEGMENT.type,
                    instructions: PREPARE_SEGMENT.instructions
                };
            }
        }
        setSelectedWorkout(workoutToPass);
    } else if (selectedWorkout && view !== View.Diploma && view !== View.WalkingDiploma && view !== View.PostWalking && view !== View.GenerateWorkout && view !== View.Achievements && view !== View.LogWalk) { // Removed LevelSystem and WalkingLevelSystem
        workoutToPass = WORKOUTS.find(w => w.id === selectedWorkout.id) || {...selectedWorkout};
         if ((view === View.PreWorkoutCountdown || view === View.ActiveWorkout) && userName && workoutToPass.timedSegments) {
            const prepareSegmentCopy = { ...PREPARE_SEGMENT, name: APP_STRINGS.prepareSegmentTitlePersonalized.replace('{name}', userName) };
             if (workoutToPass.timedSegments.length > 0 && workoutToPass.timedSegments[0].type === ExercisePhaseType.PREPARE) {
                workoutToPass.timedSegments[0] = {
                    ...workoutToPass.timedSegments[0],
                    name: prepareSegmentCopy.name,
                    durationSeconds: PREPARE_SEGMENT.durationSeconds,
                    type: PREPARE_SEGMENT.type,
                    instructions: PREPARE_SEGMENT.instructions
                };
            }
        }
        setSelectedWorkout(workoutToPass);
    }

    if (view === View.Home) {
      if (previousView === View.PostWalking && data && (data as { logTimestampToUpdate?: number }).logTimestampToUpdate) { // Check if data is from PostWalking
          const postWalkingNavData = data as { logTimestampToUpdate?: number, distance?: string, steps?: string, comment?: string };
          
          if (postWalkingNavData.logTimestampToUpdate && (postWalkingNavData.distance || postWalkingNavData.steps || postWalkingNavData.comment)) {
              const logs = localStorageService.getWalkingLog();
              const logIndexToUpdate = logs.findIndex(log => log.logTimestamp === postWalkingNavData.logTimestampToUpdate);

              if (logIndexToUpdate !== -1) {
                  const updatedEntry = { ...logs[logIndexToUpdate] };
                  if (postWalkingNavData.distance) updatedEntry.distance = postWalkingNavData.distance;
                  if (postWalkingNavData.steps) updatedEntry.steps = postWalkingNavData.steps;
                  if (postWalkingNavData.comment) updatedEntry.comment = postWalkingNavData.comment;
                  localStorageService.saveWalkingLogEntry(updatedEntry); 
              }
          }
      }

      setSelectedWorkout(null);
      setDiplomaData(null);
      setWalkingDiplomaDataToDisplay(null);
      setCurrentWorkoutCompletionData(null);
      setCurrentWalkingCompletionData(null);
      setIsGeneralChallengePromptActive(false);
      loadGlobalStats();
    }

    if (view === View.Profile || view === View.Tips || view === View.GenerateWorkout || view === View.Achievements) { 
        loadGlobalStats();
    }

    if (view === View.PreWorkoutCountdown) {
      audioService.initializeAudio();
    }

    setCurrentView(view);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, userName, loadGlobalStats, availableKBChallengeWorkouts, availableBWChallengeWorkouts]);


  const handleNameSave = (name: string) => {
    const trimmedName = name.trim();
    const isFirstNameSubmission = userName === null && trimmedName;

    if (trimmedName) localStorageService.saveUserName(trimmedName);
    else localStorageService.removeUserName();
    setUserName(trimmedName || null);
    loadGlobalStats();

    if (isFirstNameSubmission) {
        analyticsService.trackEvent('sign_up', {
            event_category: 'user_engagement',
            event_action: 'submit_name',
            method: 'app_onboarding',
            user_name_provided: !!trimmedName, 
        });
        trackUsernameEntered(trimmedName);
    }
  };

  const renderView = () => {
    const currentWorkoutForView = selectedWorkout;
    
    switch (currentView) {
      case View.Home:
        return <HomeView
                  key={View.Home}
                  onNavigate={handleNavigation}
                  userName={userName}
                  onNameSave={handleNameSave}
                  streakCount={streakCount}
                  totalWorkoutsCount={totalWorkoutsCount}
                  currentWorkoutLevel={currentWorkoutLevel}
                  nextWorkoutLevelInfo={nextWorkoutLevelInfo}
                  walkingChallengeCurrentDay={walkingChallengeCurrentDay}
                  currentWalkingLevel={currentWalkingLevel}
                  walkingStreak={walkingStreak}
                  isTodayWalkDone={isTodayWalkDone}
                  nextWalkingLevelInfo={nextWalkingLevelInfo}
                  currentTotalSummerScore={currentTotalSummerScore}
                  TOTAL_SUMMER_SCORE_MAX={TOTAL_SUMMER_SCORE_MAX} 
                  currentSummerStatusLevelName={currentSummerStatusLevelName}
                  maxWorkoutPoints={MAX_WORKOUT_CHALLENGE_POINTS} 
                  maxWalkingPoints={MAX_WALKING_CHALLENGE_POINTS} 
                  maxAchievementPoints={MAX_ACHIEVEMENT_POINTS}
                />;
      case View.WorkoutDetail:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <WorkoutDetailView key={View.WorkoutDetail} workout={currentWorkoutForView} onNavigate={handleNavigation} />;
      case View.PreWorkoutCountdown:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <PreWorkoutCountdownView key={View.PreWorkoutCountdown} workout={currentWorkoutForView} onNavigate={handleNavigation} />;
      case View.ActiveWorkout:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <WorkoutActiveView key={View.ActiveWorkout} workout={currentWorkoutForView} onNavigate={handleNavigation} userName={userName} />;
      case View.PostWorkout:
        if (!currentWorkoutForView || !currentWorkoutCompletionData) { setCurrentView(View.Home); return null; }
        return <PostWorkoutView key={View.PostWorkout} workout={currentWorkoutForView} onNavigate={handleNavigation} userName={userName} completionData={currentWorkoutCompletionData} />;
      case View.PostWarmUpPrompt:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <PostWarmUpPromptView
                  key={View.PostWarmUpPrompt}
                  workout={currentWorkoutForView}
                  onNavigate={handleNavigation}
                  availableKBChallengeWorkouts={availableKBChallengeWorkouts}
                  availableBWChallengeWorkouts={availableBWChallengeWorkouts}
                  isGeneralPrompt={isGeneralChallengePromptActive}
                />;
      case View.LogWalk: 
        return <LogWalkView key={View.LogWalk} onNavigate={handleNavigation} userName={userName} />;
      case View.PostWalking:
        if (!currentWalkingCompletionData) { setCurrentView(View.Home); return null; }
        return <PostWalkingView key={View.PostWalking} onNavigate={handleNavigation} userName={userName} completionData={currentWalkingCompletionData} />;
      case View.Profile:
         if (!currentWorkoutLevel || !currentWalkingLevel) { loadGlobalStats(); return null; }
        return <ProfileView key={View.Profile} onNavigate={handleNavigation} userName={userName} onNameSave={handleNameSave} totalWorkoutsCompleted={totalWorkoutsCount} currentWorkoutLevel={currentWorkoutLevel} currentWalkingChallengeLevel={currentWalkingLevel} walkingChallengeCurrentDay={walkingChallengeCurrentDay} />;
      case View.Achievements: 
        if (!currentWorkoutLevel || !currentWalkingLevel) { loadGlobalStats(); return null; } 
        return <AchievementsView
                  key={View.Achievements}
                  onNavigate={handleNavigation}
                  userName={userName}
                  totalWorkoutsCompleted={totalWorkoutsCount}
                  currentWorkoutLevel={currentWorkoutLevel}
                  walkingChallengeCurrentDay={walkingChallengeCurrentDay}
                  currentWalkingChallengeLevel={currentWalkingLevel}
                  appShareCount={localStorageService.getAppShareCount()} 
                />;
      case View.SpreadLove:
        return <SpreadLoveView key={View.SpreadLove} onNavigate={handleNavigation} previousView={previousView || View.Home} />;
      case View.Tips:
        return <TipsView key={View.Tips} onNavigate={handleNavigation} previousView={previousView || View.Home} />;
      case View.Diploma:
        if (!diplomaData) {
          if (currentWorkoutForView && currentWorkoutCompletionData && !currentWorkoutCompletionData.abortedByUser) {
            setCurrentView(View.PostWorkout);
            return null;
          }
          setCurrentView(View.Home);
          return null;
        }
        return <DiplomaView key={View.Diploma} diplomaData={diplomaData} onNavigate={handleNavigation} previousView={previousView || View.PostWorkout} />;
      case View.WalkingDiploma:
        if (!walkingDiplomaDataToDisplay) {
          if (currentWalkingCompletionData && !currentWalkingCompletionData.abortedByUser) {
            setCurrentView(View.PostWalking);
            return null;
          }
          setCurrentView(View.Home);
          return null;
        }
        return <WalkingDiplomaView key={View.WalkingDiploma} walkingDiplomaData={walkingDiplomaDataToDisplay} onNavigate={handleNavigation} previousView={previousView || View.PostWalking} />;
      case View.GenerateWorkout:
        return <GenerateWorkoutView key={View.GenerateWorkout} onNavigate={handleNavigation} userName={userName} />;
      // Removed LevelSystemView and WalkingLevelSystemView cases
      default:
        // Fallback for any unhandled view, navigate to Home
        setCurrentView(View.Home);
        return null;
    }
  };

  return renderView();
};
