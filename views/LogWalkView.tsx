
import React, { useState } from 'react';
import { View, LogWalkFormData } from '../types';
import { APP_STRINGS, WALKING_CHALLENGE_DAILY_MINUTES } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeftIcon, FootstepsIcon, PlusCircleIcon } from '../components/Icons';

interface LogWalkViewProps {
  onNavigate: (view: View, data?: LogWalkFormData) => void;
  userName: string | null;
}

export const LogWalkView: React.FC<LogWalkViewProps> = ({ onNavigate, userName }) => {
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [steps, setSteps] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [durationError, setDurationError] = useState<string | null>(null);

  const handleSaveWalk = () => {
    const durationNum = parseInt(durationMinutes, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      setDurationError(APP_STRINGS.logWalkDurationErrorInvalid);
      return;
    }
    setDurationError(null);

    const formData: LogWalkFormData = {
      durationMinutes: durationNum,
      distance: distance.trim() || undefined,
      steps: steps.trim() || undefined,
      comment: comment.trim() || undefined,
    };
    onNavigate(View.PostWalking, formData);
  };

  const greetingName = userName || "Du";

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 bg-sky-50 text-gray-800">
      <div className="w-full flex justify-start mt-2 mb-3">
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
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-700 flex items-center justify-center">
          <FootstepsIcon className="w-8 h-8 mr-3 text-sky-500" />
          {APP_STRINGS.logWalkFormTitle}
        </h1>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-lg mx-auto">
        <p className="text-gray-600 mb-6 text-center text-lg">
          {APP_STRINGS.logWalkInstruction.replace('{name}', greetingName)}
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSaveWalk(); }} className="space-y-6">
          <div>
            <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
              {APP_STRINGS.logWalkDurationLabel} <span className="text-red-500">*</span>
            </label>
            <input
              id="durationMinutes"
              type="number"
              value={durationMinutes}
              onChange={(e) => {
                setDurationMinutes(e.target.value);
                if (durationError) setDurationError(null);
              }}
              placeholder={APP_STRINGS.logWalkDurationPlaceholder.replace('{min_duration}', WALKING_CHALLENGE_DAILY_MINUTES.toString())}
              min="1"
              className={`w-full p-3 border rounded-lg shadow-sm bg-white text-gray-800 placeholder-gray-400 ${durationError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-sky-500 focus:border-sky-500'}`}
              required
              aria-describedby={durationError ? "duration-error" : undefined}
            />
            {durationError && <p id="duration-error" className="text-xs text-red-600 mt-1">{durationError}</p>}
             <p className="text-xs text-gray-500 mt-1">{APP_STRINGS.logWalkDurationInfo.replace('{min_duration}', WALKING_CHALLENGE_DAILY_MINUTES.toString())}</p>
          </div>

          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              {APP_STRINGS.logWalkDistanceLabel}
            </label>
            <input
              id="distance"
              type="text" // Use text to allow "3,5" or "3.5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder={APP_STRINGS.logWalkDistancePlaceholder}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
              {APP_STRINGS.logWalkStepsLabel}
            </label>
            <input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={APP_STRINGS.logWalkStepsPlaceholder}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              {APP_STRINGS.logWalkCommentLabel}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={APP_STRINGS.logWalkCommentPlaceholder}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 bg-white text-gray-800 placeholder-gray-400"
            />
          </div>

          <Button type="submit" className="w-full text-lg py-3.5 bg-sky-500 hover:bg-sky-600 border-sky-600 active:bg-sky-700 flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            {APP_STRINGS.logWalkSaveButton}
          </Button>
        </form>
      </div>
    </div>
  );
};