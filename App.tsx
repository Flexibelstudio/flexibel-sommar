
import React, { useState, useEffect, useCallback } from 'react';
import { Workout, View, ExercisePhaseType, Level, DiplomaData, CurrentWorkoutCompletionData, PostWarmUpPromptViewProps, WalkingLogEntry, WorkoutLogEntry, CurrentWalkingCompletionData, WalkingDiplomaData, SummerStatusLevel, AchievementCheckData } from './types';
import { HomeView } from './views/HomeView';
import { WorkoutDetailView } from './views/WorkoutDetailView';
import { PreWorkoutCountdownView } from './views/PreWorkoutCountdownView';
import { WorkoutActiveView } from './views/WorkoutActiveView';
import { PostWorkoutView } from './views/PostWorkoutView';
import { LevelSystemView } from './views/LevelSystemView';
import { WalkingLevelSystemView } from './views/WalkingLevelSystemView';
import { ProfileView } from './views/ProfileView';
import { SpreadLoveView } from './views/SpreadLoveView';
import { DiplomaView } from './views/DiplomaView';
import { PostWarmUpPromptView } from './views/PostWarmUpPromptView';
import { TipsView } from './views/TipsView';
import { ActiveWalkingView } from './views/ActiveWalkingView';
import { PostWalkingView } from './views/PostWalkingView';
import { GenerateWorkoutView } from './views/GenerateWorkoutView'; // New view
import { AchievementsView } from './views/AchievementsView'; // New view for achievements
import * as localStorageService from './services/localStorageService';
import * as audioService from './services/audioService';
import { APP_STRINGS, WORKOUTS, LEVEL_DEFINITIONS, getCurrentWorkoutLevel as getWorkoutLevelUtil, WALKING_CHALLENGE_TOTAL_DAYS, getCurrentWalkingLevel as getWalkingLevelUtilFunc, WALKING_LEVEL_DEFINITIONS, WALKING_CHALLENGE_DAILY_MINUTES, MAX_WORKOUT_CHALLENGE_POINTS, MAX_WALKING_CHALLENGE_POINTS, MAX_ACHIEVEMENT_POINTS, TOTAL_SUMMER_SCORE_MAX, SUMMER_STATUS_LEVELS, ACHIEVEMENT_DEFINITIONS, PREPARE_SEGMENT, MYSTERY_ACHIEVEMENT_COUNT_DISPLAY } from './constants';
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

  }, []);


  useEffect(() => {
    const storedName = localStorageService.getUserName();
    if (storedName) setUserName(storedName);
    loadGlobalStats();

    // Check for active walk on initial load
    const activeWalk = localStorageService.getActiveWalkState();
    if (activeWalk && activeWalk.startTime) {
      const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
      if (activeWalk.startTime > twentyFourHoursAgo) {
        // Active walk is recent, attempt to resume
        const recoveredState = {
          startTime: activeWalk.startTime,
          pauseStartTime: activeWalk.pauseStartTime || undefined,
          totalPausedDuration: activeWalk.totalPausedDuration || 0,
        };
        handleNavigation(View.ActiveWalking, recoveredState);
        return; // Skip further initial setup if resuming walk
      } else {
        // Walk is too old, clear it
        localStorageService.clearActiveWalkState();
      }
    }


    const kbFiltered = WORKOUTS.filter(w => w.type === 'kettlebell' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15);
    setAvailableKBChallengeWorkouts(kbFiltered);
    const bwFiltered = WORKOUTS.filter(w => w.type === 'bodyweight' && w.totalEstimatedTimeMinutes >= 10 && w.totalEstimatedTimeMinutes <= 15 && !w.id.startsWith('warmup-'));
    setAvailableBWChallengeWorkouts(bwFiltered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadGlobalStats]); // handleNavigation should be stable if wrapped in useCallback


  const handleNavigation = useCallback((
    view: View,
    data?: Workout | DiplomaData | WalkingDiplomaData | { workout: Workout; wasAbortedByUser?: boolean, completedTimeSeconds?: number } | { startChallenge: 'KB' | 'BW', context?: string } | { initialTimestamp?: number, completedDurationSeconds?: number, distance?: string, steps?: string, comment?: string, context?: string } | { startTime?: number, pauseStartTime?: number, totalPausedDuration?: number }
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

    if ((view === View.PostWorkout || view === View.PostWarmUpPrompt) && newPreviousView === View.ActiveWorkout && data && (data as { workout: Workout }).workout?.id) {
      const navData = data as { workout: Workout; wasAbortedByUser?: boolean, completedTimeSeconds?: number };
      const completedWorkoutObject = WORKOUTS.find(w => w.id === navData.workout.id) || navData.workout;
      const wasAborted = navData.wasAbortedByUser || false;

      setSelectedWorkout(completedWorkoutObject);
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
        completedTimeSeconds: navData.completedTimeSeconds,
      });

      setDiplomaData(null);
      setWalkingDiplomaDataToDisplay(null);
      if (!wasAborted) {
          loadGlobalStats();
      }
      setCurrentView(View.PostWorkout);
      return;
    }

    if (view === View.PostWalking && newPreviousView === View.ActiveWalking) {
        const navData = data as { initialTimestamp?: number, completedDurationSeconds?: number, distance?: string, steps?: string, comment?: string };
        const actualDurationSeconds = navData?.completedDurationSeconds || 0;
        const challengeCompleted = actualDurationSeconds >= (WALKING_CHALLENGE_DAILY_MINUTES * 60);
        const effectiveAbortedState = !challengeCompleted;

        const endTime = new Date();
        const startTime = navData?.initialTimestamp ? new Date(navData.initialTimestamp) : endTime;

        const localEndTime = new Date(); // Use local time for date operations
        const localTodayStr = `${localEndTime.getFullYear()}-${(localEndTime.getMonth() + 1).toString().padStart(2, '0')}-${localEndTime.getDate().toString().padStart(2, '0')}`;


        let currentChallengeDayValue = localStorageService.getWalkingChallengeCurrentDay();
        let currentWalkingStreakValue = localStorageService.getWalkingChallengeStreak();
        const lastWalkCompletionDate = localStorageService.getWalkingChallengeLastCompletionDate(); // This will be a local date string
        let didWalkingLevelUp = false;
        let walkingLevelAfter = getWalkingLevelUtilFunc(currentChallengeDayValue);
        let distanceToLog = navData?.distance;
        let stepsToLog = navData?.steps;
        let commentToLog = navData?.comment;

        if (challengeCompleted) {
            const previousChallengeDay = currentChallengeDayValue;
            if (lastWalkCompletionDate !== localTodayStr || currentChallengeDayValue === 0) {
                 currentChallengeDayValue = Math.min(currentChallengeDayValue + 1, WALKING_CHALLENGE_TOTAL_DAYS);
            }
            localStorageService.saveWalkingChallengeCurrentDay(currentChallengeDayValue);
            localStorageService.saveWalkingChallengeLastCompletionDate(localTodayStr);

            walkingLevelAfter = getWalkingLevelUtilFunc(currentChallengeDayValue);

            const walkingLogEntry: WalkingLogEntry = {
                dateCompleted: localTodayStr, // Store local date
                challengeDay: currentChallengeDayValue,
                durationMinutes: Math.floor(actualDurationSeconds / 60),
                levelNameAtCompletion: walkingLevelAfter.name,
                streakAtCompletion: currentWalkingStreakValue, // Streak before potential update for today
                distance: distanceToLog,
                steps: stepsToLog,
                actualStartTime: startTime.toISOString(),
                comment: commentToLog,
            };
            
            // Update streak based on local dates
            if (lastWalkCompletionDate) {
                const localYesterday = new Date(localEndTime);
                localYesterday.setDate(localEndTime.getDate() - 1);
                const localYesterdayStr = `${localYesterday.getFullYear()}-${(localYesterday.getMonth() + 1).toString().padStart(2, '0')}-${localYesterday.getDate().toString().padStart(2, '0')}`;

                if (lastWalkCompletionDate === localYesterdayStr) {
                    currentWalkingStreakValue++;
                } else if (lastWalkCompletionDate !== localTodayStr) { // Reset if not yesterday and not today (means a missed day)
                    currentWalkingStreakValue = 1;
                }
                // If lastWalkCompletionDate IS localTodayStr, streak is already correct for today, no change needed here for it.
            } else { // No previous completion, so today is the first day of a new streak
                currentWalkingStreakValue = 1;
            }
            localStorageService.saveWalkingChallengeStreak(currentWalkingStreakValue);

            walkingLogEntry.streakAtCompletion = currentWalkingStreakValue; // Ensure log has the *updated* streak
            localStorageService.saveWalkingLogEntry(walkingLogEntry);

            const walkingLevelBefore = getWalkingLevelUtilFunc(previousChallengeDay);
            didWalkingLevelUp = walkingLevelAfter.name !== walkingLevelBefore.name && currentChallengeDayValue > 0;
        }

        setCurrentWalkingCompletionData({
            dateTime: endTime,
            actualStartTime: startTime,
            newChallengeDay: currentChallengeDayValue,
            currentStreak: currentWalkingStreakValue,
            level: walkingLevelAfter,
            didLevelUp: didWalkingLevelUp,
            abortedByUser: effectiveAbortedState,
            distance: distanceToLog,
            steps: stepsToLog,
            comment: commentToLog,
            completedDurationSeconds: actualDurationSeconds,
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
    } else if (view === View.WalkingDiploma && data && typeof (data as WalkingDiplomaData).totalWalkingDaysAtThisPoint === 'number' && (data as WalkingDiplomaData).completionDateTime) {
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
                // If it's already there, update its name and ensure other properties match the constant
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
    } else if (selectedWorkout && view !== View.Diploma && view !== View.WalkingDiploma && view !== View.ActiveWalking && view !== View.PostWalking && view !== View.WalkingLevelSystem && view !== View.GenerateWorkout && view !== View.Achievements) {
        workoutToPass = WORKOUTS.find(w => w.id === selectedWorkout.id) || {...selectedWorkout};
         if ((view === View.PreWorkoutCountdown || view === View.ActiveWorkout) && userName && workoutToPass.timedSegments) {
            const prepareSegmentCopy = { ...PREPARE_SEGMENT, name: APP_STRINGS.prepareSegmentTitlePersonalized.replace('{name}', userName) };
             if (workoutToPass.timedSegments.length > 0 && workoutToPass.timedSegments[0].type === ExercisePhaseType.PREPARE) {
                // Ensure properties match the constant
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
      if (previousView === View.PostWalking && data) {
          const postWalkingNavData = data as { initialTimestamp?: number, completedDurationSeconds?: number, distance?: string, steps?: string, comment?: string };
          const durationForLog = postWalkingNavData.completedDurationSeconds || 0;
          if (durationForLog >= (WALKING_CHALLENGE_DAILY_MINUTES * 60) && (postWalkingNavData.distance || postWalkingNavData.steps || postWalkingNavData.comment)) {
              
              const localCompletionDate = new Date(); // Date of navigating home from PostWalking
              const localTodayStr = `${localCompletionDate.getFullYear()}-${(localCompletionDate.getMonth() + 1).toString().padStart(2, '0')}-${localCompletionDate.getDate().toString().padStart(2, '0')}`;
              const logs = localStorageService.getWalkingLog();
              const dayNumberOfCompletedWalk = localStorageService.getWalkingChallengeCurrentDay();

              const todaysLogIndex = logs.findIndex(log => log.dateCompleted === localTodayStr && log.challengeDay === dayNumberOfCompletedWalk);

              if (todaysLogIndex !== -1) {
                  const updatedEntry = { ...logs[todaysLogIndex] };
                  if (postWalkingNavData.distance) updatedEntry.distance = postWalkingNavData.distance;
                  if (postWalkingNavData.steps) updatedEntry.steps = postWalkingNavData.steps;
                  if (postWalkingNavData.comment) updatedEntry.comment = postWalkingNavData.comment;
                  updatedEntry.durationMinutes = Math.floor(durationForLog / 60);
                  if (postWalkingNavData.initialTimestamp) {
                    updatedEntry.actualStartTime = new Date(postWalkingNavData.initialTimestamp).toISOString();
                  }
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

    if (view === View.LevelSystem || view === View.WalkingLevelSystem || view === View.Profile || view === View.Tips || view === View.GenerateWorkout || view === View.Achievements) {
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
    if (trimmedName) localStorageService.saveUserName(trimmedName);
    else localStorageService.removeUserName();
    setUserName(trimmedName || null);
    loadGlobalStats();
  };

  const renderView = () => {
    const currentWorkoutForView = selectedWorkout;
    const activeWalk = localStorageService.getActiveWalkState();

    // If navigating to ActiveWalking, check for recovered state
    if (currentView === View.ActiveWalking && activeWalk && activeWalk.startTime) {
        const recoveredState = {
          startTime: activeWalk.startTime,
          pauseStartTime: activeWalk.pauseStartTime || undefined,
          totalPausedDuration: activeWalk.totalPausedDuration || 0,
        };
        return <ActiveWalkingView onNavigate={handleNavigation} userName={userName} recoveredState={recoveredState} />;
    }

    switch (currentView) {
      case View.Home:
        return <HomeView
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
                  TOTAL_SUMMER_SCORE_MAX={TOTAL_SUMMER_SCORE_MAX} // Actual max for progress bar
                  currentSummerStatusLevelName={currentSummerStatusLevelName}
                  maxWorkoutPoints={MAX_WORKOUT_CHALLENGE_POINTS} // Actual for display
                  maxWalkingPoints={MAX_WALKING_CHALLENGE_POINTS} // Actual for display
                  maxAchievementPoints={MYSTERY_ACHIEVEMENT_COUNT_DISPLAY} // Mystery for display
                />;
      case View.WorkoutDetail:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <WorkoutDetailView workout={currentWorkoutForView} onNavigate={handleNavigation} />;
      case View.PreWorkoutCountdown:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <PreWorkoutCountdownView workout={currentWorkoutForView} onNavigate={handleNavigation} />;
      case View.ActiveWorkout:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <WorkoutActiveView workout={currentWorkoutForView} onNavigate={handleNavigation} userName={userName} />;
      case View.PostWorkout:
        if (!currentWorkoutForView || !currentWorkoutCompletionData) { setCurrentView(View.Home); return null; }
        return <PostWorkoutView workout={currentWorkoutForView} onNavigate={handleNavigation} userName={userName} completionData={currentWorkoutCompletionData} />;
      case View.PostWarmUpPrompt:
        if (!currentWorkoutForView) { setCurrentView(View.Home); return null; }
        return <PostWarmUpPromptView
                  workout={currentWorkoutForView}
                  onNavigate={handleNavigation}
                  availableKBChallengeWorkouts={availableKBChallengeWorkouts}
                  availableBWChallengeWorkouts={availableBWChallengeWorkouts}
                  isGeneralPrompt={isGeneralChallengePromptActive}
                />;
      case View.ActiveWalking:
        // This case is now handled above for recovery, otherwise it's a new walk
        return <ActiveWalkingView onNavigate={handleNavigation} userName={userName} recoveredState={null} />;
      case View.PostWalking:
        if (!currentWalkingCompletionData) { setCurrentView(View.Home); return null; }
        return <PostWalkingView onNavigate={handleNavigation} userName={userName} completionData={currentWalkingCompletionData} />;
      case View.LevelSystem:
        if (!currentWorkoutLevel) { loadGlobalStats(); return null; }
        return <LevelSystemView onNavigate={handleNavigation} userName={userName} totalWorkoutsCompleted={totalWorkoutsCount} currentLevel={currentWorkoutLevel} />;
      case View.WalkingLevelSystem:
        if (!currentWalkingLevel) { loadGlobalStats(); return null; }
        return <WalkingLevelSystemView onNavigate={handleNavigation} userName={userName} totalWalkingDaysCompleted={walkingChallengeCurrentDay} currentWalkingLevelProp={currentWalkingLevel} />;
      case View.Profile:
         if (!currentWorkoutLevel || !currentWalkingLevel) { loadGlobalStats(); return null; }
        return <ProfileView onNavigate={handleNavigation} userName={userName} onNameSave={handleNameSave} totalWorkoutsCompleted={totalWorkoutsCount} currentWorkoutLevel={currentWorkoutLevel} currentWalkingChallengeLevel={currentWalkingLevel} walkingChallengeCurrentDay={walkingChallengeCurrentDay} />;
      case View.Achievements: 
        if (!currentWorkoutLevel || !currentWalkingLevel) { loadGlobalStats(); return null; }
        return <AchievementsView
                  onNavigate={handleNavigation}
                  userName={userName}
                  totalWorkoutsCompleted={totalWorkoutsCount}
                  currentWorkoutLevel={currentWorkoutLevel}
                  walkingChallengeCurrentDay={walkingChallengeCurrentDay}
                  currentWalkingChallengeLevel={currentWalkingLevel}
                  appShareCount={localStorageService.getAppShareCount()} // Pass appShareCount
                />;
      case View.SpreadLove:
        return <SpreadLoveView onNavigate={handleNavigation} previousView={previousView || View.Home} />;
      case View.Tips:
        return <TipsView onNavigate={handleNavigation} previousView={previousView || View.Home} />;
      case View.Diploma:
        if (!diplomaData) {
          if (currentWorkoutForView && currentWorkoutCompletionData && !currentWorkoutCompletionData.abortedByUser) {
            setCurrentView(View.PostWorkout);
            return null;
          }
          setCurrentView(View.Home);
          return null;
        }
        return <DiplomaView diplomaData={diplomaData} onNavigate={handleNavigation} previousView={previousView || View.PostWorkout} />;
      case View.WalkingDiploma:
        if (!walkingDiplomaDataToDisplay) {
          if (currentWalkingCompletionData && !currentWalkingCompletionData.abortedByUser) {
            setCurrentView(View.PostWalking);
            return null;
          }
          setCurrentView(View.Home);
          return null;
        }
        return <WalkingDiplomaView walkingDiplomaData={walkingDiplomaDataToDisplay} onNavigate={handleNavigation} previousView={previousView || View.PostWalking} />;
      case View.GenerateWorkout:
        return <GenerateWorkoutView onNavigate={handleNavigation} userName={userName} />;
      default:
        setCurrentView(View.Home);
        return null;
    }
  };

  return (
    <div className="app-container flex flex-col bg-gray-50 relative min-h-screen">
      <div className="flex-grow">
        {renderView()}
      </div>
      <footer className="w-full bg-white text-center p-4 text-sm text-gray-700 border-t border-gray-200 mt-auto">
        {APP_STRINGS.homeViewFooterText}
      </footer>
    </div>
  );
};
