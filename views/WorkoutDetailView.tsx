
import React, { useState, useEffect } from 'react'; 
import { Workout, View, WorkoutFormat, WorkoutLogEntry } from '../types';
import { APP_STRINGS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, StarIcon, TrophyIcon, DrinkIcon } from '../components/Icons'; // Added DrinkIcon
import * as localStorageService from '../services/localStorageService'; 
import * as analyticsService from '../services/analyticsService'; // Import analytics service

interface WorkoutDetailViewProps {
  workout: Workout;
  onNavigate: (view: View, workout?: Workout) => void;
}

export const WorkoutDetailView: React.FC<WorkoutDetailViewProps> = ({ workout, onNavigate }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [previousScore, setPreviousScore] = useState<string | null>(null);

  useEffect(() => {
    if (workout) {
      setIsFavorite(localStorageService.isFavoriteWorkout(workout.id));

      if (workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) {
        const log = localStorageService.getWorkoutLog();
        const workoutSpecificLogEntries = log.filter(
          entry => entry.workoutId === workout.id && entry.score && entry.score.trim() !== ''
        );
        if (workoutSpecificLogEntries.length > 0) {
          setPreviousScore(workoutSpecificLogEntries[0].score as string);
        } else {
          setPreviousScore(null);
        }
      } else {
        setPreviousScore(null);
      }
    }
  }, [workout]);

  const toggleFavorite = () => {
    if (!workout) return;
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    if (newFavoriteState) {
      localStorageService.addFavoriteWorkoutId(workout.id);
      if (workout.id.startsWith('generated-')) {
        localStorageService.addFavoritedGeneratedWorkout(workout); // Renamed from addFavoritedAIWorkout
      }
    } else {
      localStorageService.removeFavoriteWorkoutId(workout.id);
      if (workout.id.startsWith('generated-')) {
        localStorageService.removeFavoritedGeneratedWorkout(workout.id); // Renamed from removeFavoritedAIWorkout
      }
    }
    // GA Event: toggle_favorite_workout
    analyticsService.trackEvent('toggle_favorite_workout', {
      event_category: 'user_engagement',
      event_action: 'toggle_favorite',
      item_id: workout.id,
      item_name: workout.title,
      is_favorited: newFavoriteState,
      content_type: workout.id.startsWith('generated-') ? 'generated_workout' : 'predefined_workout', // Renamed from 'ai_workout'
    });
  };

  const handleStartWorkout = () => {
    // GA Event: start_workout (now select_workout)
    analyticsService.trackEvent('start_workout', { // Event name kept as start_workout for consistency if grouped by this
        event_category: 'workout_engagement',
        event_action: 'select_workout', // Changed from start_workout_intent
        item_id: workout.id,
        item_name: workout.title,
        workout_type: workout.id.startsWith('generated-') ? 'generated' : workout.type, // Renamed from 'ai_generated'
        workout_format: workout.format,
        workout_difficulty: workout.difficultyLevel,
        workout_duration_minutes: workout.totalEstimatedTimeMinutes,
    });
    onNavigate(View.PreWorkoutCountdown, workout);
  };

  let displayTitle = workout.title;
  const timeAlreadyInTitleRegex = /\(\s*\d+\s*min(uter)?(\s+[\w\s-]+)?\s*\)/i;
  if (!timeAlreadyInTitleRegex.test(workout.title)) {
    displayTitle = `${workout.title} (${workout.totalEstimatedTimeMinutes} min)`;
  }

  const isGeneratedWorkout = workout.id.startsWith('generated-'); // Renamed from isAiWorkout
  const startButtonText = isGeneratedWorkout ? APP_STRINGS.startGeneratedWorkoutButton : APP_STRINGS.startWorkout;
  // Consistent green styling for generated workout start button, now using thematic pink for "Låt festen börja!"
  const startButtonAdditionalClasses = isGeneratedWorkout 
    ? 'bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-400 border-pink-600 active:bg-pink-700 flex items-center justify-center' 
    : '';


  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-white text-gray-800">
      <Button onClick={() => onNavigate(View.Home)} variant="ghost" className="self-start mt-2 mb-6 flex items-center space-x-2 text-[#418484] hover:text-[#316767]">
        <ArrowLeftIcon className="w-5 h-5" />
        <span>{APP_STRINGS.backToHome}</span>
      </Button>
      <div className="flex-grow flex flex-col items-center">
        <div className="flex items-center justify-center mb-6 text-center w-full">
          <h2 className="text-3xl font-bold text-[#51A1A1] mr-3">{displayTitle}</h2>
          <button
            onClick={toggleFavorite}
            className={`p-1 rounded-full transition-colors duration-150 ${isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500'}`}
            title={isFavorite ? APP_STRINGS.removeFromFavoritesTooltip : APP_STRINGS.addToFavoritesTooltip}
            aria-label={isFavorite ? APP_STRINGS.removeFromFavoritesTooltip : APP_STRINGS.addToFavoritesTooltip}
          >
            <StarIcon className="w-7 h-7" solid={isFavorite} />
          </button>
        </div>
        
        <p className="text-gray-700 mb-6 text-center max-w-lg">{workout.detailedDescription}</p>
        
        {(workout.format === WorkoutFormat.AMRAP || workout.format === WorkoutFormat.TIME_CAP) && previousScore && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm w-full max-w-lg text-center">
            <p className="text-md font-semibold text-yellow-700 flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-yellow-600" />
              {APP_STRINGS.workoutDetailPreviousScoreLabel} <span className="font-bold ml-1">{previousScore}</span>
            </p>
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg shadow w-full max-w-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Övningar:</h3>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            {workout.exerciseSummaryList.map((ex, index) => (
              <li key={index}>
                <span className="font-medium text-gray-900">{ex.name}:</span> {ex.details}
              </li>
            ))}
          </ul>
          {workout.format === WorkoutFormat.CLASSIC_ROUNDS && workout.roundsText && (
            <p className="mt-4 text-gray-700 font-medium">Totalt: {workout.roundsText}</p>
          )}
        </div>

        <Button 
          onClick={handleStartWorkout}
          className={`w-full max-w-sm text-lg ${startButtonAdditionalClasses}`}
        >
          {isGeneratedWorkout && <DrinkIcon className="w-6 h-6 mr-2" />}
          {startButtonText}
        </Button>
      </div>
    </div>
  );
};
