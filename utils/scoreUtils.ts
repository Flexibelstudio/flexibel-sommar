
// utils/scoreUtils.ts

/**
 * Parses an AMRAP score string (e.g., "7 varv + 5 reps") into rounds and reps.
 * Returns null if parsing fails.
 * Handles formats like: "7 varv + 5 reps", "7 varv", "5 reps", "7r + 5p", "7r", "5p", "7" (assumed rounds).
 */
export const parseAMRAPScore = (score: string): { rounds: number; reps: number } | null => {
  if (!score || typeof score !== 'string' || score.trim() === "") return null;
  
  const cleanedScore = score.toLowerCase().trim();
  let rounds = 0;
  let reps = 0;

  try {
    // Try to match "X varv + Y reps" or "X r + Y p"
    const fullMatch = cleanedScore.match(/(\d+)\s*(?:varv|r)\s*\+\s*(\d+)\s*(?:reps|p)/);
    if (fullMatch) {
      rounds = parseInt(fullMatch[1], 10);
      reps = parseInt(fullMatch[2], 10);
      if (!isNaN(rounds) && !isNaN(reps)) return { rounds, reps };
    }

    // Try to match "X varv" or "X r"
    const roundsOnlyMatch = cleanedScore.match(/^(\d+)\s*(?:varv|r)$/);
    if (roundsOnlyMatch) {
      rounds = parseInt(roundsOnlyMatch[1], 10);
      if (!isNaN(rounds)) return { rounds, reps: 0 };
    }

    // Try to match "Y reps" or "Y p"
    const repsOnlyMatch = cleanedScore.match(/^(\d+)\s*(?:reps|p)$/);
    if (repsOnlyMatch) {
      reps = parseInt(repsOnlyMatch[1], 10);
      if (!isNaN(reps)) return { rounds: 0, reps };
    }
    
    // If no units, try to parse as just rounds
    if (!cleanedScore.includes('varv') && !cleanedScore.includes('r') && !cleanedScore.includes('reps') && !cleanedScore.includes('p') && !cleanedScore.includes('+')) {
        const potentialRounds = parseInt(cleanedScore, 10);
        if (!isNaN(potentialRounds)) {
            return { rounds: potentialRounds, reps: 0 };
        }
    }

    // Fallback for "X + Y" assuming X is rounds, Y is reps if no units clearly defined earlier
    const plusParts = cleanedScore.split('+');
    if (plusParts.length === 2) {
        const pRounds = parseInt(plusParts[0].replace(/\D/g, ''), 10);
        const pReps = parseInt(plusParts[1].replace(/\D/g, ''), 10);
        if (!isNaN(pRounds) && !isNaN(pReps)) return { rounds: pRounds, reps: pReps};
        if (!isNaN(pRounds) && isNaN(pReps)) return { rounds: pRounds, reps: 0}; // e.g. "7 + "
        if (isNaN(pRounds) && !isNaN(pReps)) return { rounds: 0, reps: pReps}; // e.g. " + 5"
    }


    return null; // Could not parse
  } catch (e) {
    console.error("Error parsing AMRAP score:", e);
    return null;
  }
};

/**
 * Compares two AMRAP scores. Returns true if currentScore is better than bestScore.
 */
export const compareAMRAPScores = (currentScoreStr: string, bestScoreStr: string): boolean => {
  const current = parseAMRAPScore(currentScoreStr);
  const best = parseAMRAPScore(bestScoreStr);

  if (!current) return false; // If current is invalid, it can't be better
  if (!best) return true;   // If best is invalid, current is better (assuming current is valid)

  if (current.rounds > best.rounds) return true;
  if (current.rounds === best.rounds && current.reps > best.reps) return true;
  return false;
};

/**
 * Parses a Time Cap score string (e.g., "14:30") into total seconds.
 * Returns null if parsing fails.
 */
export const parseTimeScore = (score: string): number | null => {
  if (!score || typeof score !== 'string') return null;
  const parts = score.split(':');
  if (parts.length !== 2) return null;
  try {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds) || seconds < 0 || seconds >= 60 || minutes < 0) {
      return null;
    }
    return (minutes * 60) + seconds;
  } catch (e) {
    console.error("Error parsing Time Cap score:", e);
    return null;
  }
};

/**
 * Compares two Time Cap scores. Returns true if currentTime is better (lower) than bestTime.
 */
export const compareTimeScores = (currentTimeStr: string, bestTimeStr: string): boolean => {
  const currentTimeInSeconds = parseTimeScore(currentTimeStr);
  const bestTimeInSeconds = parseTimeScore(bestTimeStr);

  if (currentTimeInSeconds === null) return false; // Current invalid, can't be better
  if (bestTimeInSeconds === null) return true;   // Best invalid, current is better

  return currentTimeInSeconds < bestTimeInSeconds;
};

/**
 * Parses a string value (like distance "3.5 km" or steps "4500") into a number.
 * Extracts the first valid number found. Handles both '.' and ',' as decimal separators.
 * Returns null if no number can be parsed or if input is invalid.
 */
export const parseNumericValue = (valueStr: string | undefined | null): number | null => {
    if (valueStr === null || valueStr === undefined || typeof valueStr !== 'string' || valueStr.trim() === "") {
        return null;
    }
    // Replace comma with dot for universal decimal parsing, then find the number
    const standardizedValueStr = valueStr.replace(',', '.');
    const match = standardizedValueStr.match(/(\d+(\.\d+)?)/);
    
    if (match && match[1]) {
        const num = parseFloat(match[1]);
        return isNaN(num) ? null : num;
    }
    return null;
};
