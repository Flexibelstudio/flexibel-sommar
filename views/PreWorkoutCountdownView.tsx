import React, { useState, useEffect } from 'react';
import { Workout, View } from '../types';
import * as audioService from '../services/audioService'; // Import the audio service
import { getUserName } from '../services/localStorageService'; // Import getUserName
import { APP_STRINGS } from '../constants'; // Import APP_STRINGS

interface PreWorkoutCountdownViewProps {
  workout: Workout;
  onNavigate: (view: View, workout?: Workout) => void;
}

export const PreWorkoutCountdownView: React.FC<PreWorkoutCountdownViewProps> = ({ workout, onNavigate }) => {
  const [countdown, setCountdown] = useState(10); // Standard 10s countdown
  const [userName, setUserName] = useState<string | null>(null);
  const [isWarmUp, setIsWarmUp] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false); // New state for audio readiness

  useEffect(() => {
    let isMounted = true;
    // Initialize audio and set isAudioReady state
    audioService.initializeAudio().then(ready => {
      if (isMounted && ready) {
        setIsAudioReady(true);
        console.log("Audio is ready for PreWorkoutCountdownView.");
      } else if (isMounted) {
        console.warn("Audio initialization failed or component unmounted for PreWorkoutCountdownView.");
      }
    });
    return () => { isMounted = false; };
  }, []); // Runs once on mount

  useEffect(() => {
    setUserName(getUserName());
    setIsWarmUp(workout.id.startsWith("warmup-"));
  }, [workout.id]);

  // Effect for playing sounds, depends on countdown and isAudioReady
  useEffect(() => {
    if (!isAudioReady) {
        // console.log("PreWorkoutCountdownView: Audio not ready, skipping sound for countdown:", countdown);
        return;
    }

    // Play sound for 3, 2, 1
    if (countdown === 3 || countdown === 2 || countdown === 1) {
      console.log("PreWorkoutCountdownView: Playing countdown sound for:", countdown);
      audioService.playCountdownSound(countdown);
    }
  }, [countdown, isAudioReady]);

  // Effect for countdown interval and navigation
  useEffect(() => {
    if (countdown <= 0) {
      if (isAudioReady) {
        console.log("PreWorkoutCountdownView: Playing GO sound.");
        audioService.playCountdownSound(0); // Play "GO" sound if audio is ready
      }
      // Small delay to allow "GO" sound to play briefly before navigating
      const navigationTimeout = setTimeout(() => {
         onNavigate(View.ActiveWorkout, workout);
      }, 350); // Increased slightly to 350ms
      return () => clearTimeout(navigationTimeout); // Cleanup timeout
    }

    const timerId = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval
  }, [countdown, onNavigate, workout, isAudioReady]); // isAudioReady ensures GO sound logic runs if audio becomes ready

  const getCountdownColor = () => {
    if (countdown <= 3 && countdown >= 1) {
      return 'text-red-500 animate-pulse'; 
    }
    return 'text-[#418484]';
  };

  const countdownTitle = isWarmUp ? APP_STRINGS.preWarmupCountdownTitle : APP_STRINGS.preWorkoutCountdownTitle;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#E4F0F0] text-[#316767]">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-[#316767]">
        {userName ? `${userName}, du ser stark ut!` : "Du ser stark ut!"}
      </h2>
      <h3 className="text-2xl sm:text-3xl font-medium mb-8 text-gray-600">{countdownTitle}</h3>
      <div className={`text-[12.5rem] leading-none font-bold font-mono transition-colors duration-300 ${getCountdownColor()}`}>
        {countdown}
      </div>
    </div>
  );
};
