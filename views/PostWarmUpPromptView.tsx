
import React from 'react';
import { Workout, View, PostWarmUpPromptViewProps } from '../types'; 
import { APP_STRINGS } from '../constants';
import { Button } from '../components/Button';
import { SparklesIcon, KettlebellIcon, StickFigureIcon, ArrowLeftIcon, DrinkIcon } from '../components/Icons'; 

export const PostWarmUpPromptView: React.FC<PostWarmUpPromptViewProps> = ({ 
  workout, 
  onNavigate, 
  availableKBChallengeWorkouts, 
  availableBWChallengeWorkouts,
  isGeneralPrompt 
}) => {
  const titleText = isGeneralPrompt ? APP_STRINGS.postWarmUpPromptQuestion : APP_STRINGS.postWarmUpPromptTitle;
  const subText = isGeneralPrompt ? "Välj din utmaning nedan." : APP_STRINGS.postWarmUpPromptQuestion;

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-orange-50 text-gray-800">
      {/* "Tillbaka till Start" button at the top, aligned left */}
      <div className="mt-2 mb-6 self-start"> {/* Added self-start to ensure left alignment in flex-col */}
        <Button
          onClick={() => onNavigate(View.Home)}
          variant="ghost"
          className="flex items-center space-x-2 text-[#418484] hover:text-[#316767]"
          aria-label={APP_STRINGS.backToHome}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{APP_STRINGS.backToHome}</span>
        </Button>
      </div>

      {/* Main content: centered */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <SparklesIcon className="w-20 h-20 sm:w-24 sm:h-24 text-orange-400 mb-6" />
        
        <h2 className="text-3xl sm:text-4xl font-bold text-orange-700 mb-4">
          {titleText}
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          {subText}
        </p>
        
        {/* Challenge buttons */}
        <div className="space-y-4 w-full max-w-xs">
          <Button 
            onClick={() => onNavigate(View.Home, { startChallenge: 'KB' })}
            variant="primary" 
            className="w-full text-xl py-4 flex items-center justify-center"
            disabled={availableKBChallengeWorkouts.length === 0}
            title={availableKBChallengeWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayKBButtonTitle}
          >
            <KettlebellIcon className="w-8 h-8 mr-3" />
            {APP_STRINGS.workoutOfTheDayKBButton}
          </Button>
          <Button 
            onClick={() => onNavigate(View.Home, { startChallenge: 'BW' })}
            variant="primary" 
            className="w-full text-xl py-4 flex items-center justify-center"
            disabled={availableBWChallengeWorkouts.length === 0}
            title={availableBWChallengeWorkouts.length === 0 ? APP_STRINGS.noWorkoutsAvailable : APP_STRINGS.workoutOfTheDayBWButtonTitle}
          >
            <StickFigureIcon className="w-8 h-8 mr-3" />
            {APP_STRINGS.workoutOfTheDayBWButton}
          </Button>
          <Button
            onClick={() => onNavigate(View.GenerateWorkout)}
            variant="purple" // Consistent with HomeView
            className="w-full text-xl py-4 flex items-center justify-center"
            title={APP_STRINGS.generateButton}
          >
            <DrinkIcon className="w-8 h-8 mr-3" /> 
            {APP_STRINGS.generateButton}
          </Button>
        </div>

        {!isGeneralPrompt && workout && (
          <p className="text-sm text-gray-500 mt-12">
            Uppvärmning slutförd: <span className="font-medium">{workout.title}</span>
          </p>
        )}
      </div>
    </div>
  );
};
