import React, { useEffect, useState, useRef } from 'react';
import { Workout, View, Level, WorkoutLogEntry, DiplomaData, CurrentWorkoutCompletionData, WorkoutFormat } from '../types'; // Updated type
import { APP_STRINGS, LEVEL_DEFINITIONS, getCurrentWorkoutLevel } from '../constants';
import { Button } from '../components/Button';
import { CheckCircleIcon, FireIcon, TrophyIcon, SparklesIcon, AcademicCapIcon, CertificateIcon, StarIcon, XCircleIcon, ShareIcon, ArrowLeftIcon } from '../components/Icons'; // Added ShareIcon and ArrowLeftIcon
import * as localStorageService from '../services/localStorageService';
import { triggerConfetti, triggerHeartsAnimation } from '../utils/animations';
import { truncateText } from '../utils/textUtils';
import { parseAMRAPScore, compareAMRAPScores, parseTimeScore, compareTimeScores } from '../utils/scoreUtils';
import { ProgressSparks } from '../components/ProgressSparks'; // Import ProgressSparks
import { LevelUpAnimation } from '../components/LevelUpAnimations'; // Import LevelUpAnimation


interface PostWorkoutViewProps {
  workout: Workout;
  onNavigate: (view: View, data?: any) => void;
  userName: string | null;
  completionData: CurrentWorkoutCompletionData; // Changed type name
}

