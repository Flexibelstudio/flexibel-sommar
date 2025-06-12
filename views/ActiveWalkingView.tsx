
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../types';
import { APP_STRINGS, WALKING_CHALLENGE_DAILY_MINUTES } from '../constants';
import { Button } from '../components/Button';
import { FootstepsIcon, InformationCircleIcon } from '../components/Icons'; // Added InformationCircleIcon
import * as localStorageService from '../services/localStorageService';


type WakeLockSentinelType = WakeLockSentinel | null; 

interface RecoveredWalkState {
  startTime: number;
  pauseStartTime?: number;
  totalPausedDuration?: number;
}

const formatDurationForModal = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0 && seconds > 0) {
    return `${minutes} min och ${seconds} sek`;
  } else if (minutes > 0) {
    return `${minutes} min`;
  } else {
    return `${seconds} sek`;
  }
};

const formatTimeFromTimestamp = (timestamp: number | null): string => {
  if (timestamp === null) return '--:--';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
};

interface ActiveWalkingViewProps {
  onNavigate: (view: View, data?: { initialTimestamp?: number, completedDurationSeconds?: number }) => void;
  userName: string | null;
  recoveredState: RecoveredWalkState | null; // Updated prop for recovered state
}

export const ActiveWalkingView: React.FC<ActiveWalkingViewProps> = ({ onNavigate, userName, recoveredState }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [initialStartTimestampState, setInitialStartTimestampState] = useState<number | null>(recoveredState?.startTime || null);
  const [displayStartTimeString, setDisplayStartTimeString] = useState<string | null>(null);
  const [durationForConfirmationModal, setDurationForConfirmationModal] = useState<number | null>(null);
  
  const wakeLockSentinelRef = useRef<WakeLockSentinelType>(null);
  
  const initialStartTimestampRef = useRef<number>(recoveredState?.startTime || 0);
  const pauseStartTimeRef = useRef<number>(recoveredState?.pauseStartTime || 0);
  const totalPausedDurationRef = useRef<number>(recoveredState?.totalPausedDuration || 0);

  const isPausedRef = useRef(recoveredState?.pauseStartTime ? true : isPaused); 
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  const showEndConfirmationRef = useRef(showEndConfirmation);
  useEffect(() => { showEndConfirmationRef.current = showEndConfirmation; }, [showEndConfirmation]);


  const releaseScreenLock = useCallback(async () => {
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch (err: any) {
        // console.error(`Could not release Screen Wake Lock: ${err.name}, ${err.message}`);
      }
    }
    wakeLockSentinelRef.current = null;
  }, []);

  const acquireScreenLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) return;
    try {
      wakeLockSentinelRef.current = await navigator.wakeLock.request('screen');
      wakeLockSentinelRef.current.addEventListener('release', () => {
        wakeLockSentinelRef.current = null; 
      });
    } catch (err: any) {
      // console.error(`Could not acquire Screen Wake Lock: ${err.name}, ${err.message}.`);
      wakeLockSentinelRef.current = null;
    }
  }, []);

  const calculateNetDuration = useCallback(() => {
    if (initialStartTimestampRef.current === 0) return 0;

    const actualEndTime = Date.now();
    const grossDurationMs = actualEndTime - initialStartTimestampRef.current;
    let currentPauseDurationMs = 0;

    if (isPausedRef.current && pauseStartTimeRef.current > 0) {
      currentPauseDurationMs = actualEndTime - pauseStartTimeRef.current;
    }
    
    const netDurationMs = grossDurationMs - (totalPausedDurationRef.current + currentPauseDurationMs);
    return Math.max(0, netDurationMs / 1000); // Return in seconds
  }, []);


  const handleComplete = useCallback((durationInSeconds: number | null) => {
    releaseScreenLock();
    localStorageService.clearActiveWalkState();
    onNavigate(View.PostWalking, { 
        initialTimestamp: initialStartTimestampRef.current || Date.now(), 
        completedDurationSeconds: durationInSeconds !== null ? Math.floor(durationInSeconds) : 0
    });
  }, [onNavigate, releaseScreenLock]);


  // Effect for one-time setup on mount (initial start time)
  useEffect(() => {
    if (recoveredState && recoveredState.startTime) {
        // Restoring from localStorage
        initialStartTimestampRef.current = recoveredState.startTime;
        setInitialStartTimestampState(recoveredState.startTime);
        setDisplayStartTimeString(formatTimeFromTimestamp(recoveredState.startTime));
        
        pauseStartTimeRef.current = recoveredState.pauseStartTime || 0;
        totalPausedDurationRef.current = recoveredState.totalPausedDuration || 0;
        
        const wasPausedOnRecover = !!recoveredState.pauseStartTime;
        setIsPaused(wasPausedOnRecover);
        isPausedRef.current = wasPausedOnRecover;

        if (!wasPausedOnRecover) {
            acquireScreenLock();
        }
    } else {
        // New walk
        const now = Date.now();
        setInitialStartTimestampState(now);
        initialStartTimestampRef.current = now;
        setDisplayStartTimeString(formatTimeFromTimestamp(now));
        localStorageService.saveActiveWalkState({
            isActive: true,
            startTime: now,
            pauseStartTime: null,
            totalPausedDuration: 0,
        });
        acquireScreenLock();
    }

    return () => {
      releaseScreenLock();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency: runs only on mount and unmount


  // Effect for managing screen lock and visibility changes based on isPaused and showEndConfirmation
  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden) {
            releaseScreenLock();
        } else {
            if (!isPausedRef.current && !showEndConfirmationRef.current) {
                acquireScreenLock();
            }
        }
    };

    if (!isPausedRef.current && !showEndConfirmationRef.current) {
        acquireScreenLock();
    } else {
        releaseScreenLock();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, showEndConfirmation, acquireScreenLock, releaseScreenLock]);


  const handlePauseResume = () => {
    const now = Date.now();
    setIsPaused(prevPaused => {
      const newIsPaused = !prevPaused;
      if (newIsPaused) { // Pausing
        pauseStartTimeRef.current = now;
      } else { // Resuming
        if (pauseStartTimeRef.current > 0) {
          totalPausedDurationRef.current += (now - pauseStartTimeRef.current);
        }
        pauseStartTimeRef.current = 0;
      }
      localStorageService.saveActiveWalkState({
        isActive: true,
        startTime: initialStartTimestampRef.current,
        pauseStartTime: newIsPaused ? pauseStartTimeRef.current : null,
        totalPausedDuration: totalPausedDurationRef.current,
      });
      return newIsPaused;
    });
  };
  
  const handleOpenEndConfirmation = () => {
    const netDurationSeconds = calculateNetDuration();
    setDurationForConfirmationModal(Math.floor(netDurationSeconds));
    
    const wasAlreadyPaused = isPausedRef.current;
    if (!wasAlreadyPaused) { 
        pauseStartTimeRef.current = Date.now(); 
    }
    setIsPaused(true); 
    setShowEndConfirmation(true);
    localStorageService.saveActiveWalkState({ // Save state as paused for modal
        isActive: true,
        startTime: initialStartTimestampRef.current,
        pauseStartTime: pauseStartTimeRef.current, // This will be now if it wasn't paused, or original if it was
        totalPausedDuration: totalPausedDurationRef.current,
    });
  };

  const handleConfirmEnd = () => {
    setShowEndConfirmation(false);
    handleComplete(durationForConfirmationModal); 
  };

  const handleCancelEnd = () => {
    setShowEndConfirmation(false);
    // If it was running before opening confirmation (conceptual pause), resume it.
    // Need to check the state *before* the modal opened.
    // If it was paused *before* modal, it stays paused.
    // If it was *running* before modal, it resumes running.
    const wasPausedBeforeModal = !!localStorageService.getActiveWalkState()?.pauseStartTime;

    if (!wasPausedBeforeModal) { // If it was running
        if (pauseStartTimeRef.current > 0) { // Account for the brief pause during modal
            // This duration should NOT be added to totalPausedDuration, as it was an artificial pause.
            // We simply clear pauseStartTimeRef so it's not counted as paused time.
        }
        pauseStartTimeRef.current = 0;
        setIsPaused(false); // Set UI state to not paused
        localStorageService.saveActiveWalkState({ // Save state as running
            isActive: true,
            startTime: initialStartTimestampRef.current,
            pauseStartTime: null,
            totalPausedDuration: totalPausedDurationRef.current, // Keep accumulated pause time
        });
    }
    // If it was already paused (wasPausedBeforeModal is true), it remains paused.
    // The localStorage state should already reflect this.
  };

  const greetingName = userName || "Kämpa på";
  
  let confirmationDialogMessages: React.ReactNode[] = [];
  if (durationForConfirmationModal !== null) {
      confirmationDialogMessages.push(
          <p key="duration" className="text-gray-700 mb-2">
              {APP_STRINGS.confirmEndWalkingDurationInfo.replace('{duration}', formatDurationForModal(durationForConfirmationModal))}
          </p>
      );
      if (durationForConfirmationModal >= WALKING_CHALLENGE_DAILY_MINUTES * 60) {
          confirmationDialogMessages.push(
              <p key="earned" className="text-green-600 font-semibold mb-2">{APP_STRINGS.confirmEndWalkingMotivationEarned}</p>
          );
      } else {
          confirmationDialogMessages.push(
              <p key="no-diploma" className="text-orange-600 mb-2">{APP_STRINGS.confirmEndWalkingMotivationNoDiploma}</p>
          );
      }
      confirmationDialogMessages.push(
          <p key="question" className="text-gray-700 mb-6 sm:mb-8">{APP_STRINGS.confirmEndWalkingQuestion}</p>
      );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#E4F0F0] text-[#316767]">
      {showEndConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">{APP_STRINGS.confirmEndWalkingTitle}</h3>
            {confirmationDialogMessages}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={handleConfirmEnd}
                variant="danger"
                className="w-full text-lg"
              >
                {APP_STRINGS.confirmEndWorkoutYesButton} 
              </Button>
              <Button
                onClick={handleCancelEnd}
                variant="secondary"
                className="w-full text-lg"
              >
                {APP_STRINGS.confirmEndWorkoutNoButton}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className={`p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg bg-white text-[#316767] relative ${showEndConfirmation ? 'blur-sm' : ''}`}>
        <FootstepsIcon className="w-16 h-16 text-[#51A1A1] mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-2">{APP_STRINGS.activeWalkingTitle}</h2>
        <p className="text-xl opacity-80 mb-6">{greetingName}, håll tempot uppe!</p>
        
         {displayStartTimeString && (
          <p className="text-2xl opacity-90 mb-4 mt-6 font-semibold">
            {APP_STRINGS.activeWalkingStartTimeLabel} <span className="text-[#51A1A1]">{displayStartTimeString}</span>
          </p>
        )}
         <div className="text-xs text-gray-500 mb-8 mt-2 flex items-center justify-center">
            <InformationCircleIcon className="w-4 h-4 mr-1"/>
            Din pågående promenad sparas lokalt. För bästa resultat, undvik att aktivt stänga webbläsarfliken helt under längre perioder.
        </div>


        <div className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row justify-center">
          <Button 
            onClick={handlePauseResume} 
            variant={isPaused ? "primary" : "pause"} 
            className="w-full sm:w-auto text-lg py-3"
            disabled={showEndConfirmation}
          >
            {isPaused ? APP_STRINGS.resumeWalkingButton : APP_STRINGS.pauseWalkingButton}
          </Button>
          <Button 
            onClick={handleOpenEndConfirmation}
            variant="primary" 
            className="w-full sm:w-auto text-lg py-3"
            disabled={showEndConfirmation}
          >
            {APP_STRINGS.completeWalkingChallengeButton.replace("Avbryt", "Slutför")} 
          </Button>
        </div>
      </div>
    </div>
  );
};
