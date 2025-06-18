// services/audioService.ts

import { ExercisePhaseType } from '../types'; // Added ExercisePhaseType

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window !== 'undefined') {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("AudioContext created.");
      } catch (e) {
        console.error("Web Audio API is not supported or an error occurred during creation:", e);
        return null;
      }
    }
    // Do not automatically resume here, let initializeAudio handle it.
    // This function's job is just to get or create the context.
    return audioCtx;
  }
  console.log("Window object not available, cannot create AudioContext.");
  return null;
};

const playBeep = (frequency: number, duration: number, type: OscillatorType = 'sine'): void => {
  const ctx = getAudioContext();
  if (!ctx) {
    console.warn("AudioContext not available, cannot play beep.");
    return;
  }

  // Check state and attempt resume only if suspended.
  // This is a fallback, primary resume should happen in initializeAudio.
  if (ctx.state === 'suspended') {
    console.warn("AudioContext is suspended during playBeep. Sound might not play reliably on this attempt. Ensure initializeAudio is called and awaited first.");
    // We don't await resume here as playBeep is synchronous.
    // The sound might not play if context doesn't resume in time.
    ctx.resume().catch(e => console.error("Error resuming AudioContext on playBeep (fallback):", e));
    // Allow attempt to play even if suspended, as resume might be quick.
  }
  
  if (ctx.state !== 'running') {
    // Only log if not suspended, as suspended case is handled above.
    if (ctx.state !== 'suspended') {
      console.warn(`AudioContext not running (state: ${ctx.state}), cannot play beep.`);
    }
    // Attempt to play anyway if it was just suspended and might resume.
    // If it's 'closed', it won't work.
    if (ctx.state === 'closed') return;
  }

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.9, ctx.currentTime); // Volume set to 0.9
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
    console.log(`Played beep: freq=${frequency}, dur=${duration}, ctx.state=${ctx.state}`);
  } catch (error) {
    console.error("Error playing beep:", error);
  }
};

export const playCountdownSound = (count: number): void => {
  console.log(`playCountdownSound called for count: ${count}`);
  if (count === 3 || count === 2 || count === 1) {
    playBeep(880, 150, 'triangle'); 
  } else if (count === 0) {
    playBeep(1200, 300, 'sine'); 
  }
};

export const playPhaseTransitionSound = (phaseType: ExercisePhaseType): void => {
  console.log(`playPhaseTransitionSound called for phase: ${phaseType}`);
  if (phaseType === ExercisePhaseType.WORK) {
    playBeep(760, 180, 'square'); // Slightly higher, shorter beep for work start
  } else if (phaseType === ExercisePhaseType.REST) {
    playBeep(520, 220, 'sawtooth'); // Lower, slightly longer beep for rest start
  }
};

export const playConfettiSound = (): void => {
  console.log("playConfettiSound called.");
  // First beep
  playBeep(1600, 80, 'triangle');
  // Second beep, slightly delayed and higher pitch
  setTimeout(() => {
    playBeep(1900, 70, 'sine');
  }, 60); // 60ms delay for the second beep
};

export const playStarFindSound = (): void => {
  console.log("playStarFindSound called.");
  playBeep(2200, 100, 'sine'); // High-pitched, short "twinkle"
  setTimeout(() => {
    playBeep(2600, 80, 'sine');
  }, 70);
};

export const initializeAudio = async (): Promise<boolean> => {
  console.log("initializeAudio called.");
  const ctx = getAudioContext(); 
  if (!ctx) {
    console.log("Audio initialization failed: AudioContext not available.");
    return false;
  }
  if (ctx.state === 'running') {
    console.log("AudioContext already running.");
    return true;
  }
  if (ctx.state === 'suspended') {
    try {
      console.log("Attempting to resume suspended AudioContext...");
      await ctx.resume();
      console.log("AudioContext resumed successfully by initializeAudio. New state:", ctx.state);
      // If `await ctx.resume()` completes without error, the state is 'running'.
      return true; 
    } catch (e) {
      console.error("Error resuming AudioContext in initializeAudio:", e);
      return false;
    }
  }
  console.log("AudioContext in unexpected state during initialization:", ctx.state);
  return false;
};