// Changed component definition to use explicit props type and return type without React.FC.
export const PostWorkoutView = ({ workout, onNavigate, userName, completionData }: PostWorkoutViewProps): JSX.Element | null => {
  const [completionMessages, setCompletionMessages] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  const [isWarmUp, setIsWarmUp] = useState(false);
  const [logEntrySaved, setLogEntrySaved] = useState(false);
  const [isCurrentWorkoutFavorite, setIsCurrentWorkoutFavorite] = useState(false);
  const [showWorkoutLevelUpAnim, setShowWorkoutLevelUpAnim] = useState(false); // State for level up animation

  const [nextLevelInfo, setNextLevelInfo] = useState<{
    nextLevel: Level | null;
    workoutsToNext: number;
    percentageToNextLevel: number;
  } | null>(null);

  const [sparkKey, setSparkKey] = useState(0);
  const prevProgressPercentageRef = useRef<number>(0);


  useEffect(() => {
    setLogEntrySaved(false);
    const currentIsWarmUp = workout.id.startsWith('warmup-');
    setIsWarmUp(currentIsWarmUp);

    if (!currentIsWarmUp && !completionData.abortedByUser) {
      triggerConfetti(completionData.didLevelUp); // More confetti on level up
      if (completionData.didLevelUp) {
        triggerHeartsAnimation();
        setShowWorkoutLevelUpAnim(true); // Trigger level up animation
      }
      setIsCurrentWorkoutFavorite(localStorageService.isFavoriteWorkout(workout.id));
    } else {
      setIsCurrentWorkoutFavorite(false);
    }

    // Pre-fill scoreInput for Time Cap workouts
    if (workout.format === WorkoutFormat.TIME_CAP && !completionData.abortedByUser && completionData.completedTimeSeconds !== undefined) {
      const mins = Math.floor(completionData.completedTimeSeconds / 60);
      const secs = completionData.completedTimeSeconds % 60;
      setScoreInput(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    } else {
      setScoreInput(''); // Clear for other types or if aborted
    }

  }, [completionData, workout.id, workout.format]);


  useEffect(() => {
    if (completionData.abortedByUser) {
        setCompletionMessages([]);
        setNextLevelInfo(null);
        return;
    }

    const messages: string[] = [];
    const nameOrDefault = userName || 'Du';

    // Level up message is handled separately for styling, so it's not added to completionMessages here.
    // Only add other messages if not level up, or if it's the first workout (which will be displayed after level up message).

    if (completionData.totalWorkouts === 1 && !completionData.didLevelUp) {
      messages.push(APP_STRINGS.postWorkoutFirstEverMessage.replace('{name}', nameOrDefault));
    } else if (!completionData.didLevelUp) { // Don't show base if level up message will show
      messages.push(APP_STRINGS.postWorkoutBaseCompletionMessage.replace('{name}', nameOrDefault));
    }

    if (completionData.streak > 1) {
      messages.push(APP_STRINGS.postWorkoutStreakContinuedMessage.replace('{streak}', completionData.streak.toString()).replace('{name}', nameOrDefault));
    } else if (completionData.streak === 1 && completionData.totalWorkouts > 1) {
      messages.push(APP_STRINGS.postWorkoutNewStreakMessage.replace('{name}', nameOrDefault));
    }

    messages.push(APP_STRINGS.postWorkoutTotalCountMessage.replace('{count}', completionData.totalWorkouts.toString()));
    setCompletionMessages(messages);

    const currentLevelFromCompletion = completionData.level;
    const totalWorkoutsFromCompletion = completionData.totalWorkouts;

    const currentLevelIndex = LEVEL_DEFINITIONS.findIndex(l => l.name === currentLevelFromCompletion.name);
    const nextLevelDefinition = (currentLevelIndex !== -1 && currentLevelIndex < LEVEL_DEFINITIONS.length - 1)
      ? LEVEL_DEFINITIONS[currentLevelIndex + 1]
      : null;

    let calculatedProgressPercentage = 0;
    if (nextLevelDefinition && nextLevelDefinition.minWorkouts !== undefined && currentLevelFromCompletion.minWorkouts !== undefined) {
      const workoutsNeededForNextSpan = nextLevelDefinition.minWorkouts - currentLevelFromCompletion.minWorkouts;
      const workoutsMadeInCurrentLevel = totalWorkoutsFromCompletion - currentLevelFromCompletion.minWorkouts;

        if (totalWorkoutsFromCompletion >= nextLevelDefinition.minWorkouts) { // handles case where user skips levels
            calculatedProgressPercentage = 100;
        } else if (workoutsNeededForNextSpan > 0) {
            calculatedProgressPercentage = (workoutsMadeInCurrentLevel / workoutsNeededForNextSpan) * 100;
        }
      setNextLevelInfo({
        nextLevel: nextLevelDefinition,
        workoutsToNext: Math.max(0, nextLevelDefinition.minWorkouts - totalWorkoutsFromCompletion),
        percentageToNextLevel: Math.max(0, Math.min(100, calculatedProgressPercentage))
      });
    } else {
      setNextLevelInfo(null);
    }

    if (calculatedProgressPercentage > prevProgressPercentageRef.current && calculatedProgressPercentage < 100) {
      setSparkKey(prev => prev + 1);
    }
    prevProgressPercentageRef.current = calculatedProgressPercentage;

  }, [completionData, userName, workout.id]);

  const toggleFavorite = () => {
    if (isWarmUp || completionData.abortedByUser) return;
    if (isCurrentWorkoutFavorite) {
      localStorageService.removeFavoriteWorkoutId(workout.id);
      if (workout.id.startsWith('generated-')) { // Also remove from AI specific storage
          localStorageService.removeFavoritedAIWorkout(workout.id);
      }
    } else {
      localStorageService.addFavoriteWorkoutId(workout.id);
      if (workout.id.startsWith('generated-')) { // Also add to AI specific storage
          localStorageService.addFavoritedAIWorkout(workout);
      }
    }
    setIsCurrentWorkoutFavorite(!isCurrentWorkoutFavorite);
  };

  const saveLogEntryAndNavigate = (targetView: View, diplomaDataForNavigation?: DiplomaData) => {
    if (!isWarmUp && !completionData.abortedByUser && !logEntrySaved) {
      const d = completionData.dateTime;
      const localDateCompleted = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

      const logEntry: WorkoutLogEntry = {
        dateCompleted: localDateCompleted, // Use local date
        timeCompleted: completionData.dateTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit'}),
        completionTimestamp: completionData.dateTime.getTime(), // Precise timestamp
        workoutId: workout.id,
        workoutTitle: workout.title,
        comment: comment.trim(),
        levelNameAtCompletion: completionData.level.name,
        durationMinutes: workout.totalEstimatedTimeMinutes,
        workoutType: workout.type, // Ensure workoutType is saved
      };
      if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && scoreInput.trim()) {
        logEntry.score = scoreInput.trim();
      }
      localStorageService.saveWorkoutLogEntry(logEntry);
      setLogEntrySaved(true);
    }

    if (targetView === View.Diploma && diplomaDataForNavigation) {
      onNavigate(targetView, diplomaDataForNavigation);
    } else {
      onNavigate(targetView);
    }
  };

  const handleShowDiploma = () => {
    if (isWarmUp || completionData.abortedByUser) return;

    let isNewRecordFlag = false;
    let previousBestScoreStr: string | undefined = undefined;
    const currentScoreTrimmed = scoreInput.trim();

    if ((workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && currentScoreTrimmed) {
      const workoutLogs = localStorageService.getWorkoutLog();
      // Filter for scores of the *same workout* and ensure they are valid and not the one just entered (though log isn't saved yet, this is more conceptual)
      const scoresForThisWorkout = workoutLogs
        .filter(log => log.workoutId === workout.id && log.score && log.score.trim() !== '')
        .map(log => log.score as string);

      if (scoresForThisWorkout.length > 0) {
        if (workout.format === WorkoutFormat.AMRAP) {
          let bestPreviousAMRAPParsed = null;
          for (const prevScoreStr of scoresForThisWorkout) {
            const parsedPrev = parseAMRAPScore(prevScoreStr);
            if (parsedPrev) {
              if (!bestPreviousAMRAPParsed || (parsedPrev.rounds > bestPreviousAMRAPParsed.rounds || (parsedPrev.rounds === bestPreviousAMRAPParsed.rounds && parsedPrev.reps > bestPreviousAMRAPParsed.reps))) {
                bestPreviousAMRAPParsed = parsedPrev;
                previousBestScoreStr = prevScoreStr;
              }
            }
          }
          if (bestPreviousAMRAPParsed) { // A valid previous best was found
            isNewRecordFlag = compareAMRAPScores(currentScoreTrimmed, previousBestScoreStr!);
          } else { // No valid previous scores to compare against (e.g. all previous were unparseable)
            isNewRecordFlag = true;
          }
        } else if (workout.format === WorkoutFormat.TIME_CAP) {
          let bestPreviousTimeSeconds = Infinity; // Lower is better
          for (const prevScoreStr of scoresForThisWorkout) {
            const parsedPrevSeconds = parseTimeScore(prevScoreStr);
            if (parsedPrevSeconds !== null && parsedPrevSeconds < bestPreviousTimeSeconds) {
              bestPreviousTimeSeconds = parsedPrevSeconds;
              previousBestScoreStr = prevScoreStr;
            }
          }
          if (bestPreviousTimeSeconds !== Infinity) { // A valid previous best was found
            isNewRecordFlag = compareTimeScores(currentScoreTrimmed, previousBestScoreStr!);
          } else { // No valid previous scores
             isNewRecordFlag = true;
          }
        }
      } else { // No previous scores at all for this workout
        isNewRecordFlag = true;
      }
    }

    let durationInSecondsForDiploma: number | undefined;
    if (workout.format === WorkoutFormat.TIME_CAP && completionData.completedTimeSeconds !== undefined) {
      durationInSecondsForDiploma = completionData.completedTimeSeconds;
    } else {
      durationInSecondsForDiploma = workout.totalEstimatedTimeMinutes * 60;
    }

    const diplomaDataToPass: DiplomaData = {
      workoutTitle: workout.title,
      userName: userName,
      levelName: completionData.level.name,
      completionDateTime: completionData.dateTime,
      workoutDurationSeconds: durationInSecondsForDiploma,
      totalWorkoutsCompleted: completionData.totalWorkouts,
      comment: comment.trim(),
      didLevelUp: completionData.didLevelUp,
      score: currentScoreTrimmed || undefined,
      isNewRecord: currentScoreTrimmed ? isNewRecordFlag : undefined,
      previousBestScore: currentScoreTrimmed && isNewRecordFlag && previousBestScoreStr ? previousBestScoreStr : undefined,
    };
    saveLogEntryAndNavigate(View.Diploma, diplomaDataToPass);
  };

  const handleShareLevelUp = async () => {
    if (isWarmUp || completionData.abortedByUser || !completionData.didLevelUp) return;

    const shareText = APP_STRINGS.shareWorkoutLevelUpText
      .replace('{levelName}', completionData.level.name)
      .replace('{hashtag}', APP_STRINGS.appHashtag)
      .replace('{appFullName}', APP_STRINGS.appMainCampaignTitle);
    const shareUrl = window.location.origin + window.location.pathname;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Min Nivåhöjning!",
          text: shareText,
          url: shareUrl,
        });
        triggerHeartsAnimation();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Share operation cancelled by the user.');
        } else {
          console.error('Error sharing:', error);
           if (navigator.clipboard) {
              try {
                await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText} ${shareUrl}`);
                triggerHeartsAnimation();
              } catch (clipboardErr) {
                alert(`${shareText} ${shareUrl}`);
              }
          } else {
              alert(`${shareText} ${shareUrl}`);
          }
        }
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert(`${APP_STRINGS.linkCopiedToClipboard}\n\n${shareText} ${shareUrl}`);
        triggerHeartsAnimation();
      } catch (err) {
        alert(`${shareText} ${shareUrl}`);
      }
    } else {
        alert(`${shareText} ${shareUrl}`);
    }
  };


  if (completionData.abortedByUser) {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-red-50 text-gray-800">
        <div className="mt-2 mb-6 self-start">
          <Button
            onClick={() => saveLogEntryAndNavigate(View.Home)}
            variant="ghost"
            className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
            aria-label={APP_STRINGS.backToHome}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>{APP_STRINGS.backToHome}</span>
          </Button>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <XCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-red-500 mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-red-700 mb-4">
            {APP_STRINGS.postWorkoutAbortedTitle}
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-md">
            {APP_STRINGS.postWorkoutAbortedInfo}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen p-6 bg-green-50 text-gray-800 relative"> {/* Added relative for animation positioning */}
       {showWorkoutLevelUpAnim && (
        <LevelUpAnimation type="kettlebell" onAnimationEnd={() => setShowWorkoutLevelUpAnim(false)} />
      )}
      <div className="mt-2 mb-6 self-start">
        <Button
          onClick={() => saveLogEntryAndNavigate(View.Home)}
          variant="ghost"
          className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
          aria-label={APP_STRINGS.backToHome}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{APP_STRINGS.backToHome}</span>
        </Button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center"> {/* Main content wrapper */}
        {completionData.didLevelUp ? (
          <SparklesIcon className="w-20 h-20 sm:w-24 sm:h-24 text-yellow-400 mb-6 animate-pulse" />
        ) : (
          <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 mb-6" />
        )}

        <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
          {APP_STRINGS.workoutCompleteTitle}
        </h2>

        {completionData.didLevelUp && (
          <div className="my-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md w-full max-w-md">
            <p className="text-2xl font-bold text-yellow-700 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 mr-2 text-yellow-500" />
              {APP_STRINGS.postWorkoutLevelUpMessage
                .replace('{name}', userName || 'Du')
                .replace('{levelName}', completionData.level.name)}
            </p>
          </div>
        )}

        <div className="my-4 space-y-2 max-w-md">
          {completionMessages.map((msg, index) => (
            <p key={index} className={`text-gray-700 text-lg ${msg.includes("GRATTIS") ? 'font-semibold text-yellow-600' : ''}`}>{msg}</p>
          ))}
        </div>

        {(completionData.streak > 0 || completionData.totalWorkouts > 0 || completionData.level) && (
          <div className="my-6 p-4 bg-white border border-green-200 rounded-lg shadow-sm w-full max-w-sm">
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex justify-around items-center">
                  {completionData.streak > 0 && (
                    <div className="text-center">
                      <FireIcon className="w-7 h-7 text-orange-500 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.homeStreakLabel}</p>
                      <p className="text-xl font-bold text-green-600">
                        {completionData.streak} <span className="text-sm font-medium">{APP_STRINGS.homeStreakUnit}</span>
                      </p>
                    </div>
                  )}
                  {completionData.totalWorkouts > 0 && (
                    <div className="text-center">
                      <TrophyIcon className="w-7 h-7 text-yellow-500 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.homeTotalWorkoutsLabel}</p>
                      <p className="text-xl font-bold text-green-600">
                        {completionData.totalWorkouts} <span className="text-sm font-medium">{APP_STRINGS.homeTotalWorkoutsUnit}</span>
                      </p>
                    </div>
                  )}
              </div>
              {completionData.level && (
                  <div className="text-center border-t pt-3 mt-3 border-green-100">
                      <div className="flex items-center justify-center mb-1">
                          <AcademicCapIcon className="w-6 h-6 text-indigo-500 mr-2" />
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{APP_STRINGS.homeCurrentLevelLabel}</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-600 break-words">{completionData.level.name}</p>

                      {nextLevelInfo && nextLevelInfo.nextLevel && nextLevelInfo.workoutsToNext > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            {APP_STRINGS.workoutsToNextLevelText
                              .replace('{count}', nextLevelInfo.workoutsToNext.toString())
                              .replace('{levelName}', nextLevelInfo.nextLevel.name)}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 relative overflow-hidden"> {/* Added relative and overflow-hidden */}
                            <div
                              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${nextLevelInfo.percentageToNextLevel}%` }}
                              aria-label="Framsteg till nästa träningsnivå"
                            ></div>
                            <ProgressSparks
                              key={sparkKey}
                              percentage={nextLevelInfo.percentageToNextLevel}
                              sparkColor="bg-indigo-300"
                            />
                          </div>
                        </div>
                      )}
                      {nextLevelInfo === null && (
                        <p className="mt-3 text-sm font-semibold text-yellow-500 flex items-center justify-center">
                          <StarIcon className="w-5 h-5 inline mr-1" solid />
                          {APP_STRINGS.maxLevelReachedText}
                        </p>
                      )}
                  </div>
              )}
            </div>
          </div>
        )}

        {!isWarmUp && (
          <>
            <div className="my-4 text-center">
              <p className="text-lg text-gray-700">Du har slutfört: <span className="font-semibold">{workout.title}</span></p>
              <div className="flex items-center justify-center mt-2">
                  <p className="text-lg text-gray-700 mr-2">{APP_STRINGS.markAsFavoriteQuestion}</p>
                  <button
                  onClick={toggleFavorite}
                  className={`p-1 rounded-full transition-colors duration-150 ${isCurrentWorkoutFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500'}`}
                  title={isCurrentWorkoutFavorite ? APP_STRINGS.removeFromFavoritesTooltip : APP_STRINGS.addToFavoritesTooltip}
                  aria-label={isCurrentWorkoutFavorite ? APP_STRINGS.removeFromFavoritesTooltip : APP_STRINGS.addToFavoritesTooltip}
                  >
                  <StarIcon className="w-7 h-7" solid={isCurrentWorkoutFavorite} />
                  </button>
              </div>
            </div>

            <div className="my-6 w-full max-w-sm">
              <label htmlFor="workoutComment" className="block text-sm font-medium text-gray-700 mb-1">
                {APP_STRINGS.postWorkoutCommentLabel}
              </label>
              <textarea
                id="workoutComment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={APP_STRINGS.postWorkoutCommentPlaceholder}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#51A1A1] focus:border-[#51A1A1] bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            {(workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && !completionData.abortedByUser && (
              <div className="my-6 w-full max-w-sm">
                <label htmlFor="workoutScore" className="block text-sm font-medium text-gray-700 mb-1">
                  {workout.format === WorkoutFormat.AMRAP ? APP_STRINGS.postWorkoutScoreLabelAMRAP : APP_STRINGS.postWorkoutScoreLabelTimeCap}
                </label>
                <input
                  id="workoutScore"
                  type="text"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder={workout.format === WorkoutFormat.AMRAP ? APP_STRINGS.postWorkoutScorePlaceholderAMRAP : APP_STRINGS.postWorkoutScorePlaceholderTimeCap}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#51A1A1] focus:border-[#51A1A1] bg-white text-gray-800 placeholder-gray-400"
                />
              </div>
            )}
          </>
        )}

        <div className="mt-6 space-y-4 w-full max-w-xs">
          {!isWarmUp && completionData.didLevelUp && (
              <Button
                  onClick={handleShareLevelUp}
                  variant="primary"
                  className="w-full flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 border-yellow-600 active:bg-yellow-700"
              >
                  <ShareIcon className="w-5 h-5 mr-2" /> {APP_STRINGS.shareLevelUpButton}
              </Button>
          )}
          {!isWarmUp && (
            <Button
              onClick={handleShowDiploma}
              variant="secondary"
              className="w-full flex items-center justify-center"
              disabled={logEntrySaved && !(workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP)} // Allow re-showing diploma if score might change
            >
              <CertificateIcon className="w-5 h-5 mr-2" /> {APP_STRINGS.showDiplomaButton}
            </Button>
          )}
          {/* This button is now removed from here and handled by the top-left one */}
        </div>
      </div>
    </div>
  );
};
