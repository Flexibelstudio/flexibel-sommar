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

  // If the first segment is PREPARE and there are subsequent segments,
  // it implies the 10s PreWorkoutCountdownView might have run.
  // We then start WorkoutActiveView with the *next* segment.
  if (segments[0].type === ExercisePhaseType.PREPARE && segments.length > 1) {
    segmentToStartWith = segments[1];
    indexToStartWith = 1;
  } else {
    // Otherwise, start with the first segment provided (could be a PREPARE if no pre-countdown, or straight to WORK/REST)
    segmentToStartWith = segments[0];
    indexToStartWith = 0;
  }
  
  if (!segmentToStartWith) {
      // Fallback if logic somehow results in no segment (should not happen with current structure)
      return { initialIndex: 0, initialTime: PREPARE_SEGMENT.durationSeconds };
  }

  let initialSegmentTime = segmentToStartWith.durationSeconds;

  // Specific duration overrides based on format for the *actual first timed segment*
  if (segmentToStartWith.type === ExercisePhaseType.WORK) {
    if (format === WorkoutFormat.EMOM) {
      initialSegmentTime = 60; 
    } else if (format === WorkoutFormat.AMRAP || format === WorkoutFormat.TIME_CAP) {
      // For AMRAP/TIME_CAP, the WORK segment's duration IS the total time for that block/task.
      initialSegmentTime = segmentToStartWith.durationSeconds;
    }
  }

  // Ensure initialSegmentTime is a valid number, default if not.
  if (initialSegmentTime === undefined || isNaN(initialSegmentTime)) {
    // If it's the PREPARE segment at index 0 (meaning no PreWorkoutCountdownView ran), use its defined duration.
    initialSegmentTime = (segmentToStartWith.type === ExercisePhaseType.PREPARE && indexToStartWith === 0)
                         ? PREPARE_SEGMENT.durationSeconds 
                         : 0; // Default to 0 if duration is missing for other types.
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
        // console.log('Screen Wake Lock released.');
        const currentIsPaused = isPausedRef.current;
        const currentShowEnd = showEndWorkoutConfirmationRef.current;
        wakeLockSentinelRef.current = null; // Important to clear the ref
        // Re-acquire if the release was automatic and app should still have lock
        if (document.visibilityState === 'visible' && !currentIsPaused && !currentShowEnd) {
          // console.log('Re-acquiring lock after automatic release.');
          acquireScreenLock();
        }
      });
      // console.log('Screen Wake Lock acquired.');
    } catch (err: any) {
      // console.error(`Could not acquire Screen Wake Lock: ${err.name}, ${err.message}.`);
      wakeLockSentinelRef.current = null;
    }
  }, []);

  const releaseScreenLock = useCallback(async () => {
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
      // console.log('Attempting to release Screen Wake Lock.');
      await wakeLockSentinelRef.current.release().catch((err: any) => console.error(`Wake Lock Release Error: ${err.name}, ${err.message}`));
    }
    wakeLockSentinelRef.current = null;
  }, []);

  const completeWorkout = useCallback((abortedByUser: boolean = false, completedTimeOverrideInSeconds?: number) => {
    releaseScreenLock();
    let finalCompletedTimeSeconds: number | undefined = undefined;

    if (workout.format === WorkoutFormat.TIME_CAP && !abortedByUser) {
      const timeCapTotalSeconds = workout.totalEstimatedTimeMinutes * 60;
      // If completedTimeOverrideInSeconds is provided (e.g., user finished early or timer ran out), use it.
      // This value should represent the actual time taken by the user.
      finalCompletedTimeSeconds = completedTimeOverrideInSeconds !== undefined 
        ? completedTimeOverrideInSeconds 
        : (timeCapTotalSeconds - overallTimeLeftRef.current); // Fallback, though override should usually be present
    }
    // console.log("Navigating to PostWorkout with data:", { workout: { ...workout }, wasAbortedByUser: abortedByUser, completedTimeSeconds: finalCompletedTimeSeconds });
    onNavigate(View.PostWorkout, { workout: { ...workout }, wasAbortedByUser: abortedByUser, completedTimeSeconds: finalCompletedTimeSeconds });
  }, [onNavigate, workout, releaseScreenLock]);

  useEffect(() => {
    // Initialize overallTimeLeft from workout prop
    if (workout && typeof workout.totalEstimatedTimeMinutes === 'number') {
      setOverallTimeLeft(workout.totalEstimatedTimeMinutes * 60);
    }
  }, [workout]); // Only re-run if workout object itself changes

  const handleSegmentCompletion = useCallback(() => {
    if (!currentTimedSegment) return;
    // console.log(`Segment ${currentTimedSegment.name} completed.`);
    // Play sound for segment end (e.g., a single "chime")
    if (currentTimedSegment.type === ExercisePhaseType.WORK || currentTimedSegment.type === ExercisePhaseType.REST) {
        // audioService.playGenericSegmentEndSound(); // Example: a generic sound indicating segment end
    }

    if (currentSegmentIndex < workout.timedSegments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIndex);
      const nextSegment = workout.timedSegments[nextIndex];
      if (nextSegment) {
        let nextSegmentDuration = nextSegment.durationSeconds;
        // Override duration for EMOM work segments
        if (workout.format === WorkoutFormat.EMOM && nextSegment.type === ExercisePhaseType.WORK) {
            nextSegmentDuration = 60;
        } else if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && nextSegment.type === ExercisePhaseType.WORK) {
            // For AMRAP/TimeCap, duration is the total time for that task/circuit
            nextSegmentDuration = nextSegment.durationSeconds;
        }
        setTimeLeftInSegment(nextSegmentDuration);
        // console.log(`Moving to next segment: ${nextSegment.name}, duration: ${nextSegmentDuration}`);

        // Play sound for new segment start
        if (nextSegment.type === ExercisePhaseType.WORK || nextSegment.type === ExercisePhaseType.REST) {
          audioService.playPhaseTransitionSound(nextSegment.type);
        }
      } else {
         // console.log("No next segment, completing workout.");
         completeWorkout(false);
      }
    } else {
      // console.log("Last segment finished, completing workout.");
      completeWorkout(false);
    }
  }, [currentSegmentIndex, workout.timedSegments, workout.format, completeWorkout, currentTimedSegment]);


  useEffect(() => {
    const shouldBeActive = !isPaused && !showEndWorkoutConfirmation;
    // Manage screen lock
    if (shouldBeActive && document.visibilityState === 'visible') {
      acquireScreenLock();
    } else {
      releaseScreenLock();
    }
    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPausedRef.current && !showEndWorkoutConfirmationRef.current) acquireScreenLock();
      else releaseScreenLock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleVisibilityChange); // Consider fullscreen changes too
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
      releaseScreenLock(); // Ensure lock is released on unmount
    };
  }, [isPaused, showEndWorkoutConfirmation, acquireScreenLock, releaseScreenLock]);


  // Main timer useEffect
  useEffect(() => {
    if (isPaused || showEndWorkoutConfirmation || !currentTimedSegment) {
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
      return;
    }
    
    // Play transition sound for the very first WORK/REST segment if WorkoutActiveView starts directly with it
    if (currentSegmentIndex === initialIndex && (currentTimedSegment.type === ExercisePhaseType.WORK || currentTimedSegment.type === ExercisePhaseType.REST)) {
        audioService.playPhaseTransitionSound(currentTimedSegment.type);
    }

    // Overall Timer (always runs unless paused or workout ends)
    overallTimerRef.current = setInterval(() => {
      setOverallTimeLeft(prevOverall => {
        if (prevOverall <= 1) {
          if (overallTimerRef.current) clearInterval(overallTimerRef.current);
          // For AMRAP/TimeCap, this means time is up. For Classic/EMOM, it's an estimated end.
          if (workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) {
            // When overall timer runs out for TimeCap, the user took the full duration.
            const timeCapFullDurationSeconds = workout.format === WorkoutFormat.TIME_CAP ? workout.totalEstimatedTimeMinutes * 60 : undefined;
            completeWorkout(false, timeCapFullDurationSeconds);
          }
          // For Classic/EMOM, completion is handled by segment timer finishing all segments
          return 0;
        }
        // Overall countdown for AMRAP/TimeCap
        if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && (prevOverall === 4 || prevOverall === 3 || prevOverall === 2)) {
          audioService.playCountdownSound(prevOverall - 1);
        }
        return prevOverall - 1;
      });
    }, 1000);

    // Segment-specific Timer
    // Runs for PREPARE, CLASSIC_ROUNDS (WORK/REST), EMOM (WORK), and TIME_CAP (REST with duration)
    if (currentTimedSegment.type === ExercisePhaseType.PREPARE ||
        workout.format === WorkoutFormat.CLASSIC_ROUNDS ||
        workout.format === WorkoutFormat.EMOM ||
        (workout.format === WorkoutFormat.TIME_CAP && currentTimedSegment.type === ExercisePhaseType.REST && currentTimedSegment.durationSeconds > 0)) {

      segmentTimerRef.current = setInterval(() => {
        setTimeLeftInSegment(prevSegmentTime => {
          if (prevSegmentTime <= 1) {
            handleSegmentCompletion(); // This will clear the interval by changing segment or completing workout
            return 0; // Return 0 to stop this specific tick from going negative
          }
          // Countdown sounds ONLY for PREPARE segments
          if (currentTimedSegment?.type === ExercisePhaseType.PREPARE &&
              (prevSegmentTime === 4 || prevSegmentTime === 3 || prevSegmentTime === 2)) {
            audioService.playCountdownSound(prevSegmentTime - 1);
          }
          return prevSegmentTime - 1;
        });
      }, 1000);
    } else if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && currentTimedSegment.type === ExercisePhaseType.WORK) {
      // For AMRAP/TimeCap WORK segments, there's no individual segment timer counting down.
      // The overall timer handles the countdown. We just display the (static) durationSeconds of the task.
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      setTimeLeftInSegment(currentTimedSegment.durationSeconds); // Should be 0 for "for time" tasks
    }

    return () => { 
      if (segmentTimerRef.current) clearInterval(segmentTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
    };
  // Key dependencies for re-running this effect.
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

  // Calculate current work segment number for CLASSIC_ROUNDS
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

  // Calculate total work segments for CLASSIC_ROUNDS
  const totalWorkSegments = useMemo(() => {
    if (workout.format !== WorkoutFormat.CLASSIC_ROUNDS) return 0;
    return workout.timedSegments.filter(segment => segment.type === ExercisePhaseType.WORK).length;
  }, [workout.timedSegments, workout.format]);


  // Loading / Error States
  if (!workout || !workout.timedSegments || workout.timedSegments.length === 0) {
    return (
        <div className="flex flex-col min-h-screen p-6 items-center justify-center bg-red-100 text-red-700">
            <p className="text-xl">Fel: Träningsdata saknas eller är felaktig.</p>
            <Button onClick={() => onNavigate(View.Home)} variant="secondary" className="mt-4">Tillbaka till Start</Button>
        </div>
    );
  }
  // If the very first segment (PREPARE) has timed out but next segment hasn't rendered yet
  if (currentTimedSegment && currentTimedSegment.type === ExercisePhaseType.PREPARE &&
      currentSegmentIndex === initialIndex && timeLeftInSegment <=0 && workout.timedSegments.length > 1) {
      // This state should be very brief. Render a simple loading message.
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
            disabled={showEndWorkoutConfirmation || (!isAmrapOrTimeCap && timeLeftInSegment <= 0 && currentTimedSegment?.type !== ExercisePhaseType.PREPARE)} // Disable if segment ended unless it's AMRAP/TimeCap or PREPARE
        >
            {isPaused ? APP_STRINGS.resume : APP_STRINGS.pause}
        </Button>

        {workout.format === WorkoutFormat.TIME_CAP && isAmrapOrTimeCap && (
            <Button
                onClick={() => {
                    // User clicked "Jag är färdig!" for Time Cap.
                    // The time taken is the total cap time minus whatever time is left on the overall timer.
                    const timeCapTotalSeconds = workout.totalEstimatedTimeMinutes * 60;
                    const timeTakenInSeconds = timeCapTotalSeconds - overallTimeLeftRef.current;
                    // Ensure timeTakenInSeconds is correctly representing the duration spent in the workout
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
            className={`w-full text-base sm:text-lg py-3 ${workout.format === WorkoutFormat.TIME_CAP && isAmrapOrTimeCap ? '' : 'sm:col-span-1'}`} // Adjust span for 3-col layout
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
    // Heuristic: if segment name largely contains the first exercise name, or vice-versa, it's likely a single-exercise focused display.
    const isEffectivelySingleExerciseDisplay = currentTimedSegment && exercisesInSegment.length === 1 &&
        (currentTimedSegment.name.toLowerCase().includes(exercisesInSegment[0].name.toLowerCase()) ||
         exercisesInSegment[0].name.toLowerCase().includes(currentTimedSegment.name.toLowerCase()));

    let mainInstructionDisplay = "";
    if (isEffectivelySingleExerciseDisplay && exercisesInSegment[0].instructions) {
        mainInstructionDisplay = exercisesInSegment[0].instructions;
    } else if (currentTimedSegment?.instructions) {
        mainInstructionDisplay = currentTimedSegment.instructions;
    }

    let segmentNameDisplay = currentTimedSegment?.name;
    if (segmentNameDisplay === "Sippaus Vila") {
        segmentNameDisplay = "Sippaus";
    }


    return (
      <div className={rootDivClasses}>
        <div className="flex-grow flex flex-col items-center justify-start p-4 pt-8 overflow-y-auto">
            <main className="flex flex-col items-center justify-center bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
            {currentTimedSegment ? (
                <>
                <h2 className="text-6xl font-semibold mb-2 text-gray-800 text-center leading-tight break-words">
                    {currentTimedSegment.type === ExercisePhaseType.PREPARE
                        ? (segmentNameDisplay || APP_STRINGS.prepareSegmentTitlePersonalized.replace('{name}', userName || "Dig"))
                        : (segmentNameDisplay) 
                    }
                </h2>

                 <div
                    className={`text-[7.9rem] sm:text-[10.5rem] font-mono font-extrabold my-0 ${timerDisplayColorClassic} leading-none`}
                    dangerouslySetInnerHTML={{__html: formatTime(timeLeftInSegment).replace(':', '<span class="mx-[-0.08em] sm:mx-[-0.1em]">:</span>')}}
                  >
                  </div>
                
                {mainInstructionDisplay && (
                    <p className="text-2xl text-gray-700 mb-3 px-3 max-w-full leading-snug text-center overflow-hidden">
                        {mainInstructionDisplay}
                    </p>
                )}

                {/* Detailed exercise list if segment isn't a single-exercise display OR if exercises array has items */}
                {(!isEffectivelySingleExerciseDisplay && exercisesInSegment.length > 0) && (
                    <div className="mt-4 text-left w-full border-t pt-3">
                        <h4 className="text-md font-semibold text-gray-600 mb-2 text-center">Detta block innehåller:</h4>
                        <ul className="list-none space-y-2">
                            {exercisesInSegment.map((ex, idx) => (
                            <li key={idx} className="text-gray-700 bg-gray-50 p-2 rounded">
                                <span className="font-medium text-gray-800 block text-center text-2xl">
                                  {ex.reps ? `${ex.reps} ` : ''}{ex.name}
                                </span>
                                {ex.durationSeconds && ( // Show duration on a new line if it exists
                                    <span className="block text-lg text-gray-600 text-center">
                                        {`${ex.durationSeconds}s`}
                                    </span>
                                )}
                                {ex.instructions && ex.instructions !== mainInstructionDisplay && (
                                    <span className="block text-base text-gray-500 italic mt-1 text-center">{ex.instructions}</span>
                                )}
                            </li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className="w-full pt-3 mt-3 border-t border-gray-200">
                    {/* Moved Next Exercise Info here */}
                    {currentTimedSegment.type !== ExercisePhaseType.PREPARE && (
                        <p className="text-lg text-gray-700 leading-normal font-bold mb-2">
                            {APP_STRINGS.nextExerciseLabel} {getNextSegmentName()}
                        </p>
                    )}
                    <div className="space-y-2 text-lg text-gray-700">
                        {currentTimedSegment.type !== ExercisePhaseType.PREPARE && currentTimedSegment.currentRound && currentTimedSegment.totalRounds && (
                            <p>{roundLabel} {currentTimedSegment.currentRound} av {currentTimedSegment.totalRounds}</p>
                        )}
                        {workout.format === WorkoutFormat.CLASSIC_ROUNDS && currentTimedSegment.type === ExercisePhaseType.WORK && totalWorkSegments > 0 && (
                            <p>Övning {currentWorkSegmentNumber} av {totalWorkSegments}</p>
                        )}
                    </div>
                    <div className="space-y-2 mt-3">
                        {overallTimeLeft > 0 && currentTimedSegment.type !== ExercisePhaseType.PREPARE && (
                            <p className="text-lg text-gray-700 leading-normal">{APP_STRINGS.timeCapOverallTimer} {formatTime(overallTimeLeft)}</p>
                        )}
                         {/* Next Exercise was here, now removed */}
                    </div>
                </div>
                </>
            ) : (
                <p className="text-xl">Laddar passinformation...</p>
            )}
            </main>
            <footer className="w-full max-w-md mt-6 p-4 bg-white border-t-2 border-gray-200 rounded-lg shadow-md">
                {commonButtons(false)}
            </footer>
        </div>
      </div>
    );
  };

  const renderAmrapTimeCapView = () => {
    let bgColor = 'bg-gray-50'; 
    if (isPaused) {
        bgColor = 'bg-yellow-50';
    } else if (currentTimedSegment?.type === ExercisePhaseType.REST) {
        bgColor = 'bg-sky-100';
    }

    const textColor = isPaused ? 'text-yellow-700' : 'text-gray-800';
    const titleColor = isPaused ? 'text-yellow-800' : 'text-[#51A1A1]';
    const timerDisplayColor = isPaused ? 'text-yellow-800' : 'text-gray-900';

    let displayedInstructions = currentTimedSegment?.instructions || workout.detailedDescription || "";
    const amrapTimeCapInstructionRegex = /(Slutför\s+\d+\s+varv\s+av:|Uppgift:.*?Snabbt\s+Som\s+Möjligt(?:[\s.:])?|Pyramid:.*?Max tid \d+ min\.)/i;
    const match = displayedInstructions.match(amrapTimeCapInstructionRegex);
    
    let mainInstructionPart = "";
    let restOfInstructions = "";

    if (match && match[0]) {
      mainInstructionPart = `<span class="text-xl sm:text-2xl font-medium block mb-2">${match[0]}</span>`;
      restOfInstructions = displayedInstructions.substring(match[0].length).trim();
      const breathingCueToRemove = `(Vila smart. ${BREATHING_CUE_REST})`;
      const breathingCueToRemoveParentheses = `(${BREATHING_CUE_REST})`; 
      if (restOfInstructions.startsWith(breathingCueToRemove)) {
          restOfInstructions = restOfInstructions.substring(breathingCueToRemove.length).trim();
      } else if (restOfInstructions.startsWith(breathingCueToRemoveParentheses)) {
          restOfInstructions = restOfInstructions.substring(breathingCueToRemoveParentheses.length).trim();
      }
      if (restOfInstructions) {
          displayedInstructions = mainInstructionPart + `<span class="text-base">${restOfInstructions}</span>`;
      } else {
          displayedInstructions = mainInstructionPart;
      }
    } else {
        let tempInstructions = displayedInstructions;
        const breathingCueToRemove = `(Vila smart. ${BREATHING_CUE_REST})`;
        const breathingCueToRemoveParentheses = `(${BREATHING_CUE_REST})`;
        if (tempInstructions.includes(breathingCueToRemove)) {
            tempInstructions = tempInstructions.replace(breathingCueToRemove, "").trim();
        } else if (tempInstructions.includes(breathingCueToRemoveParentheses)) {
            tempInstructions = tempInstructions.replace(breathingCueToRemoveParentheses, "").trim();
        }
        displayedInstructions = `<span class="text-xl sm:text-2xl font-medium">${tempInstructions}</span>`;
    }


    return (
      <div className={`min-h-screen flex flex-col ${bgColor} transition-colors duration-300 pb-10`}>
        <div className={`text-center pt-8 pb-4 ${textColor}`}>
          <h2 className={`text-5xl sm:text-6xl font-bold ${titleColor} mb-2 sm:mb-3 px-4 break-words`}>{workout.title}</h2>
          <div 
            className={`text-[7.9rem] sm:text-[10.5rem] font-mono font-extrabold ${timerDisplayColor} leading-none`} 
            dangerouslySetInnerHTML={{__html: formatTime(overallTimeLeft).replace(':', '<span class="mx-[-0.08em] sm:mx-[-0.1em]">:</span>')}}>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center px-4 py-4 overflow-y-auto">
          <div className={`bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto ${isPaused ? 'opacity-60' : ''}`}>
            <div
                className="text-gray-700 mb-5 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: displayedInstructions }}
            />

            {currentTimedSegment?.exercises && currentTimedSegment.exercises.length > 0 ? (
              <ul className="space-y-4 list-none text-gray-700 mt-4">
                {currentTimedSegment.exercises.map((ex: ExerciseInWorkout, index: number) => {
                  let exerciseDisplayText = "";
                  if (ex.reps) {
                    exerciseDisplayText = `${ex.reps} ${ex.name}`;
                  } else if (ex.durationSeconds) {
                    exerciseDisplayText = `${ex.durationSeconds}s ${ex.name}`;
                  } else {
                    exerciseDisplayText = ex.name;
                  }
                  return (
                    <li key={index} className="text-center"> 
                      <span className="font-bold text-4xl sm:text-5xl text-gray-900 block">{exerciseDisplayText}</span>
                      {ex.instructions && <span className="text-base sm:text-lg text-gray-500 block mt-1 italic"> {ex.instructions}</span>}
                    </li>
                  );
                })}
              </ul>
            ) : <p className="text-gray-500 mt-4 text-center">Inga specifika övningar listade för detta segment.</p>}
          </div>
           <footer className="w-full max-w-lg mt-6 p-4 bg-white border-t-2 border-gray-200 rounded-lg shadow-md">
             {commonButtons(true)}
           </footer>
        </div>
      </div>
    );
  };

  return (
    <>
      {showEndWorkoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                {(currentTimedSegment?.name === PREPARE_SEGMENT.name || (currentTimedSegment?.type === ExercisePhaseType.PREPARE && workout.timedSegments[0] === currentTimedSegment)) || workout.id.startsWith("warmup-")
                    ? APP_STRINGS.confirmEndWarmupMessage
                    : APP_STRINGS.confirmEndWorkoutTitle}
            </h3>
            <p className="text-gray-700 mb-6 sm:mb-8">
                {(currentTimedSegment?.name === PREPARE_SEGMENT.name || (currentTimedSegment?.type === ExercisePhaseType.PREPARE && workout.timedSegments[0] === currentTimedSegment)) || workout.id.startsWith("warmup-")
                    ? APP_STRINGS.confirmEndWarmupMessage 
                    : APP_STRINGS.confirmEndWorkoutMessage}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button onClick={handleConfirmEndWorkout} variant="danger" className="w-full text-lg">
                {APP_STRINGS.confirmEndWorkoutYesButton}
              </Button>
              <Button onClick={handleCancelEndWorkout} variant="secondary" className="w-full text-lg">
                {APP_STRINGS.confirmEndWorkoutNoButton}
              </Button>
            </div>
          </div>
        </div>
      )}

      {(workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP)
        ? renderAmrapTimeCapView()
        : renderClassicEmomView()
      }
    </>
  );
};
