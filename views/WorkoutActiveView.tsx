import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Workout, View, TimedSegment, ExercisePhaseType, WorkoutFormat, ExerciseInWorkout } from '../types';
import { APP_STRINGS, PREPARE_SEGMENT, BREATHING_CUE_REST } from '../constants';
import { Button } from '../components/Button';
import * as audioService from '../services/audioService';

type WindowTimeoutId = ReturnType<typeof window.setTimeout>;
type WindowIntervalId = ReturnType<typeof window.setInterval>;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === undefined) {
    return "00:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getInitialSegmentState = (segments: TimedSegment[], format: WorkoutFormat) => {
  if (!segments || segments.length === 0) {
    return { initialIndex: 0, initialTime: PREPARE_SEGMENT.durationSeconds };
  }

  let segmentToStartWith: TimedSegment | null = null;
  let indexToStartWith = 0;

  if (segments[0].type === ExercisePhaseType.PREPARE && segments.length > 1) {
    segmentToStartWith = segments[1];
    indexToStartWith = 1;
  } else {
    segmentToStartWith = segments[0];
    indexToStartWith = 0;
  }
  
  if (!segmentToStartWith) {
      return { initialIndex: 0, initialTime: PREPARE_SEGMENT.durationSeconds };
  }

  let initialSegmentTime = segmentToStartWith.durationSeconds;

  if (segmentToStartWith.type === ExercisePhaseType.WORK) {
    if (format === WorkoutFormat.EMOM) {
      initialSegmentTime = 60; 
    } else if (format === WorkoutFormat.AMRAP || format === WorkoutFormat.TIME_CAP) {
      initialSegmentTime = segmentToStartWith.durationSeconds;
    }
  }

  if (initialSegmentTime === undefined || isNaN(initialSegmentTime)) {
    initialSegmentTime = (segmentToStartWith.type === ExercisePhaseType.PREPARE && indexToStartWith === 0)
                         ? PREPARE_SEGMENT.durationSeconds 
                         : 0; 
  }

  return {
    initialIndex: indexToStartWith,
    initialTime: initialSegmentTime,
  };
};


interface WorkoutActiveViewProps {
  workout: Workout;
  onNavigate: (view: View, data?: Workout | { workout: Workout; wasAbortedByUser?: boolean; completedTimeSeconds?: number; }) => void;
  userName: string | null;
}

export const WorkoutActiveView: React.FC<WorkoutActiveViewProps> = ({ workout, onNavigate, userName }): JSX.Element => {
  const { initialIndex, initialTime } = useMemo(
    () => getInitialSegmentState(workout.timedSegments, workout.format),
    [workout.timedSegments, workout.format]
  );

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(initialIndex);
  const [timeLeftInSegment, setTimeLeftInSegment] = useState(initialTime);
  const [overallTimeLeft, setOverallTimeLeft] = useState(workout.totalEstimatedTimeMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showEndWorkoutConfirmation, setShowEndWorkoutConfirmation] = useState(false);

  const currentTimedSegment = workout.timedSegments && workout.timedSegments[currentSegmentIndex] ? workout.timedSegments[currentSegmentIndex] : null;

  const segmentTimerRef = useRef<WindowIntervalId | null>(null);
  const overallTimerRef = useRef<WindowIntervalId | null>(null);
  const wakeLockSentinelRef = useRef<WakeLockSentinel | null>(null);

  const isPausedRef = useRef(isPaused);
  const showEndWorkoutConfirmationRef = useRef(showEndWorkoutConfirmation);
  const overallTimeLeftRef = useRef(overallTimeLeft); 

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { showEndWorkoutConfirmationRef.current = showEndWorkoutConfirmation; }, [showEndWorkoutConfirmation]);
  useEffect(() => { overallTimeLeftRef.current = overallTimeLeft; }, [overallTimeLeft]); 

  const acquireScreenLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) return;
    try {
      wakeLockSentinelRef.current = await navigator.wakeLock.request('screen');
      wakeLockSentinelRef.current.addEventListener('release', () => {
        const currentIsPaused = isPausedRef.current;
        const currentShowEnd = showEndWorkoutConfirmationRef.current;
        wakeLockSentinelRef.current = null; 
        if (document.visibilityState === 'visible' && !currentIsPaused && !currentShowEnd) {
          acquireScreenLock();
        }
      });
    } catch (err: any) {
      wakeLockSentinelRef.current = null;
    }
  }, []);

  const releaseScreenLock = useCallback(async () => {
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
      await wakeLockSentinelRef.current.release().catch((err: any) => console.error(`Wake Lock Release Error: ${err.name}, ${err.message}`));
    }
    wakeLockSentinelRef.current = null;
  }, []);

  const completeWorkout = useCallback((abortedByUser: boolean = false, completedTimeOverrideInSeconds?: number) => {
    releaseScreenLock();
    let finalCompletedTimeSeconds: number | undefined = undefined;

    if (workout.format === WorkoutFormat.TIME_CAP && !abortedByUser) {
      const timeCapTotalSeconds = workout.totalEstimatedTimeMinutes * 60;
      finalCompletedTimeSeconds = completedTimeOverrideInSeconds !== undefined 
        ? completedTimeOverrideInSeconds 
        : (timeCapTotalSeconds - overallTimeLeftRef.current); 
    }
    onNavigate(View.PostWorkout, { workout: { ...workout }, wasAbortedByUser: abortedByUser, completedTimeSeconds: finalCompletedTimeSeconds });
  }, [onNavigate, workout, releaseScreenLock]);

  useEffect(() => {
    if (workout && typeof workout.totalEstimatedTimeMinutes === 'number') {
      setOverallTimeLeft(workout.totalEstimatedTimeMinutes * 60);
    }
  }, [workout]); 

  const handleSegmentCompletion = useCallback(() => {
    if (!currentTimedSegment) return;
    if (currentTimedSegment.type === ExercisePhaseType.WORK || currentTimedSegment.type === ExercisePhaseType.REST) {
        // audioService.playGenericSegmentEndSound(); 
    }

    if (currentSegmentIndex < workout.timedSegments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIndex);
      const nextSegment = workout.timedSegments[nextIndex];
      if (nextSegment) {
        let nextSegmentDuration = nextSegment.durationSeconds;
        if (workout.format === WorkoutFormat.EMOM && nextSegment.type === ExercisePhaseType.WORK) {
            nextSegmentDuration = 60;
        } else if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && nextSegment.type === ExercisePhaseType.WORK) {
            nextSegmentDuration = nextSegment.durationSeconds;
        }
        setTimeLeftInSegment(nextSegmentDuration);

        if (nextSegment.type === ExercisePhaseType.WORK || nextSegment.type === ExercisePhaseType.REST) {
          audioService.playPhaseTransitionSound(nextSegment.type);
        }
      } else {
         completeWorkout(false);
      }
    } else {
      completeWorkout(false);
    }
  }, [currentSegmentIndex, workout.timedSegments, workout.format, completeWorkout, currentTimedSegment]);


  useEffect(() => {
    const shouldBeActive = !isPaused && !showEndWorkoutConfirmation;
    if (shouldBeActive && document.visibilityState === 'visible') {
      acquireScreenLock();
    } else {
      releaseScreenLock();
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPausedRef.current && !showEndWorkoutConfirmationRef.current) acquireScreenLock();
      else releaseScreenLock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleVisibilityChange); 
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
      releaseScreenLock(); 
    };
  }, [isPaused, showEndWorkoutConfirmation, acquireScreenLock, releaseScreenLock]);


  useEffect(() => {
    if (isPaused || showEndWorkoutConfirmation || !currentTimedSegment) {
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
      return;
    }
    
    if (currentSegmentIndex === initialIndex && (currentTimedSegment.type === ExercisePhaseType.WORK || currentTimedSegment.type === ExercisePhaseType.REST)) {
        audioService.playPhaseTransitionSound(currentTimedSegment.type);
    }

    overallTimerRef.current = setInterval(() => {
      setOverallTimeLeft(prevOverall => {
        if (prevOverall <= 1) {
          if (overallTimerRef.current) clearInterval(overallTimerRef.current);
          if (workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) {
            const timeCapFullDurationSeconds = workout.format === WorkoutFormat.TIME_CAP ? workout.totalEstimatedTimeMinutes * 60 : undefined;
            completeWorkout(false, timeCapFullDurationSeconds);
          }
          return 0;
        }
        if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && (prevOverall === 4 || prevOverall === 3 || prevOverall === 2)) {
          audioService.playCountdownSound(prevOverall - 1);
        }
        return prevOverall - 1;
      });
    }, 1000);

    if (currentTimedSegment.type === ExercisePhaseType.PREPARE ||
        workout.format === WorkoutFormat.CLASSIC_ROUNDS ||
        workout.format === WorkoutFormat.EMOM ||
        (workout.format === WorkoutFormat.TIME_CAP && currentTimedSegment.type === ExercisePhaseType.REST && currentTimedSegment.durationSeconds > 0)) {

      segmentTimerRef.current = setInterval(() => {
        setTimeLeftInSegment(prevSegmentTime => {
          if (prevSegmentTime <= 1) {
            handleSegmentCompletion(); 
            return 0; 
          }
          if (currentTimedSegment?.type === ExercisePhaseType.PREPARE &&
              (prevSegmentTime === 4 || prevSegmentTime === 3 || prevSegmentTime === 2)) {
            audioService.playCountdownSound(prevSegmentTime - 1);
          }
          return prevSegmentTime - 1;
        });
      }, 1000);
    } else if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && currentTimedSegment.type === ExercisePhaseType.WORK) {
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      setTimeLeftInSegment(currentTimedSegment.durationSeconds); 
    }

    return () => { 
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
    };
  }, [currentSegmentIndex, isPaused, showEndWorkoutConfirmation, workout.format, handleSegmentCompletion, completeWorkout, currentTimedSegment, workout.totalEstimatedTimeMinutes, initialIndex ]);

  const togglePause = () => setIsPaused(!isPaused);
  const handleConfirmEndWorkout = () => { setShowEndWorkoutConfirmation(false); completeWorkout(true); };
  const handleCancelEndWorkout = () => setShowEndWorkoutConfirmation(false);

  const getNextSegmentName = () => {
    if (currentTimedSegment && currentSegmentIndex < workout.timedSegments.length - 1) {
      const nextSeg = workout.timedSegments[currentSegmentIndex + 1];
      let nextName = nextSeg && nextSeg.name ? nextSeg.name : "Sista övningen!";
      if (nextName === "Sippaus Vila") {
        nextName = "Sippaus";
      }
      return nextName;
    }
    return "Sista övningen!";
  };

  const currentWorkSegmentNumber = useMemo(() => {
    if (workout.format !== WorkoutFormat.CLASSIC_ROUNDS || !currentTimedSegment || currentTimedSegment.type !== ExercisePhaseType.WORK) return 0;
    let count = 0;
    for (let i = 0; i <= currentSegmentIndex; i++) {
      if (workout.timedSegments[i] && workout.timedSegments[i].type === ExercisePhaseType.WORK) {
        count++;
      }
    }
    return count;
  }, [currentSegmentIndex, currentTimedSegment, workout.timedSegments, workout.format]);

  const totalWorkSegments = useMemo(() => {
    if (workout.format !== WorkoutFormat.CLASSIC_ROUNDS) return 0;
    return workout.timedSegments.filter(segment => segment.type === ExercisePhaseType.WORK).length;
  }, [workout.timedSegments, workout.format]);


  if (!workout || !workout.timedSegments || workout.timedSegments.length === 0) {
    return (
        <div className="flex flex-col min-h-screen p-6 items-center justify-center bg-red-100 text-red-700">
            <p className="text-xl">Fel: Träningsdata saknas eller är felaktig.</p>
            <Button onClick={() => onNavigate(View.Home)} variant="secondary" className="mt-4">Tillbaka till Start</Button>
        </div>
    );
  }
  if (currentTimedSegment && currentTimedSegment.type === ExercisePhaseType.PREPARE &&
      currentSegmentIndex === initialIndex && timeLeftInSegment <=0 && workout.timedSegments.length > 1) {
      return (
          <div className="flex flex-col min-h-screen p-6 items-center justify-center bg-[#E4F0F0] text-gray-700">
              <p className="text-xl">Startar passet...</p>
          </div>
      );
  }


  const commonButtons = (isAmrapOrTimeCap: boolean = false) => (
    <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${workout.format === WorkoutFormat.TIME_CAP && isAmrapOrTimeCap ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} w-full`}>
        <Button
            onClick={togglePause}
            variant={isPaused ? "primary" : "pause"}
            className="w-full text-base sm:text-lg py-3"
            disabled={showEndWorkoutConfirmation || (!isAmrapOrTimeCap && timeLeftInSegment <= 0 && currentTimedSegment?.type !== ExercisePhaseType.PREPARE)} 
        >
            {isPaused ? APP_STRINGS.resume : APP_STRINGS.pause}
        </Button>

        {workout.format === WorkoutFormat.TIME_CAP && isAmrapOrTimeCap && (
            <Button
                onClick={() => {
                    const timeCapTotalSeconds = workout.totalEstimatedTimeMinutes * 60;
                    const timeTakenInSeconds = timeCapTotalSeconds - overallTimeLeftRef.current;
                    completeWorkout(false, timeTakenInSeconds);
                }}
                variant="primary"
                className="w-full text-base sm:text-lg py-3 bg-green-500 hover:bg-green-600 border-green-600 active:bg-green-700"
                disabled={isPaused || showEndWorkoutConfirmation}
            >
                {APP_STRINGS.timeCapCompleteWorkoutButton}
            </Button>
        )}

        <Button
            onClick={() => setShowEndWorkoutConfirmation(true)}
            variant="danger"
            className={`w-full text-base sm:text-lg py-3 ${workout.format === WorkoutFormat.TIME_CAP && isAmrapOrTimeCap ? '' : 'sm:col-span-1'}`} 
            disabled={showEndWorkoutConfirmation}
        >
            {APP_STRINGS.endWorkout}
        </Button>
    </div>
  );

  const renderClassicEmomView = () => {
    let rootDivClasses = "flex flex-col min-h-screen text-center text-gray-900 transition-colors duration-500 pb-10";

    if (currentTimedSegment?.type === ExercisePhaseType.REST) {
        rootDivClasses += " bg-sky-100";
    } else if (currentTimedSegment?.type === ExercisePhaseType.PREPARE) {
        rootDivClasses += " bg-[#E4F0F0]"; 
    } else {
        rootDivClasses += " bg-white";
    }

    if (isPaused && !showEndWorkoutConfirmation) {
        rootDivClasses += " opacity-80";
    }
    
    const timerDisplayColorClassic = isPaused ? 'text-yellow-800' : 'text-gray-900';
    const roundLabel = workout.format === WorkoutFormat.EMOM ? 'Övning' : 'Varv';

    const exercisesInSegment = currentTimedSegment?.exercises || [];
    const isEffectivelySingleExerciseDisplay = currentTimedSegment && exercisesInSegment.length === 1 &&
        (currentTimedSegment.name.toLowerCase().includes(exercisesInSegment[0].name.toLowerCase()) ||
         exercisesInSegment[0].name.toLowerCase().includes(currentTimedSegment.name.toLowerCase()));


    return (
      <div className={rootDivClasses}>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
            {currentTimedSegment?.type === ExercisePhaseType.WORK && workout.format === WorkoutFormat.CLASSIC_ROUNDS && (
                <p className="text-xl text-gray-600 mb-2">
                    {roundLabel} {currentWorkSegmentNumber} / {totalWorkSegments}
                </p>
            )}
             {currentTimedSegment?.type === ExercisePhaseType.WORK && workout.format === WorkoutFormat.EMOM && currentTimedSegment.currentRound !== undefined && currentTimedSegment.totalRounds !== undefined && (
                <p className="text-xl text-gray-600 mb-2">
                    {roundLabel} {currentTimedSegment.currentRound} / {currentTimedSegment.totalRounds}
                </p>
            )}

          <h2 className={`text-3xl sm:text-4xl font-bold mb-1 ${currentTimedSegment?.type === ExercisePhaseType.PREPARE ? 'text-gray-700' : 'text-[#51A1A1]'}`}>
            {currentTimedSegment?.name || "Laddar..."}
          </h2>
          <p className="text-gray-600 mb-6 text-lg">{currentTimedSegment?.instructions}</p> {/* Increased text size */}

          <div className={`text-9xl leading-none font-bold font-mono mb-6 ${timerDisplayColorClassic}`}> {/* Reduced text size */}
            {formatTime(timeLeftInSegment)}
          </div>
          
          {currentTimedSegment?.type === ExercisePhaseType.WORK && exercisesInSegment.length > 0 && !isEffectivelySingleExerciseDisplay && (
            <div className="mb-6 w-full max-w-md bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Denna minutens övningar:</h4>
              <ul className="list-disc list-inside text-left text-gray-600 space-y-1">
                {exercisesInSegment.map((ex, idx) => (
                  <li key={idx}>
                    {ex.name} 
                    {ex.reps && <span className="font-medium"> ({ex.reps})</span>}
                    {ex.durationSeconds && <span className="font-medium"> ({ex.durationSeconds}s)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}


          <p className="text-xl text-gray-500 mb-8">{APP_STRINGS.nextExerciseLabel} {getNextSegmentName()}</p>
        </div>
        <div className="p-4 w-full max-w-xl mx-auto">
          {commonButtons(false)}
        </div>
      </div>
    );
  };
  
  const renderAmrapTimeCapView = () => {
    let rootDivClasses = "flex flex-col min-h-screen text-center text-gray-900 transition-colors duration-500 pb-10";
    if (isPaused && !showEndWorkoutConfirmation) {
        rootDivClasses += " bg-gray-200 opacity-80";
    } else {
        rootDivClasses += " bg-white";
    }

    const timerDisplayColorAmrap = isPaused ? 'text-yellow-800' : 'text-[#51A1A1]';
    const exercisesInSegment = currentTimedSegment?.exercises || [];

    return (
      <div className={rootDivClasses}>
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#51A1A1] mb-2">
            {currentTimedSegment?.name || workout.title}
          </h2>
          <p className="text-gray-600 mb-6 text-lg">{currentTimedSegment?.instructions}</p> {/* Increased text size */}

          <div className={`text-9xl leading-none font-bold font-mono mb-6 ${timerDisplayColorAmrap}`}> {/* Reduced text size */}
            {formatTime(overallTimeLeft)}
          </div>

          <div className="mb-6 w-full max-w-md bg-gray-50 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Övningar i cirkeln:</h4>
            <ul className="list-disc list-inside text-left text-gray-600 space-y-1">
              {exercisesInSegment.map((ex, idx) => (
                <li key={idx}>
                  {ex.name} 
                  {ex.reps && <span className="font-medium"> ({ex.reps})</span>}
                  {ex.durationSeconds && <span className="font-medium"> ({ex.durationSeconds}s)</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 w-full max-w-xl mx-auto">
          {commonButtons(true)}
        </div>
      </div>
    );
  };

  if (showEndWorkoutConfirmation && currentTimedSegment) {
    const isWarmup = workout.id.startsWith("warmup-");
    const confirmMessage = isWarmup ? APP_STRINGS.confirmEndWarmupMessage : APP_STRINGS.confirmEndWorkoutMessage;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">{APP_STRINGS.confirmEndWorkoutTitle}</h3>
          <p className="text-gray-700 mb-6 sm:mb-8">{confirmMessage}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={handleConfirmEndWorkout}
              variant="danger"
              className="w-full text-lg"
            >
              {APP_STRINGS.confirmEndWorkoutYesButton}
            </Button>
            <Button
              onClick={handleCancelEndWorkout}
              variant="secondary"
              className="w-full text-lg"
            >
              {APP_STRINGS.confirmEndWorkoutNoButton}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) {
    return renderAmrapTimeCapView();
  }
  return renderClassicEmomView();
};
